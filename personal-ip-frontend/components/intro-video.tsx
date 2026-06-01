'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

/**
 * IntroVideo（GSAP 品牌动画版）
 * —— 首次访问时全屏播放品牌入场动画，结束后淡出
 * —— sessionStorage 标记：同一 Tab 内刷新不再重播
 */
export function IntroVideo() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [gone, setGone] = useState(false)

  const handleLeave = () => {
    if (!containerRef.current) return
    gsap.to(containerRef.current, {
      opacity: 0,
      duration: 0.9,
      ease: 'power2.inOut',
      onComplete: () => {
        document.documentElement.style.overflow = ''
        setGone(true)
      },
    })
  }

  useEffect(() => {
    if (sessionStorage.getItem('intro-played')) {
      setGone(true)
      return
    }

    document.documentElement.style.overflow = 'hidden'

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          sessionStorage.setItem('intro-played', '1')
          // 停顿 0.6s 后退场
          setTimeout(handleLeave, 600)
        },
      })

      tl
        // 四角线条展开
        .to('.intro-corner', {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: 'power2.out',
          stagger: 0.08,
        })
        // 横线从中央展开
        .to('.intro-line', {
          scaleX: 1,
          opacity: 1,
          duration: 0.6,
          ease: 'power2.inOut',
        }, '-=0.2')
        // 名字逐字浮现
        .to('.intro-char', {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power3.out',
          stagger: 0.06,
        }, '-=0.2')
        // 副标题淡入
        .to('.intro-sub', {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out',
        }, '-=0.1')
        // skip 按钮
        .to('.intro-skip', {
          opacity: 1,
          duration: 0.4,
        }, '-=0.2')
    }, containerRef)

    return () => ctx.revert()
  }, [])

  if (gone) return null

  const name = 'CUI XIN'.split('')

  return (
    <div
      ref={containerRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: '#0A0805',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      aria-hidden="true"
    >
      {/* 四角装饰线 */}
      {[
        { top: 32, left: 32, borderTop: '1px solid rgba(196,90,48,0.7)', borderLeft: '1px solid rgba(196,90,48,0.7)', transformOrigin: 'top left' },
        { top: 32, right: 32, borderTop: '1px solid rgba(196,90,48,0.7)', borderRight: '1px solid rgba(196,90,48,0.7)', transformOrigin: 'top right' },
        { bottom: 32, left: 32, borderBottom: '1px solid rgba(196,90,48,0.7)', borderLeft: '1px solid rgba(196,90,48,0.7)', transformOrigin: 'bottom left' },
        { bottom: 32, right: 32, borderBottom: '1px solid rgba(196,90,48,0.7)', borderRight: '1px solid rgba(196,90,48,0.7)', transformOrigin: 'bottom right' },
      ].map((s, i) => (
        <div key={i} className="intro-corner" style={{ position: 'absolute', width: 44, height: 44, opacity: 0, transform: 'scale(0.6)', ...s }} />
      ))}

      {/* 中央内容 */}
      <div style={{ textAlign: 'center', userSelect: 'none' }}>
        {/* 上横线 */}
        <div
          className="intro-line"
          style={{
            width: 120,
            height: 1,
            background: 'rgba(196,90,48,0.5)',
            margin: '0 auto 28px',
            transformOrigin: 'center',
            transform: 'scaleX(0)',
            opacity: 0,
          }}
        />

        {/* 名字逐字 */}
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 20 }}>
          {name.map((ch, i) => (
            <span
              key={i}
              className="intro-char"
              style={{
                display: 'inline-block',
                fontFamily: '"Barlow Condensed", system-ui, sans-serif',
                fontSize: ch === ' ' ? 28 : 72,
                fontWeight: 700,
                letterSpacing: '0.05em',
                color: '#EDE0D4',
                lineHeight: 1,
                width: ch === ' ' ? 20 : 'auto',
                opacity: 0,
                transform: 'translateY(40px)',
              }}
            >
              {ch === ' ' ? ' ' : ch}
            </span>
          ))}
        </div>

        {/* 副标题 */}
        <div
          className="intro-sub"
          style={{
            fontFamily: 'system-ui, sans-serif',
            fontSize: 11,
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: 'rgba(196,90,48,0.7)',
            marginBottom: 8,
            opacity: 0,
            transform: 'translateY(12px)',
          }}
        >
          Developer · Traveler · Creator
        </div>

        {/* 下横线 */}
        <div
          className="intro-line"
          style={{
            width: 120,
            height: 1,
            background: 'rgba(196,90,48,0.5)',
            margin: '20px auto 0',
            transformOrigin: 'center',
            transform: 'scaleX(0)',
            opacity: 0,
          }}
        />
      </div>

      {/* Skip 按钮 */}
      <button
        className="intro-skip"
        onClick={() => {
          sessionStorage.setItem('intro-played', '1')
          handleLeave()
        }}
        style={{
          position: 'absolute',
          bottom: 40,
          right: 48,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          color: 'rgba(232,197,176,0.5)',
          fontSize: 11,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          fontFamily: 'system-ui, sans-serif',
          padding: '8px 0',
          transition: 'color 0.3s',
          opacity: 0,
        }}
        onMouseEnter={e => (e.currentTarget.style.color = 'rgba(232,197,176,1)')}
        onMouseLeave={e => (e.currentTarget.style.color = 'rgba(232,197,176,0.5)')}
      >
        skip
        <span style={{ display: 'inline-block', width: 20, height: 1, background: 'currentColor', verticalAlign: 'middle' }} />
      </button>
    </div>
  )
}
