"use client"

import { useEffect, useRef } from "react"

interface Star {
  x: number
  y: number
  size: number
  opacity: number
  twinkleSpeed: number
}

interface Comet {
  x: number
  y: number
  length: number
  speed: number
  angle: number
  opacity: number
}

// 萤火虫粒子
interface Firefly {
  x: number
  y: number
  vx: number          // 当前速度
  vy: number
  baseOpacity: number // 呼吸中心透明度
  opacity: number
  breathSpeed: number // 呼吸周期
  breathPhase: number // 呼吸相位偏移
  size: number
  // 游走：用两组正弦叠加模拟有机漂移
  driftAmpX: number
  driftAmpY: number
  driftFreqX: number
  driftFreqY: number
  driftPhaseX: number
  driftPhaseY: number
}

export function BackgroundAnimations() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const starsRef    = useRef<Star[]>([])
  const cometsRef   = useRef<Comet[]>([])
  const firefliesRef = useRef<Firefly[]>([])
  const lastCometTime = useRef(0)
  const animationFrameRef = useRef<number>()
  const scrollYRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // ── Canvas resize ──────────────────────────────────
    const resizeCanvas = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
      initFireflies()   // 重新铺粒子防止越界
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // ── Scroll（不触发 React re-render，用 ref）─────────
    const handleScroll = () => { scrollYRef.current = window.scrollY }
    window.addEventListener("scroll", handleScroll, { passive: true })

    // ── 初始化星星 ─────────────────────────────────────
    starsRef.current = Array.from({ length: 100 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.3,
      twinkleSpeed: Math.random() * 0.02 + 0.01,
    }))

    // ── 初始化萤火虫 ────────────────────────────────────
    function initFireflies() {
      firefliesRef.current = Array.from({ length: 28 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: 0,
        vy: 0,
        baseOpacity: Math.random() * 0.25 + 0.08,
        opacity: 0,
        breathSpeed: Math.random() * 0.008 + 0.004,
        breathPhase: Math.random() * Math.PI * 2,
        size: Math.random() * 2 + 1.2,
        driftAmpX:  Math.random() * 0.6 + 0.2,
        driftAmpY:  Math.random() * 0.4 + 0.15,
        driftFreqX: Math.random() * 0.0008 + 0.0003,
        driftFreqY: Math.random() * 0.0006 + 0.0002,
        driftPhaseX: Math.random() * Math.PI * 2,
        driftPhaseY: Math.random() * Math.PI * 2,
      }))
    }
    initFireflies()

    // ── 绘制星星 ────────────────────────────────────────
    const drawStars = () => {
      starsRef.current.forEach((star) => {
        ctx.fillStyle = `rgba(184, 133, 90, ${star.opacity})`
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fill()
        star.opacity += star.twinkleSpeed
        if (star.opacity > 0.8 || star.opacity < 0.3) star.twinkleSpeed *= -1
      })
    }

    // ── 绘制彗星 ────────────────────────────────────────
    const drawComets = (time: number) => {
      if (time - lastCometTime.current > 3000 + Math.random() * 2000) {
        cometsRef.current.push({
          x: Math.random() * canvas.width,
          y: -50,
          length: Math.random() * 80 + 40,
          speed: Math.random() * 3 + 2,
          angle: Math.random() * 0.4 + 0.2,
          opacity: 1,
        })
        lastCometTime.current = time
      }
      cometsRef.current = cometsRef.current.filter((comet) => {
        const grad = ctx.createLinearGradient(
          comet.x, comet.y,
          comet.x - Math.cos(comet.angle) * comet.length,
          comet.y - Math.sin(comet.angle) * comet.length,
        )
        grad.addColorStop(0, `rgba(184, 133, 90, ${comet.opacity})`)
        grad.addColorStop(1, "rgba(184, 133, 90, 0)")
        ctx.strokeStyle = grad
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(comet.x, comet.y)
        ctx.lineTo(
          comet.x - Math.cos(comet.angle) * comet.length,
          comet.y - Math.sin(comet.angle) * comet.length,
        )
        ctx.stroke()
        comet.x += Math.cos(comet.angle) * comet.speed
        comet.y += Math.sin(comet.angle) * comet.speed
        comet.opacity -= 0.01
        return comet.y < canvas.height + 100 && comet.opacity > 0
      })
    }

    // ── 绘制萤火虫 ──────────────────────────────────────
    const drawFireflies = (time: number) => {
      // 滚动时粒子上浮加速
      const scrollBoost = Math.min(scrollYRef.current * 0.0004, 0.6)

      firefliesRef.current.forEach((ff) => {
        // 有机游走：两频率正弦叠加
        const driftX = Math.sin(time * ff.driftFreqX + ff.driftPhaseX) * ff.driftAmpX
        const driftY = Math.sin(time * ff.driftFreqY + ff.driftPhaseY) * ff.driftAmpY
        ff.x += driftX
        ff.y += driftY - scrollBoost  // 滚动时向上偏移

        // 边界环绕（柔和，从对侧重新进入）
        if (ff.x < -20)  ff.x = canvas.width  + 20
        if (ff.x > canvas.width  + 20) ff.x = -20
        if (ff.y < -20)  ff.y = canvas.height + 20
        if (ff.y > canvas.height + 20) ff.y = -20

        // 呼吸闪烁
        const breath = Math.sin(time * ff.breathSpeed + ff.breathPhase)
        ff.opacity = ff.baseOpacity + breath * ff.baseOpacity * 0.7

        // 绘制：核心点 + 外层光晕
        // 光晕（大、模糊）
        const glow = ctx.createRadialGradient(ff.x, ff.y, 0, ff.x, ff.y, ff.size * 6)
        glow.addColorStop(0,   `rgba(232, 133, 90, ${ff.opacity * 0.55})`)
        glow.addColorStop(0.4, `rgba(196, 90,  48, ${ff.opacity * 0.18})`)
        glow.addColorStop(1,   `rgba(196, 90,  48, 0)`)
        ctx.fillStyle = glow
        ctx.beginPath()
        ctx.arc(ff.x, ff.y, ff.size * 6, 0, Math.PI * 2)
        ctx.fill()

        // 核心亮点
        ctx.fillStyle = `rgba(255, 220, 160, ${ff.opacity * 1.1})`
        ctx.beginPath()
        ctx.arc(ff.x, ff.y, ff.size * 0.55, 0, Math.PI * 2)
        ctx.fill()
      })
    }

    // ── 动画主循环 ──────────────────────────────────────
    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      drawStars()
      drawComets(time)
      drawFireflies(time)
      animationFrameRef.current = requestAnimationFrame(animate)
    }
    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("scroll", handleScroll)
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
    }
  }, [])   // 空依赖：scroll 改用 ref，不再触发重新绑定

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ mixBlendMode: "screen" }}
    />
  )
}
