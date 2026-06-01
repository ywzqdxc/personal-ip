'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const GAP = 10

// 5列，每列6张图，[url, 高度px]，高度交替变化增加节奏感
const COLUMNS: [string, number][][] = [
  [
    ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=420&q=80&fit=crop', 280],
    ['https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=420&q=80&fit=crop', 200],
    ['https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=420&q=80&fit=crop', 320],
    ['https://images.unsplash.com/photo-1501854140801-50d01698950b?w=420&q=80&fit=crop', 220],
    ['https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=420&q=80&fit=crop', 260],
    ['https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=420&q=80&fit=crop', 240],
  ],
  [
    ['https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=420&q=80&fit=crop', 300],
    ['https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=420&q=80&fit=crop', 200],
    ['https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=420&q=80&fit=crop', 250],
    ['https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=420&q=80&fit=crop', 220],
    ['https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=420&q=80&fit=crop', 280],
    ['https://images.unsplash.com/photo-1555993539-1732b0258235?w=420&q=80&fit=crop', 210],
  ],
  [
    ['https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=420&q=80&fit=crop', 240],
    ['https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=420&q=80&fit=crop', 300],
    ['https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=420&q=80&fit=crop', 200],
    ['https://images.unsplash.com/photo-1512820790803-83ca734da794?w=420&q=80&fit=crop', 260],
    ['https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=420&q=80&fit=crop', 320],
    ['https://images.unsplash.com/photo-1544367000-27e29e4f3e7c?w=420&q=80&fit=crop', 220],
  ],
  [
    ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=420&q=80&fit=crop', 220],
    ['https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=420&q=80&fit=crop', 300],
    ['https://images.unsplash.com/photo-1519046904884-53103b34b206?w=420&q=80&fit=crop', 240],
    ['https://images.unsplash.com/photo-1518623489648-a173ef7824f3?w=420&q=80&fit=crop', 200],
    ['https://images.unsplash.com/photo-1484291470158-b8f8d608a559?w=420&q=80&fit=crop', 280],
    ['https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=420&q=80&fit=crop', 260],
  ],
  [
    ['https://images.unsplash.com/photo-1486325212027-8081e485255e?w=420&q=80&fit=crop', 260],
    ['https://images.unsplash.com/photo-1514565131-fce0801e6785?w=420&q=80&fit=crop', 300],
    ['https://images.unsplash.com/photo-1444723121867-7a241cacace9?w=420&q=80&fit=crop', 200],
    ['https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=420&q=80&fit=crop', 280],
    ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=420&q=80&fit=crop', 220],
    ['https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=420&q=80&fit=crop', 260],
  ],
]

// 各列速度略有差异，增加层次感
const COL_SPEED_MULT = [1.0, 1.08, 0.93, 1.05, 0.97]

export function HeroGallery() {
  const gridRef = useRef<HTMLDivElement>(null)
  const colRefs = useRef<(HTMLDivElement | null)[]>([])
  const speed = useRef({ val: 0.7 })
  const positions = useRef([0, 0, 0, 0, 0])
  const tickerFn = useRef<(() => void) | null>(null)

  useEffect(() => {
    // ── 无缝滚动 ticker ──
    const fn = () => {
      colRefs.current.forEach((col, i) => {
        if (!col) return
        positions.current[i] -= speed.current.val * COL_SPEED_MULT[i]
        const halfH = col.scrollHeight / 2
        if (positions.current[i] <= -halfH) positions.current[i] = 0
        gsap.set(col, { y: positions.current[i] })
      })
    }
    tickerFn.current = fn
    gsap.ticker.add(fn)
    gsap.ticker.lagSmoothing(0)

    // ── 鼠标视差（轻微平移，不干扰 skew）──
    const onMouseMove = (e: MouseEvent) => {
      const xPct = (e.clientX / window.innerWidth - 0.5) * 2
      const yPct = (e.clientY / window.innerHeight - 0.5) * 2
      gsap.to(gridRef.current, {
        x: xPct * 18,
        y: yPct * 10,
        duration: 1.2,
        ease: 'power2.out',
      })
    }
    window.addEventListener('mousemove', onMouseMove)

    // ── 入场：各列依次淡入 ──
    gsap.fromTo(
      colRefs.current,
      { opacity: 0 },
      { opacity: 1, duration: 1, stagger: 0.12, ease: 'power2.out', delay: 0.3 }
    )

    return () => {
      if (tickerFn.current) gsap.ticker.remove(tickerFn.current)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  const handleMouseEnter = () =>
    gsap.to(speed.current, { val: 0.12, duration: 0.7, ease: 'power2.out' })

  const handleMouseLeave = () =>
    gsap.to(speed.current, { val: 0.7, duration: 0.9, ease: 'power2.inOut' })

  return (
    <section
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: '#0A0805',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* 倾斜传送带网格 */}
      <div
        ref={gridRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          position: 'absolute',
          top: '-30%',
          left: '-8%',
          right: '-8%',
          bottom: '-30%',
          display: 'flex',
          gap: GAP,
          transform: 'skewY(-8deg)',
        }}
      >
        {COLUMNS.map((col, ci) => (
          <div
            key={ci}
            ref={el => { colRefs.current[ci] = el }}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: GAP,
              willChange: 'transform',
              opacity: 0,
            }}
          >
            {/* 原始 + 克隆，实现无缝循环 */}
            {[...col, ...col].map(([src, h], idx) => (
              <div
                key={idx}
                style={{
                  width: '100%',
                  height: h,
                  borderRadius: 6,
                  backgroundImage: `url(${src})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  flexShrink: 0,
                }}
              />
            ))}
          </div>
        ))}
      </div>

      {/* 上下渐变遮罩 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, #0A0805 0%, rgba(10,8,5,0.55) 20%, rgba(10,8,5,0.45) 50%, rgba(10,8,5,0.55) 80%, #0A0805 100%)',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />

      {/* 左右渐变，让边缘柔和 */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to right, #0A0805 0%, transparent 15%, transparent 85%, #0A0805 100%)',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      />

      {/* Scroll 指示器 */}
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 10,
          zIndex: 10,
        }}
      >
        <div
          style={{
            width: 1,
            height: 52,
            background: 'rgba(196,90,48,0.55)',
            animation: 'scrollPulse 2s ease-in-out infinite',
          }}
        />
        <span
          style={{
            color: 'rgba(196,90,48,0.55)',
            fontSize: 9,
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          scroll
        </span>
      </div>

      <style>{`
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.35; transform: scaleY(0.65); transform-origin: top; }
          50%       { opacity: 1;    transform: scaleY(1);    transform-origin: top; }
        }
      `}</style>
    </section>
  )
}
