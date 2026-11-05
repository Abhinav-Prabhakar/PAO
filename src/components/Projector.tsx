import { useEffect, useRef, useState } from 'react'
import { AsciiArt } from './AsciiArt'
import { cachedArt, type Chunk } from '../lib/ascii'
import { caption } from '../lib/caption'
import { ROLE_ORDER, ROLES } from '../lib/roles'
import { shutter, unlockSound } from '../lib/sound'

interface Props {
  chunks: Chunk[]
  index: number
  onIndex: (i: number) => void
  onClose: () => void
}

function bar(value: number, width = 28) {
  const filled = Math.round(value * width)
  return '▕' + '█'.repeat(filled) + '░'.repeat(width - filled) + '▏'
}

export function Projector({ chunks, index, onIndex, onClose }: Props) {
  const [playing, setPlaying] = useState(false)
  const [small, setSmall] = useState(window.innerWidth < 700)
  const [sound, setSound] = useState(() => localStorage.getItem('pao-sound-v1') === 'on')
  const lastIndex = useRef(index)
  const chunk = chunks[index]
  const n = chunks.length

  const go = (d: number) => {
    unlockSound()
    onIndex((index + d + n) % n)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight' || e.key === 'j') {
        unlockSound()
        onIndex((index + 1) % n)
      } else if (e.key === 'ArrowLeft' || e.key === 'k') {
        unlockSound()
        onIndex((index - 1 + n) % n)
      } else if (e.key === ' ') {
        e.preventDefault()
        unlockSound()
        setPlaying((p) => !p)
      }
    }
    const onResize = () => setSmall(window.innerWidth < 700)
    window.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
      document.body.style.overflow = ''
    }
  }, [index, n, onIndex, onClose])

  useEffect(() => {
    if (!playing) return
    const id = setInterval(() => onIndex((index + 1) % n), 3600)
    return () => clearInterval(id)
  }, [playing, index, n, onIndex])

  useEffect(() => {
    if (lastIndex.current === index) return
    lastIndex.current = index
    if (sound) shutter()
  }, [index, sound])

  const toggleSound = () => {
    const next = !sound
    setSound(next)
    localStorage.setItem('pao-sound-v1', next ? 'on' : 'off')
    if (next) {
      unlockSound()
      shutter()
    }
  }

  if (!chunk) return null
  const words = [chunk.pairs[0].person, chunk.pairs[1].action, chunk.pairs[2].object]
  const line = caption(words[0], words[1], words[2])
  const num = String(index + 1).padStart(3, '0')

  return (
    <div
      className="fixed inset-0 z-[70] flex flex-col bg-black/90 backdrop-blur-sm fade-up"
      onClick={onClose}
    >
      {/* top bar */}
      <div className="flex items-center justify-between px-5 py-4" onClick={(e) => e.stopPropagation()}>
        <span className="edge !text-[10px]">▸ {num} / {String(n).padStart(3, '0')}</span>
        <button className="btn" onClick={onClose} data-tip="close · esc" data-tip-pos="bottom" aria-label="close">
          ✕
        </button>
      </div>

      {/* gate */}
      <div className="flex flex-1 items-center justify-center overflow-auto px-3" >
        <div
          className="projector-flicker flex rounded bg-gradient-to-b from-film-2 to-film shadow-[0_0_80px_rgba(240,169,59,0.12)]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sprockets-v" />
          <div key={chunk.key} className="advance flex flex-col items-center px-3 py-6 sm:px-8 sm:py-8">
            <div className="gate grid grid-cols-1 gap-6 px-5 py-6 sm:grid-cols-3 sm:gap-8 sm:px-8 sm:py-8">
              {ROLE_ORDER.map((role, p) => {
                const pair = chunk.pairs[p]
                return (
                  <div key={role} className="flex flex-col items-center gap-4 sm:gap-5">
                    <div className={`text-[11px] tracking-[0.3em] role-${role} opacity-70`} data-tip={ROLES[role].name}>
                      {ROLES[role].glyph}
                    </div>
                    <div className={`text-4xl font-semibold tracking-[0.15em] sm:text-5xl role-${role}`}>
                      {pair.pair.split('').map((d, j) => (
                        <span key={j} style={{ opacity: p * 2 + j >= 6 - chunk.padded ? 0.28 : 1 }}>{d}</span>
                      ))}
                    </div>
                    <AsciiArt lines={cachedArt(role, pair.n)} role={role} size={small ? 12 : 17} delay={p * 180} />
                    <div className={`text-base tracking-wide sm:text-lg role-${role}`} style={{ textShadow: 'none' }}>
                      {words[p]}
                    </div>
                  </div>
                )
              })}
            </div>
            <p className="mt-6 text-center text-xs text-cream/50 sm:text-sm">
              <span className="text-amber">{line.person}</span> is{' '}
              <span className="text-sage">{line.action}</span> {line.preposition && `${line.preposition} `}
              {line.determiner} <span className="text-rust">{line.object}</span>.
            </p>
          </div>
          <div className="sprockets-v" />
        </div>
      </div>

      {/* controls */}
      <div className="flex flex-col items-center gap-3 px-5 pt-3 pb-6" onClick={(e) => e.stopPropagation()}>
        <pre className="ascii text-amber/80" style={{ ['--fs' as string]: '11px' }}>
          {bar(n > 1 ? index / (n - 1) : 1)}
        </pre>
        <div className="flex items-center gap-2">
          <button className="btn" onClick={() => go(-1)} data-tip="prev · ←/k" aria-label="previous">◀</button>
          <button className="btn min-w-14" aria-pressed={playing} onClick={() => setPlaying((p) => !p)} data-tip="play · space" aria-label="play">
            {playing ? '❚❚' : '▶'}
          </button>
          <button className="btn" onClick={() => go(1)} data-tip="next · →/j" aria-label="next">▶▶</button>
          <span className="mx-1 h-4 w-px bg-cream/10" aria-hidden />
          <button
            className="btn"
            aria-pressed={sound}
            onClick={toggleSound}
            data-tip={sound ? 'sound on' : 'sound off'}
            aria-label={sound ? 'mute projector sound' : 'unmute projector sound'}
          >
            <span className="sound-mark" data-muted={!sound || undefined}>♪</span>
          </button>
        </div>
      </div>
    </div>
  )
}
