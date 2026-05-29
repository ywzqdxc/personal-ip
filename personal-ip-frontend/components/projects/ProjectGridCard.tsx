'use client'

import { useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'

interface Project {
  id: string
  title: string
  subtitle: string
  description: string
  image: string
  tags: string[]
  featured?: boolean
  link?: string
  category?: string
}

interface Props {
  project: Project
  index: number
  onClick: () => void
}

export function ProjectGridCard({ project, index, onClick }: Props) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 })
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const cx = rect.width / 2
    const cy = rect.height / 2

    // 3D tilt: max ±15°
    const maxTilt = 15
    const rx = -((y - cy) / cy) * maxTilt
    const ry = ((x - cx) / cx) * maxTilt

    setTilt({ rx, ry })
    setGlowPos({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setTilt({ rx: 0, ry: 0 })
    setGlowPos({ x: 50, y: 50 })
    setIsHovered(false)
  }, [])

  return (
    <motion.div
      ref={cardRef}
      className="relative cursor-pointer group"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: '800px',
      }}
    >
      <div
        className="relative rounded-2xl overflow-hidden border border-[#E8C9B0]/60 bg-white transition-shadow duration-300"
        style={{
          transform: isHovered
            ? `perspective(800px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`
            : 'perspective(800px) rotateX(0deg) rotateY(0deg)',
          boxShadow: isHovered
            ? `0 20px 48px rgba(196,90,48,0.18), 0 0 0 1px rgba(232,133,90,0.3)`
            : '0 1px 3px rgba(46,26,14,0.04)',
          transition: 'box-shadow 0.35s ease, border-color 0.35s ease',
        }}
      >
        {/* Image area */}
        <div className="relative h-44 overflow-hidden bg-[#F0E6DB]">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#2E1A0E]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Hover light spot */}
          {isHovered && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(circle 120px at ${glowPos.x}% ${glowPos.y}%, rgba(255,255,255,0.25) 0%, transparent 80%)`,
                opacity: 0.6,
                transition: 'opacity 0.3s',
              }}
            />
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <p className="text-[10px] uppercase tracking-[0.15em] text-[#E8855A] font-medium mb-1">
            {project.subtitle.split('&')[0].trim()}
          </p>
          <h3 className="text-base font-bold text-[#2E1A0E] mb-1.5 leading-tight group-hover:text-[#C45A30] transition-colors">
            {project.title}
          </h3>
          <p className="text-xs text-[#B07050] leading-relaxed line-clamp-2 mb-3">
            {project.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {project.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="text-[10px] px-2 py-0.5 rounded-full bg-[#FDF6EE] text-[#7A5A40] border border-[#E8C9B0]/50"
              >
                {tag}
              </span>
            ))}
            {project.tags.length > 3 && (
              <span className="text-[10px] px-2 py-0.5 text-[#B07050]">
                +{project.tags.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
