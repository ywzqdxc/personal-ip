'use client'

import { useEffect, useState } from 'react'
import { getPublishedThoughts, type Thought } from '@/lib/api/thoughts'

/* ── Mock ── */

const MOCK_THOUGHTS: Thought[] = [
  {
    id: 1,
    content: '今天的光线很好，随手拍了几张。相机永远是最好的记忆装置。',
    mood: '平静',
    tags: 'Photography,Life',
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80',
    createTime: '2026-05-26T15:30:00',
  },
  {
    id: 2,
    content:
      "一直在找 Tailwind 暖色系配置，终于整理出来了：\n```js\n// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n        'warm': {\n          50:  '#FDF6EE',\n          100: '#F5E6D3',\n          500: '#C45A30',\n          900: '#2E1A0E',\n        },\n      },\n    },\n  },\n}\n```",
    mood: '调试中',
    tags: 'Tailwind,CSS,Frontend',
    imageUrl: null,
    createTime: '2026-05-25T21:00:00',
  },
  {
    id: 3,
    content:
      '旅行的意义，不在于终点的，你想意义，存在此。\n\n旅行的意义，不在于终点，那里义之间，彼岸在我文字的商户之前，如宝的就行。自然指的一天，不在于终点，不在还是还是……都想继续随行，四你在这般视频…\n\n每次出发，都是一次轻微的告别。',
    mood: '思考',
    tags: '旅行,随想',
    imageUrl: null,
    createTime: '2026-05-24T09:15:00',
  },
  {
    id: 4,
    content: '极简主义设计研究。',
    mood: '灵感',
    tags: 'Minimalism,Design,WebDev,Travel',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    createTime: '2026-05-23T14:00:00',
  },
  {
    id: 5,
    content:
      '写代码三小时，bug 修了两小时，剩下一小时在看文档。这大概就是编程的真相。',
    mood: '调试中',
    tags: 'Dev,Life',
    imageUrl: null,
    createTime: '2026-05-22T23:00:00',
  },
  {
    id: 6,
    content: 'Morning in Bali.',
    mood: '平静',
    tags: 'Travel,Bali,Morning',
    imageUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80',
    createTime: '2026-05-21T07:00:00',
  },
  {
    id: 7,
    content:
      'The best code is the code you never have to write.\n\n最好的代码是你永远不需要写的代码。这句话不是鼓励懒惰，而是提醒我们：真正的工程能力，在于找到不必要的复杂度并消除它。\n\n每次重构，都是一次对过去自己的谅解。',
    mood: '思考',
    tags: 'Engineering,Philosophy',
    imageUrl: null,
    createTime: '2026-05-19T16:30:00',
  },
  {
    id: 8,
    content:
      '今天收到了新键盘，机械轴的声音真的很治愈。工作效率直接提升了 0%，但快乐提升了 100%。',
    mood: '开心',
    tags: 'Life,Keyboard',
    imageUrl: null,
    createTime: '2026-05-17T18:00:00',
  },
  {
    id: 9,
    content:
      "CSS Grid 做瀑布流最简单的方法：\n```css\n.masonry {\n  columns: 3;\n  column-gap: 16px;\n}\n.card {\n  break-inside: avoid;\n  margin-bottom: 16px;\n  display: inline-block;\n  width: 100%;\n}\n```\n真的不需要 JS！",
    mood: '灵感',
    tags: 'CSS,Layout,Tips',
    imageUrl: null,
    createTime: '2026-05-15T11:00:00',
  },
]

/* ── Constants ── */

const MOOD_EMOJI: Record<string, string> = {
  '开心': '😊',
  '调试中': '🔧',
  '思考': '🤔',
  '疲惫': '😮‍💨',
  '灵感': '💡',
  '平静': '🌿',
  '兴奋': '🎉',
  '困惑': '❓',
}

/* ── Helpers ── */

function fakeLikes(id: number): number {
  return (id * 37 + 13) % 200 + 8
}

function fakeComments(id: number): number {
  return (id * 17 + 5) % 30 + 1
}

function getCardType(thought: Thought): 'photo' | 'code' | 'essay' | 'standard' {
  if (thought.imageUrl) return 'photo'
  if (thought.content.includes('```')) return 'code'
  if (thought.content.length > 120) return 'essay'
  return 'standard'
}

function parseCodeContent(
  content: string,
): Array<{ type: 'text' | 'code'; text: string; lang?: string }> {
  const parts = content.split(/(```[\s\S]*?```)/g)
  return parts
    .map((part) => {
      if (part.startsWith('```')) {
        const match = part.match(/```(\w*)\n?([\s\S]*?)```/)
        return {
          type: 'code' as const,
          text: match?.[2] || '',
          lang: match?.[1] || '',
        }
      }
      return { type: 'text' as const, text: part.trim() }
    })
    .filter((p) => p.text.length > 0)
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const h = String(d.getHours()).padStart(2, '0')
  const min = String(d.getMinutes()).padStart(2, '0')
  return `${y}.${m}.${day} ${h}:${min}`
}

/* ── Tag pill renderer ── */

function renderTags(tags: string | null, darkMode = false) {
  if (!tags) return null
  return (
    <div
      style={{
        display: 'flex',
        gap: 6,
        flexWrap: 'wrap',
        margin: '8px 0',
      }}
    >
      {tags.split(',').map((tag) => (
        <span
          key={tag.trim()}
          style={{
            fontSize: 10,
            letterSpacing: '0.06em',
            color: darkMode ? '#C9A96E' : '#B07050',
            border: darkMode
              ? '0.5px solid rgba(200,160,110,0.3)'
              : '0.5px solid #E8C9B0',
            borderRadius: 99,
            padding: '2px 8px',
          }}
        >
          #{tag.trim()}
        </span>
      ))}
    </div>
  )
}

/* ── Bottom interaction bar (shared by all card types) ── */

function InteractionBar({ thought }: { thought: Thought }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 12,
        paddingTop: 10,
        borderTop: '0.5px solid rgba(232,201,176,0.5)',
      }}
    >
      <div style={{ display: 'flex', gap: 14, fontSize: 12, color: '#B07050' }}>
        <span style={{ cursor: 'pointer' }}>
          ♡ {fakeLikes(thought.id)}
        </span>
        <span style={{ cursor: 'pointer' }}>
          💬 {fakeComments(thought.id)}
        </span>
      </div>
      <span
        style={{
          fontSize: 14,
          color: '#B07050',
          cursor: 'pointer',
          opacity: 0.6,
          transition: 'opacity 0.2s',
        }}
      >
        ↗
      </span>
    </div>
  )
}

/* ── Card Type A: Photo ── */

function PhotoCard({
  thought,
  emoji,
}: {
  thought: Thought
  emoji: string | null
}) {
  return (
    <div
      className="thought-card"
      style={{
        background: '#FFFFFF',
        borderRadius: 16,
        border: '0.5px solid #E8C9B0',
        overflow: 'hidden',
      }}
    >
      {thought.imageUrl && (
        <img
          src={thought.imageUrl}
          alt=""
          style={{
            width: '100%',
            height: 'auto',
            display: 'block',
            borderRadius: '12px 12px 0 0',
            objectFit: 'cover',
          }}
        />
      )}
      <div style={{ padding: '14px 16px 16px' }}>
        <p
          style={{
            fontFamily: 'Caveat, cursive',
            fontSize: 17,
            color: '#2E1A0E',
            lineHeight: 1.5,
            margin: '0 0 4px',
          }}
        >
          {thought.content}
        </p>

        {emoji && thought.mood && (
          <span
            style={{
              fontSize: 12,
              color: '#B07050',
            }}
          >
            {emoji} {thought.mood}
          </span>
        )}

        {renderTags(thought.tags)}
        <InteractionBar thought={thought} />
      </div>
    </div>
  )
}

/* ── Card Type B: Code ── */

// Simple syntax highlighter for inline use
function highlightCodeLine(line: string, i: number) {
  // Keywords
  const keywords =
    /\b(const|let|var|function|return|import|export|default|from|module|if|else|for|while|class|extends|type|interface|async|await)\b/g
  // Strings (single/double/backtick)
  const strings = /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g
  // Comments
  const comments = /(\/\/.*$)/g
  // Numbers
  const numbers = /\b(\d+\.?\d*)\b/g

  let html = line
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // Apply spans in order: comments first (to avoid double-match), then strings, then keywords, then numbers
  html = html.replace(comments, (m) => `<span style="color:#6B5040">${m}</span>`)
  html = html.replace(
    strings,
    (m) => `<span style="color:#C9A96E">${m}</span>`,
  )
  html = html.replace(
    keywords,
    (m) => `<span style="color:#E8855A">${m}</span>`,
  )
  html = html.replace(
    numbers,
    (m) => `<span style="color:#C45A30">${m}</span>`,
  )

  return html
}

function CodeCard({
  thought,
  emoji,
}: {
  thought: Thought
  emoji: string | null
}) {
  const segments = parseCodeContent(thought.content)

  return (
    <div
      className="thought-card thought-card-code"
      style={{
        background: '#1A1208',
        borderRadius: 16,
        border: '0.5px solid rgba(200,160,110,0.15)',
        overflow: 'hidden',
      }}
    >
      {/* Top bar */}
      <div
        style={{
          background: '#2A1E10',
          padding: '8px 14px',
          borderRadius: '14px 14px 0 0',
          fontSize: 10,
          letterSpacing: '0.12em',
          color: '#C9A96E',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span>[code]</span>
        <span>
          {emoji} {thought.mood}
        </span>
      </div>

      {/* Body */}
      <div style={{ padding: '14px 14px 16px' }}>
        {segments.map((seg, i) =>
          seg.type === 'code' ? (
            <pre
              key={i}
              className="code-pre"
              style={{
                background: 'rgba(0,0,0,0.3)',
                borderRadius: 8,
                padding: '12px 14px',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: 12,
                lineHeight: 1.7,
                overflowX: 'auto',
                whiteSpace: 'pre',
                margin: i > 0 ? '8px 0 0' : '0',
              }}
            >
              <code
                dangerouslySetInnerHTML={{
                  __html: seg.text
                    .split('\n')
                    .map((line) => highlightCodeLine(line, 0))
                    .join('\n'),
                }}
              />
            </pre>
          ) : (
            <p
              key={i}
              style={{
                color: '#C9A96E',
                fontSize: 13,
                lineHeight: 1.6,
                fontFamily: 'Barlow, sans-serif',
                margin: i > 0 ? '8px 0 0' : '0',
              }}
            >
              {seg.text}
            </p>
          ),
        )}

        {renderTags(thought.tags, true)}
        {/* Interaction bar in code mode — override colors */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 12,
            paddingTop: 10,
            borderTop: '0.5px solid rgba(200,160,110,0.15)',
          }}
        >
          <div
            style={{ display: 'flex', gap: 14, fontSize: 12, color: '#6B5040' }}
          >
            <span style={{ cursor: 'pointer' }}>
              ♡ {fakeLikes(thought.id)}
            </span>
            <span style={{ cursor: 'pointer' }}>
              💬 {fakeComments(thought.id)}
            </span>
          </div>
          <span
            style={{
              fontSize: 14,
              color: '#6B5040',
              cursor: 'pointer',
              opacity: 0.6,
            }}
          >
            ↗
          </span>
        </div>
      </div>
    </div>
  )
}

/* ── Card Type C: Essay ── */

function EssayCard({
  thought,
  emoji,
}: {
  thought: Thought
  emoji: string | null
}) {
  const paragraphs = thought.content.split(/\n\n+/)

  return (
    <div
      className="thought-card"
      style={{
        background: '#FFFBF7',
        borderRadius: 16,
        border: '0.5px solid #E8C9B0',
        padding: '20px 20px 16px',
      }}
    >
      {/* Date top-right */}
      <div
        style={{
          textAlign: 'right',
          fontSize: 11,
          color: '#B07050',
          marginBottom: 10,
          fontFamily: 'Barlow, sans-serif',
        }}
      >
        {formatDate(thought.createTime)}
      </div>

      {/* Paragraphs */}
      {paragraphs.map((para, i) => (
        <p
          key={i}
          style={{
            fontFamily: "'Noto Serif SC', 'Playfair Display', serif",
            fontSize: 15,
            lineHeight: 1.9,
            color: '#2E1A0E',
            margin: i === 0 ? '0 0 12px' : '0 0 6px',
            ...(i === 0
              ? {
                  borderLeft: '3px solid #E8855A',
                  paddingLeft: 12,
                }
              : {}),
          }}
        >
          {para}
        </p>
      ))}

      {emoji && thought.mood && (
        <span
          style={{
            fontSize: 12,
            color: '#B07050',
            display: 'inline-block',
            marginTop: 4,
          }}
        >
          {emoji} {thought.mood}
        </span>
      )}

      {renderTags(thought.tags)}
      <InteractionBar thought={thought} />
    </div>
  )
}

/* ── Card Type D: Standard ── */

function StandardCard({
  thought,
  emoji,
}: {
  thought: Thought
  emoji: string | null
}) {
  return (
    <div
      className="thought-card"
      style={{
        background: '#FFFFFF',
        borderRadius: 16,
        border: '0.5px solid #E8C9B0',
        padding: '16px 18px',
      }}
    >
      {/* Header row: avatar + time */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Avatar initial */}
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #E8855A, #C45A30)',
              color: '#FFF',
              fontSize: 13,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'Barlow, sans-serif',
            }}
          >
            R
          </div>
          <span
            style={{
              fontSize: 11,
              color: '#B07050',
              fontFamily: 'Barlow, sans-serif',
            }}
          >
            {formatDate(thought.createTime)}
          </span>
        </div>
        <span
          style={{
            fontSize: 14,
            color: '#B07050',
            cursor: 'pointer',
            opacity: 0.6,
          }}
        >
          ↗
        </span>
      </div>

      {/* Body */}
      <p
        style={{
          fontSize: 14,
          lineHeight: 1.75,
          color: '#2E1A0E',
          fontFamily: 'Barlow, sans-serif',
          fontWeight: 400,
          margin: '0 0 6px',
        }}
      >
        {thought.content}
      </p>

      {emoji && thought.mood && (
        <span
          style={{
            fontSize: 12,
            color: '#B07050',
          }}
        >
          {emoji} {thought.mood}
        </span>
      )}

      {renderTags(thought.tags)}
      <InteractionBar thought={thought} />
    </div>
  )
}

/* ── ThoughtCard dispatcher ── */

function ThoughtCard({ thought }: { thought: Thought }) {
  const type = getCardType(thought)
  const emoji = thought.mood ? MOOD_EMOJI[thought.mood] || '💭' : null

  if (type === 'photo') return <PhotoCard thought={thought} emoji={emoji} />
  if (type === 'code') return <CodeCard thought={thought} emoji={emoji} />
  if (type === 'essay') return <EssayCard thought={thought} emoji={emoji} />
  return <StandardCard thought={thought} emoji={emoji} />
}

/* ── CSS ── */

const CSS_LINES = [
  "@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800&family=Barlow:wght@300;400;500&family=Caveat:wght@600&family=Noto+Serif+SC:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap');",
  // Masonry
  '.thoughts-masonry { columns: 3; column-gap: 16px; }',
  '.thought-card { break-inside: avoid; margin-bottom: 16px; display: inline-block; width: 100%; }',
  '.thought-card { transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease; cursor: default; }',
  '.thought-card:hover { transform: translateY(-4px); box-shadow: 0 10px 36px rgba(46,26,14,0.10); border-color: #C45A30 !important; }',
  '.thought-card-code:hover { transform: translateY(-4px); box-shadow: 0 10px 36px rgba(0,0,0,0.3); border-color: rgba(200,160,110,0.35) !important; }',
  // Responsive
  '@media (max-width: 900px) { .thoughts-masonry { columns: 2; } }',
  '@media (max-width: 540px) { .thoughts-masonry { columns: 1; } }',
  // Code block scrollbar
  '.code-pre::-webkit-scrollbar { height: 3px; }',
  '.code-pre::-webkit-scrollbar-thumb { background: #3A2A1A; border-radius: 2px; }',
]
const pageCss = CSS_LINES.join('\n')

/* ── Page ── */

export default function ThoughtsPage() {
  const [thoughts, setThoughts] = useState<Thought[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPublishedThoughts()
      .then((data) =>
        setThoughts(data.length > 0 ? data : MOCK_THOUGHTS),
      )
      .catch(() => setThoughts(MOCK_THOUGHTS))
      .finally(() => setLoading(false))
  }, [])

  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#FDF6EE',
        paddingTop: 100,
      }}
    >
      {/* Header */}
      <div style={{ padding: '0 60px 48px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
          }}
        >
          <p
            style={{
              fontFamily: 'Caveat, cursive',
              fontSize: 20,
              color: '#B07050',
              margin: 0,
            }}
          >
            Fragmentos de la mente. 思绪的碎片。
          </p>
          {!loading && (
            <span
              style={{
                fontSize: 12,
                color: '#B07050',
                fontFamily: 'Barlow, sans-serif',
              }}
            >
              {thoughts.length} thoughts ↓
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '0 60px 80px' }}>
        {/* Loading */}
        {loading && (
          <div
            style={{
              textAlign: 'center',
              color: '#B07050',
              padding: 60,
              fontFamily: 'Barlow, sans-serif',
            }}
          >
            Loading...
          </div>
        )}

        {/* Empty state */}
        {!loading && thoughts.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '80px 0',
              color: '#B07050',
              fontFamily: 'Barlow, sans-serif',
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 16 }}>🍃</div>
            <p style={{ fontSize: 16 }}>暂无随想，静待灵感。</p>
          </div>
        )}

        {/* Masonry */}
        {!loading && thoughts.length > 0 && (
          <div className="thoughts-masonry">
            {thoughts.map((thought) => (
              <ThoughtCard key={thought.id} thought={thought} />
            ))}
          </div>
        )}
      </div>

      <style>{pageCss}</style>
    </main>
  )
}
