'use client'

import { useRef, useState, useEffect } from 'react'
import { useLenis } from 'lenis/react'
import BackButton from '@/components/travel/BackButton'

/* ── CSS (cooking: hearth fire — deep charcoal + warm flame orange + cream steam) ── */
const CSS_LINES = [
  "@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,700;0,800;1,400;1,700&family=Barlow:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,600;1,400;1,600&family=Lora:ital,wght@0,400;0,600;1,400&family=Noto+Serif+SC:wght@400;700&display=swap');",

  '*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }',
  ".ck-root { font-family: 'Barlow', sans-serif; background: #1A0E08; color: #F5E8D8; }",

  '.ck-hero { position: relative; width: 100%; height: 100vh; overflow: hidden; }',
  '.ck-hero-video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }',
  '.ck-hero-overlay { position: absolute; inset: 0; background: radial-gradient(ellipse at 60% 80%, rgba(210,100,40,0.06) 0%, transparent 50%), linear-gradient(to bottom, rgba(14,8,4,0.1) 0%, rgba(14,8,4,0.4) 45%, rgba(14,8,4,0.95) 100%); }',
  '.ck-hero-content { position: relative; z-index: 2; height: 100%; display: flex; flex-direction: column; justify-content: flex-end; padding: 0 64px 100px; }',

  ".ck-tag { display: inline-flex; align-items: center; gap: 10px; font-family: 'Lora', serif; font-size: 12px; font-weight: 400; font-style: italic; letter-spacing: 0.06em; color: #E87A4A; margin-bottom: 18px; }",
  '.ck-tag-dot { width: 5px; height: 5px; border-radius: 50%; background: #E87A4A; }',

  ".ck-hero-title { font-family: 'Barlow Condensed', sans-serif; font-size: clamp(64px, 10vw, 120px); font-weight: 800; line-height: 0.92; text-transform: uppercase; letter-spacing: -0.02em; color: #F5E8D8; }",
  ".ck-hero-title .ck-accent { color: #E87A4A; font-style: normal; }",

  ".ck-hero-desc { font-family: 'Barlow', sans-serif; font-size: 15px; font-weight: 300; color: rgba(245,232,216,0.45); line-height: 1.8; max-width: 500px; margin-top: 24px; }",

  '.ck-scroll-hint { position: absolute; bottom: 40px; right: 48px; z-index: 3; }',
  '.ck-scroll-line { width: 1px; height: 48px; background: rgba(232,122,74,0.15); margin: 0 auto 8px; }',
  ".ck-scroll-text { font-family: 'Lora', serif; font-size: 9px; font-style: italic; letter-spacing: 0.2em; color: rgba(232,122,74,0.3); text-transform: uppercase; writing-mode: vertical-rl; }",


  '.ck-stats { background: #1C100A; padding: 80px 64px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 32px; border-top: 1px solid rgba(232,122,74,0.06); border-bottom: 1px solid rgba(232,122,74,0.06); }',
  ".ck-stat-value { font-family: 'Barlow Condensed', sans-serif; font-size: 56px; font-weight: 800; color: #E87A4A; line-height: 1; }",
  ".ck-stat-unit { font-family: 'Lora', serif; font-size: 14px; font-weight: 400; font-style: italic; color: rgba(232,122,74,0.35); margin-left: 4px; }",
  ".ck-stat-label { font-family: 'Barlow', sans-serif; font-size: 11px; font-weight: 400; color: rgba(245,232,216,0.3); text-transform: uppercase; letter-spacing: 0.1em; margin-top: 10px; }",

  '.ck-section { padding: 80px 64px; }',
  ".ck-section-label { font-family: 'Lora', serif; font-size: 13px; font-weight: 400; font-style: italic; color: rgba(232,122,74,0.45); margin-bottom: 36px; }",

  '.ck-philosophy { background: #1C100A; }',
  '.ck-philo-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: start; }',
  ".ck-philo-quote { font-family: 'Playfair Display', serif; font-size: 30px; font-weight: 600; font-style: italic; color: #E87A4A; line-height: 1.35; }",
  ".ck-philo-body { font-family: 'Noto Serif SC', serif; font-size: 14px; font-weight: 400; color: rgba(245,232,216,0.5); line-height: 2; }",

  '.ck-dishes { background: #1A0E08; }',
  '.ck-dishes-grid { display: flex; flex-wrap: wrap; gap: 10px; }',
  ".ck-dish-tag { font-family: 'Lora', serif; font-size: 14px; font-weight: 400; font-style: italic; padding: 11px 22px; border-radius: 3px; border: 1px solid rgba(232,122,74,0.1); color: rgba(245,232,216,0.55); background: rgba(232,122,74,0.02); transition: all 0.3s; }",
  '.ck-dish-tag:hover { background: rgba(232,122,74,0.08); border-color: rgba(232,122,74,0.4); color: #E87A4A; }',

  '.ck-gallery { background: #1C100A; }',
  '.ck-gallery-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }',
  '.ck-gallery-item { position: relative; border-radius: 4px; overflow: hidden; aspect-ratio: 1/1; transition: transform 0.4s ease; }',
  '.ck-gallery-item:hover { transform: scale(1.04); }',
  '.ck-gallery-img { width: 100%; height: 100%; object-fit: cover; display: block; filter: brightness(0.9) saturate(0.85); transition: filter 0.4s; }',
  '.ck-gallery-item:hover .ck-gallery-img { filter: brightness(1.05) saturate(1); }',
  '.ck-gallery-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(14,8,4,0.75) 15%, transparent 50%); }',
  ".ck-gallery-caption { position: absolute; bottom: 14px; left: 16px; font-family: 'Lora', serif; font-size: 12px; font-style: italic; color: rgba(232,122,74,0.7); }",

  '@media (max-width: 768px) {',
  '  .ck-hero-content { padding: 0 28px 80px; }',
  '  .ck-stats { grid-template-columns: 1fr 1fr; padding: 48px 28px; gap: 24px; }',
  '  .ck-section { padding: 48px 28px; }',
  '  .ck-philo-grid { grid-template-columns: 1fr; gap: 32px; }',
  '  .ck-gallery-grid { grid-template-columns: 1fr; }',
  '}',
]

const pageCss = CSS_LINES.join('\n')

const STATS = [
  { value: '80+', unit: '', label: 'Dishes Mastered' },
  { value: '10', unit: 'yrs', label: 'Home Cooking' },
  { value: '50+', unit: '', label: 'Dinner Parties' },
  { value: '8', unit: '', label: 'Cuisines' },
]

const DISHES = [
  'Stir-fry', 'Braised Pork', 'Mapo Tofu', 'Hot Pot',
  'Steamed Fish', 'Dumplings', 'Fried Rice', 'Soup Noodles',
  'Roast Chicken', 'Pasta', 'Curry', 'BBQ Ribs',
]

const PHOTOS = [
  { url: 'photo-1540189549336-e6e99c3679fe', caption: 'Fresh Ingredients' },
  { url: 'photo-1556911220-bff31c812dba', caption: 'Stir-fry in Motion' },
  { url: 'photo-1414235077428-338989a2e8c0', caption: 'Plating' },
  { url: 'photo-1467003909585-2f8a72700288', caption: 'Sunday Prep' },
  { url: 'photo-1490645935967-10de6ba17061', caption: 'Seasoning' },
  { url: 'photo-1504674900247-0877df9cc836', caption: 'The Table' },
]

export default function CookingPage() {
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
    <div className="ck-root">
      <style>{pageCss}</style>

      <BackButton />

      <section className="ck-hero">
        {!videoError ? (
          <video ref={videoRef} className="ck-hero-video" autoPlay loop muted playsInline
            onError={() => setVideoError(true)}>
            <source src="/videos/cook.mp4" type="video/mp4" />
          </video>
        ) : (
          <div className="ck-hero-video" style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1600&q=80)',
            backgroundSize: 'cover', backgroundPosition: 'center',
          }} />
        )}
        <div className="ck-hero-overlay" />
        <div className="ck-hero-content">
          <span className="ck-tag">
            <span className="ck-tag-dot" />
            Fire · Flavor · Family
            <span className="ck-tag-dot" />
          </span>
          <h1 className="ck-hero-title">
            Taste of<br />
            <span className="ck-accent">Home</span>
          </h1>
          <p className="ck-hero-desc">
            The kitchen is where I slow down. A hot wok, a sharp knife,
            and the patience to let flavors build — cooking is the most
            honest form of care I know.
          </p>
        </div>
        <div className="ck-scroll-hint">
          <div className="ck-scroll-line" />
          <div className="ck-scroll-text">Scroll</div>
        </div>
      </section>

      <section className="ck-stats">
        {STATS.map((s) => (
          <div key={s.label}>
            <div>
              <span className="ck-stat-value">{s.value}</span>
              <span className="ck-stat-unit">{s.unit}</span>
            </div>
            <div className="ck-stat-label">{s.label}</div>
          </div>
        ))}
      </section>

      <section className="ck-section ck-philosophy">
        <div className="ck-section-label">the kitchen table</div>
        <div className="ck-philo-grid">
          <div className="ck-philo-quote">
            Cooking is the only art<br />
            you can taste, smell,<br />
            and share in a single breath.
          </div>
          <div className="ck-philo-body">
            对我来说，厨房是最诚实的空间——你不能假装一锅好汤，也无法用滤镜美化一块煎过头的牛排。
            <br /><br />
            从外婆的红烧肉到自己的第一道麻婆豆腐，火候教会我的不只是烹饪——是做任何事都不能急，也不能等太久。恰到好处，是时间告诉你的，不是食谱。
          </div>
        </div>
      </section>

      <section className="ck-section ck-dishes">
        <div className="ck-section-label">repertoire</div>
        <div className="ck-dishes-grid">
          {DISHES.map((g) => (
            <span className="ck-dish-tag" key={g}>{g}</span>
          ))}
        </div>
      </section>


    </div>
  )
}
