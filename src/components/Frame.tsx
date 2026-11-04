import { memo } from 'react'
import { AsciiArt } from './AsciiArt'
import { cachedArt, type Chunk } from '../lib/ascii'
import { ROLE_ORDER, ROLES } from '../lib/roles'

export type ViewMode = 'both' | 'numbers' | 'images'

interface Props {
  chunk: Chunk
  mode: ViewMode
  onOpen: (i: number) => void
}

function FrameBase({ chunk, mode, onOpen }: Props) {
  const num = String(chunk.index + 1).padStart(3, '0')
  const wordOf = (p: number) => [chunk.pairs[0].person, chunk.pairs[1].action, chunk.pairs[2].object][p]

  return (
    <article
      data-hover
      role="button"
      tabIndex={0}
      onClick={() => onOpen(chunk.index)}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onOpen(chunk.index)}
      className="frame group outline-none focus-visible:ring-1 focus-visible:ring-amber"
      style={{ animationDelay: `${(chunk.index % 12) * 55}ms` }}
    >
      <div className="sprockets" />
      <div className="flex items-center justify-between px-3 pb-1.5">
        <span className="edge">▸ {num}</span>
        <span className="edge reveal !text-amber">▶</span>
        <span className="edge">{num}A</span>
      </div>

      <div className="gate mx-3 grid grid-cols-3 gap-1 px-2 pt-3 pb-2">
        {ROLE_ORDER.map((role, p) => {
          const pair = chunk.pairs[p]
          return (
            <div key={role} className="flex min-w-0 flex-col items-center">
              <div className={`veil-wrap flex gap-[1px] text-[22px] font-semibold leading-none tracking-wider role-${role} ${mode === 'images' ? 'veil' : ''}`}>
                {pair.pair.split('').map((d, j) => (
                  <span key={j} style={{ opacity: p * 2 + j >= 6 - chunk.padded ? 0.28 : 1 }}>
                    {d}
                  </span>
                ))}
              </div>
              <div className={`mt-3 ${mode === 'numbers' ? 'veil' : ''}`}>
                <AsciiArt
                  lines={cachedArt(role, pair.n)}
                  role={role}
                  size={10}
                  delay={(chunk.index % 12) * 55 + p * 160 + 250}
                />
              </div>
              <div className={`reveal mt-2 h-4 w-full truncate text-center text-[10px] tracking-wide role-${role}`} style={{ textShadow: 'none' }}>
                {wordOf(p)}
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-1.5 flex items-center justify-center gap-3 pb-1 text-[9px] tracking-[0.3em]">
        {ROLE_ORDER.map((r) => (
          <span key={r} className={`role-${r} opacity-30 transition-opacity duration-300 group-hover:opacity-90`} style={{ textShadow: 'none' }}>
            {ROLES[r].glyph}
          </span>
        ))}
      </div>
      <div className="sprockets" />
    </article>
  )
}

export const Frame = memo(FrameBase)
