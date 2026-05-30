'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * IntroVideo
 * —— 首次访问时全屏播放 dy1.mp4，结束后以"双帘拉开"动效退出
 * —— sessionStorage 标记：同一 Tab 内刷新不再重播
 */
export function IntroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [phase, setPhase] = useState<'hidden' | 'entering' | 'playing' | 'leaving' | 'gone'>('hidden')
  const [showSkip, setShowSkip] = useState(false)

  useEffect(() => {
    // 同 Tab 内只播一次
    if (sessionStorage.getItem('intro-played')) {
      setPhase('gone')
      return
    }

    // 锁定滚动
    document.documentElement.style.overflow = 'hidden'

    // 短暂延迟后进入 entering（黑幕落下 → 视频淡入）
    const t1 = setTimeout(() => setPhase('entering'), 50)

    // 1s 后显示 skip 按钮
    const t2 = setTimeout(() => setShowSkip(true), 1000)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  // entering → 开始播放
  useEffect(() => {
    if (phase !== 'entering') return
    const vid = videoRef.current
    if (!vid) return

    const t = setTimeout(() => {
      setPhase('playing')
      vid.play().catch(() => {
        // autoplay blocked → 直接离开
        handleLeave()
      })
    }, 400) // 等黑幕落下

    return () => clearTimeout(t)
  }, [phase])

  const handleLeave = () => {
    if (phase === 'leaving' || phase === 'gone') return
    sessionStorage.setItem('intro-played', '1')
    document.documentElement.style.overflow = ''
    setPhase('leaving')
    // leaving 动画 1.1s 后彻底移除
    setTimeout(() => setPhase('gone'), 1100)
  }

  if (phase === 'gone') return null

  /* ─── 样式计算 ─── */
  const isLeaving = phase === 'leaving'
  const isEntering = phase === 'entering' || phase === 'playing'

  // 遮罩：进入时不透明，离开时渐透
  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0A0805',
    transition: isLeaving ? 'opacity 0.9s cubic-bezier(0.4,0,0.2,1)' : 'none',
    opacity: isLeaving ? 0 : 1,
    pointerEvents: isLeaving ? 'none' : 'all',
  }

  // 视频：进入时从略微放大 + 不透明 淡入，离开时随遮罩消失
  const videoContainerStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: isEntering
      ? 'opacity 0.6s ease, transform 0.8s cubic-bezier(0.16,1,0.3,1)'
      : 'none',
    opacity: phase === 'playing' ? 1 : 0,
    transform: phase === 'playing' ? 'scale(1)' : 'scale(1.06)',
  }

  // 四角装饰线（高级感）
  const cornerBase: React.CSSProperties = {
    position: 'absolute',
    width: 40,
    height: 40,
    transition: 'opacity 0.5s ease',
    opacity: phase === 'playing' ? 1 : 0,
  }

  return (
    <div style={overlayStyle} aria-hidden="true">
      {/* 视频主体 */}
      <div style={videoContainerStyle}>
        <video
          ref={videoRef}
          src="/videos/dy1.mp4"
          muted
          playsInline
          preload="auto"
          onEnded={handleLeave}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      </div>

      {/* 四角装饰线 */}
      <div style={{ ...cornerBase, top: 32, left: 32, borderTop: '1px solid rgba(196,90,48,0.6)', borderLeft: '1px solid rgba(196,90,48,0.6)' }} />
      <div style={{ ...cornerBase, top: 32, right: 32, borderTop: '1px solid rgba(196,90,48,0.6)', borderRight: '1px solid rgba(196,90,48,0.6)' }} />
      <div style={{ ...cornerBase, bottom: 32, left: 32, borderBottom: '1px solid rgba(196,90,48,0.6)', borderLeft: '1px solid rgba(196,90,48,0.6)' }} />
      <div style={{ ...cornerBase, bottom: 32, right: 32, borderBottom: '1px solid rgba(196,90,48,0.6)', borderRight: '1px solid rgba(196,90,48,0.6)' }} />

      {/* 底部渐变遮罩（让视频下方更沉稳） */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '30%',
        background: 'linear-gradient(to top, rgba(10,8,5,0.7) 0%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      {/* 顶部渐变 */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '15%',
        background: 'linear-gradient(to bottom, rgba(10,8,5,0.5) 0%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      {/* skip 按钮 */}
      {showSkip && (
        <button
          onClick={handleLeave}
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
            color: 'rgba(232,197,176,0.55)',
            fontSize: 11,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            fontFamily: 'system-ui, sans-serif',
            transition: 'color 0.3s',
            padding: '8px 0',
            animation: 'introFadeIn 0.6s ease forwards',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = 'rgba(232,197,176,1)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(232,197,176,0.55)')}
        >
          skip
          <span style={{
            display: 'inline-block',
            width: 20,
            height: 1,
            background: 'currentColor',
            verticalAlign: 'middle',
          }} />
        </button>
      )}

      {/* 品牌签名（中央底部，仅 playing 阶段显示） */}
      <div style={{
        position: 'absolute',
        bottom: 44,
        left: '50%',
        transform: 'translateX(-50%)',
        color: 'rgba(196,90,48,0.5)',
        fontSize: 10,
        letterSpacing: '0.35em',
        textTransform: 'uppercase',
        fontFamily: 'system-ui, sans-serif',
        whiteSpace: 'nowrap',
        transition: 'opacity 0.6s ease',
        opacity: phase === 'playing' ? 1 : 0,
        pointerEvents: 'none',
      }}>
        personal ip
      </div>

      <style>{`
        @keyframes introFadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
