'use client'

import { useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import projectsData from '@/data/projects.json'
import { ProjectGridCard } from '@/components/projects/ProjectGridCard'

// ─────────────── Types ───────────────
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

// ─────────────── Constants ───────────────
const NAV_H = 80

const CATEGORY_CONFIG: Record<string, { emoji: string; label: string; color: string }> = {
  agriculture: { emoji: '🌾', label: 'Agriculture & Sustainability', color: '#4A9B8E' },
  web: { emoji: '💻', label: 'Web Development', color: '#C45A30' },
  creative: { emoji: '🎨', label: 'Creative & More', color: '#8B6BB1' },
}

// Featured cards use different gradient backgrounds
const FEATURED_THEMES = [
  { bg: 'linear-gradient(135deg, #2E1A0E 0%, #4A2A1A 100%)', accent: '#E8855A', text: '#FDF6EE', sub: '#B09080', tagBg: 'rgba(232,133,90,0.18)', tagText: '#E8C9B0' },
  { bg: 'linear-gradient(135deg, #C45A30 0%, #E8855A 100%)', accent: '#FFF8F0', text: '#FFF', sub: 'rgba(255,255,255,0.8)', tagBg: 'rgba(255,255,255,0.18)', tagText: '#FFF8F0' },
  { bg: 'linear-gradient(135deg, #2B3A5E 0%, #4A7090 100%)', accent: '#A0C8E8', text: '#E8EEFF', sub: 'rgba(232,238,255,0.7)', tagBg: 'rgba(160,200,232,0.15)', tagText: '#C8DDF0' },
  { bg: 'linear-gradient(135deg, #1A3A2A 0%, #2E6A4E 100%)', accent: '#8ED8A0', text: '#E8F8EC', sub: 'rgba(232,248,236,0.7)', tagBg: 'rgba(142,216,160,0.15)', tagText: '#B8E8C4' },
]

// ─────────────── CSS (inline style sheet) ───────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;700;800&family=Barlow:wght@300;400;500;600&display=swap');

.gold-line { width: 28px; height: 1.5px; background: #B07050; border-radius: 1px; }

.featured-card {
  cursor: pointer;
  will-change: transform, box-shadow;
  transition: box-shadow 0.35s ease, transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.featured-card:hover {
  box-shadow: 0 24px 64px rgba(0,0,0,0.25) !important;
  z-index: 20 !important;
}
.featured-card:not(:hover) {
  z-index: auto;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

.anim-header  { animation: fadeUp 0.6s ease both;                         animation-delay: 0.05s; }
.anim-desc   { animation: fadeUp 0.6s ease both;                         animation-delay: 0.12s; }
.anim-ft1    { animation: fadeUp 0.5s ease both;                         animation-delay: 0.20s; }
.anim-ft2    { animation: fadeUp 0.5s ease both;                         animation-delay: 0.30s; }
.anim-ft3    { animation: fadeUp 0.5s ease both;                         animation-delay: 0.40s; }
.anim-cat    { animation: fadeUp 0.5s ease both; }

.category-header:hover .cat-line {
  transform: scaleX(1.03);
  background: #E8855A !important;
}
`

// ─────────────── Featured Card Component ───────────────
function FeaturedCard({
  project,
  theme,
  tiltOffset,
  index,
  onClick,
}: {
  project: Project
  theme: typeof FEATURED_THEMES[number]
  tiltOffset: number
  index: number
  onClick: () => void
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const cx = rect.width / 2
    const cy = rect.height / 2
    const maxTilt = 10
    setTilt({
      rx: -((y - cy) / cy) * maxTilt,
      ry: ((x - cx) / cx) * maxTilt,
    })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setTilt({ rx: 0, ry: 0 })
    setIsHovered(false)
  }, [])

  const animClass = `anim-ft${index + 1}`

  return (
    <div
      ref={cardRef}
      className={`featured-card ${animClass}`}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'absolute',
        left: `${tiltOffset * 38}px`,
        top: `${tiltOffset * 22}px`,
        width: 'calc(90% - 20px)',
        height: 220,
        borderRadius: 18,
        padding: '24px 28px',
        display: 'flex',
        gap: 20,
        alignItems: 'flex-end',
        background: theme.bg,
        transform: isHovered
          ? `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) translateY(-6px) scale(1.03)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)',
        zIndex: isHovered ? 20 : 10 - tiltOffset,
        boxShadow: isHovered
          ? '0 24px 64px rgba(0,0,0,0.25)'
          : '0 4px 16px rgba(0,0,0,0.1)',
      }}
    >
      {/* Image thumbnail */}
      <div
        className="flex-shrink-0 rounded-xl overflow-hidden"
        style={{ width: 100, height: 100 }}
      >
        <img
          src={project.image}
          alt={project.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          loading="lazy"
        />
      </div>

      {/* Text content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: 10,
            letterSpacing: '0.16em',
            textTransform: 'uppercase' as const,
            color: theme.accent,
            marginBottom: 4,
          }}
        >
          ⭐ Featured
        </div>
        <h3
          style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 22,
            fontWeight: 800,
            color: theme.text,
            lineHeight: 1.1,
            margin: '0 0 4px',
            letterSpacing: '-0.02em',
          }}
        >
          {project.title}
        </h3>
        <p
          style={{
            fontSize: 12,
            color: theme.sub,
            lineHeight: 1.5,
            margin: '0 0 10px',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          } as React.CSSProperties}
        >
          {project.description}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {project.tags.slice(0, 4).map(tag => (
            <span
              key={tag}
              style={{
                fontSize: 10,
                padding: '1px 8px',
                borderRadius: 99,
                background: theme.tagBg,
                color: theme.tagText,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Arrow indicator */}
      <div
        style={{
          position: 'absolute',
          top: 18,
          right: 20,
          fontSize: 16,
          color: theme.accent,
          opacity: isHovered ? 0.8 : 0.4,
          transition: 'opacity 0.3s, transform 0.3s',
          transform: isHovered ? 'translateX(3px) translateY(-3px)' : 'none',
        }}
      >
        ↗
      </div>
    </div>
  )
}

// ─────────────── Main Page ───────────────
export default function ProjectsPage() {
  const router = useRouter()

  const allProjects = projectsData as Project[]
  const featuredProjects = allProjects.filter(p => p.featured)
  const nonFeatured = allProjects.filter(p => !p.featured)

  // Group non-featured by category
  const categories = ['agriculture', 'web', 'creative']
  const grouped = categories.map(cat => ({
    key: cat,
    config: CATEGORY_CONFIG[cat],
    projects: nonFeatured.filter(p => p.category === cat),
  })).filter(g => g.projects.length > 0)

  const handleProjectClick = (project: Project) => {
    if (project.link) {
      window.open(project.link, '_blank', 'noopener noreferrer')
    } else {
      router.push(`/projects/${project.id}`)
    }
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#FDF6EE',
        paddingTop: NAV_H,
        fontFamily: 'Barlow, sans-serif',
      }}
    >
      {/* ════════════ HEADER ════════════ */}
      <section style={{ padding: '56px 60px 0', textAlign: 'center' as const }}>
        <div className="anim-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 18 }}>
          <div className="gold-line" />
          <span
            style={{
              fontSize: 11,
              letterSpacing: '0.22em',
              textTransform: 'uppercase' as const,
              color: '#B07050',
              fontWeight: 500,
            }}
          >
            Portfolio
          </span>
        </div>

        <p className="anim-desc" style={{ fontSize: 14, color: '#B07050', whiteSpace: 'nowrap' as const, overflow: 'hidden', textOverflow: 'ellipsis' as const }}>
          Things I&apos;ve built — open source, side projects, client work, and experiments across different domains.
        </p>
      </section>

      {/* ════════════ FEATURED — Overlap Stack ════════════ */}
      <section style={{ padding: '44px 60px 0' }}>
        <div className="anim-desc" style={{ marginBottom: 20 }}>
          <span
            style={{
              fontSize: 10,
              letterSpacing: '0.18em',
              textTransform: 'uppercase' as const,
              color: '#E8855A',
              fontWeight: 600,
            }}
          >
            Featured Work
          </span>
        </div>

        <div style={{ position: 'relative', height: 280 }}>
          {featuredProjects.map((project, i) => (
            <FeaturedCard
              key={project.id}
              project={project}
              theme={FEATURED_THEMES[i % FEATURED_THEMES.length]}
              tiltOffset={i}
              index={i}
              onClick={() => handleProjectClick(project)}
            />
          ))}

          {/* Ghost placeholder card when < 3 featured */}
          {featuredProjects.length < 3 && (
            <div
              style={{
                position: 'absolute',
                left: `${featuredProjects.length * 38}px`,
                top: `${featuredProjects.length * 22}px`,
                width: 'calc(90% - 20px)',
                height: 220,
                borderRadius: 18,
                border: '2px dashed #E8C9B0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#B07050',
                fontSize: 13,
                zIndex: 0,
              }}
            >
              More coming soon...
            </div>
          )}
        </div>
      </section>

      {/* ════════════ CATEGORY SECTIONS ════════════ */}
      {grouped.map((group, gi) => (
        <section key={group.key} style={{ padding: '56px 60px 0' }}>
          {/* Category header */}
          <div
            className="category-header anim-cat"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 20,
              animationDelay: `${0.45 + gi * 0.15}s`,
            }}
          >
            <span style={{ fontSize: 22 }}>{group.config.emoji}</span>
            <h2
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: 22,
                fontWeight: 800,
                color: '#2E1A0E',
                margin: 0,
                letterSpacing: '-0.02em',
                flexShrink: 0,
              }}
            >
              {group.config.label}
            </h2>
            <div
              className="cat-line"
              style={{
                flex: 1,
                height: 1,
                background: '#E8C9B0',
                transition: 'transform 0.3s, background 0.3s',
              }}
            />
            <span
              style={{
                fontSize: 11,
                color: '#B07050',
                flexShrink: 0,
              }}
            >
              {group.projects.length} project{group.projects.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* 3-column grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 16,
            }}
          >
            {group.projects.map((project, i) => (
              <ProjectGridCard
                key={project.id}
                project={project}
                index={i}
                onClick={() => handleProjectClick(project)}
              />
            ))}
          </div>
        </section>
      ))}

      {/* ════════════ FOOTER ════════════ */}
      <footer style={{ padding: '60px', textAlign: 'center' }}>
        <div style={{ width: '100%', height: 1, background: '#E8C9B0', marginBottom: 24 }} />
        <p style={{ fontSize: 12, color: '#B07050' }}>
          More projects in the works. Stay tuned. ✨
        </p>
      </footer>

      <style>{CSS}</style>
    </main>
  )
}
