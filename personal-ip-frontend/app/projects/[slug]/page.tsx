'use client'

import { use } from 'react'
import { useRouter } from 'next/navigation'
import projectsData from '@/data/projects.json'
import Link from 'next/link'

// ───── Types ─────
interface Project {
  id: string
  title: string
  subtitle: string
  description: string
  image: string
  tags: string[]
  category?: string
  featured?: boolean
  link?: string
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

.anim-hero    { animation: fadeIn 0.8s ease both;               animation-delay: 0.05s; }
.anim-meta    { animation: fadeUp 0.5s ease both;               animation-delay: 0.15s; }
.anim-title   { animation: fadeUp 0.5s ease both;               animation-delay: 0.20s; }
.anim-desc    { animation: fadeUp 0.5s ease both;               animation-delay: 0.25s; }
.anim-tags    { animation: fadeUp 0.5s ease both;               animation-delay: 0.30s; }
.anim-links   { animation: fadeUp 0.5s ease both;               animation-delay: 0.35s; }
.anim-extra   { animation: fadeUp 0.5s ease both;               animation-delay: 0.40s; }

.tag-pill {
  transition: all 0.2s;
}
.tag-pill:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(196,90,48,0.2);
}

.link-btn {
  transition: all 0.25s;
}
.link-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(196,90,48,0.2);
}

.back-link {
  transition: all 0.2s;
}
.back-link:hover {
  transform: translateX(-3px);
  color: #C45A30 !important;
}
`

// ───── Tag Colors ─────
const TAG_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  '3D 建模':        { bg: '#EEF4FF', text: '#2B3A5E', border: '#C8D8F5' },
  'SketchUp':       { bg: '#FFF0E8', text: '#C45A30', border: '#F0C8B0' },
  '农业':           { bg: '#F0F8F0', text: '#2E6A2E', border: '#C8E8C8' },
  '可持续发展':     { bg: '#F0F8F4', text: '#3A7A4A', border: '#C0E0C8' },
  '供应链':         { bg: '#FFF8F0', text: '#8A5A30', border: '#E8D0B8' },
  '食品加工':       { bg: '#FFF4EE', text: '#9A5030', border: '#F0D0B8' },
  '市场营销':       { bg: '#F8F0FF', text: '#5A3A8A', border: '#D8C8F0' },
  '园艺':           { bg: '#F4F8F0', text: '#4A7A3A', border: '#D0E0C0' },
  '有机种植':       { bg: '#F0F8EE', text: '#3A6A2A', border: '#C8E0B8' },
  '嫁接技术':       { bg: '#F8F4F0', text: '#6A4A2A', border: '#E0D0B8' },
  'WordPress':      { bg: '#EEF4FF', text: '#2A4A8A', border: '#C0D0F0' },
  'Shopify':        { bg: '#F0FFF0', text: '#2A6A3A', border: '#C0E8C0' },
  '电商':           { bg: '#FFF4EE', text: '#B05020', border: '#F0C8A8' },
  'Web 开发':       { bg: '#F4F0FF', text: '#4A3A8A', border: '#D0C8F0' },
  'JavaScript':     { bg: '#FFFDE8', text: '#8A7A00', border: '#E0D8A0' },
  'CSS':            { bg: '#F0F4FF', text: '#3A4A8A', border: '#C8D4F0' },
  'HTML':           { bg: '#FFF0E8', text: '#B05020', border: '#F0C0A0' },
  'Tailwind CSS':   { bg: '#F0F8FF', text: '#2A6A8A', border: '#C0E0F0' },
  '游戏开发':       { bg: '#FFF0F8', text: '#8A2A6A', border: '#E8C0D8' },
  '交互':           { bg: '#F8F8F0', text: '#5A5A20', border: '#D8D8B0' },
  'UI 设计':        { bg: '#F4F0FF', text: '#4A3A8A', border: '#D0C8F0' },
  '认证':           { bg: '#FFF4F0', text: '#8A3A2A', border: '#E8C8B0' },
  '前端':           { bg: '#F0F4F8', text: '#3A5A8A', border: '#C0D0E8' },
  '博客':           { bg: '#F8F4F0', text: '#6A4A2A', border: '#D8C8B0' },
  'CMS':            { bg: '#F0F4F8', text: '#4A4A8A', border: '#C8D0E8' },
  'SEO':            { bg: '#F8FFF0', text: '#4A7A2A', border: '#D0E8B8' },
  '社交媒体':       { bg: '#FFF0F8', text: '#8A2A5A', border: '#E8C0D8' },
  '内容营销':       { bg: '#FFF8F0', text: '#8A5A2A', border: '#E8D0B0' },
  '筹款':           { bg: '#F8F0FF', text: '#6A4A8A', border: '#E0D0F0' },
  '数字策略':       { bg: '#F4F0FF', text: '#5A3A8A', border: '#D8C8F0' },
  '创意写作':       { bg: '#FFF8F0', text: '#8A5A30', border: '#E8C8A8' },
  '叙事':           { bg: '#F8F4F0', text: '#6A4A30', border: '#D8C8B0' },
  '获奖作品':       { bg: '#FFF8E0', text: '#8A6A00', border: '#E8D880' },
  '销售':           { bg: '#F4F8FF', text: '#3A4A8A', border: '#C8D8F0' },
  '品牌管理':       { bg: '#F8F0FF', text: '#5A3A8A', border: '#D8C8F0' },
  '金融科技':       { bg: '#F0F4F8', text: '#2A5A8A', border: '#C0D8F0' },
  'CSS 动画':       { bg: '#FFF0F4', text: '#8A2A4A', border: '#E8C0D0' },
  '文本分析':       { bg: '#F4F8F0', text: '#4A6A2A', border: '#D0E0C0' },
  '土壤健康':       { bg: '#F0F8EE', text: '#3A6A2A', border: '#C8E0B8' },
  '可持续农业':     { bg: '#F0F8F4', text: '#3A7A4A', border: '#C0E0C8' },
  '乡村振兴':       { bg: '#F8F4F0', text: '#5A3A30', border: '#D8C0A8' },
  '混作种植':       { bg: '#F4F8F0', text: '#4A7A3A', border: '#D0E0C0' },
  '农场管理':       { bg: '#FFF8F0', text: '#8A5A30', border: '#E8D0B8' },
  '轮作':           { bg: '#F0F8F4', text: '#3A7A4A', border: '#C0E0C8' },
}

function getTagColor(tag: string) {
  return TAG_COLORS[tag] || { bg: '#FDF6EE', text: '#5A3A2A', border: '#E8C9B0' }
}

// ───── Main ─────
export default function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const router = useRouter()

  const project = (projectsData as Project[]).find(p => p.id === slug || p.title.toLowerCase().replace(/\s+/g, '-') === slug)

  if (!project) {
    return (
      <main style={{ minHeight: '100vh', background: '#FDF6EE', paddingTop: NAV_H, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 48, color: '#2E1A0E' }}>404</h1>
        <p style={{ color: '#B07050', marginBottom: 24 }}>项目未找到。</p>
        <Link href="/projects" className="back-link" style={{ color: '#E8855A', textDecoration: 'none', fontSize: 13 }}>
          ← 返回项目列表
        </Link>
      </main>
    )
  }

  const relatedProjects = (projectsData as Project[])
    .filter(p => p.category === project.category && p.id !== project.id)
    .slice(0, 3)

  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#FDF6EE',
        paddingTop: NAV_H,
        fontFamily: 'Barlow, sans-serif',
      }}
    >
      {/* ════════ HERO COVER ════════ */}
      <div className="anim-hero" style={{ width: '100%', height: '42vh', minHeight: 320, overflow: 'hidden', position: 'relative' }}>
        <img
          src={project.image}
          alt={project.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(46,26,14,0.65) 0%, rgba(46,26,14,0.15) 50%, rgba(46,26,14,0.3) 100%)',
        }} />
      </div>

      {/* ════════ CONTENT ════════ */}
      <div style={{ maxWidth: 740, margin: '0 auto', padding: '0 24px' }}>
        {/* Back link */}
        <div className="anim-meta" style={{ marginTop: -36, marginBottom: 28, position: 'relative', zIndex: 1 }}>
          <Link
            href="/projects"
            className="back-link"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 12,
              color: '#FDF6EE',
              textDecoration: 'none',
              background: 'rgba(46,26,14,0.75)',
              backdropFilter: 'blur(8px)',
              padding: '6px 14px',
              borderRadius: 99,
              border: '1px solid rgba(255,255,255,0.15)',
            }}
          >
            ← 所有项目
          </Link>
        </div>

        {/* Subtitle / Category */}
        <div className="anim-meta" style={{ marginBottom: 8 }}>
          <span style={{
            fontSize: 11,
            letterSpacing: '0.18em',
            textTransform: 'uppercase' as const,
            color: '#E8855A',
            fontWeight: 600,
          }}>
            {project.subtitle}
          </span>
        </div>

        {/* Title */}
        <h1
          className="anim-title"
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 'clamp(36px, 6vw, 56px)',
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            color: '#2E1A0E',
            margin: '0 0 16px',
          }}
        >
          {project.title}
        </h1>

        {/* Description */}
        <p className="anim-desc" style={{ fontSize: 16, color: '#5A3A2A', lineHeight: 1.75, marginBottom: 28 }}>
          {project.description}
        </p>

        {/* Tags */}
        <div className="anim-tags" style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 28 }}>
          {project.tags.map(tag => {
            const c = getTagColor(tag)
            return (
              <span
                key={tag}
                className="tag-pill"
                style={{
                  fontSize: 12,
                  padding: '5px 14px',
                  borderRadius: 99,
                  background: c.bg,
                  color: c.text,
                  border: `1px solid ${c.border}`,
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 500,
                  letterSpacing: '0.04em',
                }}
              >
                {tag}
              </span>
            )
          })}
        </div>

        {/* External link */}
        <div className="anim-links" style={{ display: 'flex', gap: 12, marginBottom: 44 }}>
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="link-btn"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 22px',
                borderRadius: 12,
                background: '#E8855A',
                color: '#FDF6EE',
                fontWeight: 600,
                fontSize: 13,
                textDecoration: 'none',
              }}
            >
              在线演示 ↗
            </a>
          )}
          <a
            href={`https://github.com/ywzqdxc`}
            target="_blank"
            rel="noopener noreferrer"
            className="link-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 22px',
              borderRadius: 12,
              border: '1px solid #E8C9B0',
              color: '#2E1A0E',
              fontSize: 13,
              textDecoration: 'none',
              background: 'transparent',
            }}
          >
            GitHub ↗
          </a>
        </div>

        {/* Divider */}
        <div style={{ width: '100%', height: 1, background: '#E8C9B0', marginBottom: 44 }} />

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <div className="anim-extra" style={{ marginBottom: 60 }}>
            <h3 style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 20,
              fontWeight: 700,
              color: '#2E1A0E',
              marginBottom: 20,
              letterSpacing: '-0.02em',
            }}>
              同类项目推荐
            </h3>
            <div className="grid md:grid-cols-3 gap-3 sm:gap-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
              {relatedProjects.map(rp => (
                <Link
                  key={rp.id}
                  href={`/projects/${rp.id}`}
                  style={{
                    display: 'block',
                    padding: '14px 16px',
                    background: '#FFF',
                    borderRadius: 12,
                    border: '1px solid #E8C9B0',
                    textDecoration: 'none',
                    transition: 'all 0.25s',
                  }}
                  className="link-btn"
                >
                  <div style={{
                    width: '100%', height: 80,
                    borderRadius: 8,
                    overflow: 'hidden',
                    marginBottom: 10,
                  }}>
                    <img src={rp.image} alt={rp.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <h4 style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontSize: 15,
                    fontWeight: 700,
                    color: '#2E1A0E',
                    margin: '0 0 4px',
                  }}>
                    {rp.title}
                  </h4>
                  <p style={{ fontSize: 11, color: '#B07050', lineHeight: 1.4 }}>
                    {rp.description.slice(0, 60)}...
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={{ padding: '40px 24px 60px', textAlign: 'center', maxWidth: 740, margin: '0 auto' }}>
        <div style={{ width: '100%', height: 1, background: '#E8C9B0', marginBottom: 24 }} />
        <p style={{ fontSize: 12, color: '#B07050' }}>
          返回 <Link href="/projects" style={{ color: '#E8855A' }}>所有项目</Link> ✨
        </p>
      </footer>

      <style>{CSS}</style>
    </main>
  )
}
