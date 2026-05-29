'use client'

import { useRef, useState, useEffect } from 'react'
import { useLenis } from 'lenis/react'
import BackButton from '@/components/travel/BackButton'

/* ── CSS (dark / gold / running) ── */
const CSS_LINES = [
  "@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,700;0,800;1,400;1,700&family=Barlow:wght@300;400;500&family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Noto+Serif+SC:wght@400;700&display=swap');",

  '*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }',
  ".r-root { font-family: 'Barlow', sans-serif; background: #080605; color: #fff; }",

  /* ── Hero ── */
  '.r-hero { position: relative; width: 100%; height: 100vh; overflow: hidden; }',
  '.r-hero-video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }',
  '.r-hero-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(6,4,3,0.25) 0%, rgba(6,4,3,0.45) 50%, rgba(6,4,3,0.92) 100%); }',
  '.r-hero-content { position: relative; z-index: 2; height: 100%; display: flex; flex-direction: column; justify-content: flex-end; padding: 0 64px 100px; }',

  '.r-tag { display: inline-block; font-family: "Barlow Condensed", sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 0.3em; color: #C9A96E; text-transform: uppercase; margin-bottom: 18px; }',
  '.r-tag::before { content: ""; display: inline-block; width: 28px; height: 1px; background: #C9A96E; margin-right: 12px; vertical-align: middle; }',

  ".r-hero-title { font-family: 'Barlow Condensed', sans-serif; font-size: clamp(64px, 10vw, 120px); font-weight: 800; line-height: 0.92; text-transform: uppercase; letter-spacing: -0.02em; color: #fff; }",
  ".r-hero-title em { font-family: 'Playfair Display', serif; font-style: italic; font-weight: 400; color: #C9A96E; text-transform: none; display: block; font-size: 0.55em; letter-spacing: 0; margin-top: 4px; }",

  ".r-hero-desc { font-family: 'Barlow', sans-serif; font-size: 15px; font-weight: 300; color: rgba(255,255,255,0.5); line-height: 1.8; max-width: 480px; margin-top: 24px; }",

  '.r-scroll-hint { position: absolute; bottom: 40px; right: 48px; z-index: 3; }',
  '.r-scroll-line { width: 1px; height: 48px; background: rgba(255,255,255,0.2); margin: 0 auto 8px; }',
  ".r-scroll-text { font-family: 'Barlow Condensed', sans-serif; font-size: 9px; letter-spacing: 0.25em; color: rgba(255,255,255,0.3); text-transform: uppercase; writing-mode: vertical-rl; }",

  /* ── Stats strip ── */
  '.r-stats { background: #0A0907; padding: 80px 64px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 32px; border-top: 1px solid rgba(255,255,255,0.05); border-bottom: 1px solid rgba(255,255,255,0.05); }',
  ".r-stat-value { font-family: 'Barlow Condensed', sans-serif; font-size: 56px; font-weight: 800; color: #C9A96E; line-height: 1; }",
  ".r-stat-unit { font-family: 'Barlow Condensed', sans-serif; font-size: 16px; font-weight: 400; color: rgba(255,255,255,0.35); margin-left: 4px; }",
  ".r-stat-label { font-family: 'Barlow', sans-serif; font-size: 12px; font-weight: 500; color: rgba(255,255,255,0.4); letter-spacing: 0.1em; text-transform: uppercase; margin-top: 8px; }",

  /* ── Section header ── */
  '.r-section { padding: 100px 64px; }',
  ".r-section-label { font-family: 'Barlow Condensed', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 0.3em; color: rgba(255,255,255,0.25); text-transform: uppercase; margin-bottom: 48px; }",
  '.r-section-label::after { content: ""; display: block; width: 40px; height: 1px; background: rgba(255,255,255,0.1); margin-top: 12px; }',

  /* ── Philosophy ── */
  '.r-philosophy { background: #0A0907; }',
  '.r-philo-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }',
  ".r-philo-quote { font-family: 'Playfair Display', serif; font-style: italic; font-size: clamp(28px, 3.5vw, 42px); font-weight: 400; color: #C9A96E; line-height: 1.35; }",
  ".r-philo-body { font-family: 'Noto Serif SC', serif; font-size: 15px; font-weight: 400; color: rgba(255,255,255,0.42); line-height: 2.1; }",

  /* ── Closing ── */
  '.r-closing { background: #080605; padding: 80px 64px 120px; display: flex; justify-content: center; }',
  ".r-closing-text { font-family: 'Playfair Display', serif; font-style: italic; font-size: 18px; color: rgba(255,255,255,0.25); max-width: 520px; text-align: center; line-height: 1.9; }",

  /* ── Responsive ── */
  '@media (max-width: 768px) {',
  '  .r-hero-content { padding: 0 28px 60px; }',
  '  .r-stats { grid-template-columns: repeat(2, 1fr); padding: 48px 28px; gap: 28px; }',
  '  .r-stat-value { font-size: 40px; }',
  '  .r-section { padding: 64px 28px; }',
  '  .r-philo-grid { grid-template-columns: 1fr; gap: 32px; }',
  '}',
]
const pageCss = CSS_LINES.join('\n')

/* ── Stats (placeholder) ── */
const STATS = [
  { value: '2,430', unit: 'km', label: 'Total Distance' },
  { value: '4:38', unit: '/km', label: 'Avg Pace' },
  { value: '7', unit: '', label: 'Marathons' },
  { value: '312', unit: 'hrs', label: 'Time on Road' },
]

export default function RunningPage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoError, setVideoError] = useState(false)

  const lenis = useLenis()

  useEffect(() => {
    // scrollTo via Lenis instance（Lenis 接管了原生滚动，必须走 Lenis API）
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
    <div className="r-root">
      <style>{pageCss}</style>

      <BackButton />

      {/* ── Hero ── */}
      <section className="r-hero">
        {!videoError ? (
          <video
            ref={videoRef}
            className="r-hero-video"
            autoPlay
            loop
            muted
            playsInline
            onError={() => setVideoError(true)}
          >
            <source src="/videos/runner.mp4" type="video/mp4" />
          </video>
        ) : (
          <div
            className="r-hero-video"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1600&q=80)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        )}
        <div className="r-hero-overlay" />
        <div className="r-hero-content">
          <span className="r-tag">Endurance · Rhythm · Clarity</span>
          <h1 className="r-hero-title">
            Running<em>&amp; the art of forward motion.</em>
          </h1>
          <p className="r-hero-desc">
            Every kilometer is a conversation between the body and the road —
            a rhythm that clears the mind and reminds us that progress, however slow, is always forward.
          </p>
        </div>
        <div className="r-scroll-hint">
          <div className="r-scroll-line" />
          <div className="r-scroll-text">Scroll</div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="r-stats">
        {STATS.map((s) => (
          <div key={s.label}>
            <div>
              <span className="r-stat-value">{s.value}</span>
              <span className="r-stat-unit">{s.unit}</span>
            </div>
            <div className="r-stat-label">{s.label}</div>
          </div>
        ))}
      </section>

      {/* ── Philosophy ── */}
      <section className="r-section r-philosophy">
        <div className="r-section-label">The Why</div>
        <div className="r-philo-grid">
          <div className="r-philo-quote">
            “The miracle isn&apos;t that I finished.<br />
            The miracle is that I had the courage to start.”
          </div>
          <div className="r-philo-body">
            跑步对我来说不只是锻炼——它是一种重新校准的方式。每一次脚步落地，我都更清楚自己是谁、想要什么。
            <br /><br />
            从 5 公里到全马，每一次突破都不只是身体上的，更是心理上的重建。路永远在那里，我需要做的只是迈出第一步。
          </div>
        </div>
      </section>

      {/* ── Closing ── */}
      <section className="r-closing">
        <div className="r-closing-text">
          &ldquo;I run because it&apos;s the one time of day when the world goes quiet
          and the only thing that matters is the next step.&rdquo;
        </div>
      </section>
    </div>
  )
}
