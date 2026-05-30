'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { getPublishedThoughts, type Thought } from '@/lib/api/thoughts'
import { MOCK_THOUGHTS } from './thought-utils'
import { ThoughtCard, Lightbox, VideoPlaybackProvider } from './thought-card'
import { Timeline } from './timeline'
import { distributeToColumns, rebalanceColumns, tryDomRebalance, type ColumnData } from './column-distributor'
import { preloadImages } from './image-preloader'
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

  /* ── Sort & distribute into columns ── */
  const sorted = useMemo(
    () =>
      [...thoughts].sort(
        (a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime(),
      ),
    [thoughts],
  )

  /* ── Image preload → accurate heights → build columns ── */
  const [columns, setColumns] = useState<ColumnData[]>([])
  const [aspectRatios, setAspectRatios] = useState<Map<string, number>>(new Map())

  useEffect(() => {
    if (sorted.length === 0) return
    const imageUrls = sorted.filter((t) => t.imageUrl).map((t) => t.imageUrl!)
    preloadImages(imageUrls).then((ratios) => {
      setAspectRatios(ratios)
    })
  }, [sorted])

  useEffect(() => {
    if (sorted.length === 0) return
    // Wait for aspect ratios to be ready (or use empty map as fallback)
    const distributed = distributeToColumns(sorted, 3, aspectRatios.size > 0 ? aspectRatios : undefined)
    setColumns(rebalanceColumns(distributed))
  }, [sorted, aspectRatios])

  /* ── Post-render DOM-height rebalance ── */
  useEffect(() => {
    if (loading || sorted.length === 0 || columns.length === 0) return
    const t = setTimeout(() => {
      const reb = tryDomRebalance(columns, '.thoughts-columns', 250, aspectRatios)
      if (reb) setColumns(reb)
    }, 1500) // wait for images to fully load
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, sorted.length, columns.length > 0 ? 1 : 0])

  /* ── Show timeline after layout settles ── */
  useEffect(() => {
    if (!loading && thoughts.length > 0) {
      // Give the columns time to paint, then show the timeline
      const t = setTimeout(() => setTimelineVisible(true), 1200)
      return () => clearTimeout(t)
    }
  }, [loading, thoughts.length])

  /* ── Image click → lightbox ── */
  const handleImageClick = (url: string, imgEl: HTMLImageElement) => {
    const rect = imgEl.getBoundingClientRect()
    setLightboxState({ url, rect: { left: rect.left, top: rect.top, width: rect.width, height: rect.height } })
  }

  return (
    <main style={{ minHeight: '100vh', background: '#FDF6EE', paddingTop: 100 }}>
      {/* Hero */}
      <div style={{ padding: '0 60px 36px' }}>
        <div
          className="divider-expand"
          style={{
            height: 1.5,
            background: 'linear-gradient(90deg, #E8855A 0%, #E8C9B0 60%, transparent 100%)',
            borderRadius: 1,
          }}
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
        {!loading && sorted.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#B07050', fontFamily: 'Barlow, sans-serif' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🍃</div>
            <p style={{ fontSize: 16 }}>暂无随想，静待灵感。</p>
          </div>
        )}

        {/* Distributed columns */}
        {!loading && sorted.length > 0 && (
          <VideoPlaybackProvider>
          <div className="thoughts-columns">
            {columns.map((col, colIdx) => (
              <div key={colIdx} className="thoughts-col" data-column-index={colIdx}>
                {col.items.map((entry, i) => (
                  <ThoughtCard
                    key={entry.thought.id}
                    thought={entry.thought}
                    onImageClick={handleImageClick}
                    enterDelay={colIdx * 40 + i * 60}
                  />
                ))}
              </div>
            ))}
          </div>
          </VideoPlaybackProvider>
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
