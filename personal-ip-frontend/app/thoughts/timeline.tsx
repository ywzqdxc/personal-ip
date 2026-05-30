'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { Thought } from '@/lib/api/thoughts'
import {
  playTick,
  startRoll,
  updateRollVelocity,
  stopRoll,
  playActivate,
  playHover,
  unlockAudio,
} from './audio-engine'

/* ═══════════════════════════════════════════════
   Helpers
   ═══════════════════════════════════════════════ */

function dateLabel(iso: string) {
  const d = new Date(iso)
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}

/* ═══════════════════════════════════════════════
   Timeline — Cinematic Memory Dial
   ═══════════════════════════════════════════════ */

const CONTAINER_VH = 80
const LERP = 0.07
const PARTICLE_COUNT = 6

interface TimelineProps {
  thoughts: Thought[]
  contentRef: React.RefObject<HTMLDivElement | null>
  visible: boolean
}

export function Timeline({ thoughts, contentRef, visible }: TimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerH, setContainerH] = useState(720)
  const [activeId, setActiveId] = useState<number | null>(null)
  const [hoverId, setHoverId] = useState<number | null>(null)
  const [cursorY, setCursorY] = useState<number | null>(null)
  const [particles, setParticles] = useState<Array<{ id: number; angle: number }>>([])
  const [nodePositions, setNodePositions] = useState<Array<{ id: number; time: string; pct: number }>>([])

  // Lerp
  const currentY = useRef(0)
  const targetY = useRef(0)
  const rafId = useRef(0)
  const lastActiveId = useRef<number | null>(null)
  const pidCounter = useRef(0)

  // Velocity-driven tick scheduling
  const scrollVelocity = useRef(0)       // 0–1, decayed each frame
  const lastTickTime = useRef(0)         // performance.now() of last tick
  const lastScrollY = useRef(0)
  const lastScrollStamp = useRef(0)
  const skipActivate = useRef(false)     // suppress activate sound during programmatic scroll

  /* ── Sorted thoughts (oldest → newest) ── */
  const sorted = [...thoughts].sort(
    (a, b) => new Date(a.createTime).getTime() - new Date(b.createTime).getTime(),
  )

  /* ── Container height ── */
  useEffect(() => {
    const u = () => { if (containerRef.current) setContainerH(containerRef.current.offsetHeight) }
    u(); window.addEventListener('resize', u); return () => window.removeEventListener('resize', u)
  }, [])

  /* ── Hide scrollbar ── */
  useEffect(() => {
    const s = document.createElement('style')
    s.textContent = 'html{scrollbar-width:none;-ms-overflow-style:none}html::-webkit-scrollbar{display:none}'
    document.head.appendChild(s)
    return () => s.remove()
  }, [])

  /* ═══════════════════════════════════════════════
     Measure actual DOM positions → node positions
     ═══════════════════════════════════════════════ */

  useEffect(() => {
    if (!contentRef.current || thoughts.length === 0) return
    const measure = () => {
      const cards = contentRef.current!.querySelectorAll<HTMLElement>(
        '[data-column-index="0"] [data-thought-id]',
      )
      if (cards.length === 0) return
      const containerRect = contentRef.current!.getBoundingClientRect()
      const positions: Array<{ id: number; time: string; top: number }> = []
      cards.forEach((card) => {
        const id = Number(card.getAttribute('data-thought-id'))
        const t = sorted.find((x) => x.id === id)
        if (t) {
          const rect = card.getBoundingClientRect()
          positions.push({ id, time: dateLabel(t.createTime), top: rect.top + rect.height / 2 - containerRect.top })
        }
      })
      if (positions.length < 2) return
      const minTop = positions[0].top
      const maxTop = positions[positions.length - 1].top
      const range = maxTop - minTop || 1
      setNodePositions(
        positions.map((p) => ({ id: p.id, time: p.time, pct: ((p.top - minTop) / range) * 100 })),
      )
    }

    // Measure after layout settles, then on resize
    const t1 = setTimeout(measure, 300)
    const t2 = setTimeout(measure, 1200) // re-measure after images load
    window.addEventListener('resize', measure)
    return () => { clearTimeout(t1); clearTimeout(t2); window.removeEventListener('resize', measure) }
  }, [contentRef, thoughts, sorted])

  /* ═══════════════════════════════════════════════
     Scroll → active node (column 0 only)
     ═══════════════════════════════════════════════ */

  useEffect(() => {
    if (!contentRef.current) return
    const onScroll = () => {
      unlockAudio() // ensure AudioContext is running
      // ── Compute scroll velocity ──
      const now = performance.now()
      const sy = window.scrollY
      const dt = now - lastScrollStamp.current
      if (dt > 0 && dt < 200) {
        const dy = Math.abs(sy - lastScrollY.current)
        const rawV = Math.min(1, dy / Math.max(dt, 8) / 3) // 3px/ms = max velocity
        scrollVelocity.current = Math.max(scrollVelocity.current, rawV)
      }
      lastScrollY.current = sy
      lastScrollStamp.current = now

      const cards = contentRef.current!.querySelectorAll<HTMLElement>(
        '[data-column-index="0"] [data-thought-id]',
      )
      if (cards.length === 0) return
      const vh = window.innerHeight
      let bestId: number | null = null
      let bestDist = Infinity
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect()
        const mid = rect.top + rect.height / 2
        const dist = Math.abs(mid - vh / 2)
        if (dist < bestDist) { bestDist = dist; bestId = Number(card.getAttribute('data-thought-id')) }
      })
      if (bestId !== null && bestId !== lastActiveId.current) {
        lastActiveId.current = bestId
        setActiveId(bestId)
        if (!skipActivate.current) playActivate()
        // Spawn particles
        const pids: Array<{ id: number; angle: number }> = []
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          pids.push({ id: pidCounter.current++, angle: (360 / PARTICLE_COUNT) * i })
        }
        setParticles((prev) => [...prev.slice(-12), ...pids])
        setTimeout(() => setParticles((prev) => prev.filter((p) => !pids.includes(p))), 700)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [contentRef])

  /* ═══════════════════════════════════════════════
     rAF — Lerp dial motion + velocity-driven ticks
     ═══════════════════════════════════════════════ */

  useEffect(() => {
    const anim = () => {
      // ── Lerp track position ──
      currentY.current += (targetY.current - currentY.current) * LERP
      if (activeId !== null) {
        const node = nodePositions.find((n) => n.id === activeId)
        if (node) {
          const h = containerRef.current?.offsetHeight || containerH
          targetY.current = h / 2 - (node.pct / 100) * h
        }
      }

      // ── Velocity decay (spring winding down) ──
      const prevV = scrollVelocity.current
      scrollVelocity.current *= 0.92
      const v = scrollVelocity.current

      const frameNow = performance.now()

      // ── Mode switch: tick vs roll ──
      const ROLL_THRESHOLD = 0.45
      if (v > ROLL_THRESHOLD) {
        if (prevV <= ROLL_THRESHOLD) startRoll(v)
        else updateRollVelocity(v)
      } else if (v > 0.006) {
        stopRoll()
        const interval = 50 + (1 - Math.min(v / ROLL_THRESHOLD, 1)) * 400
        if (frameNow - lastTickTime.current >= interval) {
          lastTickTime.current = frameNow
          playTick(v)
        }
      } else {
        stopRoll()
      }

      rafId.current = requestAnimationFrame(anim)
    }
    lastTickTime.current = performance.now()
    rafId.current = requestAnimationFrame(anim)
    return () => cancelAnimationFrame(rafId.current)
  }, [activeId, nodePositions, containerH])

  /* ═══════════════════════════════════════════════
     Mouse → hover + cinematic scan line
     ═══════════════════════════════════════════════ */

  const prevHoverId = useRef<number | null>(null)
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setCursorY(e.clientY)
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const relY = e.clientY - rect.top
    const pct = (relY / rect.height) * 100
    let best: number | null = null
    let bestDist = Infinity
    nodePositions.forEach((n) => {
      const d = Math.abs(n.pct - pct)
      if (d < bestDist) { bestDist = d; best = n.id }
    })
    if (best !== prevHoverId.current) {
      prevHoverId.current = best
      if (best !== null) playHover()
    }
    setHoverId(best)
  }, [nodePositions])

  const handleMouseLeave = useCallback(() => { setHoverId(null); setCursorY(null) }, [])

  /* ── Click → scroll (no activation sound) ── */
  const handleClick = useCallback(() => {
    unlockAudio()
    if (hoverId === null) return
    const el = document.querySelector(`[data-thought-id="${hoverId}"]`)
    if (el) {
      skipActivate.current = true
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      setTimeout(() => { skipActivate.current = false }, 1500)
    }
  }, [hoverId])

  /* ── Date card ── */
  const hoverNode = hoverId !== null ? nodePositions.find((n) => n.id === hoverId) : null

  /* ── Render ── */
  return (
    <>
      {/* ════════ Cinematic horizontal scan line ════════ */}
      {cursorY !== null && (
        <div
          style={{
            position: 'fixed',
            left: 0,
            top: cursorY,
            width: '100vw',
            height: 1,
            zIndex: 44,
            pointerEvents: 'none',
            background:
              'linear-gradient(90deg, transparent 0%, rgba(232,133,90,0.0) 40%, rgba(232,133,90,0.12) 60%, rgba(232,133,90,0.3) 85%, rgba(232,133,90,0.08) 100%)',
          }}
        />
      )}

      {/* ════════ Date card (hover tooltip) ════════ */}
      {hoverNode && cursorY !== null && (
        <div
          style={{
            position: 'fixed',
            right: 60,
            top: cursorY - 14,
            zIndex: 46,
            pointerEvents: 'none',
            fontFamily: 'Barlow Condensed, sans-serif',
            fontWeight: 700,
            fontSize: 13,
            letterSpacing: '0.08em',
            color: '#FDF6EE',
            background: '#2E1A0E',
            padding: '5px 14px',
            borderRadius: 6,
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            animation: 'dateCardIn 0.25s cubic-bezier(0.22, 0.61, 0.36, 1) both',
          }}
        >
          {hoverNode.time}
        </div>
      )}

      {/* ════════ Container ════════ */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        style={{
          position: 'fixed',
          right: 0,
          top: `${(100 - CONTAINER_VH) / 2}vh`,
          width: 36,
          height: `${CONTAINER_VH}vh`,
          zIndex: 45,
          cursor: 'pointer',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.8s ease',
          userSelect: 'none',
          overflow: 'hidden',
          maskImage:
            'linear-gradient(to bottom, transparent 0%, black 6%, black 94%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent 0%, black 6%, black 94%, transparent 100%)',
        }}
      >
        {/* ── Subtle track line ── */}
        <div
          style={{
            position: 'absolute',
            right: 8,
            top: 0,
            bottom: 0,
            width: 1,
            background: 'rgba(232,201,176,0.5)',
          }}
        />

        {/* ── Nodes ── */}
        {nodePositions.map((node) => {
          const isActive = activeId === node.id
          const isHovered = hoverId === node.id
          const wave = isActive ? 1 : isHovered ? 0.85 : 0
          const size = 4 + wave * 10
          const ringSize = size + 8 + wave * 12
          const opacity = isActive ? 1 : isHovered ? 0.8 : 0.55

          return (
            <div
              key={node.id}
              style={{
                position: 'absolute',
                right: 8,
                top: `${node.pct}%`,
                width: size,
                height: size,
                marginRight: -size / 2 + 0.5,
                marginTop: -size / 2,
                borderRadius: '50%',
                background: isActive
                  ? '#E8855A'
                  : isHovered
                    ? '#C45A30'
                    : '#C4A882',
                boxShadow: isActive
                  ? '0 0 12px rgba(232,133,90,0.7), 0 0 28px rgba(232,133,90,0.3)'
                  : isHovered
                    ? '0 0 8px rgba(196,90,48,0.5)'
                    : 'none',
                opacity,
                transition:
                  'width 0.45s cubic-bezier(0.25, 1, 0.5, 1), height 0.45s cubic-bezier(0.25, 1, 0.5, 1), margin 0.45s cubic-bezier(0.25, 1, 0.5, 1), background 0.4s ease, box-shadow 0.4s ease, opacity 0.4s ease',
              }}
            >
              {/* ── Glow ring ── */}
              {(isActive || isHovered) && (
                <div
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    width: ringSize,
                    height: ringSize,
                    marginLeft: -ringSize / 2,
                    marginTop: -ringSize / 2,
                    borderRadius: '50%',
                    border: `1px solid rgba(232,133,90,${isActive ? 0.25 : 0.12})`,
                    animation: `ringPulse ${isActive ? 2 : 3}s ease-in-out infinite`,
                    pointerEvents: 'none',
                  }}
                />
              )}

              {/* ── Particles ── */}
              {isActive &&
                particles
                  .filter((p) => p.id >= pidCounter.current - PARTICLE_COUNT)
                  .map((p) => {
                    const rad = (p.angle * Math.PI) / 180
                    const px = Math.cos(rad) * 28
                    const py = Math.sin(rad) * 28
                    return (
                      <div
                        key={p.id}
                        style={
                          {
                            position: 'absolute',
                            left: '50%',
                            top: '50%',
                            width: 2,
                            height: 2,
                            marginLeft: -1,
                            marginTop: -1,
                            borderRadius: '50%',
                            background: '#E8855A',
                            animation: 'particleBurst 0.7s ease-out forwards',
                            '--px': px + 'px',
                            '--py': py + 'px',
                          } as React.CSSProperties
                        }
                      />
                    )
                  })}
            </div>
          )
        })}
      </div>

      {/* ════════ Keyframes ════════ */}
      <style>{`
        @keyframes dateCardIn {
          from { opacity: 0; transform: translateX(12px); filter: blur(4px); }
          to   { opacity: 1; transform: translateX(0);    filter: blur(0);   }
        }
        @keyframes ringPulse {
          0%, 100% { transform: scale(1);   opacity: 1;   }
          50%      { transform: scale(1.35); opacity: 0.4; }
        }
        @keyframes particleBurst {
          0%   { opacity: 1; transform: translate(0, 0) scale(1); }
          100% { opacity: 0; transform: translate(var(--px), var(--py)) scale(0.3); }
        }
      `}</style>
    </>
  )
}
