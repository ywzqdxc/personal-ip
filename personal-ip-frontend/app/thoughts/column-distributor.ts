import type { Thought } from '@/lib/api/thoughts'

/* ═══════════════════════════════════════════════
   Height estimation — precise pre-render calc
   ═══════════════════════════════════════════════ */

const COL_WIDTH_DESKTOP = 393 // approx px for one column at 1280px viewport
const CHARS_PER_LINE_CODE = 42 // JetBrains Mono 12px in ~393px
const CHARS_PER_LINE_TEXT = 27 // Barlow 14px / Noto Serif 15px in ~393px

/** Count lines in a code block (split by ```, extract code, count \n). */
function countCodeLines(content: string): number {
  const parts = content.split(/```[\s\S]*?```/g)
  // Actually we need to match code blocks and count lines inside them
  let lines = 0
  const regex = /```[\s\S]*?```/g
  let match: RegExpExecArray | null
  while ((match = regex.exec(content)) !== null) {
    const block = match[0]
    const inner = block.replace(/^```\w*\n?/, '').replace(/\n?```$/, '')
    lines += inner.split('\n').length
  }
  return lines
}

export function estimateCardHeight(thought: Thought, aspectRatio?: number): number {
  const content = thought.content

  /* ── Photo card ── */
  if (thought.imageUrl) {
    // If we have the real aspect ratio, compute exact image height
    // Image is constrained to column width (~393px)
    const imgHeight = aspectRatio
      ? COL_WIDTH_DESKTOP / aspectRatio
      : 280 // fallback
    const textLines = Math.ceil(content.length / CHARS_PER_LINE_TEXT)
    return imgHeight + textLines * 24 + 110
  }

  /* ── Code card ── */
  if (content.includes('```')) {
    const codeLines = countCodeLines(content)
    // Remove code blocks to count text chars
    const textContent = content.replace(/```[\s\S]*?```/g, '')
    const textLines = Math.ceil(textContent.length / CHARS_PER_LINE_TEXT)
    // Header: 34, code area: (codeLines * 20) + 26 padding, text: textLines * 20, tags+interaction: 50
    return 34 + codeLines * 20 + 26 + textLines * 20 + 60
  }

  /* ── Essay card ── */
  if (content.length > 120) {
    // Noto Serif 15px, line-height 1.9 = 28.5px per line
    // Paragraphs: split by \n\n+
    const paragraphs = content.split(/\n\n+/)
    let totalLines = 0
    for (const p of paragraphs) {
      totalLines += Math.ceil(p.length / CHARS_PER_LINE_TEXT)
    }
    // padding: 40, lines * 28.5, mood: 20, tags: 30, interaction: 60
    return 40 + totalLines * 28.5 + 20 + 60
  }

  /* ── Standard card ── */
  // fontSize 14, lineHeight 1.75 = 24.5px
  const lines = Math.ceil(content.length / (CHARS_PER_LINE_TEXT + 2)) // slightly wider for Barlow 14px
  // avatar row: 42, text: lines * 24.5, mood: 20, tags: 30, interaction: 60
  return 42 + lines * 24.5 + 20 + 60
}

/* ═══════════════════════════════════════════════
   Data structures
   ═══════════════════════════════════════════════ */

export interface ColumnEntry {
  thought: Thought
  estimatedHeight: number
}

export interface ColumnData {
  items: ColumnEntry[]
  totalHeight: number
}

/* ═══════════════════════════════════════════════
   Phase 1: Shortest-Column-First distribution
   ═══════════════════════════════════════════════ */

export function distributeToColumns(
  thoughts: Thought[],
  colCount = 3,
  aspectRatios?: Map<string, number>,
): ColumnData[] {
  const columns: ColumnData[] = Array.from({ length: colCount }, () => ({
    items: [],
    totalHeight: 0,
  }))

  for (const thought of thoughts) {
    const ratio = thought.imageUrl ? aspectRatios?.get(thought.imageUrl) : undefined
    const h = estimateCardHeight(thought, ratio)

    let minIdx = 0
    for (let i = 1; i < columns.length; i++) {
      if (columns[i].totalHeight < columns[minIdx].totalHeight) {
        minIdx = i
      }
    }

    columns[minIdx].items.push({ thought, estimatedHeight: h })
    columns[minIdx].totalHeight += h
  }

  return columns
}

/* ═══════════════════════════════════════════════
   Phase 2: Bottom balancing
   ═══════════════════════════════════════════════ */

const BALANCE_THRESHOLD = 300 // px — max allowed gap between tallest & shortest
const TOP_LOCK_COUNT = 6 // first N items across all columns are "pinned" for time-linearity

/**
 * After initial distribution, if one column is dramatically taller than
 * another, move the last item from the tallest to the shortest column.
 * Items in the top rows are never moved to preserve time linearity.
 */
export function rebalanceColumns(columns: ColumnData[]): ColumnData[] {
  const cols = columns.map((c) => ({
    items: [...c.items],
    totalHeight: c.totalHeight,
  }))

  // Which items are "top-locked"? They're the first TOP_LOCK_COUNT items
  // in insertion order.  Since we insert in order, the first items in each
  // column are the newest.  We track by marking the global insertion index.
  const locked = new Set<Thought['id']>()
  let globalIdx = 0
  const colItemOrder: Array<{ col: number; idx: number; thought: Thought }> = []
  for (let ci = 0; ci < cols.length; ci++) {
    for (let ii = 0; ii < cols[ci].items.length; ii++) {
      colItemOrder.push({ col: ci, idx: ii, thought: cols[ci].items[ii].thought })
    }
  }
  // Sort by insertion order (they're already in order since we build columns sequentially)
  for (let i = 0; i < Math.min(TOP_LOCK_COUNT, colItemOrder.length); i++) {
    locked.add(colItemOrder[i].thought.id)
  }

  let iterations = 0
  const maxIter = 10

  while (iterations < maxIter) {
    let tallestIdx = 0
    let shortestIdx = 0
    for (let i = 1; i < cols.length; i++) {
      if (cols[i].totalHeight > cols[tallestIdx].totalHeight) tallestIdx = i
      if (cols[i].totalHeight < cols[shortestIdx].totalHeight) shortestIdx = i
    }

    const gap = cols[tallestIdx].totalHeight - cols[shortestIdx].totalHeight
    if (gap <= BALANCE_THRESHOLD) break

    // Find the last non-locked item in the tallest column
    const tallItems = cols[tallestIdx].items
    let moveIdx = -1
    for (let i = tallItems.length - 1; i >= 0; i--) {
      if (!locked.has(tallItems[i].thought.id)) {
        moveIdx = i
        break
      }
    }

    if (moveIdx === -1) break // no movable items

    const [moved] = cols[tallestIdx].items.splice(moveIdx, 1)
    cols[tallestIdx].totalHeight -= moved.estimatedHeight
    cols[shortestIdx].items.push(moved)
    cols[shortestIdx].totalHeight += moved.estimatedHeight

    iterations++
  }

  return cols
}

/* ═══════════════════════════════════════════════
   Phase 3: Post-render DOM measurement helper
   ═══════════════════════════════════════════════ */

/**
 * Measure actual rendered heights of the three column DOM elements.
 * Returns an array of pixel heights.  Call this after the initial paint
 * to decide if a redistribution is still needed.
 */
export function measureColumnHeights(containerSelector: string): number[] {
  const container = document.querySelector(containerSelector)
  if (!container) return []
  const cols = container.querySelectorAll<HTMLElement>('.thoughts-col')
  return Array.from(cols).map((el) => el.offsetHeight)
}

/**
 * Check if column imbalance exceeds threshold based on real DOM heights.
 * If so, return the rebalanced columns; otherwise return null.
 */
export function tryDomRebalance(
  columns: ColumnData[],
  containerSelector: string,
  threshold = 250,
  aspectRatios?: Map<string, number>,
): ColumnData[] | null {
  if (!columns || columns.length === 0) return null
  const heights = measureColumnHeights(containerSelector)
  if (heights.length < 2) return null
  const max = Math.max(...heights)
  const min = Math.min(...heights)
  if (max - min <= threshold) return null

  // Build fresh columns with these items and rebalance
  const allItems = columns.flatMap((c) => c.items)
  const fresh = distributeToColumns(
    allItems.map((e) => e.thought),
    columns.length,
    aspectRatios,
  )
  return rebalanceColumns(fresh)
}
