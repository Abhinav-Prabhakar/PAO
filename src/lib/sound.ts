let ctx: AudioContext | null = null
let noise: AudioBuffer | null = null

function audio(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Ctor) return null
    ctx = new Ctor()
  }
  return ctx
}

export function unlockSound() {
  const c = audio()
  if (c?.state === 'suspended') void c.resume()
}

function noiseBuffer(c: AudioContext) {
  if (noise) return noise
  const len = Math.floor(c.sampleRate * 0.05)
  const buffer = c.createBuffer(1, len, c.sampleRate)
  const data = buffer.getChannelData(0)
  for (let i = 0; i < len; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.4)
  }
  noise = buffer
  return buffer
}

function click(c: AudioContext, at: number, level: number, frequency: number) {
  const src = c.createBufferSource()
  src.buffer = noiseBuffer(c)

  const filter = c.createBiquadFilter()
  filter.type = 'bandpass'
  filter.frequency.value = frequency
  filter.Q.value = 1.4

  const gain = c.createGain()
  gain.gain.setValueAtTime(level, at)
  gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.055)

  src.connect(filter).connect(gain).connect(c.destination)
  src.start(at)
  src.stop(at + 0.06)
}

/** A projector gate: two sprocket clicks over a low mechanical thump. */
export function shutter() {
  const c = audio()
  if (!c) return
  if (c.state === 'suspended') void c.resume()
  const t = c.currentTime + 0.005

  click(c, t, 0.09, 2100)
  click(c, t + 0.052, 0.05, 1400)

  const osc = c.createOscillator()
  osc.type = 'triangle'
  osc.frequency.setValueAtTime(150, t)
  osc.frequency.exponentialRampToValueAtTime(72, t + 0.1)

  const gain = c.createGain()
  gain.gain.setValueAtTime(0.035, t)
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.12)

  osc.connect(gain).connect(c.destination)
  osc.start(t)
  osc.stop(t + 0.13)
}
