"use client"

import { useEffect, useRef, useState } from "react"

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

interface Plant {
  x: number
  y: number
  growth: number
  maxHeight: number
  type: number
}

export function BackgroundAnimations() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [scrollY, setScrollY] = useState(0)
  const starsRef = useRef<Star[]>([])
  const cometsRef = useRef<Comet[]>([])
  const plantsRef = useRef<Plant[]>([])
  const lastCometTime = useRef(0)
  const animationFrameRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Initialize stars
    const initStars = () => {
      starsRef.current = Array.from({ length: 100 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.3,
        twinkleSpeed: Math.random() * 0.02 + 0.01,
      }))
    }
    initStars()

    // Initialize plants
    const initPlants = () => {
      plantsRef.current = Array.from({ length: 15 }, () => ({
        x: Math.random() * canvas.width,
        y: canvas.height + Math.random() * 100,
        growth: 0,
        maxHeight: Math.random() * 80 + 40,
        type: Math.floor(Math.random() * 3),
      }))
    }
    initPlants()

    // Handle scroll
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener("scroll", handleScroll)

    // Draw functions
    const drawStars = () => {
      starsRef.current.forEach((star) => {
        ctx.fillStyle = `rgba(139, 154, 126, ${star.opacity})`
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fill()

        // Twinkle effect
        star.opacity += star.twinkleSpeed
        if (star.opacity > 0.8 || star.opacity < 0.3) {
          star.twinkleSpeed *= -1
        }
      })
    }

    const drawComets = (time: number) => {
      // Spawn new comet occasionally
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

      // Draw and update comets
      cometsRef.current = cometsRef.current.filter((comet) => {
        const gradient = ctx.createLinearGradient(
          comet.x,
          comet.y,
          comet.x - Math.cos(comet.angle) * comet.length,
          comet.y - Math.sin(comet.angle) * comet.length,
        )
        gradient.addColorStop(0, `rgba(139, 154, 126, ${comet.opacity})`)
        gradient.addColorStop(1, "rgba(139, 154, 126, 0)")

        ctx.strokeStyle = gradient
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(comet.x, comet.y)
        ctx.lineTo(comet.x - Math.cos(comet.angle) * comet.length, comet.y - Math.sin(comet.angle) * comet.length)
        ctx.stroke()

        comet.x += Math.cos(comet.angle) * comet.speed
        comet.y += Math.sin(comet.angle) * comet.speed
        comet.opacity -= 0.01

        return comet.y < canvas.height + 100 && comet.opacity > 0
      })
    }

    const drawPlants = () => {
      const scrollProgress = Math.min(scrollY / 3000, 1)
      const isScrollingDown = scrollProgress > 0.1

      plantsRef.current.forEach((plant) => {
        // Plant grows when scrolling down, withers when scrolling up
        if (isScrollingDown) {
          plant.growth = Math.min(plant.growth + 0.5, plant.maxHeight * scrollProgress)
        } else {
          plant.growth = Math.max(plant.growth - 0.8, 0)
        }

        if (plant.growth > 0) {
          const plantHealth = plant.growth / plant.maxHeight
          const green = Math.floor(100 + plantHealth * 120)
          const alpha = plantHealth * 0.6

          ctx.strokeStyle = `rgba(${50 + plantHealth * 40}, ${green}, ${50 + plantHealth * 30}, ${alpha})`
          ctx.lineWidth = 2
          ctx.lineCap = "round"

          // Draw stem
          ctx.beginPath()
          ctx.moveTo(plant.x, plant.y)
          ctx.lineTo(plant.x, plant.y - plant.growth)
          ctx.stroke()

          // Draw leaves based on plant type
          if (plant.type === 0) {
            // Simple leaves
            for (let i = 0; i < plant.growth / 20; i++) {
              const leafY = plant.y - i * 20
              ctx.beginPath()
              ctx.moveTo(plant.x, leafY)
              ctx.lineTo(plant.x - 10, leafY - 8)
              ctx.stroke()
              ctx.beginPath()
              ctx.moveTo(plant.x, leafY)
              ctx.lineTo(plant.x + 10, leafY - 8)
              ctx.stroke()
            }
          } else if (plant.type === 1) {
            // Curved leaves
            for (let i = 0; i < plant.growth / 15; i++) {
              const leafY = plant.y - i * 15
              ctx.beginPath()
              ctx.arc(plant.x - 8, leafY, 5, 0, Math.PI * 2)
              ctx.fill()
              ctx.beginPath()
              ctx.arc(plant.x + 8, leafY, 5, 0, Math.PI * 2)
              ctx.fill()
            }
          } else {
            // Flower at top when fully grown
            if (plantHealth > 0.8) {
              ctx.fillStyle = `rgba(224, 120, 86, ${alpha})`
              ctx.beginPath()
              ctx.arc(plant.x, plant.y - plant.growth, 4, 0, Math.PI * 2)
              ctx.fill()
            }
          }
        }
      })
    }

    // Animation loop
    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      drawStars()
      drawComets(time)
      drawPlants()

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("scroll", handleScroll)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [scrollY])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" style={{ mixBlendMode: "screen" }} />
}
