'use client'

import { useRef, useState, type ReactNode } from 'react'
import { motion, useMotionValue, useSpring, useMotionValueEvent } from 'framer-motion'

interface TiltCardProps {
  children: ReactNode
  className?: string
  tiltDegree?: number
  glareColor?: string
}

/**
 * 3D Tilt Card — 卡片跟随鼠标位置 3D 倾斜
 *
 * - 使用 framer-motion useMotionValue + useSpring 做平滑动画
 * - 带光泽效果（鼠标位置反射高光）
 * - 透视 1000px 以获得自然 3D 感
 */
export function TiltCard({
  children,
  className = '',
  tiltDegree = 8,
  glareColor = 'rgba(255,255,255,0.15)',
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 })

  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const glareX = useMotionValue(50)
  const glareY = useMotionValue(50)

  const springRotateX = useSpring(rotateX, { stiffness: 200, damping: 20 })
  const springRotateY = useSpring(rotateY, { stiffness: 200, damping: 20 })

  // 监听光泽位置变化，更新 state 用于 CSS background
  useMotionValueEvent(glareX, 'change', (v) => {
    setGlarePos((prev) => ({ ...prev, x: v }))
  })
  useMotionValueEvent(glareY, 'change', (v) => {
    setGlarePos((prev) => ({ ...prev, y: v }))
  })

  function handleMouseMove(e: React.MouseEvent) {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const posX = e.clientX - centerX
    const posY = e.clientY - centerY

    const rotY = (posX / (rect.width / 2)) * tiltDegree
    const rotX = -(posY / (rect.height / 2)) * tiltDegree

    rotateX.set(rotX)
    rotateY.set(rotY)

    const gX = 50 + (posX / (rect.width / 2)) * 40
    const gY = 50 + (posY / (rect.height / 2)) * 40
    glareX.set(gX)
    glareY.set(gY)
  }

  function handleMouseLeave() {
    rotateX.set(0)
    rotateY.set(0)
    glareX.set(50)
    glareY.set(50)
  }

  return (
    <motion.div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      style={{
        perspective: 1000,
        transformStyle: 'preserve-3d',
        rotateX: springRotateX,
        rotateY: springRotateY,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}

      {/* 光泽 overlay — 用 state 驱动 CSS */}
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, ${glareColor}, transparent 60%)`,
        }}
      />
    </motion.div>
  )
}
