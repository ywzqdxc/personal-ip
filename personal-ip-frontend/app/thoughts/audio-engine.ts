/* ═══════════════════════════════════════════════
   Audio Engine — Mechanical Memory Navigator
   ═══════════════════════════════════════════════ */

let _ctx: AudioContext | null = null
let _ctxReady = false

function ctx(): AudioContext {
  if (!_ctx) {
    _ctx = new AudioContext()
    _ctxReady = _ctx.state === 'running'
  }
  if (_ctx.state === 'suspended') {
    _ctx.resume().then(() => { _ctxReady = true })
  }
  return _ctx
}

/** Call once on first user interaction to unlock audio. */
export function unlockAudio() {
  const c = ctx()
  if (c.state === 'suspended') {
    c.resume().then(() => { _ctxReady = true })
  } else {
    _ctxReady = true
  }
}

/* ── Shared noise buffer (reusable) ── */
let _noiseBuffer: AudioBuffer | null = null
function noiseBuf(durationSec = 0.05): AudioBuffer {
  if (_noiseBuffer && _noiseBuffer.duration >= durationSec) return _noiseBuffer
  const c = ctx()
  _noiseBuffer = c.createBuffer(1, c.sampleRate * durationSec, c.sampleRate)
  const d = _noiseBuffer.getChannelData(0)
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
  return _noiseBuffer
}

/* ═══════════════════════════════════════════════
   Concurrency guard — prevent sound stacking
   ═══════════════════════════════════════════════ */

let _activeTickEnd = 0
let _activeRollGain: GainNode | null = null
let _activeRollNoise: AudioBufferSourceNode | null = null

function now(): number { return ctx().currentTime }

/* ═══════════════════════════════════════════════
   Individual clockwork tick (slow/medium scroll)
   ═══════════════════════════════════════════════ */

export function playTick(velocity = 0.3) {
  const c = ctx()
  const n = now()

  // Debounce — don't stack ticks closer than 12ms
  if (n - _activeTickEnd < 0.012) return
  _activeTickEnd = n + 0.045

  const vol = 0.04 + velocity * 0.05
  const bright = 0.7 + velocity * 0.3 // pitch brightness

  // ── Layer 1: Click attack (noise burst) ──
  const noise = c.createBufferSource()
  noise.buffer = noiseBuf()
  const ng = c.createGain()
  ng.gain.setValueAtTime(vol * 1.2, n)
  ng.gain.exponentialRampToValueAtTime(0.001, n + 0.006)
  const nf = c.createBiquadFilter()
  nf.type = 'highpass'; nf.frequency.value = 2400 * bright
  noise.connect(nf).connect(ng).connect(c.destination)
  noise.start(n); noise.stop(n + 0.006)

  // ── Layer 2: Metallic ping ──
  const o1 = c.createOscillator()
  const g1 = c.createGain()
  o1.type = 'sine'
  o1.frequency.setValueAtTime(2600 * bright, n)
  o1.frequency.exponentialRampToValueAtTime(1000, n + 0.018)
  g1.gain.setValueAtTime(vol * 0.8, n)
  g1.gain.exponentialRampToValueAtTime(0.001, n + 0.025)
  o1.connect(g1).connect(c.destination)
  o1.start(n); o1.stop(n + 0.03)

  // ── Layer 3: Warm body ──
  const o2 = c.createOscillator()
  const g2 = c.createGain()
  o2.type = 'triangle'
  o2.frequency.setValueAtTime(800 + velocity * 200, n + 0.003)
  o2.frequency.exponentialRampToValueAtTime(350, n + 0.022)
  g2.gain.setValueAtTime(vol * 0.5, n + 0.003)
  g2.gain.exponentialRampToValueAtTime(0.001, n + 0.035)
  o2.connect(g2).connect(c.destination)
  o2.start(n + 0.003); o2.stop(n + 0.035)
}

/* ═══════════════════════════════════════════════
   Continuous rolling sound (fast scroll)
   ═══════════════════════════════════════════════ */

export function startRoll(velocity: number) {
  const c = ctx()
  stopRoll()

  const buf = noiseBuf(0.5)
  const src = c.createBufferSource()
  src.buffer = buf
  src.loop = true

  const gain = c.createGain()
  const vol = 0.03 + velocity * 0.04
  gain.gain.setValueAtTime(vol, now())

  const bp = c.createBiquadFilter()
  bp.type = 'bandpass'
  bp.frequency.value = 600 + velocity * 800
  bp.Q.value = 1.5

  src.connect(bp).connect(gain).connect(c.destination)
  src.start()

  _activeRollGain = gain
  _activeRollNoise = src
}

export function updateRollVelocity(velocity: number) {
  if (!_activeRollGain) return
  const vol = 0.03 + velocity * 0.04
  _activeRollGain.gain.setTargetAtTime(vol, now(), 0.05)
}

export function stopRoll() {
  if (_activeRollGain) {
    _activeRollGain.gain.setTargetAtTime(0.001, now(), 0.08)
    setTimeout(() => {
      if (_activeRollNoise) { _activeRollNoise.stop(); _activeRollNoise = null }
      _activeRollGain = null
    }, 120)
  }
}

/* ═══════════════════════════════════════════════
   Drag sound (timeline dragging)
   ═══════════════════════════════════════════════ */

let _dragSrc: AudioBufferSourceNode | null = null
let _dragGain: GainNode | null = null

export function startDrag() {
  const c = ctx()
  stopDrag()

  const buf = noiseBuf(0.4)
  const src = c.createBufferSource()
  src.buffer = buf; src.loop = true
  const gain = c.createGain()
  gain.gain.setValueAtTime(0.02, now())
  const bp = c.createBiquadFilter()
  bp.type = 'lowpass'; bp.frequency.value = 400; bp.Q.value = 0.7
  src.connect(bp).connect(gain).connect(c.destination)
  src.start()
  _dragSrc = src; _dragGain = gain
}

export function updateDragVelocity(velocity: number) {
  if (!_dragGain) return
  _dragGain.gain.setTargetAtTime(0.015 + velocity * 0.04, now(), 0.05)
}

export function stopDrag() {
  if (_dragGain) {
    _dragGain.gain.setTargetAtTime(0.001, now(), 0.1)
    setTimeout(() => {
      if (_dragSrc) { _dragSrc.stop(); _dragSrc = null }
      _dragGain = null
    }, 150)
  }
  stopRoll() // also stop any rolling
}

/* ═══════════════════════════════════════════════
   Node activation — gear locking into position
   ═══════════════════════════════════════════════ */

export function playActivate() {
  const c = ctx()
  const n = now()

  // ── Sharp noise click ──
  const noise = c.createBufferSource()
  noise.buffer = noiseBuf()
  const ng = c.createGain()
  ng.gain.setValueAtTime(0.06, n)
  ng.gain.exponentialRampToValueAtTime(0.001, n + 0.005)
  const nf = c.createBiquadFilter()
  nf.type = 'highpass'; nf.frequency.value = 2500
  noise.connect(nf).connect(ng).connect(c.destination)
  noise.start(n); noise.stop(n + 0.005)

  // ── Crisp metallic ping ──
  const o1 = c.createOscillator(); const g1 = c.createGain()
  o1.type = 'sine'; o1.frequency.setValueAtTime(3600, n); o1.frequency.exponentialRampToValueAtTime(1800, n + 0.015)
  g1.gain.setValueAtTime(0.08, n); g1.gain.exponentialRampToValueAtTime(0.001, n + 0.025)
  o1.connect(g1).connect(c.destination); o1.start(n); o1.stop(n + 0.028)

  // ── Light harmonic overtone ──
  const o2 = c.createOscillator(); const g2 = c.createGain()
  o2.type = 'sine'; o2.frequency.setValueAtTime(5400, n + 0.001); o2.frequency.exponentialRampToValueAtTime(2800, n + 0.01)
  g2.gain.setValueAtTime(0.02, n + 0.001); g2.gain.exponentialRampToValueAtTime(0.001, n + 0.014)
  o2.connect(g2).connect(c.destination); o2.start(n + 0.001); o2.stop(n + 0.016)
}

/* ═══════════════════════════════════════════════
   Hover — barely noticeable metallic shimmer
   ═══════════════════════════════════════════════ */

export function playHover() {
  const c = ctx()
  const n = now()
  const o = c.createOscillator(); const g = c.createGain()
  o.type = 'sine'; o.frequency.setValueAtTime(4000, n); o.frequency.exponentialRampToValueAtTime(5000, n + 0.04)
  g.gain.setValueAtTime(0.008, n); g.gain.exponentialRampToValueAtTime(0.001, n + 0.06)
  o.connect(g).connect(c.destination); o.start(n); o.stop(n + 0.06)
}

/* ═══════════════════════════════════════════════
   Idle — final settling tick
   ═══════════════════════════════════════════════ */

let _idlePlayed = false

export function playSettle() {
  if (_idlePlayed) return
  _idlePlayed = true
  const c = ctx()
  const n = now()
  // Single soft tick — gear coming to rest
  const o = c.createOscillator(); const g = c.createGain()
  o.type = 'sine'; o.frequency.setValueAtTime(1800, n); o.frequency.exponentialRampToValueAtTime(600, n + 0.06)
  g.gain.setValueAtTime(0.03, n); g.gain.exponentialRampToValueAtTime(0.001, n + 0.08)
  o.connect(g).connect(c.destination); o.start(n); o.stop(n + 0.08)
  setTimeout(() => { _idlePlayed = false }, 500)
}

/* ═══════════════════════════════════════════════
   Reset idle flag (call when scrolling resumes)
   ═══════════════════════════════════════════════ */
export function resetIdle() { _idlePlayed = false }
