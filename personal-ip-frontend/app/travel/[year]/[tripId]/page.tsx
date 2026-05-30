'use client'

import { use, useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useRouter } from 'next/navigation'
import { getTravelTrip } from '@/lib/travel/api'
import type { TravelTrip } from '@/lib/travel/types'
import BackButton from '@/components/travel/BackButton'



// ── Wrapper: handles async data loading ────────────────────
export default function TripPage({
  params,
}: {
  params: Promise<{ year: string; tripId: string }>
}) {
  const { year: ys, tripId } = use(params)
  const year = parseInt(ys, 10)

  const [trip, setTrip]           = useState<TravelTrip | undefined>(undefined)
  const [loaded, setLoaded]       = useState(false)
  const [isNotFound, setIsNotFound] = useState(false)

  useEffect(() => {
    getTravelTrip(year, tripId).then(t => {
      if (!t) { setIsNotFound(true); return }
      setTrip(t)
      setLoaded(true)
    })
  }, [year, tripId])

  if (isNotFound) {
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 80 }}>
        <p style={{ fontFamily: "'Space Mono', monospace", fontSize: 18, color: '#666', letterSpacing: '0.1em' }}>TRIP NOT FOUND</p>
      </div>
    )
  }

  if (!loaded || !trip) {
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 80 }}>
        <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 24, color: '#555', letterSpacing: '0.1em' }}>LOADING…</p>
      </div>
    )
  }

  return <TripJournal trip={trip} year={year} />
}

// ── Inner: all hooks live here — no conditional returns above them ──
function TripJournal({ trip, year }: { trip: TravelTrip; year: number }) {
  const chs   = trip.chapters
  const TOTAL = chs.length + 1   // 0 = cover, 1..N = chapters
  const router = useRouter()

  // ── State ────────────────────────────────────────────────
  const [pg,      setPg]     = useState(0)
  const [pIdx,    setPIdx]   = useState(0)
  const [hovIdx,  setHovIdx] = useState<number | null>(null)
  const [twText,  setTwText] = useState('')
  const [kbVis,   setKbVis]  = useState(false)
  const [fadePh,  setFadePh] = useState(false)

  // ── Refs (avoid stale closures) ───────────────────────────
  const pgRef      = useRef(0)
  const pIdxRef    = useRef(0)
  const pausedRef  = useRef(false)
  const fadingRef  = useRef(false)
  const carRef     = useRef<ReturnType<typeof setInterval>  | null>(null)
  const twTRef     = useRef<ReturnType<typeof setTimeout>   | null>(null)
  const twIRef     = useRef<ReturnType<typeof setInterval>  | null>(null)
  const hovTRef      = useRef<ReturnType<typeof setTimeout>   | null>(null)
  const filmStripRef = useRef<HTMLDivElement>(null)
  const tracklistRef  = useRef<HTMLDivElement>(null)   // 左侧 tracklist 容器
  const coverRightRef = useRef<HTMLDivElement>(null)   // 右侧缩略图容器
  // 双向独立锁：syncRtoL=右→左同步进行中(左的 handler 忽略)，syncLtoR 反之
  const syncRtoLRef = useRef(false)
  const syncLtoRRef = useRef(false)

  pgRef.current   = pg
  pIdxRef.current = pIdx

  // ── 联动滚动辅助（hover 触发版）────────────────────────────
  const scrollRightToItem = useCallback((i: number) => {
    const container = coverRightRef.current
    if (!container) return
    const items = container.querySelectorAll<HTMLElement>('.cover-thumb')
    const item = items[i]
    if (!item) return
    // 滚右侧时，标记「左→右 in progress」以阻止右侧 scroll 事件反向同步左
    syncLtoRRef.current = true
    container.scrollTo({
      top: item.offsetTop - container.clientHeight / 2 + item.clientHeight / 2,
      behavior: 'smooth',
    })
    setTimeout(() => { syncLtoRRef.current = false }, 700)
  }, [])

  const scrollLeftToItem = useCallback((i: number) => {
    const container = tracklistRef.current
    if (!container) return
    const items = container.querySelectorAll<HTMLElement>('.tracklist-item')
    const item = items[i]
    if (!item) return
    syncRtoLRef.current = true
    container.scrollTo({
      top: item.offsetTop - container.clientHeight / 2 + item.clientHeight / 2,
      behavior: 'smooth',
    })
    setTimeout(() => { syncRtoLRef.current = false }, 700)
  }, [])

  // ── Helpers ───────────────────────────────────────────────
  const clearTimers = useCallback(() => {
    if (carRef.current) clearInterval(carRef.current)
    if (twTRef.current) clearTimeout(twTRef.current)
    if (twIRef.current) clearInterval(twIRef.current)
  }, [])

  const switchPhoto = useCallback((newIdx: number) => {
    if (fadingRef.current) return
    fadingRef.current = true
    setFadePh(true)
    setTimeout(() => {
      setPIdx(newIdx)
      setFadePh(false)
      fadingRef.current = false
    }, 280)
  }, [])

  const goPage = useCallback((idx: number) => {
    if (idx < 0 || idx >= TOTAL || idx === pgRef.current) return
    clearTimers()
    fadingRef.current = false
    setFadePh(false)
    setPg(idx)
    setPIdx(0)
    setTwText('')
    setKbVis(false)
    setHovIdx(null)
  }, [TOTAL, clearTimers])

  // ── 滚轮联动：左右按比例同步（双向独立锁）────────────────────
  useEffect(() => {
    if (pg !== 0) return   // 只在封面页生效

    const left  = tracklistRef.current
    const right = coverRightRef.current
    if (!left || !right) return

    const onLeftScroll = () => {
      if (syncRtoLRef.current) return   // 右→左同步触发的，忽略
      const ratio = left.scrollTop / Math.max(1, left.scrollHeight - left.clientHeight)
      syncLtoRRef.current = true
      right.scrollTop = ratio * Math.max(0, right.scrollHeight - right.clientHeight)
      requestAnimationFrame(() => { syncLtoRRef.current = false })
    }

    const onRightScroll = () => {
      if (syncLtoRRef.current) return   // 左→右同步触发的，忽略
      const ratio = right.scrollTop / Math.max(1, right.scrollHeight - right.clientHeight)
      syncRtoLRef.current = true
      left.scrollTop = ratio * Math.max(0, left.scrollHeight - left.clientHeight)
      requestAnimationFrame(() => { syncRtoLRef.current = false })
    }

    left.addEventListener('scroll',  onLeftScroll,  { passive: true })
    right.addEventListener('scroll', onRightScroll, { passive: true })
    return () => {
      left.removeEventListener('scroll',  onLeftScroll)
      right.removeEventListener('scroll', onRightScroll)
    }
  }, [pg])

  // ── Keyboard navigation ───────────────────────────────────
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goPage(pgRef.current + 1)
      else if (e.key === 'ArrowLeft')  goPage(pgRef.current - 1)
      else if (e.key === 'ArrowDown' && pgRef.current > 0) {
        const len = chs[pgRef.current - 1].photos.length
        switchPhoto((pIdxRef.current + 1) % len)
      }
      else if (e.key === 'ArrowUp' && pgRef.current > 0) {
        const len = chs[pgRef.current - 1].photos.length
        switchPhoto((pIdxRef.current - 1 + len) % len)
      }
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [chs, goPage, switchPhoto])

  // ── Chapter enter: typewriter + carousel ──────────────────
  useEffect(() => {
    if (pg === 0) return
    const ch = chs[pg - 1]

    // Keyboard hint
    setKbVis(true)
    const kbT = setTimeout(() => setKbVis(false), 3500)

    // Typewriter
    setTwText('')
    let charIdx = 0
    twTRef.current = setTimeout(() => {
      twIRef.current = setInterval(() => {
        charIdx++
        setTwText(ch.tags.slice(0, charIdx))
        if (charIdx >= ch.tags.length && twIRef.current) {
          clearInterval(twIRef.current)
        }
      }, 38)
    }, 620)

    // Carousel
    carRef.current = setInterval(() => {
      if (!pausedRef.current && pgRef.current > 0) {
        const len = chs[pgRef.current - 1]?.photos.length ?? 1
        const next = (pIdxRef.current + 1) % len
        // Direct update (no fade flash for auto-advance — key={pIdx} handles it)
        setPIdx(next)
      }
    }, 3600)

    return () => {
      clearTimeout(kbT)
      clearTimers()
    }
  }, [pg, chs, clearTimers])

  // ── Filmstrip scroll to active ────────────────────────────
  useEffect(() => {
    if (!filmStripRef.current) return
    const thumbs = filmStripRef.current.querySelectorAll('.fs-thumb')
    const active = thumbs[pIdx] as HTMLElement | undefined
    active?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [pIdx])

  // ── Cleanup on unmount ────────────────────────────────────
  useEffect(() => () => clearTimers(), [clearTimers])

  // ── Derived values ────────────────────────────────────────
  const ch    = pg > 0 ? chs[pg - 1] : null


  // Film indicator groups  [[0], [1..4], [5..8], ...]
  const filmGroups: number[][] = [[0]]
  for (let i = 1; i < TOTAL; i += 4)
    filmGroups.push(Array.from({ length: Math.min(4, TOTAL - i) }, (_, j) => i + j))

  // Cover hover derived
  const hovCh  = hovIdx !== null ? chs[hovIdx] : null
  const tintBg = hovCh
    ? `linear-gradient(to bottom, transparent 15%, ${hovCh.tintColor} 100%)`
    : 'transparent'
  const acLine = hovCh ? hovCh.accent : trip.accentColor

  // ─────────────────────────────────────────────────────────
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      fontFamily: "'Space Mono', monospace",
      background: '#111',
    }}>

      {/* ══ Back Button（portal 脱离 stacking context，感知 pg 状态）══ */}
      {typeof document !== 'undefined' && createPortal(
        <BackButton onClick={pg > 0 ? () => goPage(0) : () => router.back()} />,
        document.body
      )}

      {/* ══ Now Hovering ══ */}
      <div style={{
        position: 'absolute', bottom: 10, right: 18,
        fontSize: 8, letterSpacing: '0.16em', color: '#666',
        textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 8,
        zIndex: 300, pointerEvents: 'none',
        opacity: pg === 0 && hovIdx !== null ? 1 : 0, transition: 'opacity 0.3s',
      }}>
        <span className="nh-dot" />
        <span>NOW HOVERING · {hovCh?.name ?? ''}</span>
      </div>

      {/* ══ Keyboard hint ══ */}
      <div style={{
        position: 'absolute', bottom: 10, left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)',
        border: '1px solid #222', padding: '7px 18px',
        display: 'flex', alignItems: 'center', gap: 18,
        fontSize: 8, letterSpacing: '0.12em', color: '#555',
        textTransform: 'uppercase', zIndex: 300, pointerEvents: 'none',
        whiteSpace: 'nowrap',
        opacity: kbVis ? 1 : 0, transition: 'opacity 0.4s',
      }}>
        <span>
          <span className="kb-key">←</span>
          <span className="kb-key">→</span>
          {' '}TURN CHAPTER
        </span>
        <span style={{ color: '#2a2a2a' }}>|</span>
        <span>
          <span className="kb-key">↑</span>
          <span className="kb-key">↓</span>
          {' '}FLIP PHOTO
        </span>
        <span style={{ color: '#2a2a2a' }}>|</span>
        <span>HOVER PAUSES</span>
      </div>

      {/* ══ Page Wrapper ══ */}
      <div
        key={pg}   /* remounts on chapter change → triggers all anim-* */
        className="page-wrap"
        style={{
          position: 'absolute',
          left: 0, right: 0,
          display: 'flex',
          animation: 'pageEnter 0.35s ease both',
        }}
      >
        {pg === 0 ? (

          /* ════════════════ COVER PAGE ════════════════ */
          <>
            {/* ── Cover Left ── */}
            <div style={{
              width: '50%', padding: '28px 40px 22px',
              display: 'flex', flexDirection: 'column',
              position: 'relative',
              borderRight: '1px solid #1a1a1a',
              background: '#111',
            }}>
              {/* tint overlay */}
              <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                background: tintBg, transition: 'background 0.55s ease', zIndex: 0,
              }} />

              {/* content above tint */}
              <div style={{
                position: 'relative', zIndex: 1,
                flex: 1, display: 'flex', flexDirection: 'column',
                minHeight: 0,
              }}>
                {/* meta top */}
                {/* Big title */}
                <div style={{
                  fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900,
                  fontSize: 'clamp(70px, 13vw, 148px)', lineHeight: 0.88,
                  color: '#e8e0d0', textTransform: 'uppercase', letterSpacing: '-0.02em',
                }}>
                  {trip.title}
                </div>
                {/* Outline year */}
                <div style={{
                  fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900,
                  fontSize: 'clamp(70px, 13vw, 148px)', lineHeight: 0.9,
                  color: 'transparent', WebkitTextStroke: '2px #e8e0d0',
                  textTransform: 'uppercase', letterSpacing: '-0.02em', marginBottom: 14,
                }}>
                  {trip.titleYear}
                </div>

                {/* accent line */}
                <div style={{
                  width: 56, height: 3,
                  background: acLine,
                  marginBottom: 12, transition: 'background 0.5s',
                }} />

                {/* Chinese */}
                <div style={{
                  fontFamily: "'Noto Serif SC', serif", fontSize: 17,
                  color: '#d8d0c4', letterSpacing: '0.35em', marginBottom: 5,
                }}>
                  {trip.chinese}
                </div>

                {/* Tagline */}
                <div style={{
                  fontFamily: "'Caveat', cursive", fontSize: 15,
                  color: '#666', lineHeight: 1.45, marginBottom: 18, whiteSpace: 'pre-line',
                }}>
                  {trip.tagline}
                </div>

                {/* Tracklist */}
                <div
                  ref={tracklistRef}
                  className="cover-left-scroll"
                  data-lenis-prevent
                  data-lenis-prevent-wheel
                  style={{
                    flex: 1, display: 'flex', flexDirection: 'column',
                    borderTop: '1px solid #1e1e1e',
                    overflowY: 'scroll',
                    minHeight: 0,
                    position: 'relative',
                  }}
                >
                  {chs.map((c, i) => (
                    <div
                      key={c.id}
                      className="tracklist-item"
                      onMouseEnter={() => {
                        if (hovTRef.current) clearTimeout(hovTRef.current)
                        setHovIdx(i)
                        scrollRightToItem(i)   // 联动右侧滚动
                      }}
                      onMouseLeave={() => {
                        hovTRef.current = setTimeout(() => setHovIdx(null), 250)
                      }}
                      onClick={() => goPage(i + 1)}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '28px 52px 1fr auto',
                        alignItems: 'center', padding: '9px 0',
                        borderBottom: '1px solid #1a1a1a',
                        fontSize: '12px', letterSpacing: '0.08em',
                        color: hovIdx === i ? '#d8d0c4' : '#666',
                        textTransform: 'uppercase', cursor: 'pointer',
                        background: hovIdx === i ? 'rgba(255,255,255,0.03)' : 'transparent',
                        transition: 'color 0.3s, background 0.3s', gap: 8,
                      }}
                    >
                      <span style={{
                        color: (hovIdx === i && hovCh) ? hovCh.accent : '#e04030',
                        fontSize: '12px', fontWeight: 600, transition: 'color 0.3s',
                      }}>{c.num}</span>
                      <span style={{ color: '#4a4a4a' }}>{c.dateLabel}</span>
                      <span style={{
                        color: (hovIdx === i && hovCh) ? hovCh.accent : 'inherit',
                        transition: 'color 0.3s',
                      }}>{c.name}</span>
                      <span style={{ color: '#4a4a4a', textAlign: 'right' }}>{c.area}</span>
                    </div>
                  ))}
                </div>

                {/* Bottom bar */}
                <div style={{
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', paddingTop: 14,
                }}>
                  <button
                    onClick={() => goPage(1)}
                    className="enter-btn"
                  >→ ENTER ROLL</button>
                </div>
              </div>

            </div>

            {/* ── Cover Right (film thumbnails) ── */}
            <div
              ref={coverRightRef}
              className="cover-right-scroll"
              data-lenis-prevent
              data-lenis-prevent-wheel
              style={{ width: '50%', background: '#0d0d0d', overflowY: 'scroll', position: 'relative' }}
            >
              {/* top perfs */}
              <div style={{
                height: 18, background: '#0a0a0a',
                display: 'flex', alignItems: 'center', padding: '0 8px', gap: 6,
              }}>
                {[0,1,2,3,4,5].map(j => (
                  <div key={j} style={{
                    width: 16, height: 10,
                    border: '1.5px solid #1e1e1e', borderRadius: 2,
                  }} />
                ))}
              </div>

              {/* chapter thumbnails */}
              {chs.map((c, i) => (
                <div
                  key={c.id}
                  onMouseEnter={() => {
                    if (hovTRef.current) clearTimeout(hovTRef.current)
                    setHovIdx(i)
                    scrollLeftToItem(i)    // 联动左侧 tracklist 滚动
                  }}
                  onMouseLeave={() => {
                    hovTRef.current = setTimeout(() => setHovIdx(null), 250)
                  }}
                  onClick={() => goPage(i + 1)}
                  className={`cover-thumb${hovIdx === i ? ' hl' : ''}`}
                  style={{ '--accent': c.accent } as React.CSSProperties}
                >
                  <div className="ct-bar" />
                  <div
                    className="ct-bg"
                    style={{ background: `url(${c.coverImg}) center/cover, ${c.coverGrad}` }}
                  />
                  <div className="ct-num">{c.num}</div>
                  <div className="ct-name">{c.name}</div>
                  <div className="ct-date">EXP {c.dateLabel} · {c.region.split('·')[0].trim()}</div>
                  <div className="ct-region">{c.area}</div>
                </div>
              ))}

              {/* bottom perfs */}
              <div style={{
                height: 18, background: '#0a0a0a',
                display: 'flex', alignItems: 'center', padding: '0 8px', gap: 6,
              }}>
                {[0,1,2,3,4,5].map(j => (
                  <div key={j} style={{
                    width: 16, height: 10,
                    border: '1.5px solid #1e1e1e', borderRadius: 2,
                  }} />
                ))}
              </div>
            </div>
          </>

        ) : ch && (

          /* ════════════════ CHAPTER PAGE ════════════════ */
          <>
            {/* ── Chapter Left ── */}
            <div style={{
              width: '50%', padding: '28px 40px 22px',
              display: 'flex', flexDirection: 'column',
              position: 'relative', overflow: 'hidden',
              backgroundColor: ch.bg,
            }}>
              {/* top row: page num + breadcrumb */}
              <div className="anim-label" style={{
                display: 'flex', justifyContent: 'space-between',
                marginBottom: 34,
              }}>
                <div style={{ fontSize: 10, color: `${ch.textColor}38` }}>{ch.pageNum}</div>
                <div style={{
                  fontSize: '8px', letterSpacing: '0.16em',
                  color: `${ch.textColor}60`, textTransform: 'uppercase',
                }}>
                  CHAPTER {ch.num} ★ {ch.region}
                </div>
              </div>

              {/* label row */}
              <div className="anim-label" style={{
                fontSize: '8px', letterSpacing: '0.18em',
                textTransform: 'uppercase',
                display: 'flex', alignItems: 'center', gap: 8,
                marginBottom: 10, color: `${ch.textColor}80`,
              }}>
                CHAPTER {ch.num}
                <span style={{
                  width: 6, height: 6, borderRadius: '50%',
                  display: 'inline-block', background: `${ch.textColor}55`,
                }} />
                {ch.region} · {ch.country}
              </div>

              {/* big name */}
              <div className="ch-name anim-name" style={{ color: ch.textColor }}>
                {ch.name}
              </div>

              {/* accent line */}
              <div
                className="anim-line"
                style={{ height: 3, background: ch.accent, marginBottom: 14 }}
              />

              {/* Chinese name */}
              <div className="anim-chinese" style={{
                fontFamily: "'Noto Serif SC', serif", fontWeight: 300,
                fontSize: 20, letterSpacing: '0.55em',
                marginBottom: 16, opacity: 0.65,
                color: ch.textColor,
              }}>
                {ch.chinese}
              </div>

              {/* Tags (typewriter) */}
              <div className="anim-tags" style={{
                fontFamily: "'Caveat', cursive", fontSize: 20, fontWeight: 600,
                marginBottom: 'auto', opacity: 0.9, minHeight: 30,
                color: ch.accent,
              }}>
                {twText}
              </div>

              {/* Bottom section */}
              <div style={{ marginTop: 'auto' }}>
                {/* spots */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 16 }}>
                  {ch.spots.map((s, i) => (
                    <div
                      key={i}
                      className={`anim-spot${Math.min(i + 1, 3)}`}
                      style={{
                        fontSize: '8.5px', letterSpacing: '0.1em',
                        opacity: 0.45, textTransform: 'uppercase',
                        color: ch.textColor,
                      }}
                    >
                      {s}
                    </div>
                  ))}
                </div>

                {/* quote */}
                <div className="anim-quote" style={{
                  fontFamily: "'Caveat', cursive", fontSize: '14.5px',
                  lineHeight: 1.65, opacity: 0.7, maxWidth: 250,
                  marginBottom: 22, color: ch.textColor, whiteSpace: 'pre-line',
                }}>
                  {ch.quote}
                </div>

                {/* footer */}
                <div className="anim-footer" style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                  <div style={{
                    fontSize: '8px', letterSpacing: '0.18em',
                    opacity: 0.3, textTransform: 'uppercase', color: ch.textColor,
                  }}>
                    SPOT ★ {trip.title} {trip.titleYear}
                  </div>
                  <div style={{ fontSize: 10, opacity: 0.22, color: ch.textColor }}>
                    {ch.pageNum}
                  </div>
                </div>
              </div>

              {/* Stamp circle */}
              <div
                className="ch-stamp anim-stamp"
                style={{ borderColor: ch.textColor, color: ch.textColor }}
              >
                <div className="stamp-year">{trip.titleYear}</div>
                <div className="stamp-sub">{ch.area}</div>
              </div>
            </div>

            {/* ── Chapter Right ── */}
            <div
              style={{ width: '50%', position: 'relative', display: 'flex', overflow: 'hidden' }}
              onMouseEnter={() => { pausedRef.current = true }}
              onMouseLeave={() => { pausedRef.current = false }}
            >
              {/* Photo area */}
              <div className="anim-photo" style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>

                {/* Background photo — key forces photoReveal on photo change */}
                <div
                  key={pIdx}
                  className="ch-photo-bg"
                  style={{ background: `url(${ch.photos[pIdx]}) center/cover, ${ch.coverGrad}` }}
                />

                {/* Fade overlay for manual switch */}
                <div style={{
                  position: 'absolute', inset: 0, background: '#000',
                  opacity: fadePh ? 0.6 : 0, transition: 'opacity 0.3s',
                  zIndex: 5, pointerEvents: 'none',
                }} />

                {/* Crosshair HUD */}
                <div style={{
                  position: 'absolute', top: 18, left: 18,
                  zIndex: 10, display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none"
                    stroke="rgba(255,255,255,0.65)" strokeWidth="1.5">
                    <line x1="9" y1="0" x2="9" y2="6"/>
                    <line x1="9" y1="12" x2="9" y2="18"/>
                    <line x1="0" y1="9" x2="6" y2="9"/>
                    <line x1="12" y1="9" x2="18" y2="9"/>
                    <circle cx="9" cy="9" r="2"/>
                  </svg>
                  <div style={{ display: 'flex', gap: 3 }}>
                    {['#e04040','#40b0e0','#e8e040','#50c850'].map(c => (
                      <div key={c} style={{ width: 14, height: 14, borderRadius: 1, background: c }} />
                    ))}
                  </div>
                </div>


                {/* Caption */}
                <div style={{
                  position: 'absolute', bottom: 52, left: 18, zIndex: 10,
                  fontFamily: "'Caveat', cursive", fontSize: 22,
                  color: 'rgba(255,255,255,0.88)',
                  textShadow: '0 1px 8px rgba(0,0,0,0.7)',
                }}>
                  {ch.caption}
                </div>

                {/* Frame group (big number) */}
                <div style={{
                  position: 'absolute', bottom: 30, right: 86, zIndex: 10,
                  display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2,
                }}>
                  <div style={{
                    fontSize: '8px', letterSpacing: '0.1em',
                    color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap',
                  }}>
                    / {ch.totalExp} EXP
                  </div>
                  <div style={{
                    fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900,
                    fontSize: 66, lineHeight: 0.9,
                    color: 'rgba(255,255,255,0.9)',
                    textShadow: '0 2px 16px rgba(0,0,0,0.5)',
                  }}>
                    {String(pIdx + 1).padStart(2, '0')}
                  </div>
                </div>

                {/* Meta bar */}
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0, height: 26,
                  background: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(4px)',
                  zIndex: 10, display: 'flex', alignItems: 'center',
                  padding: '0 14px', gap: 12,
                  fontSize: '8px', letterSpacing: '0.1em',
                  color: 'rgba(255,255,255,0.42)',
                }}>
                  <span>{String(pIdx + 1).padStart(2, '0')} / {ch.totalExp}</span>
                  <span style={{ color: '#2a2a2a' }}>·</span>
                  <span>{ch.time}</span>
                  <span style={{ color: '#2a2a2a' }}>·</span>
                  <span>{ch.coords}</span>
                  <span style={{ color: '#2a2a2a' }}>·</span>
                  <span>{ch.name}</span>
                  <span style={{ color: '#2a2a2a' }}>·</span>
                  <span>{ch.locationCn}</span>
                  <span style={{ color: '#2a2a2a', marginLeft: 'auto' }}>·</span>
                  <span>CONTACT SHEET {ch.contactSheet}</span>
                </div>
              </div>

              {/* Film thumbnail strip */}
              <div
                ref={filmStripRef}
                style={{
                  width: 68, background: '#080808',
                  overflowY: 'auto', scrollbarWidth: 'none',
                  flexShrink: 0, display: 'flex', flexDirection: 'column',
                }}
              >
                {/* top holes */}
                <div style={{
                  height: 16, flexShrink: 0,
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'space-around', padding: '0 8px',
                }}>
                  {[0,1,2].map(j => (
                    <div key={j} style={{
                      width: 12, height: 9,
                      border: '1.5px solid #1e1e1e', borderRadius: 2,
                    }} />
                  ))}
                </div>

                {/* thumbnails */}
                {ch.photos.map((url, i) => (
                  <div
                    key={i}
                    className={`fs-thumb${i === pIdx ? ' active' : ''}`}
                    onClick={() => switchPhoto(i)}
                  >
                    <div className="fs-bg" style={{ background: `url(${url}) center/cover` }} />
                  </div>
                ))}

                {/* bottom holes */}
                <div style={{
                  height: 16, flexShrink: 0,
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'space-around', padding: '0 8px',
                }}>
                  {[0,1,2].map(j => (
                    <div key={j} style={{
                      width: 12, height: 9,
                      border: '1.5px solid #1e1e1e', borderRadius: 2,
                    }} />
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ══ Embedded CSS ══ */}
      <style>{journalCss}</style>
    </div>
  )
}

const journalCss = `
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,600;0,700;0,800;0,900;1,400;1,600&family=Caveat:wght@400;600;700&family=Space+Mono:ital,wght@0,400;1,400&family=Noto+Serif+SC:wght@300;400&display=swap');

        /* Enter roll button */
        .enter-btn {
          border: 1px solid #444; background: none; color: #d8d0c4;
          font-family: 'Space Mono', monospace; font-size: 9px;
          letter-spacing: 0.18em; text-transform: uppercase;
          padding: 9px 18px; cursor: pointer; transition: all 0.2s;
        }
        .enter-btn:hover { background: #d8d0c4; color: #111; }

        /* KB keys */
        .kb-key {
          border: 1px solid #3a3a3a; border-radius: 3px;
          padding: 1px 5px; font-size: 9px; color: #555;
        }

        /* Now-hovering dot */
        .nh-dot {
          width: 5px; height: 5px; border-radius: 50%;
          background: #e04030;
          animation: blink 1.1s ease-in-out infinite;
          display: inline-block;
        }

        /* Cover scrollbars hidden — always-show scroll for hover-wheel capture */
        .cover-right-scroll::-webkit-scrollbar,
        .cover-left-scroll::-webkit-scrollbar { display: none; }

        /* Cover thumbnail strip */
        .cover-thumb {
          position: relative;
          height: calc(100vh / 7.2);
          min-height: 68px;
          border-bottom: 1px solid #0a0a0a;
          cursor: pointer; overflow: hidden; transition: all 0.35s;
        }
        .ct-bg {
          position: absolute; inset: 0;
          background-size: cover; background-position: center;
          filter: brightness(0.35) saturate(0.6);
          transition: filter 0.35s, transform 0.5s;
        }
        .cover-thumb:hover .ct-bg  { filter: brightness(0.55) saturate(0.9); transform: scale(1.02); }
        .cover-thumb.hl   .ct-bg  { filter: brightness(0.65) saturate(1.1); transform: scale(1.04); }
        .ct-bar {
          position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
          background: transparent; transition: background 0.3s;
        }
        .cover-thumb.hl .ct-bar { background: var(--accent, #e8c040); }
        .ct-num {
          position: absolute; top: 10px; left: 14px;
          font-family: 'Space Mono', monospace; font-size: 18px;
          font-weight: bold; color: rgba(255,255,255,0.7);
          line-height: 1; transition: color 0.3s;
        }
        .cover-thumb.hl .ct-num { color: var(--accent, #e8c040); }
        .ct-name {
          position: absolute; top: 10px; right: 14px;
          font-family: 'Barlow Condensed', sans-serif; font-weight: 800;
          font-size: 18px; letter-spacing: 0.04em;
          color: rgba(255,255,255,0.8); text-transform: uppercase;
          transition: color 0.3s;
        }
        .cover-thumb.hl .ct-name { color: var(--accent, #e8c040); }
        .ct-date {
          position: absolute; bottom: 9px; left: 14px;
          font-size: 8px; letter-spacing: 0.1em;
          color: rgba(255,255,255,0.35); text-transform: uppercase;
        }
        .ct-region {
          position: absolute; bottom: 9px; right: 14px;
          font-size: 8px; letter-spacing: 0.1em;
          color: rgba(255,255,255,0.3); text-transform: uppercase;
        }

        /* Chapter name */
        .ch-name {
          font-family: 'Barlow Condensed', sans-serif; font-weight: 900;
          font-size: clamp(56px, 8.5vw, 100px); line-height: 0.86;
          text-transform: uppercase; letter-spacing: -0.01em; margin-bottom: 10px;
        }

        /* Chapter photo bg + pseudo-elements for vignette & grain */
        .ch-photo-bg {
          position: absolute; inset: 0;
          background-size: cover; background-position: center;
          animation: photoReveal 1.0s ease both;
        }
        .ch-photo-bg::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.5) 100%);
          z-index: 1; pointer-events: none;
        }
        .ch-photo-bg::after {
          content: '';
          position: absolute; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E");
          opacity: 0.1; pointer-events: none; mix-blend-mode: overlay; z-index: 2;
        }

        /* Film thumbnail strip */
        .fs-thumb {
          width: 68px; height: 52px; overflow: hidden; cursor: pointer;
          position: relative; flex-shrink: 0;
          border: 1.5px solid transparent;
          transition: border-color 0.25s; margin-bottom: 2px;
        }
        .fs-thumb.active { border-color: #888; }
        .fs-bg {
          width: 100%; height: 100%;
          background-size: cover; background-position: center;
          filter: brightness(0.45) saturate(0.7);
          transition: filter 0.25s;
        }
        .fs-thumb:hover .fs-bg    { filter: brightness(0.75); }
        .fs-thumb.active .fs-bg  { filter: brightness(1) saturate(1); }

        /* Stamp */
        .ch-stamp {
          position: absolute; bottom: 66px; left: 50%;
          width: 88px; height: 88px; border-radius: 50%;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          border-width: 2px; border-style: solid; opacity: 0;
          font-family: 'Space Mono', monospace;
        }
        .stamp-year { font-size: 17px; font-weight: bold; letter-spacing: 0.05em; }
        .stamp-sub  { font-size: 6.5px; letter-spacing: 0.25em; text-transform: uppercase; margin-top: 2px; }

        /* ── Keyframe animations ── */
        @keyframes slideFromLeft {
          from { opacity: 0; transform: translateX(-40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes expandWidth {
          from { width: 0; opacity: 0; }
          to   { width: min(260px, 70%); opacity: 1; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes photoReveal {
          from { opacity: 0; transform: scale(1.06); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes stampAppear {
          from { opacity: 0; transform: translateX(-50%) scale(0.7) rotate(-15deg); }
          to   { opacity: 0.3; transform: translateX(-50%) scale(1) rotate(-5deg); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.2; }
        }
        @keyframes pageEnter {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        /* ── Animation utility classes ── */
        .anim-label   { animation: fadeIn        0.5s ease both;                          animation-delay: 0.05s; }
        .anim-name    { animation: slideFromLeft  0.6s cubic-bezier(0.22,1,0.36,1) both;  animation-delay: 0.12s; }
        .anim-line    { animation: expandWidth   0.55s ease both;                          animation-delay: 0.32s; }
        .anim-chinese { animation: fadeUp         0.5s ease both;                          animation-delay: 0.45s; }
        .anim-tags    { animation: fadeIn         0.3s ease both;                          animation-delay: 0.60s; }
        .anim-spot1   { animation: fadeUp         0.4s ease both;                          animation-delay: 0.65s; }
        .anim-spot2   { animation: fadeUp         0.4s ease both;                          animation-delay: 0.72s; }
        .anim-spot3   { animation: fadeUp         0.4s ease both;                          animation-delay: 0.79s; }
        .anim-quote   { animation: fadeUp         0.5s ease both;                          animation-delay: 0.85s; }
        .anim-footer  { animation: fadeIn         0.4s ease both;                          animation-delay: 0.95s; }
        .anim-stamp   { animation: stampAppear    0.8s cubic-bezier(0.34,1.56,0.64,1) both; animation-delay: 1.00s; }
        .anim-photo   { animation: photoReveal    1.0s ease both;                          animation-delay: 0.10s; }

        /* Push content below fixed navigation (h-16 mobile / h-20 desktop) */
        .page-wrap { top: 64px !important; height: calc(100% - 64px) !important; }
        @media (min-width: 768px) { .page-wrap { top: 80px !important; height: calc(100% - 80px) !important; } }
`
