'use client'

import { useEffect, useRef } from 'react'

export function WelcomeAudio() {
  const playedRef = useRef(false)

  useEffect(() => {
    if (playedRef.current) return

    const audio = new Audio('/videos/welcome.wav')
    audio.volume = 0.25

    const playOnce = () => {
      if (playedRef.current) return
      playedRef.current = true

      audio.play().catch(() => {
        // autoplay blocked — silently skip
      })

      document.removeEventListener('click', playOnce)
      document.removeEventListener('touchstart', playOnce)
      document.removeEventListener('keydown', playOnce)
    }

    document.addEventListener('click', playOnce, { once: true, passive: true })
    document.addEventListener('touchstart', playOnce, { once: true, passive: true })
    document.addEventListener('keydown', playOnce, { once: true, passive: true })

    return () => {
      document.removeEventListener('click', playOnce)
      document.removeEventListener('touchstart', playOnce)
      document.removeEventListener('keydown', playOnce)
    }
  }, [])

  return null
}
