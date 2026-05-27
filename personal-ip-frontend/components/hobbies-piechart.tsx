"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"

const hobbies = [
  { name: "Skateboarding", value: 10, color: "hsl(var(--chart-1))" },
  { name: "Origami", value: 8, color: "hsl(var(--chart-2))" },
  { name: "Cinematography", value: 12, color: "hsl(var(--chart-3))" },
  { name: "Acting", value: 9, color: "hsl(var(--chart-4))" },
  { name: "Dancing", value: 7, color: "hsl(var(--chart-5))" },
  { name: "Meme Creation", value: 10, color: "hsl(142, 76%, 36%)" },
  { name: "Powerlifting", value: 11, color: "hsl(24, 100%, 50%)" },
  { name: "Running", value: 8, color: "hsl(262, 83%, 58%)" },
  { name: "Calisthenics", value: 9, color: "hsl(199, 89%, 48%)" },
  { name: "Cooking", value: 7, color: "hsl(340, 82%, 52%)" },
  { name: "Programming", value: 13, color: "hsl(48, 100%, 50%)" },
  { name: "Relearning", value: 6, color: "hsl(173, 80%, 40%)" },
]

export function HobbiesPieChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hoveredSlice, setHoveredSlice] = useState<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = Math.min(centerX, centerY) - 60

    // Calculate total
    const total = hobbies.reduce((sum, hobby) => sum + hobby.value, 0)

    // Draw pie chart
    let currentAngle = -Math.PI / 2

    hobbies.forEach((hobby, index) => {
      const sliceAngle = (hobby.value / total) * 2 * Math.PI

      // Draw slice
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle)
      ctx.closePath()

      // Get color value
      const tempDiv = document.createElement("div")
      tempDiv.style.color = hobby.color
      document.body.appendChild(tempDiv)
      const computedColor = getComputedStyle(tempDiv).color
      document.body.removeChild(tempDiv)

      ctx.fillStyle =
        hoveredSlice === index ? computedColor.replace("rgb", "rgba").replace(")", ", 0.8)") : computedColor
      ctx.fill()

      // Add white border between slices
      ctx.strokeStyle = "rgba(255, 255, 255, 0.3)"
      ctx.lineWidth = 2
      ctx.stroke()

      const middleAngle = currentAngle + sliceAngle / 2
      const textRadius = radius * 0.7
      const textX = centerX + Math.cos(middleAngle) * textRadius
      const textY = centerY + Math.sin(middleAngle) * textRadius

      ctx.save()
      ctx.translate(textX, textY)

      // Set text style
      ctx.fillStyle = "white"
      ctx.strokeStyle = "rgba(0, 0, 0, 0.8)"
      ctx.lineWidth = 3
      ctx.font = "bold 12px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      // Draw text with outline for better visibility
      ctx.strokeText(hobby.name, 0, 0)
      ctx.fillText(hobby.name, 0, 0)

      ctx.restore()

      currentAngle += sliceAngle
    })
  }, [hoveredSlice])

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    // Calculate angle and distance from center
    const angle = Math.atan2(y - centerY, x - centerX)
    const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2))
    const radius = Math.min(centerX, centerY) - 60

    if (distance <= radius) {
      // Normalize angle to 0-2π starting from top
      let normalizedAngle = angle + Math.PI / 2
      if (normalizedAngle < 0) normalizedAngle += 2 * Math.PI

      const total = hobbies.reduce((sum, hobby) => sum + hobby.value, 0)
      let currentAngle = 0

      for (let i = 0; i < hobbies.length; i++) {
        const sliceAngle = (hobbies[i].value / total) * 2 * Math.PI
        if (normalizedAngle >= currentAngle && normalizedAngle < currentAngle + sliceAngle) {
          setHoveredSlice(i)
          return
        }
        currentAngle += sliceAngle
      }
    } else {
      setHoveredSlice(null)
    }
  }

  return (
    <div className="w-full">
      <h3 className="text-2xl font-bold mb-6 text-center">My Hobbies & Interests</h3>
      <div className="flex flex-col lg:flex-row items-center gap-8">
        <div className="flex-shrink-0">
          <canvas
            ref={canvasRef}
            width={400}
            height={400}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoveredSlice(null)}
            className="cursor-pointer"
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 flex-1">
          {hobbies.map((hobby, index) => (
            <div
              key={hobby.name}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
              onMouseEnter={() => setHoveredSlice(index)}
              onMouseLeave={() => setHoveredSlice(null)}
            >
              <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: hobby.color }} />
              <span
                className={`text-sm ${hoveredSlice === index ? "font-semibold text-foreground" : "text-muted-foreground"}`}
              >
                {hobby.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
