'use client'

import { useEffect, useRef, useState } from 'react'
import { getPublishedThoughts, type Thought } from '@/lib/api/thoughts'
import { MOCK_THOUGHTS } from './thought-utils'
import { ThoughtCard, Lightbox } from './thought-card'
import { Timeline } from './timeline'
import { pageCss } from './styles'

/* ── Lightbox state type ── */

interface LightboxState {
  url: string
  rect: { left: number; top: number; width: number; height: number }
}

/* ── Page ── */

export default function ThoughtsPage() {
  const [thoughts, setThoughts] = useState<Thought[]>([])
  const [loading, setLoading] = useState(true)
  const [timelineVisible, setTimelineVisible] = useState(false)
  const [lightboxState, setLightboxState] = useState<LightboxState | null>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  /* ── Load data ── */
  useEffect(() => {
    getPublishedThoughts()
      .then((data) => setThoughts(data.length > 0 ? data : MOCK_THOUGHTS))
      .catch(() => setThoughts(MOCK_THOUGHTS))
      .finally(() => setLoading(false))
  }, [])

  /* ── Show timeline after load ── */
  useEffect(() => {
    if (!loading && thoughts.length > 0) {
      const t = setTimeout(() => setTimelineVisible(true), 400)
      return () => clearTimeout(t)
    }
  }, [loading, thoughts.length])

  /* ── Sort: newest first ── */
  const sorted = [...thoughts].sort(
    (a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime(),
  )

  /* ── Image click → lightbox ── */
  const handleImageClick = (url: string, imgEl: HTMLImageElement) => {
    const rect = imgEl.getBoundingClientRect()
    setLightboxState({ url, rect: { left: rect.left, top: rect.top, width: rect.width, height: rect.height } })
  }

  return (
    <main style={{ minHeight: '100vh', background: '#FDF6EE', paddingTop: 100 }}>

      {/* Hero */}
      <div style={{ padding: '0 60px 36px' }}>
        <p style={{ fontFamily: 'Caveat, cursive', fontSize: 20, color: '#B07050', margin: '0 0 16px' }}>
          Fragmentos de la mente. 思绪的碎片。
        </p>
        <div
          className="divider-expand"
          style={{ height: 1.5, background: 'linear-gradient(90deg, #E8855A 0%, #E8C9B0 60%, transparent 100%)', borderRadius: 1 }}
        />
      </div>

      {/* Body */}
      <div ref={contentRef} style={{ padding: '0 60px 80px' }}>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <span className="loading-dot" />
            <span className="loading-dot" />
            <span className="loading-dot" />
          </div>
        )}

        {/* Empty state */}
        {!loading && thoughts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#B07050', fontFamily: 'Barlow, sans-serif' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🍃</div>
            <p style={{ fontSize: 16 }}>暂无随想，静待灵感。</p>
          </div>
        )}

        {/* Masonry grid */}
        {!loading && sorted.length > 0 && (
          <div className="thoughts-masonry">
            {sorted.map((thought, i) => (
              <ThoughtCard
                key={thought.id}
                thought={thought}
                onImageClick={handleImageClick}
                enterDelay={Math.min(i * 40, 400)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Right side timeline */}
      <Timeline thoughts={thoughts} contentRef={contentRef} visible={timelineVisible} />

      {/* Lightbox */}
      <Lightbox lightboxState={lightboxState} onClose={() => setLightboxState(null)} />

      <style>{pageCss}</style>
    </main>
  )
}
