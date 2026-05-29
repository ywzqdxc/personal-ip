'use client'

import { useRef, useState, useEffect } from 'react'
import { useLenis } from 'lenis/react'
import BackButton from '@/components/travel/BackButton'

/* ── CSS (coder: terminal / dark blue-black / cyan accent — quiet, focused, builder) ── */
const CSS_LINES = [
  "@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,700;0,800;1,400;1,700&family=Barlow:wght@300;400;500;600&family=JetBrains+Mono:ital,wght@0,300;0,400;0,500;1,400&family=Noto+Serif+SC:wght@400;700&display=swap');",

  '*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }',
  ".cr-root { font-family: 'Barlow', sans-serif; background: #0A0E17; color: #fff; }",

  /* ── Hero ── */
  '.cr-hero { position: relative; width: 100%; height: 100vh; overflow: hidden; }',
  '.cr-hero-video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }',
  '.cr-hero-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(6,9,14,0.2) 0%, rgba(6,9,14,0.5) 50%, rgba(6,9,14,0.94) 100%); }',
  '.cr-hero-scanlines { position: absolute; inset: 0; background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(100,255,218,0.015) 2px, rgba(100,255,218,0.015) 4px); pointer-events: none; z-index: 1; }',
  '.cr-hero-content { position: relative; z-index: 2; height: 100%; display: flex; flex-direction: column; justify-content: flex-end; padding: 0 64px 100px; }',

  '.cr-tag { display: inline-flex; align-items: center; gap: 10px; font-family: "JetBrains Mono", monospace; font-size: 10px; font-weight: 500; letter-spacing: 0.12em; color: #64FFDA; text-transform: uppercase; margin-bottom: 18px; }',
  '.cr-tag-prompt { color: rgba(255,255,255,0.25); }',
  '.cr-tag-cursor { display: inline-block; width: 8px; height: 14px; background: #64FFDA; animation: crBlink 1s step-end infinite; vertical-align: middle; margin-left: 2px; }',
  '@keyframes crBlink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }',

  ".cr-hero-title { font-family: 'Barlow Condensed', sans-serif; font-size: clamp(64px, 10vw, 120px); font-weight: 800; line-height: 0.92; text-transform: uppercase; letter-spacing: -0.02em; color: #fff; }",
  ".cr-hero-title .cr-accent { color: #64FFDA; font-style: normal; }",

  ".cr-hero-desc { font-family: 'Barlow', sans-serif; font-size: 15px; font-weight: 300; color: rgba(255,255,255,0.5); line-height: 1.8; max-width: 500px; margin-top: 24px; }",

  '.cr-scroll-hint { position: absolute; bottom: 40px; right: 48px; z-index: 3; }',
  '.cr-scroll-line { width: 1px; height: 48px; background: rgba(100,255,218,0.15); margin: 0 auto 8px; }',
  ".cr-scroll-text { font-family: 'JetBrains Mono', monospace; font-size: 9px; letter-spacing: 0.25em; color: rgba(100,255,218,0.3); text-transform: uppercase; writing-mode: vertical-rl; }",


  /* ── Stats strip ── */
  '.cr-stats { background: #0C111A; padding: 80px 64px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 32px; border-top: 1px solid rgba(100,255,218,0.06); border-bottom: 1px solid rgba(100,255,218,0.06); }',
  ".cr-stat-value { font-family: 'Barlow Condensed', sans-serif; font-size: 56px; font-weight: 800; color: #64FFDA; line-height: 1; }",
  ".cr-stat-unit { font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 400; color: rgba(100,255,218,0.35); margin-left: 4px; }",
  ".cr-stat-label { font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 400; color: rgba(255,255,255,0.35); text-transform: uppercase; letter-spacing: 0.08em; margin-top: 10px; }",

  /* ── Shared section ── */
  '.cr-section { padding: 80px 64px; }',
  ".cr-section-label { font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 500; color: rgba(100,255,218,0.5); text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 36px; }",
  ".cr-section-label::before { content: '// '; color: rgba(255,255,255,0.2); }",

  /* ── Philosophy ── */
  '.cr-philosophy { background: #0C111A; }',
  '.cr-philo-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: start; }',
  ".cr-philo-quote { font-family: 'Barlow Condensed', sans-serif; font-size: 28px; font-weight: 700; color: #64FFDA; line-height: 1.3; letter-spacing: -0.01em; text-transform: uppercase; }",
  ".cr-philo-body { font-family: 'Noto Serif SC', serif; font-size: 14px; font-weight: 400; color: rgba(255,255,255,0.55); line-height: 2; }",

  /* ── Tech tags ── */
  '.cr-tech { background: #0A0E17; }',
  '.cr-tech-grid { display: flex; flex-wrap: wrap; gap: 8px; }',
  ".cr-tech-tag { font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 400; padding: 10px 18px; border-radius: 4px; border: 1px solid rgba(100,255,218,0.12); color: rgba(255,255,255,0.65); background: rgba(100,255,218,0.03); transition: all 0.2s; }",
  '.cr-tech-tag:hover { background: rgba(100,255,218,0.08); border-color: rgba(100,255,218,0.3); color: #64FFDA; }',

  /* ── Gallery ── */
  '.cr-gallery { background: #0C111A; }',
  '.cr-gallery-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }',
  '.cr-gallery-item { position: relative; border-radius: 8px; overflow: hidden; aspect-ratio: 16/9; transition: transform 0.35s ease; }',
  '.cr-gallery-item:hover { transform: scale(1.04); }',
  '.cr-gallery-img { width: 100%; height: 100%; object-fit: cover; display: block; }',
  '.cr-gallery-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(6,9,14,0.85) 15%, transparent 50%); }',
  ".cr-gallery-caption { position: absolute; bottom: 14px; left: 16px; font-family: 'JetBrains Mono', monospace; font-size: 10px; color: rgba(100,255,218,0.75); text-transform: uppercase; letter-spacing: 0.08em; }",
]

const pageCss = CSS_LINES.join('\n')

/* ── Data ── */
const STATS = [
  { value: '1,200+', unit: '', label: 'Commits / Year' },
  { value: '180K+', unit: '', label: 'Lines of Code' },
  { value: '8', unit: 'yrs', label: 'Writing Code' },
  { value: '30+', unit: '', label: 'Projects Built' },
]

const TECH_TAGS = [
  'TypeScript', 'React', 'Next.js', 'Java',
  'Spring Boot', 'MySQL', 'Redis', 'Docker',
  'Tailwind CSS', 'Framer Motion', 'Node.js', 'Git',
  'REST API', 'Vue 3', 'Maven', 'pnpm',
]

const PHOTOS = [
  { url: 'photo-1498050108023-c5249f4df085', caption: 'Late Night Build' },
  { url: 'photo-1517694712202-14dd9538aa97', caption: 'Code Review' },
  { url: 'photo-1551033406-611cf9a28f67', caption: 'Terminal Session' },
  { url: 'photo-1542831371-29b0f74f9713', caption: 'VS Code' },
  { url: 'photo-1461749280684-dccba630e2f6', caption: 'The Stack' },
  { url: 'photo-1504639725590-34d0984388bd', caption: 'Architecture' },
]

export default function CoderPage() {
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
    vid.playbackRate = 0.9
  }, [lenis])

  return (
    <div className="cr-root">
      <style>{pageCss}</style>

      <BackButton />

      {/* ── Hero ── */}
      <section className="cr-hero">
        {!videoError ? (
          <video
            ref={videoRef}
            className="cr-hero-video"
            autoPlay
            loop
            muted
            playsInline
            onError={() => setVideoError(true)}
          >
            <source src="/videos/coder.mp4" type="video/mp4" />
          </video>
        ) : (
          <div
            className="cr-hero-video"
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1600&q=80)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        )}
        <div className="cr-hero-overlay" />
        <div className="cr-hero-scanlines" />
        <div className="cr-hero-content">
          <span className="cr-tag">
            <span className="cr-tag-prompt">&gt; </span>
            Logic · Create · Ship
            <span className="cr-tag-cursor" />
          </span>
          <h1 className="cr-hero-title">
            <span className="cr-accent">Code</span> is Craft
          </h1>
          <p className="cr-hero-desc">
            I write software not just as a profession, but as a craft — every
            line is a decision, every function a small piece of architecture.
            The terminal is where ideas become things.
          </p>
        </div>
        <div className="cr-scroll-hint">
          <div className="cr-scroll-line" />
          <div className="cr-scroll-text">Scroll</div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="cr-stats">
        {STATS.map((s) => (
          <div key={s.label}>
            <div>
              <span className="cr-stat-value">{s.value}</span>
              <span className="cr-stat-unit">{s.unit}</span>
            </div>
            <div className="cr-stat-label">{s.label}</div>
          </div>
        ))}
      </section>

      {/* ── Philosophy ── */}
      <section className="cr-section cr-philosophy">
        <div className="cr-section-label">the why</div>
        <div className="cr-philo-grid">
          <div className="cr-philo-quote">
            I DON&apos;T JUST WRITE CODE.<br />
            I BUILD SYSTEMS<br />
            THAT OUTLAST ME.
          </div>
          <div className="cr-philo-body">
            代码对我来说从来不只是工具——它是一种思维方式。每一个抽象、每一次重构，都是在和复杂性对话。
            <br /><br />
            我喜欢凌晨三点只有终端光标闪烁的房间，也喜欢清晨看到 CI 全部变绿的那一刻。从 Java 到 TypeScript，从后端到前端，技术栈会变，但"用逻辑建造东西"的冲动不会。
          </div>
        </div>
      </section>

      {/* ── Tech tags ── */}
      <section className="cr-section cr-tech">
        <div className="cr-section-label">stack</div>
        <div className="cr-tech-grid">
          {TECH_TAGS.map((t) => (
            <span className="cr-tech-tag" key={t}>{t}</span>
          ))}
        </div>
      </section>

      {/* ── Gallery ── */}
      <section className="cr-section cr-gallery">
        <div className="cr-section-label">frames</div>
        <div className="cr-gallery-grid">
          {PHOTOS.map((g) => (
            <div className="cr-gallery-item" key={g.url}>
              <img
                className="cr-gallery-img"
                src={'https://images.unsplash.com/' + g.url + '?auto=format&fit=crop&w=800&q=80'}
                alt={g.caption}
                loading="lazy"
              />
              <div className="cr-gallery-overlay" />
              <div className="cr-gallery-caption">{g.caption}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
