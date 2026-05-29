'use client'

import { useRouter } from 'next/navigation'
import { useRef, useState, useEffect } from 'react'
import { useLenis } from 'lenis/react'

/* ── CSS (music: vinyl bonfire — deep brown-black + warm amber gold + ember red) ── */
const CSS_LINES = [
  "@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,700;0,800;1,400;1,700&family=Barlow:wght@300;400;500;600&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=Noto+Serif+SC:wght@400;700&display=swap');",

  '*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }',
  ".mu-root { font-family: 'Barlow', sans-serif; background: #0D0806; color: #fff; }",

  /* ── Hero ── */
  '.mu-hero { position: relative; width: 100%; height: 100vh; overflow: hidden; }',
  '.mu-hero-video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }',
  '.mu-hero-overlay { position: absolute; inset: 0; background: radial-gradient(ellipse at 30% 70%, rgba(180,140,80,0.08) 0%, transparent 60%), linear-gradient(to bottom, rgba(7,5,3,0.1) 0%, rgba(7,5,3,0.45) 50%, rgba(7,5,3,0.96) 100%); }',
  '.mu-hero-vignette { position: absolute; inset: 0; background: radial-gradient(ellipse at center, transparent 55%, rgba(7,5,3,0.5) 100%); pointer-events: none; z-index: 1; }',
  '.mu-hero-content { position: relative; z-index: 2; height: 100%; display: flex; flex-direction: column; justify-content: flex-end; padding: 0 64px 100px; }',

  ".mu-tag { display: inline-flex; align-items: center; gap: 10px; font-family: 'Barlow Condensed', sans-serif; font-size: 11px; font-weight: 500; letter-spacing: 0.18em; color: #D4A54A; text-transform: uppercase; margin-bottom: 18px; }",
  '.mu-tag-line { width: 18px; height: 1px; background: #D4A54A; }',

  ".mu-hero-title { font-family: 'Barlow Condensed', sans-serif; font-size: clamp(64px, 10vw, 120px); font-weight: 800; line-height: 0.92; text-transform: uppercase; letter-spacing: -0.02em; color: #fff; }",
  ".mu-hero-title .mu-accent { color: #D4A54A; font-style: normal; }",
  ".mu-hero-title .mu-accent-red { color: #8B3737; font-style: normal; }",

  ".mu-hero-desc { font-family: 'Barlow', sans-serif; font-size: 15px; font-weight: 300; color: rgba(255,255,255,0.45); line-height: 1.8; max-width: 480px; margin-top: 24px; }",

  '.mu-scroll-hint { position: absolute; bottom: 40px; right: 48px; z-index: 3; }',
  '.mu-scroll-line { width: 1px; height: 48px; background: rgba(212,165,74,0.15); margin: 0 auto 8px; }',
  ".mu-scroll-text { font-family: 'Barlow', sans-serif; font-size: 9px; letter-spacing: 0.25em; color: rgba(212,165,74,0.3); text-transform: uppercase; writing-mode: vertical-rl; }",

  /* ── Back button ── */
  ".mu-back { position: fixed; top: 92px; left: 36px; z-index: 100; display: flex; align-items: center; gap: 8px; color: rgba(255,255,255,0.6); font-family: 'Barlow Condensed', sans-serif; font-size: 12px; letter-spacing: 0.15em; text-transform: uppercase; cursor: pointer; background: none; border: none; padding: 0; transition: color 0.2s; }",
  '.mu-back:hover { color: #D4A54A; }',

  /* ── Stats strip ── */
  '.mu-stats { background: #0E0907; padding: 80px 64px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 32px; border-top: 1px solid rgba(212,165,74,0.06); border-bottom: 1px solid rgba(212,165,74,0.06); }',
  ".mu-stat-value { font-family: 'Barlow Condensed', sans-serif; font-size: 56px; font-weight: 800; color: #D4A54A; line-height: 1; }",
  ".mu-stat-unit { font-family: 'Cormorant Garamond', serif; font-size: 16px; font-weight: 400; font-style: italic; color: rgba(212,165,74,0.35); margin-left: 4px; }",
  ".mu-stat-label { font-family: 'Barlow', sans-serif; font-size: 11px; font-weight: 400; color: rgba(255,255,255,0.3); text-transform: uppercase; letter-spacing: 0.1em; margin-top: 10px; }",

  /* ── Shared section ── */
  '.mu-section { padding: 80px 64px; }',
  ".mu-section-label { font-family: 'Cormorant Garamond', serif; font-size: 14px; font-weight: 400; font-style: italic; color: rgba(212,165,74,0.45); margin-bottom: 36px; }",
  ".mu-section-label::before { content: '~ '; }",
  ".mu-section-label::after { content: ' ~'; }",

  /* ── Philosophy ── */
  '.mu-philosophy { background: #0E0907; }',
  '.mu-philo-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: start; }',
  ".mu-philo-quote { font-family: 'Cormorant Garamond', serif; font-size: 32px; font-weight: 600; font-style: italic; color: #D4A54A; line-height: 1.35; }",
  ".mu-philo-body { font-family: 'Noto Serif SC', serif; font-size: 14px; font-weight: 400; color: rgba(255,255,255,0.5); line-height: 2; }",

  /* ── Genres ── */
  '.mu-genres { background: #0D0806; }',
  '.mu-genres-grid { display: flex; flex-wrap: wrap; gap: 10px; }',
  ".mu-genre-tag { font-family: 'Barlow Condensed', sans-serif; font-size: 15px; font-weight: 600; letter-spacing: 0.04em; padding: 12px 24px; border-radius: 3px; border: 1px solid rgba(212,165,74,0.1); color: rgba(255,255,255,0.55); background: rgba(212,165,74,0.02); transition: all 0.3s; text-transform: uppercase; }",
  '.mu-genre-tag:hover { background: rgba(139,55,55,0.12); border-color: rgba(139,55,55,0.4); color: #8B3737; transform: translateY(-1px); }',

  /* ── Gallery ── */
  '.mu-gallery { background: #0E0907; }',
  '.mu-gallery-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }',
  '.mu-gallery-item { position: relative; border-radius: 4px; overflow: hidden; aspect-ratio: 4/3; transition: transform 0.4s ease; }',
  '.mu-gallery-item:hover { transform: scale(1.05); }',
  '.mu-gallery-img { width: 100%; height: 100%; object-fit: cover; display: block; filter: brightness(0.85) sepia(0.15); transition: filter 0.4s; }',
  '.mu-gallery-item:hover .mu-gallery-img { filter: brightness(1) sepia(0); }',
  '.mu-gallery-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(7,5,3,0.85) 15%, transparent 50%); }',
  ".mu-gallery-caption { position: absolute; bottom: 14px; left: 16px; font-family: 'Cormorant Garamond', serif; font-size: 13px; font-style: italic; color: rgba(212,165,74,0.7); }",
]

const pageCss = CSS_LINES.join('\n')

/* ── Data ── */
const STATS = [
  { value: '8,400+', unit: 'hrs', label: 'Lifetime Listening' },
  { value: '120+', unit: '', label: 'Playlists Curated' },
  { value: '2,300+', unit: '', label: 'Songs Saved' },
  { value: '16', unit: 'yrs', label: 'Music Lover' },
]

const GENRES = [
  'Lo-Fi', 'Jazz', 'Classical', 'Post-Rock',
  'Ambient', 'Indie Folk', 'Hip-Hop', 'R&B',
  'Electronic', 'Bossa Nova', 'City Pop', 'Soundtrack',
]

const PHOTOS = [
  { url: 'photo-1478737270239-2f02b77fc618', caption: 'Late Night Listening' },
  { url: 'photo-1511671782779-c97d3d27a1d4', caption: 'Needle Drop' },
  { url: 'photo-1507838153414-b4b713384a76', caption: 'Vinyl Collection' },
  { url: 'photo-1514320296556-c3c98a2f1bf2', caption: 'Amber Glow' },
  { url: 'photo-1493225457124-a3eb161ffa5f', caption: 'Live Session' },
  { url: 'photo-1525362081669-2b476bb628c4', caption: 'After Midnight' },
]

export default function MusicPage() {
  const router = useRouter()
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
    vid.playbackRate = 0.8
  }, [lenis])

  return (
    <div className="mu-root">
      <style>{pageCss}</style>

      {/* Back */}
      <button className="mu-back" onClick={() => router.push('/about/hobby')}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M10 3L5 8l5 5"/>
        </svg>
        Hobby
      </button>

      {/* ── Hero ── */}
      <section className="mu-hero">
        {!videoError ? (
          <video
            ref={videoRef}
            className="mu-hero-video"
            autoPlay
            loop
            muted
            playsInline
            onError={() => setVideoError(true)}
          >
            <source src="/videos/listener.mp4" type="video/mp4" />
          </video>
        ) : (
          <div
            className="mu-hero-video"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1600&q=80)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        )}
        <div className="mu-hero-overlay" />
        <div className="mu-hero-vignette" />
        <div className="mu-hero-content">
          <span className="mu-tag">
            <span className="mu-tag-line" />
            Sound · Memory · Feeling
          </span>
          <h1 className="mu-hero-title">
            Music is<br />
            <span className="mu-accent">Time</span>{' '}
            <span className="mu-accent-red">Travel</span>
          </h1>
          <p className="mu-hero-desc">
            A single chord can pull you back to a moment you thought you'd
            forgotten. Music is my way of keeping time — not beating it, just
            holding it still long enough to listen.
          </p>
        </div>
        <div className="mu-scroll-hint">
          <div className="mu-scroll-line" />
          <div className="mu-scroll-text">Scroll</div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="mu-stats">
        {STATS.map((s) => (
          <div key={s.label}>
            <div>
              <span className="mu-stat-value">{s.value}</span>
              <span className="mu-stat-unit">{s.unit}</span>
            </div>
            <div className="mu-stat-label">{s.label}</div>
          </div>
        ))}
      </section>

      {/* ── Philosophy ── */}
      <section className="mu-section mu-philosophy">
        <div className="mu-section-label">the sound between notes</div>
        <div className="mu-philo-grid">
          <div className="mu-philo-quote">
            Every song is a<br />
            timestamp in the<br />
            soundtrack of a life.
          </div>
          <div className="mu-philo-body">
            音乐是唯一能让时间弯曲的媒介。按下播放键的那一刻——可能是深夜赶作业时循环的 Lo-Fi，可能是公路旅行副驾上响起的 City Pop，可能是某个雨天窗边的肖邦。
            <br /><br />
            我不演奏乐器，但我收集声音。每一个歌单都是一段时期的心情日记，每一首单曲循环背后都有一个不想结束的故事。声音是记忆的容器。
          </div>
        </div>
      </section>

      {/* ── Genres ── */}
      <section className="mu-section mu-genres">
        <div className="mu-section-label">frequencies</div>
        <div className="mu-genres-grid">
          {GENRES.map((g) => (
            <span className="mu-genre-tag" key={g}>{g}</span>
          ))}
        </div>
      </section>

      {/* ── Gallery ── */}
      <section className="mu-section mu-gallery">
        <div className="mu-section-label">film strip</div>
        <div className="mu-gallery-grid">
          {PHOTOS.map((g) => (
            <div className="mu-gallery-item" key={g.url}>
              <img
                className="mu-gallery-img"
                src={'https://images.unsplash.com/' + g.url + '?auto=format&fit=crop&w=800&q=80'}
                alt={g.caption}
                loading="lazy"
              />
              <div className="mu-gallery-overlay" />
              <div className="mu-gallery-caption">{g.caption}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
