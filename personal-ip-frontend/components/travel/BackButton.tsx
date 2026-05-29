'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface BackButtonProps {
  onClick?: () => void
}

export default function BackButton({ onClick }: BackButtonProps) {
  const router = useRouter()
  const [hovered, setHovered] = useState(false)

  return (
    <button
      onClick={onClick ?? (() => router.back())}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'fixed',
        top: 0,
        left: 48,
        height: 64,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
        zIndex: 100,
        transition: 'color 0.2s',
        color: hovered ? '#C45A30' : '#B07050',
      }}
    >
      <span style={{ fontSize: 16, lineHeight: 1 }}>←</span>
      <span style={{
        fontFamily: "'Barlow', sans-serif",
        fontSize: 11,
        letterSpacing: '0.16em',
        textTransform: 'uppercase',
        fontWeight: 500,
      }}>
        Back
      </span>
    </button>
  )
}
