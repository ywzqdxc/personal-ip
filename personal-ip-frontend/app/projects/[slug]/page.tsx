'use client'

import { use, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import projectsData from '@/data/projects.json'
import Link from 'next/link'
import BackButton from '@/components/travel/BackButton'

// ───── Types ─────
interface StatItem   { value: string; label: string }
interface PainPoint  { icon: string; title: string; desc: string }
interface Feature    { icon: string; title: string; desc: string }
interface TechItem   { metric: string; label: string; desc: string }
interface Product    { platform: string; target: string; icon: string; features: string[] }

interface Project {
  id: string
  title: string
  subtitle: string
  description: string
  image: string
  video?: string
  tags: string[]
  category?: string
  featured?: boolean
  link?: string
  visitUrl?: string
  stats?: StatItem[]
  painPoints?: PainPoint[]
  features?: Feature[]
  techHighlights?: TechItem[]
  products?: Product[]
}

const NAV_H = 80

// ───── CSS ─────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;700;800&family=Barlow:wght@300;400;500;600&family=Caveat:wght@400;600;700&display=swap');

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes countUp {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

.anim-hero    { animation: fadeIn  0.8s ease both; animation-delay: 0.05s; }
.anim-meta    { animation: fadeUp  0.5s ease both; animation-delay: 0.15s; }
.anim-title   { animation: fadeUp  0.5s ease both; animation-delay: 0.20s; }
.anim-desc    { animation: fadeUp  0.5s ease both; animation-delay: 0.25s; }
.anim-tags    { animation: fadeUp  0.5s ease both; animation-delay: 0.30s; }
.anim-links   { animation: fadeUp  0.5s ease both; animation-delay: 0.35s; }
.anim-extra   { animation: fadeUp  0.5s ease both; animation-delay: 0.40s; }

.tag-pill { transition: all 0.2s; }
.tag-pill:hover { transform: translateY(-1px); box-shadow: 0 2px 8px rgba(196,90,48,0.2); }

.link-btn { transition: all 0.25s; }
.link-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(196,90,48,0.2); }

.back-link { transition: all 0.2s; }
.back-link:hover { transform: translateX(-3px); color: #C45A30 !important; }

.pain-card { transition: transform 0.25s, box-shadow 0.25s; }
.pain-card:hover { transform: translateY(-4px); box-shadow: 0 8px 28px rgba(46,26,14,0.1); }

.feature-card { transition: transform 0.25s, box-shadow 0.25s, border-color 0.25s; }
.feature-card:hover { transform: translateY(-4px); border-color: #C45A30 !important; box-shadow: 0 8px 28px rgba(196,90,48,0.12); }

.tech-card { transition: all 0.25s; }
.tech-card:hover { transform: translateY(-3px); box-shadow: 0 6px 24px rgba(46,26,14,0.1); }

.product-card { transition: all 0.25s; }
.product-card:hover { transform: translateY(-4px); box-shadow: 0 8px 32px rgba(46,26,14,0.12); }

.play-btn { transition: transform 0.2s, background 0.2s; }
.play-btn:hover { transform: scale(1.08); background: rgba(196,90,48,0.85) !important; }

.section-label {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: 11px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #C45A30;
  font-weight: 600;
  margin-bottom: 10px;
}
.section-title {
  font-family: 'Barlow Condensed', sans-serif;
  font-size: clamp(26px, 3.5vw, 38px);
  font-weight: 800;
  color: #2E1A0E;
  line-height: 1.1;
  letter-spacing: -0.02em;
  margin: 0 0 12px;
}
.section-sub {
  font-size: 15px;
  color: #8A6A50;
  line-height: 1.65;
  max-width: 560px;
}
`

// ───── Tag Colors ─────
const TAG_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'IoT':           { bg: '#E8F4FF', text: '#1A5A8A', border: '#B8D8F0' },
  'YOLO v12':      { bg: '#F0FFF4', text: '#1A6A3A', border: '#B0E8C0' },
  '大语言模型':    { bg: '#F4F0FF', text: '#4A2A8A', border: '#D0C0F0' },
  'GIS':           { bg: '#FFF8E8', text: '#7A5A00', border: '#E8D880' },
  'React':         { bg: '#F0F8FF', text: '#1A5A8A', border: '#B0D8F0' },
  '城市安全':      { bg: '#FFF0F0', text: '#8A2A2A', border: '#F0C0C0' },
  '3D 建模':       { bg: '#EEF4FF', text: '#2B3A5E', border: '#C8D8F5' },
  'SketchUp':      { bg: '#FFF0E8', text: '#C45A30', border: '#F0C8B0' },
  '农业':          { bg: '#F0F8F0', text: '#2E6A2E', border: '#C8E8C8' },
  '可持续发展':    { bg: '#F0F8F4', text: '#3A7A4A', border: '#C0E0C8' },
  '供应链':        { bg: '#FFF8F0', text: '#8A5A30', border: '#E8D0B8' },
  '食品加工':      { bg: '#FFF4EE', text: '#9A5030', border: '#F0D0B8' },
  '市场营销':      { bg: '#F8F0FF', text: '#5A3A8A', border: '#D8C8F0' },
  '园艺':          { bg: '#F4F8F0', text: '#4A7A3A', border: '#D0E0C0' },
  '有机种植':      { bg: '#F0F8EE', text: '#3A6A2A', border: '#C8E0B8' },
  '嫁接技术':      { bg: '#F8F4F0', text: '#6A4A2A', border: '#E0D0B8' },
  'WordPress':     { bg: '#EEF4FF', text: '#2A4A8A', border: '#C0D0F0' },
  'Shopify':       { bg: '#F0FFF0', text: '#2A6A3A', border: '#C0E8C0' },
  '电商':          { bg: '#FFF4EE', text: '#B05020', border: '#F0C8A8' },
  'Web 开发':      { bg: '#F4F0FF', text: '#4A3A8A', border: '#D0C8F0' },
  'JavaScript':    { bg: '#FFFDE8', text: '#8A7A00', border: '#E0D8A0' },
  'CSS':           { bg: '#F0F4FF', text: '#3A4A8A', border: '#C8D4F0' },
  'HTML':          { bg: '#FFF0E8', text: '#B05020', border: '#F0C0A0' },
  'Tailwind CSS':  { bg: '#F0F8FF', text: '#2A6A8A', border: '#C0E0F0' },
  '游戏开发':      { bg: '#FFF0F8', text: '#8A2A6A', border: '#E8C0D8' },
  '交互':          { bg: '#F8F8F0', text: '#5A5A20', border: '#D8D8B0' },
  'UI 设计':       { bg: '#F4F0FF', text: '#4A3A8A', border: '#D0C8F0' },
  '认证':          { bg: '#FFF4F0', text: '#8A3A2A', border: '#E8C8B0' },
  '前端':          { bg: '#F0F4F8', text: '#3A5A8A', border: '#C0D0E8' },
  '博客':          { bg: '#F8F4F0', text: '#6A4A2A', border: '#D8C8B0' },
  'CMS':           { bg: '#F0F4F8', text: '#4A4A8A', border: '#C8D0E8' },
  'SEO':           { bg: '#F8FFF0', text: '#4A7A2A', border: '#D0E8B8' },
  '社交媒体':      { bg: '#FFF0F8', text: '#8A2A5A', border: '#E8C0D8' },
  '内容营销':      { bg: '#FFF8F0', text: '#8A5A2A', border: '#E8D0B0' },
  '筹款':          { bg: '#F8F0FF', text: '#6A4A8A', border: '#E0D0F0' },
  '数字策略':      { bg: '#F4F0FF', text: '#5A3A8A', border: '#D8C8F0' },
  '销售':          { bg: '#F4F8FF', text: '#3A4A8A', border: '#C8D8F0' },
  '品牌管理':      { bg: '#F8F0FF', text: '#5A3A8A', border: '#D8C8F0' },
  '金融科技':      { bg: '#F0F4F8', text: '#2A5A8A', border: '#C0D8F0' },
  'CSS 动画':      { bg: '#FFF0F4', text: '#8A2A4A', border: '#E8C0D0' },
  '文本分析':      { bg: '#F4F8F0', text: '#4A6A2A', border: '#D0E0C0' },
  '土壤健康':      { bg: '#F0F8EE', text: '#3A6A2A', border: '#C8E0B8' },
  '可持续农业':    { bg: '#F0F8F4', text: '#3A7A4A', border: '#C0E0C8' },
  '乡村振兴':      { bg: '#F8F4F0', text: '#5A3A30', border: '#D8C0A8' },
  '混作种植':      { bg: '#F4F8F0', text: '#4A7A3A', border: '#D0E0C0' },
  '农场管理':      { bg: '#FFF8F0', text: '#8A5A30', border: '#E8D0B8' },
  '轮作':          { bg: '#F0F8F4', text: '#3A7A4A', border: '#C0E0C8' },
}

function getTagColor(tag: string) {
  return TAG_COLORS[tag] || { bg: '#FDF6EE', text: '#5A3A2A', border: '#E8C9B0' }
}

// ───── Video Hero ─────
function VideoHero({ project }: { project: Project }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(true)

  const toggle = () => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) { v.play(); setPlaying(true) }
    else { v.pause(); setPlaying(false) }
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '78vh', minHeight: 520, maxHeight: 860, overflow: 'hidden' }}>
      <video
        ref={videoRef}
        src={project.video}
        autoPlay muted loop playsInline
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      {/* gradient overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(10,6,3,0.82) 0%, rgba(10,6,3,0.3) 45%, rgba(10,6,3,0.45) 100%)',
        pointerEvents: 'none',
      }} />
      {/* center content */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'flex-end',
        padding: '0 32px 52px',
        pointerEvents: 'none',
      }}>
        <div style={{ textAlign: 'center', maxWidth: 720 }}>
          <div style={{ fontSize: 10, letterSpacing: '0.22em', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', marginBottom: 14 }}>
            智慧城市 · 防汛预警
          </div>
          <h1 style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 'clamp(42px, 6vw, 76px)',
            fontWeight: 800,
            color: '#fff',
            letterSpacing: '-0.03em',
            lineHeight: 1,
            margin: '0 0 14px',
            textShadow: '0 2px 20px rgba(0,0,0,0.5)',
          }}>
            {project.title}
          </h1>
          <p style={{
            fontSize: 'clamp(13px, 1.4vw, 16px)',
            color: 'rgba(255,255,255,0.8)',
            lineHeight: 1.6,
            margin: 0,
            textShadow: '0 1px 8px rgba(0,0,0,0.5)',
          }}>
            {project.subtitle}
          </p>
        </div>
      </div>
      {/* play/pause */}
      <button
        onClick={toggle}
        className="play-btn"
        style={{
          position: 'absolute', bottom: 20, right: 24, zIndex: 3,
          width: 38, height: 38, borderRadius: '50%',
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.25)',
          color: '#fff', fontSize: 14,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
        }}
        aria-label={playing ? '暂停' : '播放'}
      >
        {playing ? '⏸' : '▶'}
      </button>
    </div>
  )
}

// ───── Image Hero ─────
function ImageHero({ project }: { project: Project }) {
  return (
    <div className="anim-hero" style={{ width: '100%', height: '42vh', minHeight: 320, overflow: 'hidden', position: 'relative' }}>
      <img src={project.image} alt={project.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to top, rgba(46,26,14,0.65) 0%, rgba(46,26,14,0.15) 50%, rgba(46,26,14,0.3) 100%)',
      }} />
    </div>
  )
}

// ───── Main ─────
export default function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const router = useRouter()

  const project = (projectsData as Project[]).find(
    p => p.id === slug || p.title.toLowerCase().replace(/\s+/g, '-') === slug
  )

  if (!project) {
    return (
      <main style={{ minHeight: '100vh', background: '#FDF6EE', paddingTop: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 48, color: '#2E1A0E' }}>404</h1>
        <p style={{ color: '#B07050', marginBottom: 24 }}>项目未找到。</p>
        <Link href="/projects" className="back-link" style={{ color: '#E8855A', textDecoration: 'none', fontSize: 13 }}>
          ← 返回项目列表
        </Link>
      </main>
    )
  }

  const hasRichContent = !!(project.features || project.techHighlights || project.products)

  return (
    <main style={{ minHeight: '100vh', background: '#FDF6EE', fontFamily: 'Barlow, sans-serif' }}>
      <BackButton />

      {/* ════════ HERO ════════ */}
      {project.video ? <VideoHero project={project} /> : <ImageHero project={project} />}

      {/* ════════ STATS BAR ════════ */}
      {project.stats && (
        <div style={{
          background: '#2E1A0E',
          padding: '28px 60px',
          display: 'flex',
          justifyContent: 'center',
          gap: 'clamp(32px, 6vw, 96px)',
          flexWrap: 'wrap',
        }}>
          {project.stats.map((s, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 'clamp(28px, 4vw, 40px)',
                fontWeight: 800,
                color: '#E8855A',
                letterSpacing: '-0.02em',
                lineHeight: 1,
              }}>{s.value}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.14em', textTransform: 'uppercase', marginTop: 6 }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* ════════ OVERVIEW ════════ */}
      <div style={{ maxWidth: 820, margin: '0 auto', padding: '52px 32px 0' }}>


        {/* subtitle */}
        <div className="anim-meta" style={{ marginBottom: 8 }}>
          <span style={{ fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: '#E8855A', fontWeight: 600 }}>
            {project.subtitle}
          </span>
        </div>

        {/* title (for non-video) */}
        {!project.video && (
          <h1 className="anim-title" style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 'clamp(36px, 6vw, 56px)',
            fontWeight: 800, lineHeight: 1.05,
            letterSpacing: '-0.03em', color: '#2E1A0E',
            margin: '0 0 16px',
          }}>{project.title}</h1>
        )}

        {/* description */}
        <p className="anim-desc" style={{ fontSize: 16, color: '#5A3A2A', lineHeight: 1.8, marginBottom: 28, marginTop: project.video ? 12 : 0 }}>
          {project.description}
        </p>

        {/* tags */}
        <div className="anim-tags" style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 32 }}>
          {project.tags.map(tag => {
            const c = getTagColor(tag)
            return (
              <span key={tag} className="tag-pill" style={{
                fontSize: 12, padding: '5px 14px', borderRadius: 99,
                background: c.bg, color: c.text, border: `1px solid ${c.border}`,
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 500, letterSpacing: '0.04em',
              }}>{tag}</span>
            )
          })}
        </div>

        {/* links */}
        <div className="anim-links" style={{ display: 'flex', gap: 12, marginBottom: 52 }}>
          {project.link && (
            <a href={project.link} target="_blank" rel="noopener noreferrer" className="link-btn" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '10px 22px', borderRadius: 12,
              background: '#C45A30', color: '#FDF6EE',
              fontWeight: 600, fontSize: 13, textDecoration: 'none',
            }}>在线演示 ↗</a>
          )}
          {project.visitUrl ? (
            <a href={project.visitUrl} target="_blank" rel="noopener noreferrer" className="link-btn" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '10px 22px', borderRadius: 12,
              border: '1px solid #E8C9B0', color: '#2E1A0E',
              fontSize: 13, textDecoration: 'none', background: 'transparent',
            }}>访问地址 ↗</a>
          ) : (
            <a href="https://github.com/ywzqdxc" target="_blank" rel="noopener noreferrer" className="link-btn" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '10px 22px', borderRadius: 12,
              border: '1px solid #E8C9B0', color: '#2E1A0E',
              fontSize: 13, textDecoration: 'none', background: 'transparent',
            }}>GitHub ↗</a>
          )}
        </div>

        <div style={{ width: '100%', height: 1, background: '#E8C9B0', marginBottom: 64 }} />
      </div>

      {/* ════════ RICH CONTENT ════════ */}
      {hasRichContent && (
        <div style={{ maxWidth: 1040, margin: '0 auto', padding: '0 32px' }}>

          {/* — Pain Points — */}
          {project.painPoints && (
            <section style={{ marginBottom: 80 }}>
              <div style={{ marginBottom: 36, textAlign: 'center' }}>
                <div className="section-label">行业痛点</div>
                <h2 className="section-title">为什么需要智水先知？</h2>
                <p className="section-sub" style={{ margin: '0 auto' }}>中国 62% 城市曾遭遇内涝，传统应对体系存在三大核心缺陷。</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
                {project.painPoints.map((p, i) => (
                  <div key={i} className="pain-card" style={{
                    background: '#fff',
                    border: '1px solid #E8C9B0',
                    borderRadius: 16,
                    padding: '28px 24px',
                    borderTop: '3px solid #C45A30',
                  }}>
                    <div style={{ fontSize: 32, marginBottom: 14 }}>{p.icon}</div>
                    <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 18, fontWeight: 700, color: '#2E1A0E', margin: '0 0 10px', letterSpacing: '-0.01em' }}>{p.title}</h3>
                    <p style={{ fontSize: 14, color: '#8A6A50', lineHeight: 1.7, margin: 0 }}>{p.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* — Features — */}
          {project.features && (
            <section style={{ marginBottom: 80 }}>
              <div style={{ marginBottom: 36, textAlign: 'center' }}>
                <div className="section-label">核心功能</div>
                <h2 className="section-title">四层解决方案</h2>
                <p className="section-sub" style={{ margin: '0 auto' }}>从感知到预警，从分析到协同，构建完整的防汛响应闭环。</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20 }}>
                {project.features.map((f, i) => (
                  <div key={i} className="feature-card" style={{
                    background: '#FFF8F2',
                    border: '1.5px solid #E8C9B0',
                    borderRadius: 16,
                    padding: '28px 22px',
                  }}>
                    <div style={{ fontSize: 36, marginBottom: 16 }}>{f.icon}</div>
                    <h3 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 17, fontWeight: 700, color: '#2E1A0E', margin: '0 0 10px', letterSpacing: '-0.01em' }}>{f.title}</h3>
                    <p style={{ fontSize: 13.5, color: '#8A6A50', lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* — Tech Highlights — */}
          {project.techHighlights && (
            <section style={{ marginBottom: 80 }}>
              <div style={{ marginBottom: 36 }}>
                <div className="section-label">技术亮点</div>
                <h2 className="section-title">核心技术突破</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                {project.techHighlights.map((t, i) => (
                  <div key={i} className="tech-card" style={{
                    background: '#2E1A0E',
                    borderRadius: 16,
                    padding: '28px 22px',
                  }}>
                    <div style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontSize: 'clamp(22px, 3vw, 30px)',
                      fontWeight: 800,
                      color: '#E8855A',
                      letterSpacing: '-0.02em',
                      marginBottom: 4,
                    }}>{t.metric}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 14 }}>{t.label}</div>
                    <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, margin: 0 }}>{t.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* — Products — */}
          {project.products && (
            <section style={{ marginBottom: 80 }}>
              <div style={{ marginBottom: 36 }}>
                <div className="section-label">产品形态</div>
                <h2 className="section-title">两端协同，覆盖全链路</h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
                {project.products.map((prod, i) => (
                  <div key={i} className="product-card" style={{
                    background: '#fff',
                    border: '1px solid #E8C9B0',
                    borderRadius: 20,
                    padding: '32px 28px',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                      <div style={{
                        width: 52, height: 52, borderRadius: 14,
                        background: '#FFF0E8',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 26,
                        border: '1px solid #F0C8B0',
                      }}>{prod.icon}</div>
                      <div>
                        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 18, fontWeight: 700, color: '#2E1A0E', letterSpacing: '-0.01em' }}>{prod.platform}</div>
                        <div style={{ fontSize: 12, color: '#B07050', marginTop: 2 }}>{prod.target}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {prod.features.map((feat, j) => (
                        <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                          <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#C45A30', marginTop: 6, flexShrink: 0 }} />
                          <span style={{ fontSize: 14, color: '#5A3A2A', lineHeight: 1.5 }}>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>
      )}

      {/* ════════ FOOTER ════════ */}
      <footer style={{ padding: '40px 32px 60px', textAlign: 'center', maxWidth: 820, margin: '0 auto' }}>
        <div style={{ width: '100%', height: 1, background: '#E8C9B0', marginBottom: 24 }} />
        <p style={{ fontSize: 12, color: '#B07050' }}>More projects in the works. Stay tuned. ✨</p>
      </footer>

      <style>{CSS}</style>
    </main>
  )
}
