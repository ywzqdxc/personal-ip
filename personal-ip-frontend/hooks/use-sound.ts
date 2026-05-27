"use client"

import { useCallback, useRef } from "react"
import { SoundPlayer } from "@/lib/sound-data"

export function useSound() {
  const soundPlayer = useRef<SoundPlayer | null>(null)

  const getPlayer = useCallback(() => {
    if (!soundPlayer.current) {
      soundPlayer.current = new SoundPlayer()
    }
    return soundPlayer.current
  }, [])

  const playSound = useCallback(
    (soundType: "pop" | "hover", volume = 0.3) => {
      try {
        const player = getPlayer()

        if (soundType === "pop") {
          player.playPop(volume)
        } else if (soundType === "hover") {
          player.playHover(volume)
        }
      } catch (error) {
        console.log("[v0] Error playing sound:", error)
      }
    },
    [getPlayer],
  )

  return { playSound }
}
