'use client'
import { useRouter } from 'next/navigation'

const CSS_LINES = [
  "@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,400;0,700;0,800;1,400;1,700&family=Barlow:wght@300;400;500&family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&display=swap');",
  'html { scroll-behavior: smooth; }',
  ".hobby-root { font-family: 'Barlow', sans-serif; background: #0E0C0A; }",

  /* Hero */
  '.hero-section { position: relative; width: 100%; height: 100vh; overflow: hidden; }',
  '.hero-bg { position: absolute; inset: 0; background-size: cover; background-position: center; }',
  '.hero-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(20,15,10,0.3) 0%, rgba(10,8,5,0.55) 60%, rgba(5,3,2,0.85) 100%); }',
  '.hero-content { position: relative; z-index: 2; height: 100%; display: flex; flex-direction: column; justify-content: flex-end; padding: 0 64px 90px; }',
  ".momentum-label { font-family: 'Barlow Condensed', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.25em; color: rgba(255,255,255,0.5); text-transform: uppercase; margin-bottom: 20px; }",
  ".hero-heading { font-family: 'Barlow Condensed', sans-serif; font-size: clamp(52px, 7vw, 88px); font-weight: 800; line-height: 1.0; color: #fff; text-transform: uppercase; letter-spacing: -0.01em; margin-bottom: 24px; }",
  ".hero-heading em { font-family: 'Playfair Display', serif; font-style: italic; font-weight: 400; color: #C9A96E; text-transform: none; }",
  ".hero-desc { font-family: 'Barlow', sans-serif; font-size: 14px; font-weight: 300; color: rgba(255,255,255,0.55); line-height: 1.9; max-width: 500px; }",
  '.scroll-indicator { position: absolute; bottom: 36px; left: 64px; display: flex; align-items: center; gap: 12px; cursor: pointer; z-index: 3; }',
  '.scroll-circle { width: 44px; height: 44px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.3); display: flex; align-items: center; justify-content: center; }',
  '.scroll-arrow { width: 0; height: 0; border-left: 5px solid transparent; border-right: 5px solid transparent; border-top: 6px solid rgba(255,255,255,0.65); }',
  ".scroll-label { font-family: 'Barlow Condensed', sans-serif; font-size: 10px; letter-spacing: 0.2em; color: rgba(255,255,255,0.4); text-transform: uppercase; }",
  ".scroll-vertical { position: absolute; right: 40px; bottom: 80px; writing-mode: vertical-rl; transform: rotate(180deg); font-family: 'Barlow Condensed', sans-serif; font-size: 10px; letter-spacing: 0.2em; color: rgba(255,255,255,0.3); text-transform: uppercase; z-index: 3; }",

  /* Cards section */
  '.cards-section { background: #0A0907; padding: 0 48px 64px; }',
  ".cards-label { font-family: 'Barlow Condensed', sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 0.25em; color: rgba(255,255,255,0.28); text-transform: uppercase; padding: 28px 0 24px; border-bottom: 1px solid rgba(255,255,255,0.07); margin-bottom: 28px; }",

  /* Bento grid: 4 cols × 2 rows, Running/Cooking span 2 cols */
  '.cards-grid { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; grid-template-rows: minmax(260px, 36vh) minmax(260px, 36vh); gap: 14px; }',

  /* Cards */
  '.hobby-card { position: relative; border-radius: 14px; overflow: hidden; cursor: pointer; transition: transform 0.35s ease; }',
  '.hobby-card:hover { transform: translateY(-5px); }',
  '.card-bg { position: absolute; inset: 0; background-size: cover; background-position: center; transition: transform 0.5s ease; }',
  '.hobby-card:hover .card-bg { transform: scale(1.06); }',
  '.card-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(4,3,2,0.9) 20%, rgba(4,3,2,0.1) 70%); }',
  '.card-inner { position: relative; z-index: 2; height: 100%; display: flex; flex-direction: column; padding: 20px; }',
  '.card-top { display: flex; align-items: center; justify-content: space-between; }',
  ".card-num { font-family: 'Barlow Condensed', sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 0.18em; color: rgba(255,255,255,0.35); }",
  '.card-arrow { width: 30px; height: 30px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.22); display: flex; align-items: center; justify-content: center; transition: border-color 0.2s, background 0.2s; }',
  '.hobby-card:hover .card-arrow { border-color: rgba(255,255,255,0.55); background: rgba(255,255,255,0.08); }',
  '.card-bottom { margin-top: auto; }',
  ".card-title { font-family: 'Playfair Display', serif; font-size: clamp(18px, 2vw, 26px); font-weight: 400; color: #fff; line-height: 1.1; margin-bottom: 7px; }",
  ".card-subtitle { font-family: 'Barlow', sans-serif; font-size: 11.5px; font-weight: 300; color: rgba(255,255,255,0.42); line-height: 1.55; }",
  /* Wide card title larger */
  ".card-wide .card-title { font-size: clamp(24px, 2.8vw, 36px); }",

  /* Quote */
  '.quote-section { background: #0A0907; padding: 0 48px 64px; display: flex; justify-content: flex-end; }',
  ".quote-text { font-family: 'Playfair Display', serif; font-style: italic; font-size: 14px; color: rgba(255,255,255,0.3); line-height: 1.85; max-width: 480px; text-align: right; }",
  ".quote-attr { font-family: 'Barlow', sans-serif; font-size: 11px; color: rgba(255,255,255,0.22); letter-spacing: 0.1em; margin-top: 10px; text-align: right; }",

  /* Back button */
  ".back-btn { position: fixed; top: 92px; left: 36px; z-index: 100; display: flex; align-items: center; gap: 8px; color: rgba(255,255,255,0.6); font-family: 'Barlow Condensed', sans-serif; font-size: 12px; letter-spacing: 0.15em; text-transform: uppercase; cursor: pointer; background: none; border: none; padding: 0; transition: color 0.2s; }",
  '.back-btn:hover { color: rgba(255,255,255,0.95); }',
]
const pageCss = CSS_LINES.join('\n')

// Bento grid: Row1 → Running(2col) Coder Reading | Row2 → Music T.Tennis Cooking(2col)
const HOBBIES = [
  {
    num: '01', title: 'Running',
    subtitle: 'Every mile is a meditation. The road teaches patience and grit.',
    img: 'photo-1476480862126-209bfaa8edc8',   // trail runner in fog — atmospheric
    href: '/about/hobby/running',
    gridCol: '1 / 3', gridRow: '1', wide: true,
  },
  {
    num: '02', title: 'Coder',
    subtitle: 'Building things from nothing. Logic as a creative language.',
    img: 'photo-1555066931-4365d14bab8c',       // dark terminal code closeup
    href: '/about/hobby/coder',
    gridCol: '3', gridRow: '1', wide: false,
  },
  {
    num: '03', title: 'Reading',
    subtitle: 'Living a thousand lives before the first one ends.',
    img: 'photo-1481627834876-b7833e8f5570',    // dramatic library light
    href: '/about/hobby/reading',
    gridCol: '4', gridRow: '1', wide: false,
  },
  {
    num: '04', title: 'Music',
    subtitle: 'Sound as memory. Every song, a different version of time.',
    img: 'photo-1507838153414-b4b713384a76',    // piano keys dramatic
    href: '/about/hobby/music',
    gridCol: '1', gridRow: '2', wide: false,
  },
  {
    num: '05', title: 'T. Tennis',
    subtitle: 'Split-second decisions. The fastest sport on two feet.',
    img: 'photo-1534158914592-062992fbe900',    // table tennis action
    href: '/about/hobby/table-tennis',
    gridCol: '2', gridRow: '2', wide: false,
  },
  {
    num: '06', title: 'Cooking',
    subtitle: 'Fire and patience. Good food takes time, and time is love.',
    img: 'photo-1556909114-f6e7ad7d3136',       // chef cooking with dramatic fire
    href: '/about/hobby/cooking',
    gridCol: '3 / 5', gridRow: '2', wide: true,
  },
]

export default function HobbyPage() {
  const router = useRouter()

  const scrollToCards = () => {
    const el = document.getElementById('hobby-cards')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="hobby-root">
      <style>{pageCss}</style>

      <button className="back-btn" onClick={() => router.push('/about')}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M10 3L5 8l5 5"/>
        </svg>
        About
      </button>

      {/* Hero */}
      <section className="hero-section">
        <div
          className="hero-bg"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?auto=format&fit=crop&w=1600&q=80)' }}
        />
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="momentum-label">Momentum · Life · Passion</div>
          <h1 className="hero-heading">
            Beyond Work,<br />
            Inside <em>Life.</em>
          </h1>
          <p className="hero-desc">
            工作塑造了我的能力，而热爱，塑造了我的生活方式和思考方式。
          </p>
        </div>
        <div className="scroll-indicator" onClick={scrollToCards}>
          <div className="scroll-circle">
            <div className="scroll-arrow" />
          </div>
          <span className="scroll-label">Scroll to explore</span>
        </div>
        <div className="scroll-vertical">Scroll to explore</div>
      </section>

      {/* Bento Cards */}
      <section className="cards-section" id="hobby-cards">
        <div className="cards-label">Things I do beyond the screen</div>
        <div className="cards-grid">
          {HOBBIES.map((h) => (
            <div
              key={h.num}
              className={'hobby-card' + (h.wide ? ' card-wide' : '')}
              onClick={() => { if (h.href) router.push(h.href) }}
              style={{
                gridColumn: h.gridCol,
                gridRow: h.gridRow,
                cursor: h.href ? 'pointer' : 'default',
              }}
            >
              <div
                className="card-bg"
                style={{
                  backgroundImage: 'url(https://images.unsplash.com/' + h.img + '?auto=format&fit=crop&w=900&q=85)',
                }}
              />
              <div className="card-overlay" />
              <div className="card-inner">
                <div className="card-top">
                  <span className="card-num">{h.num}</span>
                  {h.href && (
                    <div className="card-arrow">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="rgba(255,255,255,0.65)" strokeWidth="1.5">
                        <path d="M2 5h6M5.5 2.5L8 5l-2.5 2.5"/>
                      </svg>
                    </div>
                  )}
                </div>
                <div className="card-bottom">
                  <div className="card-title">{h.title}</div>
                  <div className="card-subtitle">{h.subtitle}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quote */}
      <section className="quote-section">
        <div>
          <div className="quote-text">
            "We do not stop playing because we grow old,<br />
            we grow old because we stop playing."
          </div>
          <div className="quote-attr">— George Bernard Shaw</div>
        </div>
      </section>
    </div>
  )
}
