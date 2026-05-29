'use client'

import { useRef, useState, useEffect } from 'react'
import { useLenis } from 'lenis/react'
import BackButton from '@/components/travel/BackButton'

/* ── CSS (table-tennis: green / white / red — fast, sharp, competitive) ── */
const CSS_LINES = [
  "@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,700;0,800;1,400;1,700&family=Barlow:wght@300;400;500;600&family=Noto+Serif+SC:wght@400;700&display=swap');",

  '*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }',
  ".tt-root { font-family: 'Barlow', sans-serif; background: #060F08; color: #fff; }",

  /* ── Hero ── */
  '.tt-hero { position: relative; width: 100%; height: 100vh; overflow: hidden; }',
  '.tt-hero-video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }',
  '.tt-hero-overlay { position: absolute; inset: 0; background: linear-gradient(160deg, rgba(4,14,6,0.35) 0%, rgba(4,14,6,0.55) 40%, rgba(2,8,3,0.88) 100%); }',
  '.tt-hero-vignette { position: absolute; inset: 0; background: radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.55) 100%); pointer-events: none; }',
  '.tt-hero-content { position: relative; z-index: 2; height: 100%; display: flex; flex-direction: column; justify-content: flex-end; padding: 0 64px 100px; }',

  '.tt-tag { display: inline-flex; align-items: center; gap: 10px; font-family: "Barlow Condensed", sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 0.3em; color: #E53935; text-transform: uppercase; margin-bottom: 18px; }',
  '.tt-tag-dot { width: 6px; height: 6px; border-radius: 50%; background: #E53935; animation: ttPulse 1.2s ease-in-out infinite; }',
  '@keyframes ttPulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.35; transform: scale(1.6); } }',

  ".tt-hero-title { font-family: 'Barlow Condensed', sans-serif; font-size: clamp(68px, 10vw, 130px); font-weight: 800; line-height: 0.88; text-transform: uppercase; letter-spacing: -0.02em; color: #fff; display: flex; flex-wrap: wrap; align-items: baseline; gap: 0 16px; }",
  ".tt-hero-title .tt-accent { color: #E53935; font-style: normal; }",
  ".tt-hero-sub { font-family: 'Barlow', sans-serif; font-size: clamp(14px, 1.6vw, 18px); font-weight: 300; color: rgba(255,255,255,0.55); letter-spacing: 0.12em; text-transform: uppercase; margin-top: 6px; }",

  ".tt-hero-desc { font-family: 'Barlow', sans-serif; font-size: 15px; font-weight: 300; color: rgba(255,255,255,0.45); line-height: 1.8; max-width: 460px; margin-top: 24px; }",

  '.tt-scroll-hint { position: absolute; bottom: 40px; right: 48px; z-index: 3; display: flex; flex-direction: column; align-items: center; gap: 8px; }',
  '.tt-scroll-line { width: 1px; height: 40px; background: rgba(255,255,255,0.25); }',
  ".tt-scroll-text { font-family: 'Barlow Condensed', sans-serif; font-size: 9px; letter-spacing: 0.25em; color: rgba(255,255,255,0.35); text-transform: uppercase; writing-mode: vertical-rl; }",


  /* ── Table divider ── */
  '.tt-divider { background: #050D06; padding: 0 64px; display: flex; align-items: center; }',
  '.tt-net-line { flex: 1; height: 1px; background: rgba(255,255,255,0.08); position: relative; }',
  '.tt-net-line::after { content: ""; position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); width: 60px; height: 1px; background: rgba(255,255,255,0.22); }',
  '.tt-net-label { font-family: "Barlow Condensed", sans-serif; font-size: 9px; letter-spacing: 0.2em; color: rgba(255,255,255,0.18); text-transform: uppercase; padding: 28px 0; }',

  /* ── Stats strip ── */
  '.tt-stats { background: #050D06; padding: 72px 64px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 32px; }',
  ".tt-stat-value { font-family: 'Barlow Condensed', sans-serif; font-size: 52px; font-weight: 800; color: #E53935; line-height: 1; }",
  ".tt-stat-unit { font-family: 'Barlow Condensed', sans-serif; font-size: 15px; font-weight: 400; color: rgba(255,255,255,0.3); margin-left: 3px; }",
  ".tt-stat-label { font-family: 'Barlow', sans-serif; font-size: 11px; font-weight: 500; color: rgba(255,255,255,0.35); letter-spacing: 0.12em; text-transform: uppercase; margin-top: 8px; }",

  /* ── Section header ── */
  '.tt-section { padding: 100px 64px; }',
  ".tt-section-label { font-family: 'Barlow Condensed', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 0.3em; color: rgba(255,255,255,0.2); text-transform: uppercase; margin-bottom: 48px; display: flex; align-items: center; gap: 12px; }",
  '.tt-section-label::after { content: ""; flex: 1; height: 1px; background: rgba(255,255,255,0.07); }',

  /* ── Philosophy ── */
  '.tt-philosophy { background: #050D06; }',
  '.tt-philo-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: start; }',
  ".tt-philo-quote { font-family: 'Barlow Condensed', sans-serif; font-size: clamp(32px, 4vw, 48px); font-weight: 800; color: #fff; line-height: 1.1; text-transform: uppercase; letter-spacing: -0.01em; }",
  ".tt-philo-quote em { font-family: 'Barlow Condensed', sans-serif; font-style: normal; color: #E53935; }",
  ".tt-philo-body { font-family: 'Noto Serif SC', serif; font-size: 15px; font-weight: 400; color: rgba(255,255,255,0.38); line-height: 2.1; }",


  /* ── Closing ── */
  '.tt-closing { background: #060F08; padding: 80px 64px 120px; display: flex; justify-content: center; }',
  ".tt-closing-text { font-family: 'Barlow Condensed', sans-serif; font-size: 18px; font-weight: 700; color: rgba(255,255,255,0.2); max-width: 520px; text-align: center; line-height: 1.7; letter-spacing: 0.08em; text-transform: uppercase; }",

  /* ── Responsive ── */
  '@media (max-width: 768px) {',
  '  .tt-hero-content { padding: 0 28px 60px; }',
  '  .tt-stats { grid-template-columns: repeat(2, 1fr); padding: 48px 28px; gap: 28px; }',
  '  .tt-stat-value { font-size: 38px; }',
  '  .tt-section { padding: 64px 28px; }',
  '  .tt-philo-grid { grid-template-columns: 1fr; gap: 28px; }',
  '}',
]
const pageCss = CSS_LINES.join('\n')

/* ── Stats ── */
const STATS = [
  { value: '0.18', unit: 's', label: 'Avg Reaction' },
  { value: '47', unit: '', label: 'Best Rally' },
  { value: '12', unit: 'yrs', label: 'Playing Since' },
  { value: '3', unit: '', label: 'Club Titles' },
]

export default function TableTennisPage() {
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
    vid.playbackRate = 1.0
  }, [lenis])

  return (
    <div className="tt-root">
      <style>{pageCss}</style>

      {/* Back */}
      <BackButton />

      {/* ── Hero ── */}
      <section className="tt-hero">
        {!videoError ? (
          <video
            ref={videoRef}
            className="tt-hero-video"
            autoPlay
            loop
            muted
            playsInline
            onError={() => setVideoError(true)}
          >
            <source src="/videos/tabletennis.mp4" type="video/mp4" />
          </video>
        ) : (
          <div
            className="tt-hero-video"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1611251135345-18c56206b863?auto=format&fit=crop&w=1600&q=80)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        )}
        <div className="tt-hero-overlay" />
        <div className="tt-hero-vignette" />
        <div className="tt-hero-content">
          <span className="tt-tag">
            <span className="tt-tag-dot" />
            Speed · Precision · Instinct
          </span>
          <h1 className="tt-hero-title">
            Table<span className="tt-accent">Tennis</span>
          </h1>
          <div className="tt-hero-sub">The fastest sport on two feet.</div>
          <p className="tt-hero-desc">
            In the space between a serve and a smash, there is no time to think —
            only to react. Table tennis is pure instinct, refined through
            thousands of hours into split-second decisions.
          </p>
        </div>
        <div className="tt-scroll-hint">
          <div className="tt-scroll-line" />
          <div className="tt-scroll-text">Scroll</div>
        </div>
      </section>

      {/* ── Table divider ── */}
      <section className="tt-divider">
        <div className="tt-net-line" />
        <div className="tt-net-label">Net</div>
        <div className="tt-net-line" />
      </section>

      {/* ── Stats ── */}
      <section className="tt-stats">
        {STATS.map((s) => (
          <div key={s.label}>
            <div>
              <span className="tt-stat-value">{s.value}</span>
              <span className="tt-stat-unit">{s.unit}</span>
            </div>
            <div className="tt-stat-label">{s.label}</div>
          </div>
        ))}
      </section>

      {/* ── Philosophy ── */}
      <section className="tt-section tt-philosophy">
        <div className="tt-section-label">The Mindset</div>
        <div className="tt-philo-grid">
          <div className="tt-philo-quote">
            NO TIME<em>.</em><br />
            NO HESITATION<em>.</em><br />
            ONLY THE NEXT<br />
            <em>POINT</em>.
          </div>
          <div className="tt-philo-body">
            乒乓球教会我：犹豫是最大的敌人。球不会等你准备好——它来了，你只有两个选择：退缩，或者挥拍。
            <br /><br />
            生活中也一样。机会从不提前敲门，它就像对手的弧圈球，旋转着、加速着朝你飞来。你唯一能做的，就是在 0.18 秒内做出决定，然后全力一击。
          </div>
        </div>
      </section>


      {/* ── Closing ── */}
      <section className="tt-closing">
        <div className="tt-closing-text">
          The ball is round. The table is flat.<br />
          Everything else is up to you.
        </div>
      </section>
    </div>
  )
}
