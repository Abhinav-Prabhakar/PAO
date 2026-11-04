import { useMemo, useState } from 'react'
import { AsciiArt } from './AsciiArt'
import { cachedArt, paoFor, personArt, type Chunk } from '../lib/ascii'
import { ROLE_ORDER, ROLES } from '../lib/roles'

const eyesOf = (n: number) => personArt(n)[2].replace(/[|]/g, '').trim().replace(/\s+/g, '_')

export function Codex({ chunks }: { chunks: Chunk[] }) {
  const used = useMemo(() => {
    const m = new Map<number, number>()
    chunks.forEach((c) => c.pairs.forEach((p) => m.set(p.n, (m.get(p.n) ?? 0) + 1)))
    return m
  }, [chunks])
  const [sel, setSel] = useState(() => chunks[0]?.pairs[0].n ?? 0)
  const pao = paoFor(sel)
  const words = [pao.person, pao.action, pao.object]

  return (
    <div className="fade-up flex flex-col gap-8 lg:flex-row lg:items-start">
      <div className="grid flex-1 grid-cols-10 gap-1 sm:gap-1.5">
        {Array.from({ length: 100 }, (_, n) => {
          const isUsed = used.has(n)
          return (
            <button
              key={n}
              data-hover
              onMouseEnter={() => setSel(n)}
              onFocus={() => setSel(n)}
              onClick={() => setSel(n)}
              className={`codex-cell relative flex aspect-square flex-col items-center justify-center overflow-hidden rounded-[3px] border font-mono ${
                sel === n ? 'border-amber bg-amber/10' : isUsed ? 'border-amber/25 bg-film-2' : 'border-cream/[0.06] bg-film/60'
              }`}
              style={{ animation: `fadeUp .5s ${n * 8}ms both` }}
            >
              <span className={`text-[9px] leading-none sm:text-xs ${isUsed ? 'text-amber' : 'text-cream/35'}`}>
                {String(n).padStart(2, '0')}
              </span>
              <span className="mt-1 hidden text-[8px] leading-none text-cream/30 sm:block">{eyesOf(n)}</span>
              {isUsed && <span className="absolute top-0.5 right-1 text-[8px] leading-none text-amber">•</span>}
            </button>
          )
        })}
      </div>

      <aside className="lg:sticky lg:top-6 lg:w-[360px]">
        <div className="frame animate-none!">
          <div className="sprockets" />
          <div className="gate mx-3 my-1 flex flex-col gap-4 p-4">
            <div className="flex items-baseline justify-between">
              <span className="text-4xl font-semibold tracking-[0.15em] text-cream">{pao.pair}</span>
              <span className="text-[10px] tracking-[0.2em] text-amber/70">
                {used.get(sel) ? '●'.repeat(Math.min(used.get(sel)!, 6)) : '○'}
              </span>
            </div>
            {ROLE_ORDER.map((role, i) => (
              <div key={role + sel} className="flex items-center gap-4 fade-up" style={{ animationDelay: `${i * 90}ms` }}>
                <div className="w-[100px] shrink-0">
                  <AsciiArt lines={cachedArt(role, sel)} role={role} size={12} delay={i * 120} />
                </div>
                <div className="min-w-0">
                  <div className={`text-[10px] tracking-[0.3em] role-${role} opacity-60`}>{ROLES[role].glyph}</div>
                  <div className={`truncate text-lg role-${role}`} style={{ textShadow: 'none' }}>{words[i]}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="sprockets mt-1" />
        </div>
      </aside>
    </div>
  )
}
