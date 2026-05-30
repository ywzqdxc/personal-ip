'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
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

// ─────────────── CSS (inline style sheet) ───────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;700;800&family=Barlow:wght@300;400;500;600&display=swap');

.gold-line { width: 28px; height: 1.5px; background: #B07050; border-radius: 1px; }

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes cinemaZoomOut {
  from { opacity: 0; transform: scale(1.12); }
  to   { opacity: 1; transform: scale(1); }
}

.anim-header  { animation: fadeUp 0.6s ease both;           animation-delay: 0.05s; }
.anim-desc   { animation: fadeUp 0.6s ease both;            animation-delay: 0.12s; }
.anim-cat    { animation: fadeUp 0.5s ease both; }

.category-header:hover .cat-line {
  transform: scaleX(1.03);
  background: #E8855A !important;
}

.cinema-slide { animation: cinemaZoomOut 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) both; }

.dot-btn { transition: all 0.25s; }
.dot-btn:hover { background: #E8855A !important; }

.carousel-arrow { transition: all 0.3s ease; }
.carousel-arrow:hover {
  background: rgba(0,0,0,0.45) !important;
  border-color: rgba(255,255,255,0.45) !important;
  transform: translateY(-50%) scale(1.08) !important;
}
`

// ─────────────── Cinema Carousel ───────────────
const AUTO_INTERVAL = 5000

function CinemaCarousel({ projects, onProjectClick }: { projects: Project[]; onProjectClick: (p: Project) => void }) {
  const [current, setCurrent] = useState(0)
  const [prevSlide, setPrevSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const goTo = useCallback((idx: number) => {
    setPrevSlide(current)
    setCurrent(idx)
  }, [current])

  const prev = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setPrevSlide(current)
    setCurrent(s => (s - 1 + projects.length) % projects.length)
  }, [current, projects.length])

  const next = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setPrevSlide(current)
    setCurrent(s => (s + 1) % projects.length)
  }, [current, projects.length])

  // Auto-rotate
  useEffect(() => {
    if (isPaused || projects.length <= 1) return
    timerRef.current = setInterval(() => {
      setPrevSlide(s => s)
      setCurrent(s => (s + 1) % projects.length)
    }, AUTO_INTERVAL)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [isPaused, projects.length])

  const project = projects[current]
  if (!project) return null

  return (
    <section style={{ padding: '14px 60px 0' }}>
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '52vh',
          minHeight: 360,
          maxHeight: 520,
          borderRadius: 20,
          overflow: 'hidden',
          cursor: 'pointer',
        }}
        onClick={() => onProjectClick(project)}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Slide images */}
        {projects.map((p, i) => {
          const isActive = i === current
          const isLeaving = i === prevSlide && i !== current
          return (
            <div
              key={p.id}
              style={{
                position: 'absolute', inset: 0,
                opacity: isActive ? 1 : 0,
                transform: isActive ? 'scale(1)' : isLeaving ? 'scale(1.08)' : 'scale(1.12)',
                transition: 'opacity 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                zIndex: isActive ? 1 : 0,
              }}
            >
              <img
                src={p.image}
                alt={p.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          )
        })}

        {/* Dark overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.25) 100%)',
          zIndex: 2, pointerEvents: 'none',
        }} />

        {/* Center text */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 3,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'none',
        }}>
          <div
            key={current}
            className="cinema-slide"
            style={{ textAlign: 'center', padding: '0 40px' }}
          >
            <div style={{
              fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase' as const,
              color: 'rgba(255,255,255,0.7)', marginBottom: 12,
            }}>
              ⭐ 精选
            </div>
            <h2 style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 'clamp(28px, 4.5vw, 52px)',
              fontWeight: 800,
              color: '#FFF',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              margin: '0 0 10px',
              textShadow: '0 2px 16px rgba(0,0,0,0.4)',
            }}>
              {project.title}
            </h2>
            <p style={{
              fontSize: 'clamp(12px, 1.2vw, 15px)',
              color: 'rgba(255,255,255,0.85)',
              maxWidth: 560,
              margin: '0 auto 16px',
              lineHeight: 1.6,
              textShadow: '0 1px 8px rgba(0,0,0,0.5)',
            }}>
              {project.description}
            </p>
            <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
              {project.tags.slice(0, 5).map(tag => (
                <span key={tag} style={{
                  fontSize: 11, padding: '4px 12px', borderRadius: 99,
                  background: 'rgba(255,255,255,0.15)',
                  backdropFilter: 'blur(4px)',
                  color: 'rgba(255,255,255,0.9)',
                  border: '1px solid rgba(255,255,255,0.2)',
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Dot indicators */}
        <div style={{
          position: 'absolute', bottom: 20, left: '50%',
          transform: 'translateX(-50%)', zIndex: 4,
          display: 'flex', gap: 8,
        }}>
          {projects.map((_, i) => (
            <button
              key={i}
              className="dot-btn"
              onClick={e => { e.stopPropagation(); goTo(i) }}
              style={{
                width: i === current ? 24 : 8,
                height: 8,
                borderRadius: 4,
                border: 'none',
                background: i === current ? '#E8855A' : 'rgba(255,255,255,0.4)',
                cursor: 'pointer',
                padding: 0,
              }}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Left / Right arrows */}
        {projects.length > 1 && (
          <>
            <button
              className="carousel-arrow carousel-arrow-left"
              onClick={prev}
              aria-label="Previous slide"
              style={{
                position: 'absolute',
                left: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 4,
                width: 40,
                height: 40,
                borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.25)',
                background: 'rgba(0,0,0,0.25)',
                backdropFilter: 'blur(4px)',
                color: '#FFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              className="carousel-arrow carousel-arrow-right"
              onClick={next}
              aria-label="Next slide"
              style={{
                position: 'absolute',
                right: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 4,
                width: 40,
                height: 40,
                borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.25)',
                background: 'rgba(0,0,0,0.25)',
                backdropFilter: 'blur(4px)',
                color: '#FFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 0,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </>
        )}
      </div>
    </section>
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
        paddingTop: 72,
        fontFamily: 'Barlow, sans-serif',
      }}
    >
      {/* ════════════ FEATURED — Cinema Carousel ════════════ */}
      {featuredProjects.length > 0 && (
        <CinemaCarousel projects={featuredProjects} onProjectClick={handleProjectClick} />
      )}

      {/* ════════════ CATEGORY SECTIONS ════════════ */}
      {grouped.map((group, gi) => (
        <section key={group.key} style={{ padding: '20px 60px 0' }}>
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
      <footer style={{ padding: '36px 60px', textAlign: 'center' }}>
        <div style={{ width: '100%', height: 1, background: '#E8C9B0', marginBottom: 24 }} />
        <p style={{ fontSize: 12, color: '#B07050' }}>
          More projects in the works. Stay tuned. ✨
        </p>
      </footer>

      <style>{CSS}</style>
    </main>
  )
}
