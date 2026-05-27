"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function PixarCharacter() {
  const [isVisible, setIsVisible] = useState(false)
  const [hasShown, setHasShown] = useState(false)

  useEffect(() => {
    // Show character after 2 seconds on first load
    const timer = setTimeout(() => {
      if (!hasShown) {
        setIsVisible(true)
        setHasShown(true)

        // Hide after 5 seconds
        setTimeout(() => {
          setIsVisible(false)
        }, 5000)
      }
    }, 2000)

    // Show on scroll events occasionally
    const handleScroll = () => {
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100

      // Show at 25%, 50%, 75% scroll points
      if (
        (scrollPercent > 24 && scrollPercent < 26) ||
        (scrollPercent > 49 && scrollPercent < 51) ||
        (scrollPercent > 74 && scrollPercent < 76)
      ) {
        setIsVisible(true)
        setTimeout(() => setIsVisible(false), 4000)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      clearTimeout(timer)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [hasShown])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0, scale: 0.5 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 100, opacity: 0, scale: 0.5 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="fixed bottom-8 right-8 z-[100] pointer-events-none"
        >
          {/* Character Container */}
          <div className="relative">
            {/* Speech Bubble */}
            <motion.div
              initial={{ scale: 0, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 300, damping: 15 }}
              className="absolute bottom-full mb-2 right-0 bg-white rounded-2xl px-4 py-2 shadow-lg"
            >
              <div className="text-gray-900 font-medium text-sm whitespace-nowrap">Hello! 👋</div>
              <div className="absolute bottom-[-8px] right-8 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-white" />
            </motion.div>

            {/* Character */}
            <motion.div
              animate={{
                rotate: [-5, 5, -5],
              }}
              transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className="w-24 h-24 relative"
            >
              {/* Character SVG - Pixar style friendly blob */}
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-2xl">
                {/* Shadow */}
                <ellipse cx="50" cy="90" rx="20" ry="5" fill="rgba(0,0,0,0.2)" />

                {/* Body */}
                <path
                  d="M30 60 Q30 30 50 30 Q70 30 70 60 Q70 80 50 85 Q30 80 30 60"
                  fill="#5b8a72"
                  stroke="#4a7360"
                  strokeWidth="1"
                />

                {/* Eyes */}
                <g>
                  {/* Left eye white */}
                  <ellipse cx="42" cy="48" rx="6" ry="8" fill="white" />
                  {/* Left pupil */}
                  <motion.circle
                    animate={{ x: [0, 2, 0, -2, 0] }}
                    transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                    cx="42"
                    cy="50"
                    r="3"
                    fill="#1a1f2e"
                  />
                  {/* Left highlight */}
                  <circle cx="43" cy="49" r="1.5" fill="white" />

                  {/* Right eye white */}
                  <ellipse cx="58" cy="48" rx="6" ry="8" fill="white" />
                  {/* Right pupil */}
                  <motion.circle
                    animate={{ x: [0, 2, 0, -2, 0] }}
                    transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                    cx="58"
                    cy="50"
                    r="3"
                    fill="#1a1f2e"
                  />
                  {/* Right highlight */}
                  <circle cx="59" cy="49" r="1.5" fill="white" />
                </g>

                {/* Smile */}
                <motion.path
                  animate={{
                    d: ["M40 62 Q50 68 60 62", "M40 62 Q50 70 60 62", "M40 62 Q50 68 60 62"],
                  }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                  d="M40 62 Q50 68 60 62"
                  fill="none"
                  stroke="#1a1f2e"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                {/* Blush */}
                <ellipse cx="35" cy="58" rx="4" ry="3" fill="#e07856" opacity="0.3" />
                <ellipse cx="65" cy="58" rx="4" ry="3" fill="#e07856" opacity="0.3" />

                {/* Left arm waving */}
                <motion.g
                  animate={{
                    rotate: [0, 30, 0],
                    originX: "20px",
                    originY: "55px",
                  }}
                  transition={{ duration: 0.6, repeat: Number.POSITIVE_INFINITY }}
                  style={{ transformOrigin: "20px 55px" }}
                >
                  <ellipse cx="20" cy="55" rx="8" ry="4" fill="#5b8a72" stroke="#4a7360" strokeWidth="1" />
                  <circle cx="15" cy="55" r="5" fill="#5b8a72" stroke="#4a7360" strokeWidth="1" />
                </motion.g>

                {/* Right arm */}
                <ellipse cx="80" cy="55" rx="8" ry="4" fill="#5b8a72" stroke="#4a7360" strokeWidth="1" />
                <circle cx="85" cy="55" r="5" fill="#5b8a72" stroke="#4a7360" strokeWidth="1" />

                {/* Feet */}
                <ellipse cx="42" cy="87" rx="7" ry="4" fill="#5b8a72" stroke="#4a7360" strokeWidth="1" />
                <ellipse cx="58" cy="87" rx="7" ry="4" fill="#5b8a72" stroke="#4a7360" strokeWidth="1" />
              </svg>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
