'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getTravelYears } from '@/lib/travel/api'
import type { TravelYear } from '@/lib/travel/types'

const NAV_H = 80

interface CardData {
  year: number
  label: string
  coverImg: string
  color: string
  rot: number
  left: string
  top: string
}

const YEAR_COLORS: Record<string, string> = {
  '2022': '#E8855A',
  '2023': '#4A9B8E',
  '2024': '#C45A30',
  '2025': '#8B6BB1',
  '2026': '#4A7FA5',
}

const CARD_SLOTS = [
  { rot: -6,  left: '4%',  top: '6%'  },
  { rot:  4,  left: '46%', top: '4%'  },
  { rot: -3,  left: '24%', top: '46%' },
  { rot:  5,  left: '60%', top: '38%' },
  { rot: -4,  left: '10%', top: '68%' },
]

const pageCss = [
  "@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;700;800&family=Barlow:wght@300;400;500&family=Caveat:wght@400;600;700&display=swap');",
  '.year-card { cursor:pointer; will-change:transform,box-shadow; }',
  '.year-card:hover { z-index:20 !important; box-shadow:0 24px 64px rgba(0,0,0,0.22) !important; }',
  '.cta-btn { transition:background 0.25s,transform 0.2s; }',
  '.cta-btn:hover { background:#1a2a4a !important; transform:translateX(4px); }',
  '.y-pill { cursor:pointer; transition:all 0.2s; }',
  '.y-pill:hover { background:rgba(46,26,14,0.1) !important; }',
  '.y-pill.active { background:#2E1A0E !important; color:#FDF6EE !important; border-color:#2E1A0E !important; }',
  '@keyframes floatCard0 { 0%,100%{transform:rotate(-6deg) translateY(0px)} 50%{transform:rotate(-6deg) translateY(-8px)} }',
  '@keyframes floatCard1 { 0%,100%{transform:rotate(4deg) translateY(0px)} 50%{transform:rotate(4deg) translateY(-10px)} }',
  '@keyframes floatCard2 { 0%,100%{transform:rotate(-3deg) translateY(0px)} 50%{transform:rotate(-3deg) translateY(-7px)} }',
  '@keyframes floatCard3 { 0%,100%{transform:rotate(5deg) translateY(0px)} 50%{transform:rotate(5deg) translateY(-9px)} }',
  '@keyframes floatCard4 { 0%,100%{transform:rotate(-4deg) translateY(0px)} 50%{transform:rotate(-4deg) translateY(-6px)} }',
  '@keyframes fadeInUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }',
  '.card-float-0 { animation:floatCard0 6s ease-in-out infinite; }',
  '.card-float-1 { animation:floatCard1 7s ease-in-out 0.5s infinite; }',
  '.card-float-2 { animation:floatCard2 8s ease-in-out 1s infinite; }',
  '.card-float-3 { animation:floatCard3 6.5s ease-in-out 1.5s infinite; }',
  '.card-float-4 { animation:floatCard4 7.5s ease-in-out 0.8s infinite; }',
  '.year-card:hover .card-float-0,.year-card:hover .card-float-1,.year-card:hover .card-float-2,.year-card:hover .card-float-3,.year-card:hover .card-float-4 { animation-play-state:paused; }',
  '.left-content { animation:fadeInUp 0.7s ease both; }',
  '.left-content > * { animation:fadeInUp 0.7s ease both; }',
].join('\n')

export default function TravelPage() {
  const router = useRouter()
  const [years, setYears] = useState<TravelYear[]>([])
  const [activeYear, setActiveYear] = useState<number | null>(null)
  const [hovered, setHovered] = useState<number | null>(null)

  useEffect(() => {
    getTravelYears().then(data => {
      setYears(data)
      if (data.length > 0) setActiveYear(data[data.length - 1].year)
    })
  }, [])

  const cards: CardData[] = years.map((y, i) => {
    const slot = CARD_SLOTS[i % CARD_SLOTS.length]
    const img = y.coverImg || (y.trips.length > 0 ? y.trips[0].coverImg : '')
    return {
      year: y.year,
      label: y.label,
      coverImg: img,
      color: YEAR_COLORS[String(y.year)] || '#E8855A',
      rot: slot.rot,
      left: slot.left,
      top: slot.top,
    }
  })

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      paddingTop: NAV_H,
      background: 'linear-gradient(135deg, #FDE8D0 0%, #F5EEF8 55%, #D4E8F5 100%)',
      overflow: 'hidden',
      fontFamily: "'Barlow', sans-serif",
    }}>

      {/* ── Leaf decoration ── */}
      <svg
        style={{ position: 'absolute', top: NAV_H, left: 0, width: 140, height: 140, opacity: 0.25, pointerEvents: 'none', zIndex: 5 }}
        viewBox="0 0 140 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 128 Q 25 45, 105 18 Q 70 68, 12 128Z" fill="#7A9B50" />
        <path d="M12 128 Q 35 80, 80 32" stroke="#5A7B30" strokeWidth="1.5" fill="none" />
        <path d="M12 128 Q 28 92, 55 65" stroke="#5A7B30" strokeWidth="1" fill="none" opacity="0.6" />
      </svg>

      {/* ── Bird silhouette ── */}
      <svg
        style={{ position: 'absolute', top: NAV_H + 32, right: 80, width: 48, height: 24, opacity: 0.18, pointerEvents: 'none', zIndex: 5 }}
        viewBox="0 0 48 24"
        fill="none"
      >
        <path d="M24 12 C18 4, 4 2, 0 8 C8 6, 16 10, 24 12Z" fill="#4A6090" />
        <path d="M24 12 C30 4, 44 2, 48 8 C40 6, 32 10, 24 12Z" fill="#4A6090" />
      </svg>

      {/* ── Main two-column layout ── */}
      <div style={{ display: 'flex', height: 'calc(100% - 56px)', position: 'relative' }}>

        {/* ── LEFT PANEL ── */}
        <div style={{
          width: '42%', flexShrink: 0,
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: '0 40px 40px 60px',
          position: 'relative', zIndex: 10,
        }}>
          <div className="left-content">
            {/* Hello label */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22, animationDelay: '0.1s' }}>
              <div style={{ width: 28, height: 1.5, background: '#B07050', borderRadius: 1 }} />
              <span style={{
                fontSize: 11, letterSpacing: '0.26em', textTransform: 'uppercase',
                color: '#B07050', fontFamily: "'Barlow', sans-serif", fontWeight: 500,
              }}>Hello, I&apos;m</span>
            </div>

            {/* Main heading */}
            <h1 style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 76, fontWeight: 800, lineHeight: 0.92,
              letterSpacing: '-0.03em', color: '#2E1A0E',
              margin: '0 0 22px', animationDelay: '0.15s',
            }}>
              Collecting<br />
              <span style={{ color: '#C45A30' }}>Moments.</span>
            </h1>

            {/* Caveat subtitle */}
            <p style={{
              fontFamily: "'Caveat', cursive",
              fontSize: 23, color: '#5A4030', marginBottom: 18,
              fontWeight: 600, lineHeight: 1.4, animationDelay: '0.22s',
            }}>
              Exploring the world, one story at a time.
            </p>

            {/* Chinese description */}
            <p style={{
              fontSize: 13, color: '#7A5A40', lineHeight: 1.8,
              fontFamily: "'Barlow', sans-serif",
              marginBottom: 38, maxWidth: 310, animationDelay: '0.28s',
            }}>
              记录每一段旅途，留存那些触动心灵的瞬间。
              <br />
              <span style={{ color: '#9A7A60', fontSize: 11.5, letterSpacing: '0.02em' }}>
                Each journey is a chapter. Each photo, a memory.
              </span>
            </p>

            {/* CTA button */}
            <button
              className="cta-btn"
              onClick={() => { if (activeYear) router.push('/travel/' + activeYear) }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                background: '#2B3A5E', color: '#FDF6EE',
                border: 'none', borderRadius: 50,
                padding: '14px 34px',
                fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase',
                fontFamily: "'Barlow', sans-serif", fontWeight: 500,
                cursor: 'pointer', width: 'fit-content',
                boxShadow: '0 4px 20px rgba(43,58,94,0.25)',
                animationDelay: '0.34s',
              }}
            >
              Explore My Journey
              <span style={{ fontSize: 15 }}>→</span>
            </button>
          </div>
        </div>

        {/* ── RIGHT PANEL — floating photo cards ── */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>

          {/* Dotted connecting lines (SVG overlay) */}
          {cards.length >= 2 && (
            <svg
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%',
                pointerEvents: 'none', zIndex: 1,
              }}
              preserveAspectRatio="none"
            >
              {cards.slice(0, -1).map((card, i) => {
                const next = cards[i + 1]
                const panelW = 700
                const panelH = 700
                const x1 = parseFloat(card.left) / 100 * panelW + 95
                const y1 = parseFloat(card.top)  / 100 * panelH + 130
                const x2 = parseFloat(next.left) / 100 * panelW + 95
                const y2 = parseFloat(next.top)  / 100 * panelH + 130
                const mx = (x1 + x2) / 2
                const my = (y1 + y2) / 2 - 30
                return (
                  <path
                    key={i}
                    d={'M ' + x1 + ' ' + y1 + ' Q ' + mx + ' ' + my + ' ' + x2 + ' ' + y2}
                    stroke="#C8A898"
                    strokeWidth="1.5"
                    strokeDasharray="5 7"
                    fill="none"
                    opacity="0.45"
                  />
                )
              })}
            </svg>
          )}

          {/* Photo cards */}
          {cards.map((card, i) => (
            <div
              key={card.year}
              className={'year-card card-float-' + i}
              onClick={() => router.push('/travel/' + card.year)}
              onMouseEnter={() => setHovered(card.year)}
              onMouseLeave={() => setHovered(null)}
              style={{
                position: 'absolute',
                left: card.left,
                top: card.top,
                width: 188,
                borderRadius: 14,
                overflow: 'hidden',
                background: '#FFFAF6',
                boxShadow: hovered === card.year
                  ? '0 24px 64px rgba(0,0,0,0.22)'
                  : '0 8px 36px rgba(0,0,0,0.13)',
                zIndex: hovered === card.year ? 20 : 10,
                transition: 'box-shadow 0.3s',
              }}
            >
              {/* Photo */}
              <div style={{
                width: '100%', height: 238,
                overflow: 'hidden', background: '#E8D0B8',
                position: 'relative',
              }}>
                {card.coverImg && (
                  <img
                    src={card.coverImg}
                    alt={card.label}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                )}
                {/* Subtle gradient overlay */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to bottom, transparent 55%, rgba(45,26,14,0.35) 100%)',
                }} />
              </div>

              {/* Card footer */}
              <div style={{
                padding: '11px 14px 13px',
                borderTop: '1px solid #EDD8C8',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: card.color, flexShrink: 0,
                    boxShadow: '0 0 6px ' + card.color + '80',
                  }} />
                  <span style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: 24, fontWeight: 800, color: '#2E1A0E',
                    letterSpacing: '-0.02em', lineHeight: 1,
                  }}>{card.year}</span>
                </div>
                <span style={{
                  fontFamily: "'Barlow', sans-serif",
                  fontSize: 10, color: '#B07050',
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                }}>{card.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        display: 'flex', alignItems: 'center',
        padding: '0 48px',
        height: 56,
        background: 'rgba(253,246,238,0.82)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid rgba(232,201,176,0.45)',
        zIndex: 30,
      }}>
        {/* Year pills */}
        <div style={{ display: 'flex', gap: 6, flex: 1, alignItems: 'center' }}>
          {years.map(y => (
            <button
              key={y.year}
              className={'y-pill' + (activeYear === y.year ? ' active' : '')}
              onClick={() => { setActiveYear(y.year); router.push('/travel/' + y.year) }}
              style={{
                border: '1px solid rgba(176,112,80,0.28)',
                borderRadius: 20,
                padding: '5px 16px',
                fontSize: 12, fontWeight: 500,
                letterSpacing: '0.06em',
                fontFamily: "'Barlow', sans-serif",
                background: 'transparent',
                color: '#7A5A40',
                cursor: 'pointer',
              }}
            >
              {y.year}
            </button>
          ))}
        </div>

        {/* Calendar icon */}
        <button
          onClick={() => { if (activeYear) router.push('/travel/' + activeYear) }}
          style={{
            background: 'none',
            border: '1px solid rgba(176,112,80,0.28)',
            borderRadius: 8, padding: '6px 10px',
            cursor: 'pointer', color: '#B07050',
            display: 'flex', alignItems: 'center',
          }}
        >
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
            <rect x="1" y="2.5" width="14" height="12.5" rx="2" stroke="currentColor" strokeWidth="1.3" />
            <path d="M1 6.5h14" stroke="currentColor" strokeWidth="1.3" />
            <path d="M5 1v3M11 1v3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            <circle cx="5" cy="10" r="1" fill="currentColor" />
            <circle cx="8" cy="10" r="1" fill="currentColor" />
            <circle cx="11" cy="10" r="1" fill="currentColor" />
          </svg>
        </button>
      </div>

      {/* ── Bottom-left: Scroll indicator ── */}
      <div style={{
        position: 'absolute', bottom: 70, left: 52,
        display: 'flex', alignItems: 'center', gap: 8,
        pointerEvents: 'none', zIndex: 20,
      }}>
        <div style={{ width: 1, height: 22, background: '#B07050', opacity: 0.45 }} />
        <span style={{
          fontSize: 9.5, letterSpacing: '0.22em', textTransform: 'uppercase',
          color: '#B07050', fontFamily: "'Barlow', sans-serif",
          opacity: 0.6,
        }}>Scroll to explore</span>
      </div>

      {/* ── Bottom-right: Handwritten quote ── */}
      <div style={{
        position: 'absolute', bottom: 68, right: 52,
        pointerEvents: 'none', zIndex: 20,
      }}>
        <span style={{
          fontFamily: "'Caveat', cursive",
          fontSize: 17, color: '#8A6850', opacity: 0.75,
        }}>Life is short, the world is wide.</span>
      </div>

      <style>{pageCss}</style>
    </div>
  )
}
