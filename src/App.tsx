import { useCallback, useEffect, useMemo, useState } from 'react'
import { Cursor } from './components/Cursor'
import { FilmFX } from './components/FilmFX'
import { AsciiAnim, PROJECTOR_FRAMES, REEL_FRAMES, SPIN } from './components/AsciiAnim'
import { Frame, type ViewMode } from './components/Frame'
import { Projector } from './components/Projector'
import { Codex } from './components/Codex'
import { Trainer } from './components/Trainer'
import { PI_DIGITS, chunkDigits, randomDigits } from './lib/ascii'
import { ROLE_ORDER, ROLES } from './lib/roles'

const MAX = 1200
type Tab = 'reel' | 'codex' | 'trainer'

const LOGO: [string, string][] = [
  ['P', '█▀█\n█▀▀'],
  ['A', '▄▀█\n█▀█'],
  ['O', '█▀█\n█▄█'],
]

export default function App() {
  const [digits, setDigits] = useState(() => localStorage.getItem('pao-digits') ?? PI_DIGITS.slice(0, 96))
  const [tab, setTab] = useState<Tab>('reel')
  const [mode, setMode] = useState<ViewMode>('both')
  const [open, setOpen] = useState<number | null>(null)

  const chunks = useMemo(() => chunkDigits(digits), [digits])
  const fill = digits.length % 6 === 0 ? (digits.length ? 6 : 0) : digits.length % 6

  useEffect(() => {
    localStorage.setItem('pao-digits', digits)
  }, [digits])

  const onOpen = useCallback((i: number) => setOpen(i), [])
  const onClose = useCallback(() => setOpen(null), [])

  const set = (v: string) => setDigits(v.replace(/\D/g, '').slice(0, MAX))

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 pt-8 pb-16 sm:px-8">
      <FilmFX />
      <Cursor />

      {/* ───────── header ───────── */}
      {tab !== 'trainer' && (
        <header className="fade-up flex items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <AsciiAnim frames={REEL_FRAMES} fps={4} className="role-P" style={{ ['--fs' as string]: '7px' }} />
            <div className="flex gap-2.5">
              {LOGO.map(([r, art]) => (
                <pre
                  key={r}
                  className={`ascii role-${r}`}
                  style={{ ['--fs' as string]: '30px', lineHeight: 1, fontWeight: 800 }}
                >
                  {art}
                </pre>
              ))}
            </div>
          </div>
  
          <div className="flex items-center gap-4 text-xs sm:gap-6">
            {ROLE_ORDER.map((r) => (
              <span
                key={r}
                data-tip={ROLES[r].name}
                className={`role-${r} tracking-[0.2em] opacity-80 transition-opacity hover:opacity-100`}
                style={{ textShadow: 'none' }}
              >
                {ROLES[r].glyph}
              </span>
            ))}
          </div>
        </header>
      )}

      {/* ───────── input slate ───────── */}
      {tab !== 'trainer' && (
        <section className="slate fade-up relative mt-8 px-4 py-4" style={{ animationDelay: '120ms' }}>
          <span className="corner tl -top-1 -left-1">┌</span>
          <span className="corner tr -top-1 -right-1">┐</span>
          <span className="corner bl -bottom-1 -left-1">└</span>
          <span className="corner br -right-1 -bottom-1">┘</span>
  
          <div className="flex gap-3">
            <AsciiAnim frames={SPIN} fps={8} className="mt-[3px] w-3 text-amber" style={{ ['--fs' as string]: '14px' }} />
            <textarea
              value={digits}
              onChange={(e) => set(e.target.value)}
              onPaste={(e) => {
                e.preventDefault()
                const t = e.clipboardData.getData('text')
                const el = e.currentTarget
                set(digits.slice(0, el.selectionStart) + t + digits.slice(el.selectionEnd))
              }}
              spellCheck={false}
              rows={3}
              placeholder="3 1 4 1 5 9 …"
              aria-label="digits"
              className="h-[86px] w-full resize-none bg-transparent text-[15px] leading-6 tracking-[0.28em] break-all text-cream outline-none"
            />
          </div>
  
          <div className="mt-3 flex items-center justify-between gap-4 border-t border-cream/10 pt-3">
            <div className="flex items-center gap-4 text-xs text-cream/65">
              <span data-tip="digits" className="tabular-nums text-cream/80">
                {String(digits.length).padStart(4, '0')}
              </span>
              <span data-tip="next frame" className="tracking-[0.15em] text-amber">
                {'▰'.repeat(fill)}
                <span className="text-cream/45">{'▱'.repeat(6 - fill)}</span>
              </span>
              <span data-tip="frames" className="tabular-nums text-cream/80">
                ▤ {chunks.length}
              </span>
            </div>
            <div className="flex gap-2">
              <button className="btn" data-tip="π" aria-label="pi digits" onClick={() => set(PI_DIGITS)}>π</button>
              <button className="btn" data-tip="random" aria-label="random digits" onClick={() => set(randomDigits(96))}>⚄</button>
              <button className="btn" data-tip="clear" aria-label="clear" onClick={() => set('')}>✕</button>
            </div>
          </div>
        </section>
      )}

      {/* ───────── toolbar ───────── */}
      <nav
        className={`fade-up mb-6 flex items-center justify-between ${tab === 'trainer' ? 'mx-auto mt-0 w-full max-w-4xl' : 'mt-8'}`}
        style={{ animationDelay: '220ms' }}
      >
        <div className="flex gap-2">
          <button className="btn" aria-pressed={tab === 'reel'} data-tip="reel" aria-label="reel" onClick={() => setTab('reel')}>
            ▤▤▤
          </button>
          <button className="btn" aria-pressed={tab === 'codex'} data-tip="codex 00–99" aria-label="codex" onClick={() => setTab('codex')}>
            ▦
          </button>
          <button className="btn" aria-pressed={tab === 'trainer'} data-tip="trainer" aria-label="trainer" onClick={() => setTab('trainer')}>
            ◎
          </button>
        </div>
        <div
          className={`flex gap-2 transition-all duration-300 ${tab === 'reel' ? '' : 'pointer-events-none translate-x-2 opacity-0'}`}
        >
          <button className="btn" aria-pressed={mode === 'both'} data-tip="all" aria-label="show all" onClick={() => setMode('both')}>◧</button>
          <button className="btn" aria-pressed={mode === 'numbers'} data-tip="numbers · hover for images" aria-label="numbers only" onClick={() => setMode('numbers')}>#</button>
          <button className="btn" aria-pressed={mode === 'images'} data-tip="images · hover for numbers" aria-label="images only" onClick={() => setMode('images')}>☺</button>
        </div>
      </nav>

      {/* ───────── content ───────── */}
      <main className="flex-1">
        {tab === 'codex' ? (
          <Codex chunks={chunks} />
        ) : tab === 'trainer' ? (
          <Trainer />
        ) : chunks.length === 0 ? (
          <div className="fade-up flex flex-col items-center gap-6 py-16 text-amber/80">
            <AsciiAnim frames={PROJECTOR_FRAMES} fps={6} className="role-P" style={{ ['--fs' as string]: '15px' }} />
            <span className="blink text-lg">▌</span>
          </div>
        ) : (
          <div
            key={chunks.length === 0 ? 'e' : 'r'}
            className="grid gap-5"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(296px, 1fr))' }}
          >
            {chunks.map((c) => (
              <Frame key={c.key} chunk={c} mode={mode} onOpen={onOpen} />
            ))}
          </div>
        )}
      </main>

      <footer className="mt-16 text-center text-[10px] tracking-[0.4em] text-cream/55">
        ─────── ▸ 00 ─ 99 ◂ ───────
      </footer>

      {open !== null && <Projector chunks={chunks} index={Math.min(open, chunks.length - 1)} onIndex={setOpen} onClose={onClose} />}
    </div>
  )
}
