'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { GitHubCalendar } from 'react-github-calendar'
import { Tooltip as ReactTooltip } from 'react-tooltip'
import { useLenis } from 'lenis/react'

const NAV_H = 80

const BENTO_CARDS = [
  {
    id: 'story',
    href: '/about/story',
    tag: 'My Story',
    title: "Where I come from, where I'm going.",
    desc: 'A developer who grew up chasing curiosity — from first lines of code to building for real users.',
    theme: 'dark',
  },
  {
    id: 'hobby',
    href: '/about/hobby',
    tag: 'Life',
    title: 'Beyond Work.',
    desc: 'Running · Coder · Reading · Music',
    theme: 'black',
  },
  {
    id: 'tech',
    href: '/about/tech',
    tag: 'Skills',
    title: 'Tech Stack',
    desc: 'React · Next.js · Java · Spring Boot · TypeScript',
    theme: 'blue',
  },
  {
    id: 'career',
    href: '/about/career',
    tag: 'Experience',
    title: 'Career',
    desc: 'Timeline of education and work',
    theme: 'warm',
  },
]

const SOCIAL = [
  { label: 'LinkedIn', href: '#' },
  { label: '19270859916@163.com', href: null },
]

// 浅色透明版（嵌入 hero）
const warmContribThemeLight = {
  light: ['#EDE0D4', '#D4A882', '#C45A30', '#A04020', '#2E1A0E'],
}

const CSS_LINES = [
  "@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;700;800&family=Barlow:wght@300;400;500&family=Caveat:wght@400;600;700&display=swap');",
  '.about-card { cursor:pointer; transition: transform 0.25s ease, box-shadow 0.25s ease; }',
  '.about-card:hover { transform:translateY(-4px); }',
  '.about-card-dark:hover { box-shadow: 0 16px 48px rgba(0,0,0,0.4); }',
  '.about-card-blue:hover { box-shadow: 0 16px 48px rgba(43,58,94,0.2); }',
  '.about-card-warm:hover { box-shadow: 0 16px 48px rgba(196,90,48,0.15); }',
  '.social-chip { transition: background 0.2s, color 0.2s; }',
  '.social-chip:hover { background: #2E1A0E !important; color: #FDF6EE !important; }',
  '@keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }',
  '.fade-up { animation: fadeUp 0.6s ease both; }',
  '.hobby-dot { display:inline-block; width:6px; height:6px; border-radius:50%; background:#E8855A; margin-right:6px; vertical-align:middle; }',
  // GitHub Calendar 内嵌样式
  '.react-github-calendar { width:100% !important; }',
  '.react-github-calendar svg { width:100% !important; height:auto !important; }',
  '.react-github-calendar text { fill:#B07050 !important; font-size:9px !important; }',
  // 隐藏全局背景动画 canvas（About 页不需要）
  'canvas.pointer-events-none { display:none !important; }',
]
const pageCss = CSS_LINES.join('\n')

/* ── 荣誉展示区：滚轮驱动扇形展开动画 ─────────────────────────── */

function lerp(a: number, b: number, t: number) { return a + (b - a) * t }
function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

// 根据卡片数量动态计算聚拢/展开位置
function buildPositions(count: number) {
  const gap = 340
  const gathered: { x: number; y: number; rot: number }[] = []
  const spread:   { x: number; y: number; rot: number }[] = []
  const center = (count - 1) / 2
  for (let i = 0; i < count; i++) {
    const off = i - center
    const a = count <= 5 ? 1 : off / (center || 1)
    gathered.push({ x: a * 8, y: 0, rot: a * 18 })
    spread.push({
      x: off * gap,
      y: Math.abs(off) * 18 + (count <= 5 ? 0 : Math.abs(off) * 4),
      rot: a * 14,
    })
  }
  return { gathered, spread }
}

function RewardSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const cardRefs     = useRef<(HTMLDivElement | null)[]>([])
  const [cards, setCards] = useState<string[]>([])
  const positionsRef = useRef<{ gathered: {x:number;y:number;rot:number}[], spread: {x:number;y:number;rot:number}[] } | null>(null)

  useEffect(() => {
    fetch('/api/rewards')
      .then(r => r.json())
      .then(d => {
        setCards(d.images || [])
        positionsRef.current = buildPositions(d.images?.length || 0)
      })
      .catch(() => setCards([]))
  }, [])

  useLenis(() => {
    const el = containerRef.current
    const pos = positionsRef.current
    if (!el || !pos || pos.gathered.length === 0) return
    const rect      = el.getBoundingClientRect()
    const scrollable = el.offsetHeight - window.innerHeight
    if (scrollable <= 0) return
    const raw = Math.max(0, Math.min(1, -rect.top / scrollable))
    const t   = easeInOutCubic(raw)
    cardRefs.current.forEach((card, i) => {
      if (!card || !pos.gathered[i] || !pos.spread[i]) return
      const x   = lerp(pos.gathered[i].x, pos.spread[i].x, t)
      const y   = lerp(pos.gathered[i].y, pos.spread[i].y, t)
      const rot = lerp(pos.gathered[i].rot, pos.spread[i].rot, t)
      card.style.transform = `translateX(${x}px) translateY(${y}px) rotate(${rot}deg)`
    })
  })

  if (cards.length === 0) return null

  const centerIdx = Math.floor(cards.length / 2)

  return (
    <div ref={containerRef} style={{ position: 'relative', height: '200vh', marginTop: 16 }}>
      <div style={{
        position: 'sticky', top: NAV_H,
        height: `calc(100vh - ${NAV_H}px)`,
        background: '#FDF6EE',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', marginBottom: 8 }}>
            <div style={{ width: 24, height: 1.5, background: '#B07050' }} />
            <span style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase' as const, color: '#B07050', fontWeight: 500 }}>Honors & Awards</span>
            <div style={{ width: 24, height: 1.5, background: '#B07050' }} />
          </div>
          <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 36, fontWeight: 800, color: '#2E1A0E', letterSpacing: '-0.02em', margin: 0 }}>Recognition</h2>
        </div>
        <div style={{ position: 'relative', width: '100%', height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {cards.map((src, i) => {
            const pos = positionsRef.current
            const g = pos?.gathered[i]
            return (
              <div key={i} ref={el => { cardRefs.current[i] = el }} style={{ position: 'absolute', transform: g ? `translateX(${g.x}px) rotate(${g.rot}deg)` : undefined, zIndex: i === centerIdx ? 10 : (10 - Math.abs(i - centerIdx) * 2), willChange: 'transform' } as React.CSSProperties}>
                <img src={src} alt={`Award ${i + 1}`} style={{ width: 340, height: 220, objectFit: 'contain', background: '#FFF8F0', borderRadius: 6, boxShadow: '0 4px 28px rgba(46,26,14,0.16)', display: 'block', userSelect: 'none' as const, pointerEvents: 'none', draggable: false } as React.CSSProperties} draggable={false} />
              </div>
            )
          })}
        </div>
        <div style={{ position: 'absolute', bottom: 24, display: 'flex', alignItems: 'center', gap: 10, fontSize: 10, letterSpacing: '0.18em', color: 'rgba(176,112,80,0.55)', textTransform: 'uppercase' as const }}>
          <div style={{ width: 1, height: 24, background: '#E8C9B0' }} />
          Scroll to explore
          <div style={{ width: 1, height: 24, background: '#E8C9B0' }} />
        </div>
      </div>
    </div>
  )
}



export default function AboutPage() {
  const router = useRouter()
  const [hovCard, setHovCard] = useState(null)

  return (
    <main style={{
      background: '#FDF6EE',
      minHeight: '100vh',
      paddingTop: NAV_H,
      fontFamily: 'Barlow, sans-serif',
    }}>

      {/* Hero */}
      <section style={{
        padding: '48px 60px 36px',
        display: 'flex',
        alignItems: 'center',
        gap: 32,
        borderBottom: '0.5px solid #E8C9B0',
      }}>
        {/* Left */}
        <div style={{ flex: 1 }} className="fade-up">
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16,
          }}>
            <div style={{ width: 24, height: 1.5, background: '#B07050' }} />
            <span style={{
              fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase' as const,
              color: '#B07050', fontWeight: 500,
            }}>About me</span>
          </div>

          <h1 style={{
            fontFamily: 'Barlow Condensed, sans-serif',
            fontSize: 64, fontWeight: 800, lineHeight: 0.92,
            letterSpacing: '-0.03em', color: '#2E1A0E',
            margin: '0 0 18px',
          }}>
            Hi, I am{' '}
            <span style={{ color: '#C45A30' }}>Reginamy.</span>
          </h1>

          <p style={{
            fontSize: 14, color: '#7A5A40', lineHeight: 1.7,
            maxWidth: 440, marginBottom: 20,
          }}>
            Developer · Traveler · Lifelong learner.
            I build things on the web and collect stories on the road.
            Driven by curiosity, shaped by the journey.
          </p>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const, marginBottom: 20 }}>
            {SOCIAL.map(s => (
              s.href ? (
                <a key={s.label} href={s.href}
                  className="social-chip"
                  style={{
                    fontSize: 11, color: '#7A5A40',
                    border: '0.5px solid #E8C9B0',
                    borderRadius: 99, padding: '5px 14px',
                    textDecoration: 'none', letterSpacing: '0.06em',
                    background: 'transparent',
                  }}
                >{s.label}</a>
              ) : (
                <span key={s.label}
                  style={{
                    fontSize: 11, color: '#7A5A40',
                    border: '0.5px solid #E8C9B0',
                    borderRadius: 99, padding: '5px 14px',
                    letterSpacing: '0.06em',
                    background: 'transparent',
                    userSelect: 'all' as const,
                  }}
                >{s.label}</span>
              )
            ))}
          </div>

          {/* Contribution Graph — 透明内嵌版 */}
          <div style={{ borderTop: '0.5px solid #E8C9B0', paddingTop: 16 }}>
            <div style={{
              display: 'flex', alignItems: 'center',
              justifyContent: 'space-between', marginBottom: 10,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B07050" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
                <span style={{
                  fontSize: 10, letterSpacing: '0.16em',
                  textTransform: 'uppercase' as const, color: '#B07050',
                }}>Contribution Graph</span>
              </div>
              <a
                href="https://github.com/ywzqdxc"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontSize: 11, color: '#C45A30',
                  textDecoration: 'none',
                  display: 'flex', alignItems: 'center', gap: 3,
                }}
              >
                github.com/ywzqdxc <span>↗</span>
              </a>
            </div>
            <GitHubCalendar
              username="ywzqdxc"
              theme={warmContribThemeLight}
              colorScheme="light"
              blockSize={10}
              blockMargin={3}
              fontSize={11}
              hideColorLegend
              hideTotalCount
            />
          </div>
        </div>

        {/* Avatar */}
        <img
          src="/images/cuixin.png"
          alt="Reginamy"
          style={{
            height: 340,
            flexShrink: 0,
          }}
        />
      </section>

      {/* Bento Grid — 3 cols × 3 rows */}
      <section style={{ padding: '24px 60px 60px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gridTemplateRows: '200px 160px',
          gap: 12,
        }}>

          {/* Story — wide dark card (row 1, col 1-2) */}
          <div
            className="about-card about-card-dark"
            style={{
              gridColumn: '1 / 3',
              gridRow: '1',
              background: '#2E1A0E',
              borderRadius: 16,
              padding: '28px 32px',
              display: 'flex',
              gap: 24,
              alignItems: 'flex-end',
              position: 'relative' as const,
            }}
            onClick={() => router.push('/about/story')}
          >
            <span style={{
              position: 'absolute' as const, top: 20, right: 22,
              fontSize: 18, color: 'rgba(253,246,238,0.4)',
            }}>↗</span>

            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase' as const,
                color: '#C45A30', marginBottom: 10,
              }}>My Story</div>
              <h2 style={{
                fontFamily: 'Barlow Condensed, sans-serif',
                fontSize: 28, fontWeight: 800, color: '#FDF6EE',
                lineHeight: 1.1, margin: '0 0 10px',
                letterSpacing: '-0.02em',
              }}>
                Where I come from,{' '}<span style={{ color: '#B07050' }}>where I&apos;m going.</span>
              </h2>
              <p style={{
                fontSize: 12, color: '#8A6A50', lineHeight: 1.6, maxWidth: 280,
              }}>
                A developer who grew up chasing curiosity — from first lines of code to building for real users.
              </p>
            </div>

            {/* Mini timeline */}
            <div style={{
              display: 'flex', flexDirection: 'column' as const,
              gap: 0, flexShrink: 0, paddingBottom: 4,
            }}>
              {[
                { year: '2019', label: 'Started CS', color: '#4A9B8E' },
                { year: '2022', label: 'Graduated', color: '#8B6BB1' },
                { year: '2024', label: 'Building now', color: '#C45A30' },
              ].map((item, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: item.color, flexShrink: 0,
                    }} />
                    <span style={{ fontSize: 9, color: item.color, fontWeight: 600, minWidth: 28 }}>{item.year}</span>
                    <span style={{ fontSize: 9, color: '#6A4A30' }}>{item.label}</span>
                  </div>
                  {i < 2 && (
                    <div style={{ width: 1, height: 16, background: '#3E2A1E', marginLeft: 2.5 }} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Hobby — right column spanning rows 1-2 */}
          <div
            className="about-card"
            style={{
              gridColumn: '3',
              gridRow: '1 / 3',
              background: '#141414',
              borderRadius: 16,
              padding: '24px 22px',
              display: 'flex', flexDirection: 'column' as const,
              position: 'relative' as const,
            }}
            onClick={() => router.push('/about/hobby')}
          >
            <span style={{
              position: 'absolute' as const, top: 20, right: 20,
              fontSize: 16, color: '#E8855A', opacity: 0.7,
            }}>↗</span>

            <div style={{
              fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase' as const,
              color: '#E8855A', marginBottom: 8,
            }}>Life</div>
            <h2 style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontSize: 26, fontWeight: 800, color: '#F5F0EA',
              lineHeight: 1.1, margin: '0 0 18px',
              letterSpacing: '-0.02em',
            }}>Beyond<br />Work.</h2>

            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr',
              gap: 6, flex: 1,
            }}>
              {[
                { name: 'Running', sub: 'Discipline', bg: '#1E1008' },
                { name: 'Coder',   sub: 'Building',   bg: '#081018' },
                { name: 'Reading', sub: 'Ideas',      bg: '#181808' },
                { name: 'Music',   sub: 'Sounds',     bg: '#100818' },
              ].map(h => (
                <div key={h.name} style={{
                  background: h.bg,
                  borderRadius: 10,
                  padding: '10px 10px 8px',
                  display: 'flex', flexDirection: 'column' as const,
                  justifyContent: 'flex-end',
                }}>
                  <div style={{
                    fontSize: 12, fontWeight: 700,
                    color: '#E8D8C0', letterSpacing: '-0.01em',
                    fontFamily: 'Barlow Condensed, sans-serif',
                  }}>{h.name}</div>
                  <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.35)', marginTop: 1 }}>{h.sub}</div>
                </div>
              ))}
            </div>

            <p style={{
              fontSize: 11, color: 'rgba(232,200,176,0.4)',
              marginTop: 14, lineHeight: 1.5, fontStyle: 'italic' as const,
            }}>
              Work built my skills. Passion built who I am.
            </p>
          </div>

          {/* Tech Stack (row 2, col 1) */}
          <div
            className="about-card about-card-blue"
            style={{
              gridColumn: '1',
              gridRow: '2',
              background: '#EEF4FF',
              borderRadius: 16,
              padding: '22px 24px',
              position: 'relative' as const,
            }}
            onClick={() => router.push('/about/tech')}
          >
            <span style={{
              position: 'absolute' as const, top: 16, right: 18,
              fontSize: 15, color: 'rgba(90,130,192,0.5)',
            }}>↗</span>
            <div style={{
              fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase' as const,
              color: '#5A82C0', marginBottom: 8,
            }}>Skills</div>
            <h2 style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontSize: 22, fontWeight: 800, color: '#1A2A4A',
              margin: '0 0 12px', letterSpacing: '-0.02em',
            }}>Tech Stack</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 4 }}>
              {['React', 'Next.js', 'TypeScript', 'Java', 'Spring Boot', 'MySQL', 'Redis'].map(t => (
                <span key={t} style={{
                  fontSize: 10,
                  background: t === 'React' || t === 'Next.js' ? '#2B3A5E' : '#C8D8F5',
                  color: t === 'React' || t === 'Next.js' ? '#E8EEFF' : '#2A4A8A',
                  borderRadius: 99, padding: '2px 9px',
                }}>{t}</span>
              ))}
            </div>
          </div>

          {/* Career (row 2, col 2) */}
          <div
            className="about-card about-card-warm"
            style={{
              gridColumn: '2',
              gridRow: '2',
              background: '#FFF8F0',
              border: '0.5px solid #E8C9B0',
              borderRadius: 16,
              padding: '22px 24px',
              position: 'relative' as const,
            }}
            onClick={() => router.push('/about/career')}
          >
            <span style={{
              position: 'absolute' as const, top: 16, right: 18,
              fontSize: 15, color: 'rgba(176,112,80,0.4)',
            }}>↗</span>
            <div style={{
              fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase' as const,
              color: '#C45A30', marginBottom: 8,
            }}>Experience</div>
            <h2 style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontSize: 22, fontWeight: 800, color: '#2E1A0E',
              margin: '0 0 12px', letterSpacing: '-0.02em',
            }}>Career</h2>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 8 }}>
              {[
                { role: 'Software Engineer', year: '2024–now', color: '#C45A30' },
                { role: 'Backend Intern',    year: '2023',     color: '#8B6BB1' },
                { role: 'CS · University',   year: '2019–23',  color: '#4A9B8E' },
              ].map(item => (
                <div key={item.role} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: item.color, flexShrink: 0,
                  }} />
                  <span style={{ fontSize: 11, color: '#2E1A0E', flex: 1 }}>{item.role}</span>
                  <span style={{ fontSize: 9, color: '#B07050' }}>{item.year}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 荣誉展示滚动动画区 */}
      <RewardSection />

      <ReactTooltip id="react-tooltip" />
      <style>{pageCss}</style>
    </main>
  )
}
