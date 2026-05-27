"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"

const Canvas = dynamic(() => import("@react-three/fiber").then((mod) => mod.Canvas), {
  ssr: false,
})

function EarthScene() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const alienCount = Math.min(Math.floor(scrollY / 500), 8)

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* 3D Earth with CSS */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative w-64 h-64">
          {/* Earth sphere */}
          <div
            className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-600 via-green-600 to-blue-800 shadow-2xl animate-spin-slow"
            style={{
              animation: "rotate 60s linear infinite",
              boxShadow: "0 0 80px rgba(59, 130, 246, 0.5), inset 0 0 40px rgba(0, 0, 0, 0.5)",
            }}
          >
            {/* Earth texture overlay */}
            <div className="absolute inset-0 rounded-full opacity-30 bg-[url('/earth-continents-map.jpg')]" />
          </div>

          {/* Glass dome */}
          <div
            className="absolute inset-[-20%] rounded-full border-2 border-sage/30 bg-sage/5"
            style={{
              boxShadow: "inset 0 0 40px rgba(91, 138, 114, 0.2), 0 0 60px rgba(91, 138, 114, 0.1)",
            }}
          />

          {/* Glow effect */}
          <div className="absolute inset-0 rounded-full blur-3xl bg-blue-500/20 animate-pulse" />
        </div>
      </div>

      {/* Aliens/UFOs appearing on scroll */}
      {Array.from({ length: alienCount }).map((_, i) => {
        const x = 20 + (i % 4) * 20
        const y = 10 + Math.floor(i / 4) * 15
        const delay = i * 0.2

        return (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              animationDelay: `${delay}s`,
            }}
          >
            {/* UFO body */}
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 rounded-full bg-sage/80 blur-sm" />
              <div
                className="absolute inset-2 rounded-full bg-gradient-to-br from-sage to-sage-dark"
                style={{
                  boxShadow: "0 4px 20px rgba(91, 138, 114, 0.6), inset 0 -2px 10px rgba(0, 0, 0, 0.3)",
                }}
              >
                {/* UFO dome */}
                <div className="absolute top-1 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-sage/40 backdrop-blur-sm border border-sage/50" />

                {/* UFO lights */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-sage animate-pulse" />
              </div>

              {/* Beam of light */}
              <div
                className="absolute top-full left-1/2 -translate-x-1/2 w-1 h-20 bg-gradient-to-b from-sage/50 to-transparent opacity-50"
                style={{
                  clipPath: "polygon(40% 0%, 60% 0%, 100% 100%, 0% 100%)",
                }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export function ThreeScene() {
  return <EarthScene />
}
