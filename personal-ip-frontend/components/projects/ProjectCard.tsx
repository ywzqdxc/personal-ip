'use client'

import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import type { Project } from '@/lib/api/projects'

interface Props {
  project: Project
}

export function ProjectCard({ project }: Props) {
  const [isHovered, setIsHovered] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const techList = project.techStack ? project.techStack.split(',') : []

  return (
    <div
      className="relative border-b border-[#E8C9B0]/60 py-6 group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
    >
      <Link href={`/projects/${project.slug}`}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-[#2E1A0E] group-hover:text-[#C45A30] transition-colors">
              {project.name}
            </h3>
            {project.description && (
              <p className="text-[#B07050] mt-1 text-sm">{project.description}</p>
            )}
            <div className="flex flex-wrap gap-2 mt-2">
              {techList.map((tech) => (
                <span
                  key={tech}
                  className="text-xs px-2 py-0.5 rounded border border-[#E8C9B0] text-[#2E1A0E] font-mono"
                >
                  {tech.trim()}
                </span>
              ))}
            </div>
          </div>
          <span className="text-[#B07050] group-hover:text-[#C45A30] transition-colors ml-4">→</span>
        </div>
      </Link>

      {/* 悬浮预览图 */}
      {project.previewUrl && isHovered && (
        <motion.div
          className="fixed pointer-events-none z-50 w-64 h-40 rounded-lg overflow-hidden shadow-2xl"
          style={{ left: mousePos.x + 20, top: mousePos.y - 80 }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.15 }}
        >
          <img
            src={project.previewUrl}
            alt={project.name}
            className="w-full h-full object-cover"
          />
        </motion.div>
      )}
    </div>
  )
}
