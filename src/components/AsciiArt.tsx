import { useCallback, useEffect, useRef } from 'react'
import type { Role } from '../lib/ascii'

const NOISE = '░▒▓#*+:.%@'
const reduce = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

interface Props {
  lines: string[]
  role: Role
  size?: number
  delay?: number
  className?: string
  /** Render the finished frame immediately instead of waiting for the viewport. */
  instant?: boolean
}

/** ASCII art that "develops" like a photo: noise resolves cell by cell. */
export function AsciiArt({ lines, role, size = 10, delay = 0, className = '', instant = false }: Props) {
  const ref = useRef<HTMLPreElement>(null)
  const raf = useRef(0)
  const timer = useRef<number>(0)

  const develop = useCallback(
    (duration = 750, wait = 0) => {
      const el = ref.current
      if (!el) return
      cancelAnimationFrame(raf.current)
      clearTimeout(timer.current)
      if (reduce()) {
        el.textContent = lines.join('\n')
        return
      }
      const H = lines.length
      const W = lines[0].length
      const thr = lines.map((row, r) =>
        row.split('').map((_, c) => ((c / W + r / H) / 2) * 0.55 + Math.random() * 0.45),
      )
      const draw = (t: number) =>
        lines
          .map((row, r) =>
            row
              .split('')
              .map((ch, c) => {
                if (t >= thr[r][c]) return ch
                return ch === ' ' && Math.random() < 0.6 ? ' ' : NOISE[Math.floor(Math.random() * NOISE.length)]
              })
              .join(''),
          )
          .join('\n')
      el.textContent = lines.map((l) => l.replace(/./g, ' ')).join('\n')
      timer.current = window.setTimeout(() => {
        const start = performance.now()
        let last = 0
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration)
          if (now - last > 45 || t >= 1) {
            last = now
            el.textContent = draw(t * 1.02)
          }
          if (t < 1) raf.current = requestAnimationFrame(tick)
        }
        raf.current = requestAnimationFrame(tick)
      }, wait)
    },
    [lines],
  )

  // develop when scrolled into view (and whenever the art changes)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (instant) {
      el.textContent = lines.join('\n')
      return
    }
    el.textContent = lines.map((l) => l.replace(/./g, ' ')).join('\n')
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          develop(750, delay)
          io.disconnect()
        }
      },
      { threshold: 0.2 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf.current)
      clearTimeout(timer.current)
    }
  }, [lines, develop, delay, instant])

  return (
    <pre
      ref={ref}
      aria-hidden
      onMouseEnter={() => develop(420, 0)}
      className={`ascii role-${role} ${className}`}
      style={{ ['--fs' as string]: `${size}px` }}
    />
  )
}
