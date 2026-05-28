'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { getArticleBySlug, type Article } from '@/lib/api/articles'

// ── Mock Data ──

const MOCK_ARTICLES: Record<string, Article> = {
  'exploring-warm-aesthetics': {
    id: 1,
    title: 'Exploring Warm Aesthetics in Modern UI Design',
    slug: 'exploring-warm-aesthetics',
    coverUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
    summary: '暖色系不是一种风格，而是一种态度——让像素拥有温度，让界面成为归宿。',
    content: `## Introduction

Design is not just about aesthetics. It is about creating experiences that resonate with people on an emotional level. Warm tones — amber, terracotta, cream — evoke comfort and familiarity.

## Palette Principles

The foundation of a warm UI starts with a carefully chosen palette. We anchor everything to a single base hue.

\`\`\`js
const warmPalette = {
  background: '#FDF6EE',
  primary:    '#2E1A0E',
  accent:     '#C45A30',
  highlight:  '#E8855A',
  muted:      '#B07050',
  border:     '#E8C9B0',
}
\`\`\`

Each color has a role. The background should feel like aged paper — present but never intrusive.

## Implementation

Start by replacing hard-coded hex values with CSS custom properties. This makes theme switching trivial.

\`\`\`css
:root {
  --color-bg:      #FDF6EE;
  --color-text:    #2E1A0E;
  --color-accent:  #C45A30;
}
\`\`\`

Then apply them consistently across your component tree.

## Code Basics

Typography is half of design. For warm aesthetics, serif fonts pair beautifully with condensed sans-serifs.

\`\`\`tsx
const Heading = ({ children }: { children: React.ReactNode }) => (
  <h2 style={{
    fontFamily: 'Barlow Condensed, sans-serif',
    fontWeight: 800,
    color: '#2E1A0E',
    letterSpacing: '-0.02em',
  }}>
    {children}
  </h2>
)
\`\`\`

## Case Studies

Several production applications have successfully adopted warm palettes. The key insight: warmth is achieved through contrast ratios, not just hue.

> 设计是无声的语言，它说的不是"这里有什么"，而是"这里是什么感觉"。

Ultimately, warm design invites the user to slow down. In a world of aggressive blues and sterile whites, amber is a radical act of hospitality.`,
    tags: 'Design,UI,CSS,React',
    category: 'Tech',
    pinned: false,
    viewCount: 312,
    createTime: '2026-05-20T10:00:00',
  },
  'the-meaning-of-travel': {
    id: 2,
    title: '旅行的意义，不在于终点',
    slug: 'the-meaning-of-travel',
    coverUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80',
    summary: '旅行改变的不是脚下的土地，而是你看待世界的方式。',
    content: `## 出发之前

每次收拾行李，我都在问自己同一个问题：我究竟在逃离什么，还是在寻找什么？

多年以后我才明白，这个问题本身就是答案。旅行从来不是目的地的函数，而是出发这个动作的意义。

## 在路上

巴厘岛的清晨五点，寺庙里传来木鱼声。我坐在稻田边，看着薄雾一层层退去。那一刻没有 WiFi，没有消息通知，只有时间在流动。

> 真正的旅行者不携带目的地，他们只携带好奇心。

这种好奇心是珍贵的——它不问"这里有什么著名景点"，而是问"这里的人早饭吃什么"。

## 回来之后

每次旅行结束，我都带回两件东西：一些照片，和一个更陌生的自己。

陌生不是坏事。陌生意味着你用新的眼光看待了原来熟悉的一切——包括你自己的房间，你自己的生活，还有镜子里的那个人。

## 下一站

下一站在哪里不重要。重要的是，你愿意再次出发。`,
    tags: '旅行,随想,Bali',
    category: 'Life',
    pinned: false,
    viewCount: 189,
    createTime: '2026-04-15T08:30:00',
  },
}

// ── Helper Functions ──

function formatDate(iso: string): string {
  const d = new Date(iso)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}.${m}.${day}`
}

function calcReadTime(content: string): string {
  const cnChars = (content.match(/[\u4e00-\u9fff]/g) || []).length
  const enWords = (content.replace(/[\u4e00-\u9fff]/g, '').match(/\w+/g) || []).length
  const cpm = 300 // Chinese chars per minute
  const wpm = 200 // English words per minute
  const minutes = Math.ceil(cnChars / cpm + enWords / wpm)
  return `${Math.max(1, minutes)} min read`
}

interface TocItem { id: string; level: 2 | 3; text: string }

function parseToc(content: string): TocItem[] {
  return content
    .split('\n')
    .filter(line => /^#{2,3}\s/.test(line))
    .map(line => {
      const level = line.startsWith('### ') ? 3 : 2
      const text = line.replace(/^#{2,3}\s+/, '')
      const id = text.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff]+/g, '-').replace(/-+$/, '')
      return { id, level, text }
    })
}

function highlightCode(code: string): string {
  // 1. HTML escape
  let result = code
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // 2. Strings (single/double/backtick)
  result = result.replace(
    /(['"`])((?:\\.|(?!\1)[^\\])*)\1/g,
    '<span style="color:#C9A96E">$1$2$1</span>'
  )
  // 3. Single-line comments
  result = result.replace(
    /(\/\/[^\n]*)/g,
    '<span style="color:#6B5040">$1</span>'
  )
  // 4. Keywords
  const keywords = ['const', 'let', 'var', 'function', 'return', 'import', 'export',
    'default', 'from', 'if', 'else', 'for', 'while', 'class', 'interface',
    'type', 'async', 'await', 'new', 'this', 'extends']
  keywords.forEach(kw => {
    result = result.replace(
      new RegExp('\\b(' + kw + ')\\b', 'g'),
      '<span style="color:#E8855A">$1</span>'
    )
  })
  // 5. Numbers
  result = result.replace(
    /\b(\d+)\b/g,
    '<span style="color:#C45A30">$1</span>'
  )

  return result
}

function CodeBlock({ lang, code }: { lang: string; code: string }) {
  const highlighted = highlightCode(code)
  return (
    <div style={{
      background: '#1A1208',
      borderRadius: 10,
      margin: '20px 0',
      overflow: 'hidden',
    }}>
      {lang && (
        <div style={{
          padding: '6px 16px',
          background: '#2A1E10',
          fontSize: 10, letterSpacing: '0.1em',
          color: '#8A6A50', fontFamily: 'monospace',
        }}>
          {lang}
        </div>
      )}
      <pre style={{
        margin: 0, padding: '16px 20px',
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 13, lineHeight: 1.7,
        overflowX: 'auto',
      }}>
        <code dangerouslySetInnerHTML={{ __html: highlighted }} />
      </pre>
    </div>
  )
}

function renderContent(content: string): JSX.Element {
  const segments = content.split(/(```[\s\S]*?```)/g)
  const nodes: JSX.Element[] = []
  let key = 0

  for (const seg of segments) {
    if (seg.startsWith('```')) {
      const match = seg.match(/```(\w*)\n?([\s\S]*?)```/)
      const lang = match?.[1] || ''
      const code = match?.[2] || ''
      nodes.push(<CodeBlock key={key++} lang={lang} code={code} />)
    } else {
      const lines = seg.split('\n')
      for (const line of lines) {
        if (/^#{2}\s/.test(line)) {
          const text = line.replace(/^#{2}\s+/, '')
          const id = text.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff]+/g, '-').replace(/-+$/, '')
          nodes.push(
            <h2 key={key++} id={id} style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontSize: 28, fontWeight: 800, color: '#2E1A0E',
              margin: '40px 0 16px', letterSpacing: '-0.01em',
              borderBottom: '1px solid #E8C9B0', paddingBottom: 8,
            }}>{text}</h2>
          )
        } else if (/^#{3}\s/.test(line)) {
          const text = line.replace(/^#{3}\s+/, '')
          const id = text.toLowerCase().replace(/[^a-z0-9\u4e00-\u9fff]+/g, '-').replace(/-+$/, '')
          nodes.push(
            <h3 key={key++} id={id} style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontSize: 20, fontWeight: 700, color: '#2E1A0E',
              margin: '28px 0 10px',
            }}>{text}</h3>
          )
        } else if (/^>\s/.test(line)) {
          const text = line.replace(/^>\s+/, '')
          nodes.push(
            <blockquote key={key++} style={{
              borderLeft: '3px solid #C45A30',
              paddingLeft: 16, margin: '20px 0',
              fontFamily: 'Caveat, cursive', fontSize: 18,
              color: '#B07050', lineHeight: 1.6,
            }}>{text}</blockquote>
          )
        } else if (/^!\[.*\]\(.*\)/.test(line)) {
          const match = line.match(/!\[([^\]]*)\]\(([^)]+)\)/)
          if (match) nodes.push(
            <img key={key++} src={match[2]} alt={match[1]} style={{
              width: '100%', borderRadius: 12, margin: '24px 0',
              objectFit: 'cover',
            }} />
          )
        } else if (line.trim()) {
          nodes.push(
            <p key={key++} style={{
              fontSize: 16, lineHeight: 1.9, color: '#2E1A0E',
              margin: '0 0 20px', fontFamily: 'Barlow, sans-serif',
              fontWeight: 400,
            }}>{line}</p>
          )
        }
      }
    }
  }
  return <>{nodes}</>
}

// ── Page Component ──

export default function BlogDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    async function fetchArticle() {
      try {
        const data = await getArticleBySlug(slug)
        if (data) {
          setArticle(data)
          setLoading(false)
          return
        }
      } catch (e) {
        console.error('Failed to fetch article:', e)
      }
      // Fallback to mock
      const mock = MOCK_ARTICLES[slug]
      if (mock) {
        setArticle(mock)
      }
      setLoading(false)
    }
    fetchArticle()
  }, [slug])

  const toc = article?.content ? parseToc(article.content) : []

  useEffect(() => {
    if (toc.length === 0) return
    const headingEls = toc.map(item =>
      document.getElementById(item.id)
    ).filter(Boolean) as HTMLElement[]

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting)
        if (visible.length > 0) {
          setActiveSection(visible[0].target.id)
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
    )

    headingEls.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [toc])

  // ── Loading State ──
  if (loading) {
    return (
      <main style={{
        minHeight: '100vh', background: '#FDF6EE',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <p style={{ fontFamily: 'Barlow, sans-serif', fontSize: 14, color: '#B07050' }}>Loading...</p>
      </main>
    )
  }

  // ── 404 State ──
  if (!article) {
    return (
      <main style={{
        minHeight: '100vh', background: '#FDF6EE',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', gap: 16,
      }}>
        <p style={{ fontSize: 48 }}>📄</p>
        <p style={{ fontFamily: 'Barlow Condensed', fontSize: 24, color: '#2E1A0E' }}>
          Article not found
        </p>
        <Link href="/blog" style={{ color: '#C45A30', fontSize: 14 }}>
          ← Back to Blog
        </Link>
      </main>
    )
  }

  return (
    <main className="blog-detail" style={{
      minHeight: '100vh',
      background: '#FDF6EE',
      fontFamily: 'Barlow, sans-serif',
    }}>

      {/* ── Cover Hero ── */}
      {article.coverUrl && (
        <div style={{
          width: '100%',
          height: 280,
          position: 'relative',
          overflow: 'hidden',
        }}>
          <img
            src={article.coverUrl}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          {!article.coverUrl && (
            <div className="cover-placeholder" style={{
              width: '100%', height: '100%',
              background: 'linear-gradient(135deg, #E8C9B0, #FFF8F0)',
            }} />
          )}
          {/* bottom gradient overlay */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: 120,
            background: 'linear-gradient(to bottom, transparent, #FDF6EE)',
          }} />
        </div>
      )}

      {/* ── Metadata Bar ── */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 16,
        padding: '12px 60px',
        borderBottom: '0.5px solid #E8C9B0',
        fontSize: 12, color: '#B07050',
      }}>
        <Link href="/blog" style={{ color: '#B07050', textDecoration: 'none' }}>
          ← Blog
        </Link>
        {article.category && (
          <span style={{
            background: '#2E1A0E', color: '#FDF6EE',
            borderRadius: 4, padding: '2px 8px', fontSize: 10, letterSpacing: '0.1em',
          }}>
            {article.category.toUpperCase()}
          </span>
        )}
        <span style={{ marginLeft: 'auto' }}>
          {formatDate(article.createTime)}
        </span>
        <span>{calcReadTime(article.content || '')}</span>
      </div>

      {/* ── Title Section ── */}
      <div style={{
        maxWidth: 720, margin: '40px auto 32px',
        padding: '0 24px', textAlign: 'center',
      }}>
        <h1 style={{
          fontFamily: 'Barlow Condensed, sans-serif',
          fontSize: 52, fontWeight: 800,
          color: '#2E1A0E', lineHeight: 1.1,
          letterSpacing: '-0.02em', margin: '0 0 16px',
        }}>
          {article.title}
        </h1>
        {article.summary && (
          <p style={{
            fontFamily: 'Caveat, cursive', fontSize: 20,
            color: '#B07050', lineHeight: 1.6, margin: '0 0 20px',
          }}>
            {article.summary}
          </p>
        )}
        {article.tags && (
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
            {article.tags.split(',').map(tag => (
              <span key={tag.trim()} style={{
                fontSize: 11, color: '#B07050',
                border: '0.5px solid #E8C9B0',
                borderRadius: 99, padding: '3px 10px',
              }}>
                #{tag.trim()}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── Two-Column Layout: TOC + Content ── */}
      <div style={{
        display: 'flex',
        maxWidth: 1100,
        margin: '0 auto',
        padding: '0 40px 80px',
        gap: 48,
        alignItems: 'flex-start',
      }}>

        {/* Left TOC */}
        {toc.length > 0 && (
          <aside style={{
            width: 220, flexShrink: 0,
            position: 'sticky', top: 100,
            maxHeight: 'calc(100vh - 120px)',
            overflowY: 'auto',
          }}>
            <div style={{
              fontSize: 10, letterSpacing: '0.15em',
              color: '#C45A30', marginBottom: 12,
              textTransform: 'uppercase', fontWeight: 700,
            }}>
              Contents
            </div>
            <nav>
              {toc.map(item => (
                <a
                  key={item.id}
                  href={'#' + item.id}
                  className="toc-item"
                  data-active={activeSection === item.id ? 'true' : 'false'}
                  style={{
                    display: 'block',
                    padding: '5px 0 5px ' + (item.level === 3 ? '12px' : '0'),
                    fontSize: 13,
                    color: activeSection === item.id ? '#C45A30' : '#B07050',
                    fontWeight: activeSection === item.id ? 600 : 400,
                    textDecoration: 'none',
                    borderLeft: activeSection === item.id
                      ? '2px solid #C45A30'
                      : '2px solid transparent',
                    transition: 'color 0.2s, border-color 0.2s',
                    lineHeight: 1.4,
                  }}
                >
                  {item.text}
                </a>
              ))}
            </nav>
          </aside>
        )}

        {/* Right Content */}
        <article style={{ flex: 1, minWidth: 0 }}>
          {renderContent(article.content || '')}
        </article>

      </div>

      {/* ── Page Styles ── */}
      <style>{pageCss}</style>
    </main>
  )
}

// ── CSS ──

const CSS_LINES = [
  "@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800&family=Barlow:wght@300;400;500&family=Caveat:wght@600&display=swap');",
  // Scrollbar styling
  '.blog-detail::-webkit-scrollbar { width: 4px; }',
  '.blog-detail::-webkit-scrollbar-thumb { background: #E8C9B0; border-radius: 2px; }',
  // TOC hover
  '.toc-item:hover { color: #C45A30 !important; }',
  // Code block scrollbar
  'pre::-webkit-scrollbar { height: 4px; }',
  'pre::-webkit-scrollbar-thumb { background: #3A2A1A; border-radius: 2px; }',
  // Cover placeholder
  '.cover-placeholder { background: linear-gradient(135deg, #E8C9B0, #FFF8F0); }',
]
const pageCss = CSS_LINES.join('\n')
