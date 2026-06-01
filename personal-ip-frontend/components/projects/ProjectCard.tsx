'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { TiltCard } from './tilt-card'
import type { LocalProject } from '@/data/local-projects'

interface Props {
  project: LocalProject
  variant?: 'featured' | 'grid'
  /** 用于 featured 错层的偏移量 (px) */
  offset?: { x: number; y: number }
  /** 用于 featured 的渐变色 */
  gradient?: string
}

const GRADIENT_MAP: Record<string, string> = {
  ai: 'linear-gradient(135deg, #2E1A0E 0%, #4A2A1A 100%)',
  fullstack: 'linear-gradient(135deg, #C45A30 0%, #E8855A 100%)',
  infra: 'linear-gradient(135deg, #4A9B8E 0%, #6EC4B8 100%)',
}

export function ProjectCard({ project, variant = 'grid', offset, gradient }: Props) {
  const [isHovered, setIsHovered] = useState(false)
  const techList = project.techStack ? project.techStack.split(',') : []
  const bgGradient = gradient ?? GRADIENT_MAP[project.category] ?? GRADIENT_MAP.ai

  if (variant === 'featured') {
    return (
      <TiltCard tiltDegree={6}>
        <Link href={`/projects/${project.slug}`}>
          <motion.div
            className="relative rounded-2xl overflow-hidden cursor-pointer"
            style={{
              background: bgGradient,
              padding: '32px 28px',
              minHeight: 220,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              transform: offset ? `translate(${offset.x}px, ${offset.y}px)` : undefined,
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{ scale: 1.03, zIndex: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            {/* 分类标签 */}
            <span
              className="absolute top-5 left-6 text-[10px] tracking-[0.16em] uppercase font-medium"
              style={{ color: 'rgba(255,255,255,0.6)' }}
            >
              {project.category === 'ai' ? '🤖 AI / ML' :
               project.category === 'fullstack' ? '💻 Full-Stack' : '🛠️ 基础设施'}
            </span>

            {/* 箭头 */}
            <motion.span
              className="absolute top-5 right-6 text-lg"
              style={{ color: 'rgba(255,255,255,0.4)' }}
              animate={{ x: isHovered ? 4 : 0, y: isHovered ? -4 : 0 }}
            >
              ↗
            </motion.span>

            {/* 内容 */}
            <div>
              <h3
                className="text-xl font-bold mb-1"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", color: '#FDF6EE' }}
              >
                {project.name}
              </h3>
              {project.description && (
                <p
                  className="text-sm leading-relaxed line-clamp-2 mb-3"
                  style={{ color: 'rgba(255,255,255,0.7)' }}
                >
                  {project.description}
                </p>
              )}
              <div className="flex flex-wrap gap-1.5">
                {techList.slice(0, 3).map((tech) => (
                  <span
                    key={tech}
                    className="text-[10px] px-2 py-0.5 rounded-full"
                    style={{
                      background: 'rgba(255,255,255,0.15)',
                      color: 'rgba(255,255,255,0.85)',
                    }}
                  >
                    {tech.trim()}
                  </span>
                ))}
                {techList.length > 3 && (
                  <span className="text-[10px] px-2 py-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    +{techList.length - 3}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        </Link>
      </TiltCard>
    )
  }

  // ===== Grid variant =====
  return (
    <TiltCard tiltDegree={8}>
      <Link href={`/projects/${project.slug}`}>
        <motion.div
          className="relative rounded-xl overflow-hidden cursor-pointer bg-white border border-[#E8C9B0]/60 h-full"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          whileHover={{ y: -4 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          {/* 预览图区 */}
          <div
            className="h-28 flex items-center justify-center overflow-hidden"
            style={{ background: '#F0E6DB' }}
          >
            {project.previewUrl ? (
              <motion.img
                src={project.previewUrl}
                alt={project.name}
                className="w-full h-full object-cover"
                animate={{ scale: isHovered ? 1.08 : 1 }}
                transition={{ duration: 0.4 }}
              />
            ) : (
              <span className="text-xs" style={{ color: '#B07050' }}>
                {project.category === 'ai' ? '🤖' : project.category === 'fullstack' ? '💻' : '🛠️'}
              </span>
            )}
          </div>

          {/* 文字内容 */}
          <div className="p-4">
            <h4
              className="text-sm font-bold mb-0.5 transition-colors"
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                color: isHovered ? '#C45A30' : '#2E1A0E',
              }}
            >
              {project.name}
            </h4>
            {project.description && (
              <p className="text-xs leading-relaxed line-clamp-2 mb-2" style={{ color: '#B07050' }}>
                {project.description}
              </p>
            )}
            <div className="flex flex-wrap gap-1">
              {techList.slice(0, 2).map((tech) => (
                <span
                  key={tech}
                  className="text-[9px] px-1.5 py-0.5 rounded-full"
                  style={{ background: '#F0E6DB', color: '#5A3A2A' }}
                >
                  {tech.trim()}
                </span>
              ))}
              {techList.length > 2 && (
                <span className="text-[9px]" style={{ color: '#B07050' }}>
                  +{techList.length - 2}
                </span>
              )}
            </div>
          </div>

          {/* Hover 右箭头 */}
          <motion.span
            className="absolute bottom-3 right-3 text-xs font-mono"
            style={{ color: '#E8855A' }}
            animate={{ x: isHovered ? 4 : 0, opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            →
          </motion.span>
        </motion.div>
      </Link>
    </TiltCard>
  )
}
