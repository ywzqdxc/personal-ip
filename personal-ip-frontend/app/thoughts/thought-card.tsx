'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState, type MutableRefObject } from 'react'
import { useLenis } from 'lenis/react'
import type { Thought } from '@/lib/api/thoughts'
import {
  MOOD_EMOJI,
  fakeLikes,
  fakeComments,
  getCardType,
  parseCodeContent,
  formatDate,
} from './thought-utils'

/* ── Props ── */

interface CardProps {
  thought: Thought
  onImageClick?: (url: string, imgEl: HTMLImageElement) => void
  enterDelay?: number
}

/* ═══════════════════════════════════════════════
   Interaction Bar (shared by all card types)
   ═══════════════════════════════════════════════ */

function InteractionBar({ thought }: { thought: Thought }) {
  const [likes, setLikes] = useState(fakeLikes(thought.id))
  const [comments] = useState(fakeComments(thought.id))
  const [likeBounce, setLikeBounce] = useState(false)
  const [commentBounce, setCommentBounce] = useState(false)
  const [likeNumPop, setLikeNumPop] = useState(false)

  const handleLike = useCallback(() => {
    setLikeBounce(true)
    setLikeNumPop(true)
    setLikes((n) => n + 1)
    setTimeout(() => setLikeBounce(false), 300)
    setTimeout(() => setLikeNumPop(false), 300)
  }, [])

  const handleComment = useCallback(() => {
    setCommentBounce(true)
    setTimeout(() => setCommentBounce(false), 300)
  }, [])

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, paddingTop: 10, borderTop: '0.5px solid rgba(232,201,176,0.5)' }}>
      {/* Left: likes + comments */}
      <div style={{ display: 'flex', gap: 14, fontSize: 12, color: '#B07050', alignItems: 'center' }}>
        <span onClick={handleLike} style={{ cursor: 'pointer', userSelect: 'none', display: 'inline-flex', alignItems: 'center', gap: 3 }} className={likeBounce ? 'icon-bounce' : ''}>
          ♡ <span className={likeNumPop ? 'num-pop' : ''} style={{ display: 'inline-block' }}>{likes}</span>
        </span>
        <span onClick={handleComment} style={{ cursor: 'pointer', userSelect: 'none', display: 'inline-flex', alignItems: 'center', gap: 3 }} className={commentBounce ? 'icon-bounce' : ''}>
          💬 {comments}
        </span>
      </div>
      {/* Right: time + share */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <span style={{ fontSize: 10, color: '#B07050', fontFamily: 'Barlow, sans-serif', opacity: 0.7 }}>
          {formatDate(thought.createTime)}
        </span>
        <span
          style={{ fontSize: 14, color: '#B07050', cursor: 'pointer', opacity: 0.5, transition: 'opacity 0.2s, transform 0.2s' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.8'; (e.currentTarget as HTMLElement).style.transform = 'rotate(45deg)' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.5'; (e.currentTarget as HTMLElement).style.transform = 'rotate(0deg)' }}
        >↗</span>
      </div>
    </div>
  )
}

/* ── Tag pills ── */

function renderTags(tags: string | null, darkMode = false) {
  if (!tags) return null
  return (
    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', margin: '8px 0' }}>
      {tags.split(',').map((tag) => (
        <span key={tag.trim()} className={darkMode ? 'thought-tag-dark' : 'thought-tag'} style={{
          fontSize: 10, letterSpacing: '0.06em',
          color: darkMode ? '#C9A96E' : '#B07050',
          border: darkMode ? '0.5px solid rgba(200,160,110,0.3)' : '0.5px solid #E8C9B0',
          borderRadius: 99, padding: '2px 8px',
        }}>#{tag.trim()}</span>
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════════
   Card Type V: Video
   ═══════════════════════════════════════════════ */


/* ═══════════════════════════════════════════════
   Video Playback Context — only one video plays at a time
   ═══════════════════════════════════════════════ */

interface VideoPlaybackCtx {
  requestPlay: (ref: MutableRefObject<HTMLVideoElement | null>) => void
}

const VideoPlaybackContext = createContext<VideoPlaybackCtx | null>(null)

export function VideoPlaybackProvider({ children }: { children: React.ReactNode }) {
  const currentRef = useRef<HTMLVideoElement | null>(null)

  const requestPlay = useCallback((ref: MutableRefObject<HTMLVideoElement | null>) => {
    const incoming = ref.current
    if (!incoming) return
    // Pause the previously playing video
    if (currentRef.current && currentRef.current !== incoming) {
      currentRef.current.pause()
    }
    currentRef.current = incoming
    incoming.play()
  }, [])

  return (
    <VideoPlaybackContext.Provider value={{ requestPlay }}>
      {children}
    </VideoPlaybackContext.Provider>
  )
}

function useVideoPlayback() {
  return useContext(VideoPlaybackContext)
}

function VideoCard({ thought, emoji }: { thought: Thought; emoji: string | null }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const playback = useVideoPlayback()

  const toggle = useCallback(() => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) {
      if (playback) {
        playback.requestPlay(videoRef)
      } else {
        v.play()
      }
      setPlaying(true)
    } else {
      v.pause()
      setPlaying(false)
    }
  }, [playback])

  return (
    <div className="thought-card thought-card-video" style={{ background: '#0D0806', borderRadius: 16, border: '0.5px solid rgba(200,160,110,0.15)', overflow: 'hidden' }}>
      {/* Video */}
      <div style={{ position: 'relative', cursor: 'pointer' }} onClick={toggle}>
        <video
          ref={videoRef}
          src={thought.videoUrl!}
          loop muted playsInline
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          style={{ width: '100%', display: 'block', borderRadius: '14px 14px 0 0' }}
        />
        {/* Play overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: playing ? 'transparent' : 'rgba(0,0,0,0.2)',
          transition: 'background 0.2s',
        }}>
          {!playing && (
            <div style={{
              width: 44, height: 44, borderRadius: '50%',
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(6px)',
              border: '1px solid rgba(255,255,255,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, color: '#fff',
            }}>▶</div>
          )}
        </div>
      </div>
      {/* Caption */}
      <div style={{ padding: '12px 14px 14px' }}>
        <p style={{ fontFamily: 'Caveat, cursive', fontSize: 16, color: 'rgba(255,255,255,0.85)', lineHeight: 1.5, margin: '0 0 4px' }}>
          {thought.content}
        </p>
        {emoji && thought.mood && (
          <span style={{ fontSize: 12, color: '#C9A96E' }}>{emoji} {thought.mood}</span>
        )}
        {renderTags(thought.tags, true)}
        {/* Interaction bar in dark mode */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, paddingTop: 10, borderTop: '0.5px solid rgba(200,160,110,0.15)' }}>
          <div style={{ display: 'flex', gap: 14, fontSize: 12, color: '#6B5040', alignItems: 'center' }}>
            <span style={{ cursor: 'pointer', userSelect: 'none' }}>♡ {fakeLikes(thought.id)}</span>
            <span style={{ cursor: 'pointer', userSelect: 'none' }}>💬 {fakeComments(thought.id)}</span>
          </div>
          <span style={{ fontSize: 10, color: '#6B5040', fontFamily: 'Barlow, sans-serif', opacity: 0.7 }}>
            {formatDate(thought.createTime)}
          </span>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   Card Type A: Photo
   ═══════════════════════════════════════════════ */

function PhotoCard({ thought, emoji, onImageClick }: { thought: Thought; emoji: string | null; onImageClick?: (url: string, imgEl: HTMLImageElement) => void }) {
  const imgRef = useRef<HTMLImageElement>(null)

  return (
    <div className="thought-card" style={{ background: '#FFFFFF', borderRadius: 16, border: '0.5px solid #E8C9B0', overflow: 'hidden' }}>
      {thought.imageUrl && (
        <img
          ref={imgRef}
          src={thought.imageUrl}
          alt=""
          className="thought-card-img"
          onClick={() => { if (imgRef.current) onImageClick?.(thought.imageUrl!, imgRef.current) }}
          style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '12px 12px 0 0', objectFit: 'cover', cursor: 'pointer' }}
        />
      )}
      <div style={{ padding: '14px 16px 16px' }}>
        <p style={{ fontFamily: 'Caveat, cursive', fontSize: 17, color: '#2E1A0E', lineHeight: 1.5, margin: '0 0 4px' }}>
          {thought.content}
        </p>
        {thought.location && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6, fontSize: 11, color: '#B07050', fontFamily: 'Barlow, sans-serif', opacity: 0.8 }}>
            <span>📍</span>
            <span>{thought.location}</span>
          </div>
        )}
        {emoji && thought.mood && <span style={{ fontSize: 12, color: '#B07050' }}>{emoji} {thought.mood}</span>}
        {renderTags(thought.tags)}
        <InteractionBar thought={thought} />
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   Card Type B: Code
   ═══════════════════════════════════════════════ */

function highlightCodeLine(line: string) {
  const keywords = /\b(const|let|var|function|return|import|export|default|from|module|if|else|for|while|class|extends|type|interface|async|await)\b/g
  const strings = /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g
  const comments = /(\/\/.*$)/g
  const numbers = /\b(\d+\.?\d*)\b/g
  let html = line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  html = html.replace(comments, (m) => `<span style="color:#6B5040">${m}</span>`)
  html = html.replace(strings, (m) => `<span style="color:#C9A96E">${m}</span>`)
  html = html.replace(keywords, (m) => `<span style="color:#E8855A">${m}</span>`)
  html = html.replace(numbers, (m) => `<span style="color:#C45A30">${m}</span>`)
  return html
}

function CodeCard({ thought, emoji }: { thought: Thought; emoji: string | null }) {
  const segments = parseCodeContent(thought.content)
  return (
    <div className="thought-card thought-card-code" style={{ background: '#1A1208', borderRadius: 16, border: '0.5px solid rgba(200,160,110,0.15)', overflow: 'hidden' }}>
      <div style={{ background: '#2A1E10', padding: '8px 14px', borderRadius: '14px 14px 0 0', fontSize: 10, letterSpacing: '0.12em', color: '#C9A96E', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span>[code]</span>
        <span>{emoji} {thought.mood}</span>
      </div>
      <div style={{ padding: '14px 14px 16px' }}>
        {segments.map((seg, i) =>
          seg.type === 'code' ? (
            <pre key={i} className="code-pre" style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 8, padding: '12px 14px', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, lineHeight: 1.7, overflowX: 'auto', whiteSpace: 'pre', margin: i > 0 ? '8px 0 0' : '0' }}>
              <code dangerouslySetInnerHTML={{ __html: seg.text.split('\n').map((line) => highlightCodeLine(line)).join('\n') }} />
            </pre>
          ) : (
            <p key={i} style={{ color: '#C9A96E', fontSize: 13, lineHeight: 1.6, fontFamily: 'Barlow, sans-serif', margin: i > 0 ? '8px 0 0' : '0' }}>{seg.text}</p>
          ),
        )}
        {renderTags(thought.tags, true)}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 12, paddingTop: 10, borderTop: '0.5px solid rgba(200,160,110,0.15)' }}>
          <div style={{ display: 'flex', gap: 14, fontSize: 12, color: '#6B5040', alignItems: 'center' }}>
            <span style={{ cursor: 'pointer', userSelect: 'none' }}>♡ {fakeLikes(thought.id)}</span>
            <span style={{ cursor: 'pointer', userSelect: 'none' }}>💬 {fakeComments(thought.id)}</span>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ fontSize: 10, color: '#6B5040', fontFamily: 'Barlow, sans-serif', opacity: 0.7 }}>{formatDate(thought.createTime)}</span>
            <span style={{ fontSize: 14, color: '#6B5040', cursor: 'pointer', opacity: 0.5, transition: 'opacity 0.2s, transform 0.2s' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.8'; (e.currentTarget as HTMLElement).style.transform = 'rotate(45deg)' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.5'; (e.currentTarget as HTMLElement).style.transform = 'rotate(0deg)' }}>↗</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   Card Type C: Essay
   ═══════════════════════════════════════════════ */

function EssayCard({ thought, emoji }: { thought: Thought; emoji: string | null }) {
  const paragraphs = thought.content.split(/\n\n+/)
  return (
    <div className="thought-card" style={{ background: '#FFFBF7', borderRadius: 16, border: '0.5px solid #E8C9B0', padding: '20px 20px 16px' }}>
      {paragraphs.map((para, i) => (
        <p key={i} style={{
          fontFamily: "'Noto Serif SC', 'Playfair Display', serif",
          fontSize: 15, lineHeight: 1.9, color: '#2E1A0E',
          margin: i === 0 ? '0 0 12px' : '0 0 6px',
          ...(i === 0 ? { borderLeft: '3px solid #E8855A', paddingLeft: 12 } : {}),
        }}>{para}</p>
      ))}
      {emoji && thought.mood && <span style={{ fontSize: 12, color: '#B07050', display: 'inline-block', marginTop: 4 }}>{emoji} {thought.mood}</span>}
      {renderTags(thought.tags)}
      <InteractionBar thought={thought} />
    </div>
  )
}

/* ═══════════════════════════════════════════════
   Card Type D: Standard
   ═══════════════════════════════════════════════ */

function StandardCard({ thought, emoji }: { thought: Thought; emoji: string | null }) {
  return (
    <div className="thought-card" style={{ background: '#FFFFFF', borderRadius: 16, border: '0.5px solid #E8C9B0', padding: '16px 18px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #E8855A, #C45A30)', color: '#FFF', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Barlow, sans-serif' }}>R</div>
        {emoji && thought.mood && <span style={{ fontSize: 12, color: '#B07050' }}>{emoji} {thought.mood}</span>}
      </div>
      <p style={{ fontSize: 14, lineHeight: 1.75, color: '#2E1A0E', fontFamily: 'Barlow, sans-serif', fontWeight: 400, margin: '0 0 6px' }}>{thought.content}</p>
      {renderTags(thought.tags)}
      <InteractionBar thought={thought} />
    </div>
  )
}

/* ═══════════════════════════════════════════════
   Lightbox — morph from source position to center
   ═══════════════════════════════════════════════ */

type LightboxPhase = 'closed' | 'entering' | 'open' | 'exiting'

interface LightboxState {
  url: string
  rect: { left: number; top: number; width: number; height: number }
}

export function Lightbox({ lightboxState, onClose }: { lightboxState: LightboxState | null; onClose: () => void }) {
  const [phase, setPhase] = useState<LightboxPhase>('closed')
  const [currentState, setCurrentState] = useState<LightboxState | null>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (lightboxState && phase === 'closed') {
      setCurrentState(lightboxState)
      requestAnimationFrame(() => { requestAnimationFrame(() => setPhase('entering')) })
    }
  }, [lightboxState, phase])

  useEffect(() => {
    if (phase === 'entering') {
      const t = setTimeout(() => setPhase('open'), 50)
      return () => clearTimeout(t)
    }
  }, [phase])

  const lenis = useLenis()

  useEffect(() => {
    if (phase === 'closed') { lenis?.start(); return }
    lenis?.stop()
    return () => { lenis?.start() }
  }, [phase, lenis])

  useEffect(() => {
    if (phase !== 'open') return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setPhase('exiting') }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase])

  const handleClose = useCallback(() => { if (phase === 'open') setPhase('exiting') }, [phase])

  const doneRef = useRef(false)
  const finishExit = useCallback(() => {
    if (doneRef.current) return
    doneRef.current = true
    setPhase('closed')
    setCurrentState(null)
    onClose()
  }, [onClose])

  useEffect(() => {
    if (phase === 'exiting') {
      doneRef.current = false
      const t = setTimeout(finishExit, 400)
      return () => clearTimeout(t)
    }
  }, [phase, finishExit])

  const onTransitionEnd = useCallback(() => { if (phase === 'exiting') finishExit() }, [phase, finishExit])

  if (phase === 'closed' || !currentState) return null

  const srcRect = currentState.rect
  const vw = window.innerWidth
  const vh = window.innerHeight
  const maxW = vw * 0.9
  const maxH = vh * 0.85
  const scale = Math.min(maxW / srcRect.width, maxH / srcRect.height, 3)
  const targetW = srcRect.width * scale
  const targetH = srcRect.height * scale
  const targetLeft = (vw - targetW) / 2
  const targetTop = (vh - targetH) / 2
  const toTarget = phase === 'entering' || phase === 'open'
  const imgLeft = toTarget ? targetLeft : srcRect.left
  const imgTop = toTarget ? targetTop : srcRect.top
  const imgW = toTarget ? targetW : srcRect.width
  const imgH = toTarget ? targetH : srcRect.height

  return (
    <>
      <div onClick={handleClose} style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(0,0,0,0)',
        transition: phase === 'exiting' ? 'background 0.35s ease, opacity 0.35s ease' : 'background 0.45s cubic-bezier(0.22, 0.61, 0.36, 1)',
        pointerEvents: phase === 'exiting' ? 'none' : 'auto',
      }} className={phase === 'entering' || phase === 'open' ? 'thought-lightbox-overlay-open' : 'thought-lightbox-overlay-exit'} />
      <img ref={imgRef} src={currentState.url} alt="" onClick={handleClose} onTransitionEnd={onTransitionEnd} style={{
        position: 'fixed', zIndex: 201,
        left: imgLeft, top: imgTop, width: imgW, height: imgH,
        objectFit: 'contain', borderRadius: phase === 'open' ? 4 : 8,
        cursor: 'pointer', opacity: phase === 'exiting' ? 0 : 1,
        transition: phase === 'entering'
          ? 'left 0.45s cubic-bezier(0.22, 0.61, 0.36, 1), top 0.45s cubic-bezier(0.22, 0.61, 0.36, 1), width 0.45s cubic-bezier(0.22, 0.61, 0.36, 1), height 0.45s cubic-bezier(0.22, 0.61, 0.36, 1), border-radius 0.45s ease'
          : 'left 0.35s cubic-bezier(0.55, 0.06, 0.68, 0.19), top 0.35s cubic-bezier(0.55, 0.06, 0.68, 0.19), width 0.35s cubic-bezier(0.55, 0.06, 0.68, 0.19), height 0.35s cubic-bezier(0.55, 0.06, 0.68, 0.19), opacity 0.25s ease, border-radius 0.35s ease',
      }} />
      <style>{`.thought-lightbox-overlay-open { background: rgba(0,0,0,0.88) !important; } .thought-lightbox-overlay-exit { background: rgba(0,0,0,0) !important; opacity: 0; }`}</style>
    </>
  )
}

/* ═══════════════════════════════════════════════
   ThoughtCard dispatcher
   ═══════════════════════════════════════════════ */

export function ThoughtCard({ thought, onImageClick, enterDelay = 0 }: CardProps) {
  const type = getCardType(thought)
  const emoji = thought.mood ? MOOD_EMOJI[thought.mood] || '💭' : null
  const style: React.CSSProperties = enterDelay > 0 ? { animationDelay: enterDelay + 'ms' } : {}

  return (
    <div className="card-enter" style={style} data-thought-id={thought.id}>
      {type === 'video'    && <VideoCard    thought={thought} emoji={emoji} />}
      {type === 'photo'    && <PhotoCard    thought={thought} emoji={emoji} onImageClick={onImageClick} />}
      {type === 'code'     && <CodeCard     thought={thought} emoji={emoji} />}
      {type === 'essay'    && <EssayCard    thought={thought} emoji={emoji} />}
      {type === 'standard' && <StandardCard thought={thought} emoji={emoji} />}
    </div>
  )
}