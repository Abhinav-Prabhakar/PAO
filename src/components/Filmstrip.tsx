import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import type { Chunk } from '../lib/ascii'
import { ROLE_ORDER } from '../lib/roles'

interface Props {
  chunks: Chunk[]
  active: number
  onSelect: (index: number, smooth?: boolean) => void
}

const pad3 = (n: number) => String(n).padStart(3, '0')

function FrameDigits({ chunk }: { chunk: Chunk }) {
  return (
    <span className="tabular-nums tracking-[0.12em] text-[10px]" style={{ textShadow: 'none' }}>
      {chunk.digits.split('').map((d, i) => (
        <span
          key={i}
          className={`role-${ROLE_ORDER[Math.floor(i / 2)]}`}
          style={{
            marginLeft: i > 0 && i % 2 === 0 ? '0.35em' : 0,
            opacity: i >= 6 - chunk.padded ? 0.28 : 1,
          }}
        >
          {d}
        </span>
      ))}
    </span>
  )
}

/** A scrubbable strip of every frame in the reel. */
export function Filmstrip({ chunks, active, onSelect }: Props) {
  const [preview, setPreview] = useState<number | null>(null)
  const track = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)
  const raf = useRef(0)
  const queued = useRef(0)
  const n = chunks.length

  useEffect(
    () => () => {
      if (raf.current) cancelAnimationFrame(raf.current)
    },
    [],
  )

  const indexAt = useCallback(
    (clientX: number) => {
      const el = track.current
      if (!el) return 0
      const rect = el.getBoundingClientRect()
      const x = Math.max(0, Math.min(rect.width - 0.01, clientX - rect.left))
      return Math.min(n - 1, Math.floor((x / rect.width) * n))
    },
    [n],
  )

  const queue = (i: number) => {
    queued.current = i
    if (raf.current) return
    raf.current = requestAnimationFrame(() => {
      raf.current = 0
      onSelect(queued.current, false)
    })
  }

  const down = (e: PointerEvent<HTMLDivElement>) => {
    if (!n) return
    e.preventDefault()
    track.current?.focus()
    track.current?.setPointerCapture(e.pointerId)
    dragging.current = true
    const i = indexAt(e.clientX)
    setPreview(i)
    onSelect(i, false)
  }

  const move = (e: PointerEvent<HTMLDivElement>) => {
    const i = indexAt(e.clientX)
    setPreview(i)
    if (dragging.current) queue(i)
  }

  const up = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return
    dragging.current = false
    const i = indexAt(e.clientX)
    onSelect(i, false)
    setPreview(i)
  }

  const leave = () => {
    if (!dragging.current) setPreview(null)
  }

  const key = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!n) return
    const next =
      e.key === 'Home'
        ? 0
        : e.key === 'End'
          ? n - 1
          : e.key === 'ArrowLeft'
            ? Math.max(0, active - 1)
            : e.key === 'ArrowRight'
              ? Math.min(n - 1, active + 1)
              : null
    if (next === null) return
    e.preventDefault()
    onSelect(next)
  }

  const shown = Math.max(0, Math.min(n - 1, preview ?? active))
  const chunk = chunks[shown]

  return (
    <div className="filmstrip fade-up">
      <div className="filmstrip-meta">
        <span className="edge" data-tip="filmstrip">▤</span>
        <span className="tabular-nums text-[10px] text-cream/70">
          <span className={preview === null ? 'text-amber' : 'text-cream/80'}>{pad3(shown + 1)}</span>
          <span className="text-cream/60"> / {pad3(n)}</span>
        </span>
        <span className="ml-auto">
          <FrameDigits chunk={chunk} />
        </span>
      </div>

      <div
        ref={track}
        role="slider"
        aria-label="filmstrip"
        aria-valuemin={1}
        aria-valuemax={n}
        aria-valuenow={shown + 1}
        aria-valuetext={`frame ${pad3(shown + 1)} of ${pad3(n)}, digits ${chunk.digits}`}
        tabIndex={0}
        className="filmstrip-track"
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
        onPointerLeave={leave}
        onKeyDown={key}
      >
        {chunks.map((c, i) => (
          <span
            key={c.key}
            aria-hidden
            className="filmstrip-cell"
            data-active={i === active ? '' : undefined}
            data-preview={i === preview && i !== active ? '' : undefined}
          />
        ))}
      </div>
    </div>
  )
}
