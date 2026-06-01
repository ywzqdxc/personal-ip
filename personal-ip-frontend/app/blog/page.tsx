'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getPublishedArticles, type Article } from '@/lib/api/articles'

// ── Mock data ──────────────────────────────────────────────────────────────
const MOCK_ARTICLES: Article[] = [
  { id: 1, title: 'Exploring Warm Aesthetics in Modern UI Design', slug: 'exploring-warm-aesthetics', coverUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=75', summary: '暖色系不是一种风格，而是一种态度——让像素拥有温度，让界面成为归宿。', content: null, tags: 'Design,UI,CSS', category: 'Tech', pinned: false, viewCount: 312, createTime: '2026-05-20T10:00:00' },
  { id: 2, title: '旅行的意义，不在于终点', slug: 'the-meaning-of-travel', coverUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=75', summary: '旅行改变的不是脚下的土地，而是你看待世界的方式。', content: null, tags: '旅行,随想', category: 'Life', pinned: false, viewCount: 189, createTime: '2026-05-18T08:30:00' },
  { id: 3, title: 'Building with Next.js 16 App Router', slug: 'nextjs-16-app-router', coverUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=75', summary: 'Server Components, ISR, and everything in between.', content: null, tags: 'Next.js,React', category: 'Tech', pinned: true, viewCount: 540, createTime: '2026-04-30T14:00:00' },
  { id: 4, title: '产品思维：从解决问题到创造价值', slug: 'product-thinking', coverUrl: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&q=75', summary: '好的产品不是功能的堆砌，而是对人性的理解与共鸣。', content: null, tags: '产品,思考', category: 'Thoughts', pinned: false, viewCount: 234, createTime: '2026-04-21T09:00:00' },
  { id: 5, title: '在森林里，时间慢了下来', slug: 'forest-slow-time', coverUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&q=75', summary: '远离城市的喧嚣，听见内心的声音。', content: null, tags: '自然,随想', category: 'Travel', pinned: false, viewCount: 167, createTime: '2026-04-15T07:30:00' },
  { id: 6, title: 'Design Systems: From Zero to Consistent', slug: 'design-systems', coverUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&q=75', summary: 'How to build a scalable component library that your team will actually use.', content: null, tags: 'Design,System,Component', category: 'Design', pinned: false, viewCount: 298, createTime: '2026-04-08T11:00:00' },
  { id: 7, title: '关于专注：在碎片时代做深度工作', slug: 'deep-work', coverUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400&q=75', summary: '手机通知、无休止的会议、社交媒体——如何在碎片化的现代找回专注？', content: null, tags: '效率,生活方式', category: 'Life', pinned: false, viewCount: 421, createTime: '2026-03-22T10:00:00' },
  { id: 8, title: '巴厘岛七日：慢下来才看得见', slug: 'bali-seven-days', coverUrl: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=400&q=75', summary: '从布罗莫到乌鲁瓦图，用胶卷的速度丈量这座岛屿。', content: null, tags: 'Bali,Travel,摄影', category: 'Travel', pinned: false, viewCount: 388, createTime: '2026-03-10T08:00:00' },
  { id: 9, title: 'TypeScript Patterns I Use Every Day', slug: 'typescript-patterns', coverUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&q=75', summary: 'Conditional types, template literal types, and infer — from abstract to practical.', content: null, tags: 'TypeScript,JavaScript', category: 'Tech', pinned: false, viewCount: 476, createTime: '2026-02-28T15:00:00' },
]

const CATEGORIES = ['All','Tech','Life','Travel','Design','Thoughts','Others']

const CAT_COLOR: Record<string,string> = {
  Tech:'#C45A30', Life:'#5A8C5A', Travel:'#4A7CB0', Design:'#8B5EA8', Thoughts:'#B07050', Others:'#888',
}

const SIDEBAR_CATS = [
  { key:'Tech', count:3, imgs:['photo-1555066931-4365d14bab8c','photo-1498050108023-c5249f4df085','photo-1517694712202-14dd9538aa97','photo-1461749280684-dccba630e2f6'] },
  { key:'Life', count:2, imgs:['photo-1499750310107-5fef28a66643','photo-1545205597-3d9d02c29597','photo-1545205597-3d9d02c29597','photo-1511988617509-a57c8a288659'] },
  { key:'Travel', count:2, imgs:['photo-1537996194471-e657df975ab4','photo-1506905925346-21bda4d32df4','photo-1476480862126-209bfaa8edc8','photo-1448375240586-882707db888b'] },
  { key:'Design', count:1, imgs:['photo-1561070791-2526d30994b5','photo-1558618666-fcd25c85cd64','photo-1572044162444-ad60f128bdea','photo-1545235617-9465d2a55698'] },
  { key:'Thoughts', count:1, imgs:['photo-1507838153414-b4b713384a76','photo-1485988412941-77a35537dae4','photo-1474552226712-ac0f0961a954','photo-1509228468518-180dd4864904'] },
]

const MORE_TAGS = ['JavaScript','React','Next.js','CSS','UI/UX','TypeScript','Node.js','Performance','SEO','Accessibility','Product','Mindset']

const KNOWN_CATS = ['Tech','Life','Travel','Design','Thoughts']

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const CSS_LINES = [
  "@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800&family=Barlow:wght@300;400;500;600&family=Caveat:wght@600&display=swap');",
  '.blog-card { transition: transform 0.22s ease, box-shadow 0.22s ease, background 0.18s; }',
  '.blog-card:hover { transform: translateY(-2px); box-shadow: 0 6px 24px rgba(46,26,14,0.08); background: rgba(255,255,255,0.75) !important; }',
  '.blog-card:hover .bc-arrow { color: #C45A30 !important; transform: translateX(3px); }',
  '.bc-arrow { transition: color 0.2s, transform 0.2s; }',
  '.cat-tab { transition: background 0.18s, color 0.18s; }',
  '.cat-tab:hover { background: rgba(196,90,48,0.12) !important; }',
  '.sb-thumb { overflow: hidden; border-radius: 4px; }',
  '.sb-thumb img { transition: transform 0.35s ease; width: 100%; height: 100%; object-fit: cover; display: block; }',
  '.sb-thumb:hover img { transform: scale(1.1); }',
  '.more-tag { transition: background 0.18s, color 0.18s; }',
  '.more-tag:hover { background: #C45A30 !important; color: #fff !important; border-color: #C45A30 !important; }',
  '.sb-cat-row { transition: background 0.18s; border-radius: 10px; cursor: pointer; }',
  '.sb-cat-row:hover { background: rgba(196,90,48,0.07); }',
  '.search-input:focus { outline: none; }',
]
const pageCss = CSS_LINES.join('\n')

export default function BlogPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQ, setSearchQ] = useState('')

  useEffect(() => {
    getPublishedArticles()
      .then(d => setArticles(d.length > 0 ? d : MOCK_ARTICLES))
      .catch(() => setArticles(MOCK_ARTICLES))
  }, [])

  const filtered = articles.filter(a => {
    const matchCat = activeCategory === 'All'
      || a.category === activeCategory
      || (activeCategory === 'Others' && !KNOWN_CATS.includes(a.category ?? ''))
    const q = searchQ.toLowerCase()
    const matchQ = q === '' || a.title.toLowerCase().includes(q) || (a.summary ?? '').toLowerCase().includes(q)
    return matchCat && matchQ
  })

  return (
    <main style={{ minHeight: '100vh', background: '#FDF6EE', paddingTop: 96, paddingBottom: 80 }}>
      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '0 32px', display: 'flex', gap: 48, alignItems: 'flex-start' }}>

        {/* ── Main ── */}
        <div style={{ flex: 1, minWidth: 0 }}>


          {/* Tabs + Search */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, gap: 12, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {CATEGORIES.map(c => (
                <button key={c} className="cat-tab" onClick={() => setActiveCategory(c)} style={{ padding: '6px 16px', borderRadius: 99, fontSize: 13, fontWeight: 500, border: 'none', cursor: 'pointer', fontFamily: 'Barlow, sans-serif', background: activeCategory === c ? '#C45A30' : 'rgba(196,90,48,0.08)', color: activeCategory === c ? '#fff' : '#B07050' }}>
                  {c}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid #E8C9B0', borderRadius: 8, padding: '7px 14px', minWidth: 180 }}>
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="#B07050" strokeWidth="1.5"><circle cx="6" cy="6" r="4.5"/><path d="M10 10l2.5 2.5"/></svg>
              <input className="search-input" value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Search articles..." style={{ border: 'none', background: 'transparent', fontSize: 13, color: '#2E1A0E', width: '100%', fontFamily: 'Barlow, sans-serif' }} />
            </div>
          </div>

          {/* Article cards */}
          {filtered.length === 0
            ? <p style={{ color: '#B07050', fontSize: 14, padding: '48px 0', textAlign: 'center' }}>暂无文章</p>
            : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {filtered.map(a => (
                  <Link key={a.id} href={'/blog/' + a.slug} className="blog-card" style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '14px 16px', borderRadius: 12, textDecoration: 'none', background: 'transparent' }}>
                    {a.coverUrl
                      ? <div style={{ width: 112, height: 76, flexShrink: 0, borderRadius: 8, overflow: 'hidden' }}><img src={a.coverUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} /></div>
                      : <div style={{ width: 112, height: 76, flexShrink: 0, borderRadius: 8, background: '#EEE4D8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C8A882" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="3"/></svg></div>
                    }
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        {a.pinned && <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, background: 'rgba(232,133,90,0.18)', color: '#E8855A', letterSpacing: '0.08em', fontFamily: 'Barlow, sans-serif' }}>PINNED</span>}
                        {a.category && <span style={{ fontSize: 12, fontWeight: 600, color: CAT_COLOR[a.category] ?? '#888', fontFamily: 'Barlow, sans-serif' }}>{a.category}</span>}
                      </div>
                      <h2 style={{ fontFamily: 'Barlow, sans-serif', fontSize: 16, fontWeight: 700, color: '#2E1A0E', margin: '0 0 4px', lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.title}</h2>
                      {a.summary && <p style={{ color: '#B07050', fontSize: 13, margin: '0 0 6px', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' as const }}>{a.summary}</p>}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                          {(a.tags ?? '').split(',').slice(0, 3).map(t => <span key={t.trim()} style={{ fontSize: 11, color: '#B07050' }}>#{t.trim()}</span>)}
                        </div>
                        <span style={{ fontSize: 11, color: '#C8A882', fontFamily: 'Barlow, sans-serif', flexShrink: 0 }}>{formatDate(a.createTime)}</span>
                      </div>
                    </div>
                    <span className="bc-arrow" style={{ color: '#C8A882', fontSize: 18, flexShrink: 0 }}>→</span>
                  </Link>
                ))}
              </div>
            )
          }
        </div>

        {/* ── Sidebar ── */}
        <aside style={{ width: 272, flexShrink: 0, position: 'sticky', top: 104 }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="#C45A30" strokeWidth="1.5"><path d="M2 2h5l7 7-5 5-7-7V2z"/><circle cx="5.5" cy="5.5" r="1"/></svg>
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', color: '#2E1A0E', textTransform: 'uppercase', fontFamily: 'Barlow, sans-serif' }}>Explore by Tag</span>
          </div>
          <div style={{ height: 2, background: 'linear-gradient(to right, #C45A30 0%, transparent 100%)', marginBottom: 20, borderRadius: 1 }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
            {SIDEBAR_CATS.map(sc => (
              <div key={sc.key} className="sb-cat-row" onClick={() => setActiveCategory(sc.key)} style={{ padding: '8px 10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: CAT_COLOR[sc.key] ?? '#888', fontFamily: 'Barlow, sans-serif' }}>{sc.key}</span>
                  <span style={{ fontSize: 11, color: '#C8A882' }}>{sc.count}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 4 }}>
                  {sc.imgs.map((img, i) => (
                    <div key={i} className="sb-thumb" style={{ height: 44 }}>
                      <img src={'https://images.unsplash.com/' + img + '?auto=format&fit=crop&w=120&q=70'} alt="" loading="lazy" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', color: '#B07050', textTransform: 'uppercase', margin: '0 0 10px', fontFamily: 'Barlow, sans-serif' }}>More Tags</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {MORE_TAGS.map(t => (
              <button key={t} className="more-tag" style={{ fontSize: 11, padding: '4px 10px', borderRadius: 99, border: '0.5px solid #E8C9B0', background: 'transparent', color: '#B07050', cursor: 'pointer', fontFamily: 'Barlow, sans-serif' }}>
                {t}
              </button>
            ))}
          </div>

        </aside>
      </div>
      <style>{pageCss}</style>
    </main>
  )
}
