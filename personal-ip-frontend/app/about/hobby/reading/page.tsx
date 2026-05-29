'use client'

import { useRef, useState, useEffect } from 'react'
import { useLenis } from 'lenis/react'
import BackButton from '@/components/travel/BackButton'

/* ── CSS (reading: library nook — deep brown + gilded gold + parchment cream) ── */
const CSS_LINES = [
  "@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,700;0,800;1,400;1,700&family=Barlow:wght@300;400;500;600&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Noto+Serif+SC:wght@400;700&display=swap');",

  '*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }',
  ".rd-root { font-family: 'Barlow', sans-serif; background: #1C1612; color: #F0E8DC; }",

  /* ── Hero ── */
  '.rd-hero { position: relative; width: 100%; height: 100vh; overflow: hidden; }',
  '.rd-hero-video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }',
  '.rd-hero-overlay { position: absolute; inset: 0; background: radial-gradient(ellipse at 50% 60%, rgba(180,150,100,0.06) 0%, transparent 55%), linear-gradient(to bottom, rgba(18,14,10,0.15) 0%, rgba(18,14,10,0.5) 55%, rgba(18,14,10,0.96) 100%); }',
  '.rd-hero-content { position: relative; z-index: 2; height: 100%; display: flex; flex-direction: column; justify-content: flex-end; padding: 0 64px 100px; }',

  ".rd-tag { display: inline-flex; align-items: center; gap: 12px; font-family: 'Libre Baskerville', serif; font-size: 11px; font-weight: 400; font-style: italic; letter-spacing: 0.08em; color: #C9A96E; margin-bottom: 18px; }",
  '.rd-tag-ornament { width: 24px; height: 1px; background: #C9A96E; }',

  ".rd-hero-title { font-family: 'Barlow Condensed', sans-serif; font-size: clamp(64px, 10vw, 120px); font-weight: 800; line-height: 0.92; text-transform: uppercase; letter-spacing: -0.02em; color: #F0E8DC; }",
  ".rd-hero-title .rd-accent { color: #C9A96E; font-style: normal; }",

  ".rd-hero-desc { font-family: 'Barlow', sans-serif; font-size: 15px; font-weight: 300; color: rgba(240,232,220,0.45); line-height: 1.8; max-width: 480px; margin-top: 24px; }",

  '.rd-scroll-hint { position: absolute; bottom: 40px; right: 48px; z-index: 3; }',
  '.rd-scroll-line { width: 1px; height: 48px; background: rgba(201,169,110,0.15); margin: 0 auto 8px; }',
  ".rd-scroll-text { font-family: 'Libre Baskerville', serif; font-size: 9px; font-style: italic; letter-spacing: 0.2em; color: rgba(201,169,110,0.3); text-transform: uppercase; writing-mode: vertical-rl; }",


  /* ── Stats strip ── */
  '.rd-stats { background: #1E1812; padding: 80px 64px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 32px; border-top: 1px solid rgba(201,169,110,0.06); border-bottom: 1px solid rgba(201,169,110,0.06); }',
  ".rd-stat-value { font-family: 'Barlow Condensed', sans-serif; font-size: 56px; font-weight: 800; color: #C9A96E; line-height: 1; }",
  ".rd-stat-unit { font-family: 'Libre Baskerville', serif; font-size: 14px; font-weight: 400; font-style: italic; color: rgba(201,169,110,0.35); margin-left: 4px; }",
  ".rd-stat-label { font-family: 'Barlow', sans-serif; font-size: 11px; font-weight: 400; color: rgba(240,232,220,0.3); text-transform: uppercase; letter-spacing: 0.1em; margin-top: 10px; }",

  /* ── Shared section ── */
  '.rd-section { padding: 80px 64px; }',
  ".rd-section-label { font-family: 'Libre Baskerville', serif; font-size: 13px; font-weight: 400; font-style: italic; color: rgba(201,169,110,0.45); margin-bottom: 36px; }",

  /* ── Philosophy ── */
  '.rd-philosophy { background: #1E1812; }',
  '.rd-philo-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: start; }',
  ".rd-philo-quote { font-family: 'Libre Baskerville', serif; font-size: 28px; font-weight: 400; font-style: italic; color: #C9A96E; line-height: 1.4; }",
  ".rd-philo-quote em { font-style: normal; color: #F0E8DC; }",
  ".rd-philo-body { font-family: 'Noto Serif SC', serif; font-size: 14px; font-weight: 400; color: rgba(240,232,220,0.5); line-height: 2; }",

  /* ── Shelf ── */
  '.rd-shelf { background: #1C1612; }',
  '.rd-shelf-grid { display: flex; flex-wrap: wrap; gap: 10px; }',
  ".rd-shelf-tag { font-family: 'Libre Baskerville', serif; font-size: 14px; font-weight: 400; font-style: italic; padding: 10px 22px; border-radius: 2px; border: 1px solid rgba(201,169,110,0.1); color: rgba(240,232,220,0.55); background: rgba(201,169,110,0.02); transition: all 0.3s; }",
  '.rd-shelf-tag:hover { background: rgba(201,169,110,0.08); border-color: rgba(201,169,110,0.4); color: #C9A96E; }',

  /* ── Gallery ── */
  '.rd-gallery { background: #1E1812; }',
  '.rd-gallery-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }',
  '.rd-gallery-item { position: relative; border-radius: 3px; overflow: hidden; aspect-ratio: 4/5; transition: transform 0.4s ease; }',
  '.rd-gallery-item:hover { transform: scale(1.04); }',
  '.rd-gallery-img { width: 100%; height: 100%; object-fit: cover; display: block; filter: brightness(0.88) sepia(0.12); transition: filter 0.4s; }',
  '.rd-gallery-item:hover .rd-gallery-img { filter: brightness(1) sepia(0); }',
  '.rd-gallery-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(18,14,10,0.8) 15%, transparent 50%); }',
  ".rd-gallery-caption { position: absolute; bottom: 14px; left: 16px; font-family: 'Libre Baskerville', serif; font-size: 12px; font-style: italic; color: rgba(201,169,110,0.7); }",

  /* ── responsive ── */
  '@media (max-width: 768px) {',
  '  .rd-hero-content { padding: 0 28px 80px; }',
  '  .rd-stats { grid-template-columns: 1fr 1fr; padding: 48px 28px; gap: 24px; }',
  '  .rd-section { padding: 48px 28px; }',
  '  .rd-philo-grid { grid-template-columns: 1fr; gap: 32px; }',
  '  .rd-gallery-grid { grid-template-columns: 1fr; }',
  '}',
]

const pageCss = CSS_LINES.join('\n')

const STATS = [
  { value: '42', unit: '', label: 'Books / Year' },
  { value: '12K+', unit: '', label: 'Pages Turned' },
  { value: '18', unit: 'yrs', label: 'Avid Reader' },
  { value: '6', unit: '', label: 'Languages' },
]

const SHELF = [
  'Fiction', 'Philosophy', 'History', 'Biography',
  'Science', 'Technology', 'Poetry', 'Psychology',
  'Essays', 'Sci-Fi', 'Art & Design', 'Travel Writing',
]

const PHOTOS = [
  { url: 'photo-1524578271613-d550eacf6090', caption: 'Afternoon Light' },
  { url: 'photo-1506880018603-83d5b814b5a6', caption: 'Old Bookshelf' },
  { url: 'photo-1512820795304-f6e5c8e1a5b9', caption: 'Morning Pages' },
  { url: 'photo-1513475382585-d06e58bcb0e0', caption: 'Library Aisle' },
  { url: 'photo-1481627834876-b7833e8f5570', caption: 'Reading Nook' },
  { url: 'photo-1495446815901-a7297e633e8d', caption: 'Stack & Coffee' },
]

export default function ReadingPage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoError, setVideoError] = useState(false)

  const lenis = useLenis()

  useEffect(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true })
    } else {
      window.scrollTo(0, 0)
    }
    const vid = videoRef.current
    if (!vid) return
    vid.playbackRate = 0.85
  }, [lenis])

  return (
    <div className="rd-root">
      <style>{pageCss}</style>

      <BackButton />

      <section className="rd-hero">
        {!videoError ? (
          <video
            ref={videoRef}
            className="rd-hero-video"
            autoPlay loop muted playsInline
            onError={() => setVideoError(true)}
          >
            <source src="/videos/reader.mp4" type="video/mp4" />
          </video>
        ) : (
          <div className="rd-hero-video"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1524578271613-d550eacf6090?auto=format&fit=crop&w=1600&q=80)',
              backgroundSize: 'cover', backgroundPosition: 'center',
            }}
          />
        )}
        <div className="rd-hero-overlay" />
        <div className="rd-hero-content">
          <span className="rd-tag">
            <span className="rd-tag-ornament" />
            Words · Worlds · Wisdom
            <span className="rd-tag-ornament" />
          </span>
          <h1 className="rd-hero-title">
            A Life <span className="rd-accent">Well</span><br />
            <span className="rd-accent">Read</span>
          </h1>
          <p className="rd-hero-desc">
            To read is to live a thousand lives before the first one ends.
            Books are the quietest teachers — they wait in silence until
            you are ready to listen.
          </p>
        </div>
        <div className="rd-scroll-hint">
          <div className="rd-scroll-line" />
          <div className="rd-scroll-text">Scroll</div>
        </div>
      </section>

      <section className="rd-stats">
        {STATS.map((s) => (
          <div key={s.label}>
            <div>
              <span className="rd-stat-value">{s.value}</span>
              <span className="rd-stat-unit">{s.unit}</span>
            </div>
            <div className="rd-stat-label">{s.label}</div>
          </div>
        ))}
      </section>

      <section className="rd-section rd-philosophy">
        <div className="rd-section-label">chapter one</div>
        <div className="rd-philo-grid">
          <div className="rd-philo-quote">
            A room without books<br />
            is like a body<br />
            <em>without a soul.</em>
          </div>
          <div className="rd-philo-body">
            阅读是我最安静的反叛。在信息碎片化的时代，花三个小时读完一章而不看手机——这本身就是一种立场。
            <br /><br />
            我从小说里学会共情，从哲学里学会提问，从历史里学会谦卑。每一本翻旧的书都是时间的褶皱，每一处折角都是一个暂停键——"这里，我曾被打动。"
          </div>
        </div>
      </section>

      <section className="rd-section rd-shelf">
        <div className="rd-section-label">the shelf</div>
        <div className="rd-shelf-grid">
          {SHELF.map((g) => (
            <span className="rd-shelf-tag" key={g}>{g}</span>
          ))}
        </div>
      </section>


    </div>
  )
}
