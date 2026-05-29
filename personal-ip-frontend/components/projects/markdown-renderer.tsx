'use client'

interface Props {
  content: string
}

/**
 * 轻量 Markdown 渲染器 — 处理项目详情的 Markdown 内容
 * 支持：标题(h2/h3)、无序列表、有序列表、粗体、行内代码、段落、分割线
 */
export function MarkdownRenderer({ content }: Props) {
  const lines = content.split('\n')
  const elements: React.ReactNode[] = []
  let key = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // 空行
    if (!line.trim()) continue

    // h2: ## Title
    if (line.startsWith('## ')) {
      elements.push(
        <h2
          key={key++}
          className="text-xl font-bold mt-8 mb-3"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", color: '#2E1A0E' }}
        >
          {renderInline(line.slice(3))}
        </h2>
      )
      continue
    }

    // h3: ### Title
    if (line.startsWith('### ')) {
      elements.push(
        <h3
          key={key++}
          className="text-base font-bold mt-6 mb-2"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", color: '#2E1A0E' }}
        >
          {renderInline(line.slice(4))}
        </h3>
      )
      continue
    }

    // 分割线: ---
    if (line.startsWith('---')) {
      elements.push(
        <hr key={key++} className="my-6 border-[#E8C9B0]/60" />
      )
      continue
    }

    // 无序列表: - item
    if (line.startsWith('- ')) {
      const items: React.ReactNode[] = [renderInline(line.slice(2))]
      // 收集后续列表项
      while (i + 1 < lines.length && lines[i + 1].startsWith('- ')) {
        i++
        items.push(renderInline(lines[i].slice(2)))
      }
      elements.push(
        <ul key={key++} className="list-disc pl-5 mb-4 space-y-1 text-sm leading-relaxed" style={{ color: '#5A3A2A' }}>
          {items.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      )
      continue
    }

    // 有序列表: 1. item
    if (/^\d+\.\s/.test(line)) {
      const items: React.ReactNode[] = [renderInline(line.replace(/^\d+\.\s/, ''))]
      while (i + 1 < lines.length && /^\d+\.\s/.test(lines[i + 1])) {
        i++
        items.push(renderInline(lines[i].replace(/^\d+\.\s/, '')))
      }
      elements.push(
        <ol key={key++} className="list-decimal pl-5 mb-4 space-y-1 text-sm leading-relaxed" style={{ color: '#5A3A2A' }}>
          {items.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ol>
      )
      continue
    }

    // 普通段落
    elements.push(
      <p key={key++} className="text-sm leading-relaxed mb-3" style={{ color: '#5A3A2A' }}>
        {renderInline(line)}
      </p>
    )
  }

  return <div className="max-w-none">{elements}</div>
}

/** 渲染行内元素：粗体、行内代码 */
function renderInline(text: string): React.ReactNode {
  // 粗体: **text**
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-bold text-[#2E1A0E]">{part.slice(2, -2)}</strong>
    }
    // 行内代码: `code`
    const codeParts = part.split(/(`[^`]+`)/g)
    return codeParts.map((cp, j) => {
      if (cp.startsWith('`') && cp.endsWith('`')) {
        return (
          <code key={`${i}-${j}`} className="px-1.5 py-0.5 rounded text-xs font-mono" style={{ background: '#F0E6DB', color: '#C45A30' }}>
            {cp.slice(1, -1)}
          </code>
        )
      }
      return cp
    })
  })
}
