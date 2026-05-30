'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { Thought } from '@/lib/api/thoughts'

/* ── Gear-tick sound (Web Audio) ── */

let _audioCtx: AudioContext | null = null
function getCtx() {
  if (!_audioCtx) _audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)()
  return _audioCtx
}

function playTick() {
  try {
    const ctx = getCtx()
    const now = ctx.currentTime
    const o1 = ctx.createOscillator()
    const g1 = ctx.createGain()
    o1.type = 'sine'
    o1.frequency.setValueAtTime(1400, now)
    o1.frequency.exponentialRampToValueAtTime(800, now + 0.03)
    g1.gain.setValueAtTime(0.08, now)
    g1.gain.exponentialRampToValueAtTime(0.001, now + 0.04)
    o1.connect(g1).connect(ctx.destination)
    o1.start(now); o1.stop(now + 0.04)
    const o2 = ctx.createOscillator()
    const g2 = ctx.createGain()
    o2.type = 'triangle'
    o2.frequency.setValueAtTime(600, now + 0.005)
    o2.frequency.exponentialRampToValueAtTime(300, now + 0.04)
    g2.gain.setValueAtTime(0.05, now + 0.005)
    g2.gain.exponentialRampToValueAtTime(0.001, now + 0.05)
    o2.connect(g2).connect(ctx.destination)
    o2.start(now + 0.005); o2.stop(now + 0.05)
  } catch (_) { /* silent */ }
}

/* ── Helpers ── */

function dateLabel(iso: string): string {
  const d = new Date(iso)
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}

interface TimelineProps {
  thoughts: Thought[]
  contentRef: React.RefObject<HTMLDivElement | null>
  visible: boolean
}

/* ═══════════════════════════════════════════════
   Timeline — Stopwatch / Chronograph style
   ═══════════════════════════════════════════════ */

export function Timeline({ thoughts, contentRef, visible }: TimelineProps) {
  const lineRef = useRef<HTMLDivElement>(null)
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const [activeIdx, setActiveIdx] = useState<number | null>(null)
  const [cursorY, setCursorY] = useState<number | null>(null)
  const lastTickIdx = useRef<number | null>(null)

  /* ── Build markers sorted oldest→newest (bottom→top on timeline) ── */

  const markers = [...thoughts]
    .sort((a, b) => new Date(a.createTime).getTime() - new Date(b.createTime).getTime())
    .map((thought, i, arr) => ({
      thought,
      pct: arr.length <= 1 ? 50 : (i / (arr.length - 1)) * 100,
    }))

  /* ── Generate minor ticks between majors ── */

  const minorTicks: number[] = []
  for (let i = 0; i < markers.length - 1; i++) {
    const gap = markers[i + 1].pct - markers[i].pct
    const count = Math.max(1, Math.round(gap / 3))
    for (let j = 1; j < count; j++) {
      minorTicks.push(markers[i].pct + (gap * j) / count)
    }
  }

  /* ── Hide browser scrollbar ── */

  useEffect(() => {
    const style = document.createElement('style')
    style.id = 'thoughts-hide-scrollbar'
    style.textContent = `
      html { scrollbar-width: none; -ms-overflow-style: none; }
      html::-webkit-scrollbar { display: none; }
    `
    document.head.appendChild(style)
    return () => { style.remove() }
  }, [])

  /* ── Scroll-driven active marker ── */

  useEffect(() => {
    if (!contentRef.current) return
    let prevIdx: number | null = null
    const onScroll = () => {
      const cards = contentRef.current!.querySelectorAll('[data-thought-id]')
      const vh = window.innerHeight
      let closestIdx: number | null = null
      let closestDist = Infinity
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect()
        const mid = rect.top + rect.height / 2
        const dist = Math.abs(mid - vh / 2)
        if (dist < closestDist) {
          closestDist = dist
          const id = Number(card.getAttribute('data-thought-id'))
          const idx = markers.findIndex((m) => m.thought.id === id)
          if (idx !== -1) closestIdx = idx
        }
      })
      if (closestIdx !== null && closestIdx !== prevIdx) {
        prevIdx = closestIdx
        setActiveIdx(closestIdx)
        playTick()
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [contentRef, markers])

  /* ── Mouse interaction ── */

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setCursorY(e.clientY)
    if (!lineRef.current) return
    const rect = lineRef.current.getBoundingClientRect()
    const relY = e.clientY - rect.top
    const pct = (relY / rect.height) * 100
    let nearest = 0
    let minDist = Infinity
    markers.forEach((m, i) => {
      const d = Math.abs(m.pct - pct)
      if (d < minDist) { minDist = d; nearest = i }
    })
    setHoveredIdx(nearest)
    if (nearest !== lastTickIdx.current) {
      lastTickIdx.current = nearest
      playTick()
    }
  }, [markers])

  const handleMouseLeave = useCallback(() => {
    setHoveredIdx(null)
    setCursorY(null)
    lastTickIdx.current = null
  }, [])

  const handleClick = useCallback(() => {
    if (hoveredIdx === null) return
    const thought = markers[hoveredIdx].thought
    const el = document.querySelector(`[data-thought-id="${thought.id}"]`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [hoveredIdx, markers])

  /* ── Tooltip ── */

  const tooltipThought = hoveredIdx !== null ? markers[hoveredIdx]?.thought : null

  return (
    <div
      ref={lineRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{
        position: 'fixed',
        right: 20,
        top: '50%',
        transform: 'translateY(-50%)',
        width: 56,
        height: 'min(64vh, 520px)',
        zIndex: 30,
        cursor: 'pointer',
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.6s ease',
        userSelect: 'none',
      }}
    >
      {/* Top gradient fade */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 40,
          background: 'linear-gradient(to bottom, #FDF6EE 0%, transparent 100%)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />
      {/* Bottom gradient fade */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 40,
          background: 'linear-gradient(to top, #FDF6EE 0%, transparent 100%)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      {/* Tooltip */}
      {tooltipThought && hoveredIdx !== null && cursorY !== null && (
        <div
          style={{
            position: 'fixed',
            right: 88,
            top: cursorY - 11,
            background: '#2E1A0E',
            color: '#FDF6EE',
            fontSize: 11,
            fontFamily: 'Barlow Condensed, sans-serif',
            fontWeight: 700,
            letterSpacing: '0.06em',
            padding: '3px 10px',
            borderRadius: 4,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            zIndex: 31,
            boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
          }}
        >
          {dateLabel(tooltipThought.createTime)}
        </div>
      )}

      {/* Track background */}
      <div
        style={{
          position: 'absolute',
          left: 14,
          top: 12,
          bottom: 12,
          width: 1,
          background: '#E8C9B0',
          borderRadius: 1,
        }}
      />

      {/* Minor ticks */}
      {minorTicks.map((pct, i) => (
        <div
          key={'mn' + i}
          style={{
            position: 'absolute',
            left: 12,
            top: `calc(12px + (100% - 24px) * ${pct / 100})`,
            width: 5,
            height: 1,
            background: '#E8C9B0',
            opacity: 0.5,
          }}
        />
      ))}

      {/* Major ticks (one per thought) */}
      {markers.map((m, i) => {
        const isActive = activeIdx === i
        const isHovered = hoveredIdx === i
        const len = isHovered ? 22 : isActive ? 18 : 14
        const thick = isHovered ? 2.5 : isActive ? 3 : 1
        return (
          <div
            key={m.thought.id}
            style={{
              position: 'absolute',
              left: isHovered ? 6 : 10,
              top: `calc(12px + (100% - 24px) * ${m.pct / 100})`,
              width: len,
              height: thick,
              marginTop: thick === 3 ? -1.5 : thick === 2.5 ? -1.25 : -0.5,
              background: isHovered ? '#C45A30' : isActive ? '#E8855A' : '#B07050',
              boxShadow: isHovered
                ? '0 0 6px rgba(196,90,48,0.5)'
                : isActive
                  ? '0 0 4px rgba(232,133,90,0.3)'
                  : 'none',
              borderRadius: 1,
              transition:
                'width 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), left 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), background 0.25s ease, box-shadow 0.25s ease',
            }}
          />
        )
      })}

      {/* Horizontal scan line at cursor */}
      {cursorY !== null && (
        <div
          style={{
            position: 'fixed',
            left: 0,
            top: cursorY,
            width: '100vw',
            height: 1,
            background: 'linear-gradient(90deg, transparent 0%, rgba(232,133,90,0.06) 40%, rgba(232,133,90,0.2) 80%, rgba(232,133,90,0.35) 100%)',
            pointerEvents: 'none',
            zIndex: 29,
          }}
        />
      )}
    </div>
  )
}
