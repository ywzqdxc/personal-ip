'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useRef, useEffect, useCallback } from 'react'
import { GitHubCalendar } from 'react-github-calendar'
import { Tooltip as ReactTooltip } from 'react-tooltip'

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

/* ── 荣誉展示区：叠放 → 扇形入场 + 单向滚轮传送带 ───────────────── */

const AWARD_LABELS = [
  'Excellence in Innovation',
  'Outstanding Achievement',
  'Leadership Award',
  'Creative Vision',
  'Impact & Growth',
  'Quality Excellence',
  'Team Collaboration',
  'Rising Star',
  'Distinguished Honor',
]

// 扇形参数
const VISIBLE   = 7          // 可见槽位数
const CENTER_SLOT = 3        // (VISIBLE-1)/2
const GAP_X     = 300        // 相邻槽水平间距 px
const FADE_ZONE = 0.65       // 进/出淡出区宽度（槽单位）
const SCROLL_TOTAL = 22      // 容器滚动对应的总 progress 量（~2.5 轮）

function lerp(a: number, b: number, t: number) { return a + (b - a) * t }

// 构建扇形 7 个槽位置
const FAN: { x: number; y: number; rot: number }[] = Array.from({ length: VISIBLE }, (_, slot) => {
  const off  = slot - CENTER_SLOT          // -3 … +3
  const norm = off / CENTER_SLOT           // -1 … +1
  return { x: off * GAP_X, y: Math.abs(off) * 20, rot: norm * 15 }
})

// 退出方向（左侧沉降）
const EXIT_POS  = { x: FAN[0].x - 240,          y: FAN[0].y + 160,          rot: FAN[0].rot - 14 }
// 进入方向（右侧升起）
const ENTRY_POS = { x: FAN[VISIBLE-1].x + 240,  y: FAN[VISIBLE-1].y + 160,  rot: FAN[VISIBLE-1].rot + 14 }

/** 根据 progress 计算单张卡片的变换参数 */
function getCardState(i: number, N: number, progress: number) {
  const rawRel = i - progress
  const rel = ((rawRel % N) + N) % N
  const centeredRel = rel > N / 2 ? rel - N : rel
  const slot = centeredRel + CENTER_SLOT

  let x: number, y: number, rot: number, opacity: number, zIndex: number

  if (slot >= 0 && slot <= VISIBLE - 1) {
    // ① 扇形内：相邻槽插值
    const lo = Math.max(0, Math.min(VISIBLE - 2, Math.floor(slot)))
    const t  = slot - lo
    x   = lerp(FAN[lo].x,   FAN[lo+1].x,   t)
    y   = lerp(FAN[lo].y,   FAN[lo+1].y,   t)
    rot = lerp(FAN[lo].rot, FAN[lo+1].rot, t)
    opacity = 1
    zIndex  = 20 - Math.round(Math.abs(slot - CENTER_SLOT)) * 3
  } else if (slot < 0 && slot >= -FADE_ZONE) {
    // ② 正在退出（左侧沉降淡出）
    const t = slot / -FADE_ZONE               // 0 @ slot=0 → 1 @ slot=-FADE_ZONE
    x   = lerp(FAN[0].x,   EXIT_POS.x,   t)
    y   = lerp(FAN[0].y,   EXIT_POS.y,   t)
    rot = lerp(FAN[0].rot, EXIT_POS.rot, t)
    opacity = 1 - t
    zIndex  = 2                               // 低于所有扇形卡片
  } else if (slot > VISIBLE - 1 && slot <= VISIBLE - 1 + FADE_ZONE) {
    // ③ 正在进入（右侧升起淡入）
    const t = (slot - (VISIBLE - 1)) / FADE_ZONE  // 0 @ rightmost → 1 @ rightmost+FADE
    x   = lerp(FAN[VISIBLE-1].x,   ENTRY_POS.x,   t)
    y   = lerp(FAN[VISIBLE-1].y,   ENTRY_POS.y,   t)
    rot = lerp(FAN[VISIBLE-1].rot, ENTRY_POS.rot, t)
    opacity = 1 - t
    zIndex  = 2
  } else {
    // ④ 完全隐藏
    opacity = 0
    zIndex  = 1
    if (slot < 0) { x = EXIT_POS.x;  y = EXIT_POS.y;  rot = EXIT_POS.rot }
    else          { x = ENTRY_POS.x; y = ENTRY_POS.y; rot = ENTRY_POS.rot }
  }

  return { x, y, rot, opacity, zIndex }
}

function RewardSection({ visible, onHide }: { visible: boolean; onHide: () => void }) {
  const cardRefs       = useRef<(HTMLDivElement | null)[]>([])
  const [cards, setCards]           = useState<string[]>([])
  const [expanded, setExpanded]     = useState(false)
  const [carouselMode, setCarousel] = useState(false)
  const progressRef    = useRef(0)
  const expandedOnce   = useRef(false)

  /* 拉取证书图片 */
  useEffect(() => {
    fetch('/api/rewards')
      .then(r => r.json())
      .then(d => setCards(d.images || []))
      .catch(() => setCards([]))
  }, [])

  /* 首次显示时触发入场展开 */
  useEffect(() => {
    if (visible && !expandedOnce.current) {
      expandedOnce.current = true
      setTimeout(() => setExpanded(true), 200)
    }
  }, [visible])

  /* 入场动画播完后切换 carousel 模式 */
  useEffect(() => {
    if (!expanded) return
    const t = setTimeout(() => setCarousel(true), 1100)
    return () => clearTimeout(t)
  }, [expanded])

  /* Wheel 拦截：visible 时完全接管滚轮
     向下 → 旋转 carousel
     向上 → 调用 onHide，覆盖层滑出 */
  useEffect(() => {
    if (!visible) return
    const N     = cards.length
    const SPEED = 0.007

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      e.stopPropagation()

      if (e.deltaY > 0 && carouselMode && N > 0) {
        progressRef.current += e.deltaY * SPEED
        const prog = progressRef.current
        cardRefs.current.forEach((card, i) => {
          if (!card) return
          const { x, y, rot, opacity, zIndex } = getCardState(i, N, prog)
          card.style.transition = 'none'
          card.style.transform  = `translateX(${x}px) translateY(${y}px) rotate(${rot}deg)`
          card.style.opacity    = String(opacity)
          card.style.zIndex     = String(zIndex)
        })
      } else if (e.deltaY < 0) {
        onHide()
      }
    }

    window.addEventListener('wheel', onWheel, { passive: false, capture: true })
    return () => window.removeEventListener('wheel', onWheel, true)
  }, [visible, carouselMode, cards.length, onHide])

  if (cards.length === 0) return null

  const N         = cards.length
  const centerIdx = Math.floor(N / 2)

  return (
    /* position:fixed 覆盖层，通过 translateY 控制进出 */
    <div style={{
      position: 'fixed',
      top: NAV_H, left: 0, right: 0, bottom: 0,
      background: '#FDF6EE',
      zIndex: 40,
      transform: visible ? 'translateY(0)' : 'translateY(100vh)',
      transition: 'transform 0.42s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden',
    }}>
      {/* 标题 */}
      <div style={{ textAlign: 'center', marginBottom: 52 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', marginBottom: 8 }}>
          <div style={{ width: 24, height: 1.5, background: '#B07050' }} />
          <span style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase' as const, color: '#B07050', fontWeight: 500 }}>Honors & Awards</span>
          <div style={{ width: 24, height: 1.5, background: '#B07050' }} />
        </div>
        <h2 style={{ fontFamily: 'Barlow Condensed, sans-serif', fontSize: 36, fontWeight: 800, color: '#2E1A0E', letterSpacing: '-0.02em', margin: 0 }}>Recognition</h2>
      </div>

      {/* 证书区 */}
      <div style={{ position: 'relative', width: '100%', height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {cards.map((src, i) => {
          const stackOff  = i - centerIdx
          const initState = getCardState(i, N, 0)
          let transform: string, opacity: number, zIndex: number, transition: string
          if (!expanded) {
            transform  = `translateX(${stackOff * 5}px) rotate(${stackOff * 13}deg)`
            opacity    = 1
            zIndex     = 10 - Math.abs(stackOff) * 2
            transition = 'none'
          } else if (!carouselMode) {
            transform  = `translateX(${initState.x}px) translateY(${initState.y}px) rotate(${initState.rot}deg)`
            opacity    = initState.opacity
            zIndex     = initState.zIndex
            transition = `transform 0.9s cubic-bezier(0.34,1.56,0.64,1) ${i * 55}ms, opacity 0.6s ease ${i * 55}ms`
          } else {
            transform  = `translateX(${initState.x}px) translateY(${initState.y}px) rotate(${initState.rot}deg)`
            opacity    = initState.opacity
            zIndex     = initState.zIndex
            transition = 'none'
          }
          return (
            <div key={i} ref={el => { cardRefs.current[i] = el }}
              style={{ position: 'absolute', transform, opacity, zIndex, transition } as React.CSSProperties}>
              <img src={src} alt={`Award ${i + 1}`}
                style={{ width: 320, height: 210, objectFit: 'contain', background: '#FFF8F0', borderRadius: 6, boxShadow: '0 4px 28px rgba(46,26,14,0.16)', display: 'block', userSelect: 'none' as const, pointerEvents: 'none' } as React.CSSProperties}
                draggable={false} />
              <div style={{ textAlign: 'center', marginTop: 8, fontSize: 12, fontFamily: 'Caveat, cursive', fontStyle: 'italic', color: '#B07050', opacity: expanded ? 0.7 : 0, transition: 'opacity 0.5s ease', whiteSpace: 'nowrap' }}>
                {AWARD_LABELS[i] || `Honor ${i + 1}`}
              </div>
            </div>
          )
        })}
      </div>

      {/* 底部提示 */}
      <div style={{ position: 'absolute', bottom: 24, display: 'flex', alignItems: 'center', gap: 10, fontSize: 10, letterSpacing: '0.18em', color: 'rgba(176,112,80,0.55)', textTransform: 'uppercase' as const, opacity: expanded ? 1 : 0, transition: 'opacity 0.5s ease 0.8s' }}>
        <div style={{ width: 1, height: 24, background: '#E8C9B0' }} />
        Scroll to rotate
        <div style={{ width: 1, height: 24, background: '#E8C9B0' }} />
      </div>
    </div>
  )
}

export default function AboutPage() {
  const router = useRouter()
  const [hovCard, setHovCard] = useState(null)

  /* ── RewardSection 显示控制 ── */
  const [rewardVisible, setRewardVisible] = useState(false)
  const sentinelRef   = useRef<HTMLDivElement>(null)
  const canShowRef    = useRef(true)          // 防止 hide 后立即重触发
  const cooldownRef   = useRef<ReturnType<typeof setTimeout> | null>(null)

  /* sentinel 进入视口 + 向下滚 → 弹出 RewardSection */
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (!sentinelRef.current || !canShowRef.current || e.deltaY <= 0) return
      const rect = sentinelRef.current.getBoundingClientRect()
      if (rect.top < window.innerHeight && rect.bottom >= 0) {
        e.preventDefault()
        canShowRef.current = false
        setRewardVisible(true)
      }
    }
    window.addEventListener('wheel', onWheel, { passive: false, capture: true })
    return () => window.removeEventListener('wheel', onWheel, true)
  }, [])

  const handleRewardHide = useCallback(() => {
    setRewardVisible(false)
    if (cooldownRef.current) clearTimeout(cooldownRef.current)
    cooldownRef.current = setTimeout(() => { canShowRef.current = true }, 600)
  }, [])

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

      {/* Sentinel：滚动到此处时触发 RewardSection 弹出 */}
      <div ref={sentinelRef} style={{ height: 1, margin: 0 }} />

      {/* 荣誉展示 — position:fixed 全屏覆盖层 */}
      <RewardSection visible={rewardVisible} onHide={handleRewardHide} />

      <ReactTooltip id="react-tooltip" />
      <style>{pageCss}</style>
    </main>
  )
}
