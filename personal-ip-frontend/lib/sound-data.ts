// Simple sound effect generators using Web Audio API
export function createPopSound(): string {
  // Create a simple pop sound using Web Audio API and return as data URL
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  const sampleRate = audioContext.sampleRate
  const duration = 0.1 // 100ms
  const frequency = 800 // Hz

  const buffer = audioContext.createBuffer(1, duration * sampleRate, sampleRate)
  const data = buffer.getChannelData(0)

  for (let i = 0; i < buffer.length; i++) {
    const t = i / sampleRate
    // Simple sine wave with decay envelope
    const envelope = Math.exp(-t * 30)
    data[i] = Math.sin(2 * Math.PI * frequency * t) * envelope * 0.3
  }

  return "pop"
}

export function createHoverSound(): string {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  const sampleRate = audioContext.sampleRate
  const duration = 0.05 // 50ms
  const frequency = 600 // Hz

  const buffer = audioContext.createBuffer(1, duration * sampleRate, sampleRate)
  const data = buffer.getChannelData(0)

  for (let i = 0; i < buffer.length; i++) {
    const t = i / sampleRate
    // Soft sine wave with quick decay
    const envelope = Math.exp(-t * 40)
    data[i] = Math.sin(2 * Math.PI * frequency * t) * envelope * 0.2
  }

  return "hover"
}

// Simple Web Audio API based sound player
export class SoundPlayer {
  private audioContext: AudioContext | null = null

  private getContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    return this.audioContext
  }

  playPop(volume = 0.3) {
    try {
      const ctx = this.getContext()
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      oscillator.frequency.value = 800
      oscillator.type = "sine"

      const now = ctx.currentTime
      gainNode.gain.setValueAtTime(volume, now)
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1)

      oscillator.start(now)
      oscillator.stop(now + 0.1)
    } catch (error) {
      console.log("[v0] Audio playback error:", error)
    }
  }

  playHover(volume = 0.2) {
    try {
      const ctx = this.getContext()
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)

      oscillator.frequency.value = 600
      oscillator.type = "sine"

      const now = ctx.currentTime
      gainNode.gain.setValueAtTime(volume, now)
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05)

      oscillator.start(now)
      oscillator.stop(now + 0.05)
    } catch (error) {
      console.log("[v0] Audio playback error:", error)
    }
  }
}
