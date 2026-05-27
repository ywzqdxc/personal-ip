"use client"

import { useEffect, useState } from "react"
import { useSound } from "@/hooks/use-sound"

const hobbies = [
  {
    name: "Skateboarding",
    emoji: "🛹",
    color: "#FF6B6B",
    animation: "skate",
    description: "Riding the rails",
  },
  { name: "Origami", emoji: "🦢", color: "#4ECDC4", animation: "fold", description: "Folding paper art" },
  {
    name: "Cinematography",
    emoji: "🎬",
    color: "#FFE66D",
    animation: "film",
    description: "Capturing moments",
  },
  { name: "Acting", emoji: "🎭", color: "#A8E6CF", animation: "perform", description: "Living characters" },
  { name: "Dancing", emoji: "💃", color: "#FF8B94", animation: "dance", description: "Moving to rhythm" },
  {
    name: "Meme Creation",
    emoji: "😂",
    color: "#C7CEEA",
    animation: "laugh",
    description: "Making people laugh",
  },
  { name: "Powerlifting", emoji: "💪", color: "#FFDAB9", animation: "lift", description: "Building strength" },
  { name: "Running", emoji: "🏃", color: "#B4F8C8", animation: "run", description: "Chasing goals" },
  { name: "Calisthenics", emoji: "🤸", color: "#A0C4FF", animation: "flip", description: "Body mastery" },
  { name: "Cooking", emoji: "👨‍🍳", color: "#FFB4A2", animation: "cook", description: "Culinary creativity" },
  {
    name: "Programming",
    emoji: "💻",
    color: "#B9FBC0",
    animation: "code",
    description: "Building solutions",
  },
  {
    name: "Relearning",
    emoji: "📚",
    color: "#D4A5A5",
    animation: "study",
    description: "Growing daily",
  },
]

export function HobbyCharacters() {
  const [visibleCards, setVisibleCards] = useState<number[]>([])
  const playSound = useSound()

  useEffect(() => {
    // Stagger animation on mount
    hobbies.forEach((_, index) => {
      setTimeout(() => {
        setVisibleCards((prev) => [...prev, index])
      }, index * 100)
    })
  }, [])

  return (
    <div className="w-full">
      <h3 className="text-2xl md:text-3xl font-bold mb-8 text-center">My Hobbies & Passions</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {hobbies.map((hobby, index) => (
          <div
            key={hobby.name}
            className={`hobby-card relative group cursor-pointer transition-all duration-500 ${
              visibleCards.includes(index) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            onMouseEnter={() => playSound("hover")}
          >
            <div
              className="relative p-6 rounded-2xl border border-border bg-card/80 backdrop-blur-sm 
                         hover:scale-105 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300
                         flex flex-col items-center justify-center text-center gap-3 h-full min-h-[180px]"
              style={{
                borderColor: hobby.color + "40",
              }}
            >
              {/* Animated Character */}
              <div
                className={`text-5xl md:text-6xl animate-${hobby.animation} filter drop-shadow-lg group-hover:scale-110 transition-transform duration-300`}
                style={{
                  textShadow: `0 0 20px ${hobby.color}80`,
                }}
              >
                {hobby.emoji}
              </div>

              {/* Hobby Name */}
              <div className="space-y-1">
                <h4 className="font-bold text-base md:text-lg text-foreground group-hover:text-primary transition-colors">
                  {hobby.name}
                </h4>
                <p className="text-xs text-muted-foreground">{hobby.description}</p>
              </div>

              {/* Glow effect on hover */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl"
                style={{
                  background: `radial-gradient(circle at center, ${hobby.color}, transparent 70%)`,
                }}
              />

              {/* Sparkles effect */}
              <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
                <div
                  className="sparkle absolute w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100"
                  style={{
                    top: "20%",
                    left: "20%",
                    animation: "sparkle 2s ease-in-out infinite",
                  }}
                />
                <div
                  className="sparkle absolute w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100"
                  style={{
                    top: "60%",
                    right: "20%",
                    animation: "sparkle 2s ease-in-out infinite 0.5s",
                  }}
                />
                <div
                  className="sparkle absolute w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100"
                  style={{
                    bottom: "20%",
                    left: "50%",
                    animation: "sparkle 2s ease-in-out infinite 1s",
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
