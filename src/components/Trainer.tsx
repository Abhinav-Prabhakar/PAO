import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import { AsciiAnim } from './AsciiAnim'
import { AsciiArt } from './AsciiArt'
import { cachedArt, type Pao, type Role } from '../lib/ascii'
import { ROLE_ORDER, ROLES } from '../lib/roles'
import {
  DRILLS,
  DRILL_NAMES,
  HOLD_MS,
  SESSION_LEN,
  SHOW_MS,
  digitsOf,
  loadStats,
  makeRep,
  saveStats,
  scoreMarks,
  type Drill,
  type Rep,
  type TrainerStore,
  type Triple,
} from '../lib/trainer'

type Phase = 'ready' | 'show' | 'input' | 'feedback' | 'summary'

interface Result {
  expected: string
  value: string
  hit: boolean
  marks: boolean[]
}

interface Session {
  hits: boolean[]
  streak: number
  best: number
}

const EMPTY_SESSION = (): Session => ({ hits: [], streak: 0, best: 0 })

const ROLE_VAR: Record<Role, string> = {
  P: 'var(--amber)',
  A: 'var(--sage)',
  O: 'var(--rust)',
}

const roleAt = (i: number) => ROLE_ORDER[Math.floor((i % 6) / 2)]

const wordOf = (role: Role, p: Pao) => (role === 'P' ? p.person : role === 'A' ? p.action : p.object)

const pad = (n: number) => String(n).padStart(2, '0')

function bar(value: number, width: number) {
  const filled = Math.max(0, Math.min(width, Math.round(value * width)))
  return '▰'.repeat(filled) + '▱'.repeat(width - filled)
}

function DrillIcon({ drill }: { drill: Drill }) {
  if (drill === 'reel') {
    return (
      <span className="ascii block text-center" style={{ ['--fs' as string]: '11px' }}>
        <span className="role-P">▤</span>
        <span className="role-A">▤</span>
        <span className="role-O">▤</span>
        <br />
        <span className="role-P">▤</span>
        <span className="role-A">▤</span>
        <span className="role-O">▤</span>
      </span>
    )
  }
  return (
    <span className="ascii whitespace-pre" style={{ ['--fs' as string]: '11px' }}>
      {drill === 'decode' ? (
        <>
          <span className="role-P">(o_o)</span>
          <span className="role-A">▸</span>
          <span className="text-cream/75">##</span>
        </>
      ) : (
        <>
          <span className="text-cream/75">##</span>
          <span className="role-A">▸</span>
          <span className="role-P">(o_o)</span>
        </>
      )}
    </span>
  )
}

function leader(n: string) {
  return [
    '    ┌───────────┐',
    '    │  \\  |  /  │',
    '    │   .---.   │',
    '    │  / ### \\  │',
    `    │ | ##${n}## | │`,
    '    │  \\ ### /  │',
    "    │   '---'   │",
    '    │  /  |  \\  │',
    '    └───────────┘',
  ].join('\n')
}
const LEADER_FRAMES = ['3', '2', '1'].map(leader)

/* ───────────── segmented digits ───────────── */

interface SegmentsProps {
  value: string
  length: number
  marks?: boolean[]
  cursor?: number | null
  size?: number
  /** Accessible name for prompts where the digits are the content (encode). */
  label?: string
}

function Segments({ value, length, marks, cursor = null, size = 40, label }: SegmentsProps) {
  return (
    <div
      className="flex items-end"
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {Array.from({ length }, (_, i) => {
        const ch = value[i] ?? ''
        const mark = marks?.[i]
        const role = roleAt(i)
        return (
          <span
            key={i}
            className="seg"
            data-mark={mark === undefined ? undefined : mark ? 'hit' : 'miss'}
            data-active={cursor === i ? '' : undefined}
            style={{
              fontSize: size,
              minWidth: size * 0.66,
              marginLeft: i > 0 && i % 2 === 0 ? size * 0.28 : 0,
              color: ch && mark === undefined ? ROLE_VAR[role] : undefined,
            }}
          >
            {ch ? ch : <span className="text-cream/15">·</span>}
          </span>
        )
      })}
    </div>
  )
}

function AnswerDigits({ value }: { value: string }) {
  return (
    <span className="text-[13px] tracking-[0.08em]">
      {value.split('').map((d, i) => (
        <span
          key={i}
          style={{ color: ROLE_VAR[roleAt(i)], marginLeft: i > 0 && i % 2 === 0 ? '0.35em' : 0 }}
        >
          {d}
        </span>
      ))}
    </span>
  )
}

function AnswerWords({ triple }: { triple: Triple }) {
  return (
    <span className="text-[10px] tracking-wide">
      <span className="role-P" style={{ textShadow: 'none' }}>{triple[0].person}</span>
      <span className="text-cream/20"> · </span>
      <span className="role-A" style={{ textShadow: 'none' }}>{triple[1].action}</span>
      <span className="text-cream/20"> · </span>
      <span className="role-O" style={{ textShadow: 'none' }}>{triple[2].object}</span>
    </span>
  )
}

/* ───────────── stage pieces ───────────── */

function Prompt({ p, role, size }: { p: Pao; role: Role; size: number }) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-1.5">
      <span
        className={`text-[9px] tracking-[0.2em] role-${role} opacity-60`}
        style={{ textShadow: 'none' }}
        data-tip={ROLES[role].name}
      >
        {ROLES[role].glyph}
      </span>
      <AsciiArt lines={cachedArt(role, p.n)} role={role} size={size} delay={80} instant />
      <span
        className={`max-w-[120px] truncate text-[10px] tracking-wide role-${role}`}
        style={{ textShadow: 'none' }}
      >
        {wordOf(role, p)}
      </span>
    </div>
  )
}

const ROW_WORDS = ['person', 'action', 'object'] as const

/* ───────────── trainer ───────────── */

export function Trainer() {
  const [drill, setDrill] = useState<Drill>('decode')
  const [phase, setPhase] = useState<Phase>('ready')
  const [rep, setRep] = useState<Rep | null>(null)
  const [repId, setRepId] = useState(0)
  const [typed, setTyped] = useState('')
  const [picks, setPicks] = useState<(Pao | null)[]>([null, null, null])
  const [result, setResult] = useState<Result | null>(null)
  const [frame, setFrame] = useState(0)
  const [elapsed, setElapsed] = useState(0)
  const [stats, setStats] = useState<TrainerStore>(() => loadStats())
  const [session, setSession] = useState<Session>(EMPTY_SESSION)

  const inputRef = useRef<HTMLInputElement>(null)
  const startedAt = useRef(0)
  const len = SESSION_LEN[drill]
  const score = session.hits.filter(Boolean).length
  const best = stats[drill].bestScore

  /* elapsed clock — answer time only */
  useEffect(() => {
    if (phase !== 'input') return
    startedAt.current = performance.now()
    setElapsed(0)
    const id = window.setInterval(() => {
      setElapsed((performance.now() - startedAt.current) / 1000)
    }, 100)
    return () => window.clearInterval(id)
  }, [phase, repId])

  /* reel reveal — one frame at a time, then hand over to input */
  useEffect(() => {
    if (phase !== 'show' || !rep) return
    if (frame >= rep.triples.length - 1) {
      const id = window.setTimeout(() => setPhase('input'), SHOW_MS)
      return () => window.clearTimeout(id)
    }
    const id = window.setTimeout(() => setFrame((f) => f + 1), SHOW_MS)
    return () => window.clearTimeout(id)
  }, [phase, frame, rep])

  /* keep the invisible numeric field focused while answering */
  useEffect(() => {
    if (phase === 'input' && drill !== 'encode') inputRef.current?.focus()
  }, [phase, drill, repId])

  const arm = useCallback(() => {
    setSession(EMPTY_SESSION())
    setRep(makeRep(drill))
    setRepId((n) => n + 1)
    setFrame(0)
    setTyped('')
    setPicks([null, null, null])
    setResult(null)
    setPhase(drill === 'reel' ? 'show' : 'input')
  }, [drill])

  const next = useCallback(() => {
    setTyped('')
    setPicks([null, null, null])
    setResult(null)
    if (session.hits.length >= SESSION_LEN[drill]) {
      setPhase('summary')
      return
    }
    setRep(makeRep(drill))
    setRepId((n) => n + 1)
    setFrame(0)
    setPhase(drill === 'reel' ? 'show' : 'input')
  }, [drill, session.hits.length])

  const submit = useCallback(
    (value: string) => {
      if (!rep || phase !== 'input') return
      const expected = rep.digits
      const hit = value === expected
      const nextStreak = hit ? session.streak + 1 : 0
      setResult({ expected, value, hit, marks: scoreMarks(expected, value) })
      setTyped(value)
      setSession({
        hits: [...session.hits, hit],
        streak: nextStreak,
        best: Math.max(session.best, nextStreak),
      })
      setPhase('feedback')
      setStats((prev) => {
        const cur = prev[drill]
        const updated: TrainerStore = {
          ...prev,
          [drill]: {
            attempts: cur.attempts + 1,
            correct: cur.correct + (hit ? 1 : 0),
            bestStreak: Math.max(cur.bestStreak, nextStreak),
            bestScore: cur.bestScore,
            last: [...cur.last, hit].slice(-5),
          },
        }
        saveStats(updated)
        return updated
      })
    },
    [rep, phase, session, drill],
  )

  const onType = useCallback(
    (raw: string) => {
      if (!rep || phase !== 'input') return
      const v = raw.replace(/\D/g, '').slice(0, rep.digits.length)
      setTyped(v)
      if (v.length === rep.digits.length) submit(v)
    },
    [rep, phase, submit],
  )

  const pick = useCallback(
    (slot: number, p: Pao) => {
      if (!rep || phase !== 'input') return
      const nextPicks = [...picks]
      nextPicks[slot] = p
      setPicks(nextPicks)
      if (nextPicks.every((v) => v !== null)) {
        submit(nextPicks.map((v) => v!.pair).join(''))
      }
    },
    [rep, phase, picks, submit],
  )

  /* settle feedback, then move on */
  useEffect(() => {
    if (phase !== 'feedback') return
    const id = window.setTimeout(next, HOLD_MS)
    return () => window.clearTimeout(id)
  }, [phase, repId, next])

  /* record the session score once per finish */
  useEffect(() => {
    if (phase !== 'summary') return
    const final = session.hits.filter(Boolean).length
    setStats((prev) => {
      if (final <= prev[drill].bestScore) return prev
      const updated: TrainerStore = { ...prev, [drill]: { ...prev[drill], bestScore: final } }
      saveStats(updated)
      return updated
    })
  }, [phase, drill, session.hits])

  const choose = (d: Drill) => {
    if (d === drill) return
    setDrill(d)
    setPhase('ready')
    setRep(null)
    setResult(null)
    setTyped('')
    setPicks([null, null, null])
    setSession(EMPTY_SESSION())
  }

  /* keys: arm, skip, assemble */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (phase === 'ready' && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault()
        arm()
      } else if (phase === 'feedback' && e.key === 'Enter') {
        e.preventDefault()
        next()
      } else if (phase === 'summary' && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault()
        arm()
      } else if (phase === 'input' && drill === 'encode' && /^[1-4]$/.test(e.key) && rep?.options) {
        e.preventDefault()
        const slot = picks.findIndex((p) => p === null)
        if (slot < 0) return
        const opt = rep.options[slot][Number(e.key) - 1]
        if (opt) pick(slot, opt)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase, drill, picks, rep, arm, next, pick])

  const cursor = phase === 'input' ? typed.length : null

  const stage = useMemo(() => {
    if (phase === 'ready') {
      return (
        <button
          onClick={arm}
          aria-label={`arm ${DRILL_NAMES[drill]} drill`}
          className="group flex flex-col items-center gap-4 outline-none focus-visible:ring-1 focus-visible:ring-amber"
        >
          <AsciiAnim frames={LEADER_FRAMES} fps={1.1} className="role-P opacity-80" style={{ ['--fs' as string]: '13px' }} />
          <span className="text-lg text-amber transition-transform duration-300 group-hover:scale-110">▶</span>
          <span className="edge transition-colors group-hover:text-amber">arm · ↵</span>
        </button>
      )
    }

    if (phase === 'summary') {
      return (
        <div className="flex flex-col items-center gap-4">
          <span className="edge">▸ session</span>
          <div className="text-4xl text-amber sm:text-5xl" style={{ letterSpacing: '0.08em' }}>
            {bar(score / len, len)}
          </div>
          <div className="text-2xl tabular-nums text-cream/85">
            {pad(score)}
            <span className="text-cream/25"> / {pad(len)}</span>
          </div>
          <div className="flex items-center gap-7 text-[10px] tracking-[0.15em] text-cream/45">
            <span data-tip="best streak · session">▲ {pad(session.best)}</span>
            <span data-tip="personal best · score">PB {bar(best / len, 5)}</span>
          </div>
          <button className="btn mt-1" onClick={arm} data-tip="replay · ↵" aria-label="replay session">↻</button>
        </div>
      )
    }

    if (!rep) return null

    /* ── encode: assemble the scene ── */
    if (drill === 'encode') {
      const correct = rep.triples[0]
      return (
        <div className="flex w-full max-w-3xl flex-col items-center gap-5">
          <Segments value={rep.digits} length={6} size={44} label={`digits ${rep.digits}`} />
          <div className="flex w-full flex-col gap-2">
            {ROLE_ORDER.map((role, slot) => {
              const options = rep.options![slot]
              const chosen = picks[slot]
              return (
                <div key={role} className="flex items-center gap-2 sm:gap-3">
                  <span
                    className={`w-8 shrink-0 text-center text-[10px] role-${role}`}
                    data-tip={ROW_WORDS[slot]}
                    style={{ textShadow: 'none' }}
                  >
                    {ROLES[role].glyph}
                  </span>
                  <div className="grid min-w-0 flex-1 grid-cols-4 gap-1.5">
                    {options.map((p, i) => {
                      const isPicked = chosen?.n === p.n
                      const isCorrect = phase === 'feedback' && p.n === correct[slot].n
                      const isMiss = phase === 'feedback' && isPicked && p.n !== correct[slot].n
                      return (
                        <button
                          key={p.n}
                          onClick={() => pick(slot, p)}
                          disabled={phase !== 'input'}
                          aria-pressed={isPicked}
                          aria-label={`${ROLES[role].name}: ${wordOf(role, p)}`}
                          data-picked={isPicked ? '' : undefined}
                          data-correct={isCorrect ? '' : undefined}
                          data-miss={isMiss ? '' : undefined}
                          className="option group flex flex-col items-center gap-1"
                          style={{ ['--accent' as string]: ROLE_VAR[role] }}
                        >
                          <span className="keycap absolute top-1 right-1.5">{i + 1}</span>
                          <AsciiArt lines={cachedArt(role, p.n)} role={role} size={7} delay={i * 40} instant />
                          <span
                            className={`w-full truncate text-center text-[8px] leading-none tracking-wide role-${role} opacity-55 transition-opacity group-hover:opacity-100`}
                            style={{ textShadow: 'none' }}
                          >
                            {wordOf(role, p)}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
          {result && (
            <div className="fade-up flex items-center gap-2 text-[11px]">
              <span className={result.hit ? 'text-sage' : 'text-rust'}>{result.hit ? '✓' : '✕'}</span>
              <AnswerWords triple={correct} />
            </div>
          )}
        </div>
      )
    }

    /* ── reel: study frames, then reproduce ── */
    if (drill === 'reel') {
      if (phase === 'show') {
        const t = rep.triples[frame]
        return (
          <div key={frame} className="advance flex flex-col items-center gap-4">
            <Segments value={digitsOf(t)} length={6} size={36} />
            <div className="grid grid-cols-3 gap-4 sm:gap-10">
              {ROLE_ORDER.map((role, p) => (
                <Prompt key={role} p={t[p]} role={role} size={11} />
              ))}
            </div>
            <div className="h-px w-44 bg-cream/10">
              <div
                key={frame}
                className="drain h-px bg-amber"
                style={{ ['--dur' as string]: `${SHOW_MS}ms` } as CSSProperties}
              />
            </div>
            <span className="edge">
              frame {pad(frame + 1)} / {pad(rep.triples.length)}
            </span>
          </div>
        )
      }

      return (
        <div className="flex w-full max-w-2xl flex-col items-center gap-4">
          <div className="relative flex flex-col gap-2">
            {rep.triples.map((_, f) => (
              <div key={f} className="flex items-center gap-3">
                <span className="edge w-6 tabular-nums">{pad(f + 1)}</span>
                <Segments
                  value={typed.slice(f * 6, f * 6 + 6)}
                  length={6}
                  marks={result?.marks.slice(f * 6, f * 6 + 6)}
                  cursor={
                    cursor !== null && cursor >= f * 6 && cursor < f * 6 + 6 ? cursor - f * 6 : null
                  }
                  size={30}
                />
                {phase === 'feedback' && (
                  <span className={result?.marks.slice(f * 6, f * 6 + 6).every(Boolean) ? 'text-sage' : 'text-rust'}>
                    {result?.marks.slice(f * 6, f * 6 + 6).every(Boolean) ? '✓' : '✕'}
                  </span>
                )}
              </div>
            ))}
            {phase === 'input' && (
              <input
                ref={inputRef}
                value={typed}
                onChange={(e) => onType(e.target.value)}
                inputMode="numeric"
                autoComplete="off"
                spellCheck={false}
                aria-label="reel digits"
                className="absolute inset-0 h-full w-full bg-transparent opacity-0 outline-none"
              />
            )}
          </div>
          {result && !result.hit && (
            <div className="fade-up flex flex-wrap items-center justify-center gap-2 text-[11px]">
              <span className="text-rust">✕</span>
              <AnswerDigits value={result.expected} />
            </div>
          )}
          <span className="edge">
            {phase === 'feedback' ? '▶ next' : 'type the reel'}
          </span>
        </div>
      )
    }

    /* ── decode: words → digits ── */
    const t = rep.triples[0]
    return (
      <div className="flex flex-col items-center gap-5">
        <div className="grid grid-cols-3 gap-3 sm:gap-9">
          {ROLE_ORDER.map((role, p) => (
            <Prompt key={role} p={t[p]} role={role} size={13} />
          ))}
        </div>
        <div className="relative">
          <Segments value={typed} length={6} marks={result?.marks} cursor={cursor} size={40} />
          {phase === 'input' && (
            <input
              ref={inputRef}
              value={typed}
              onChange={(e) => onType(e.target.value)}
              inputMode="numeric"
              autoComplete="off"
              spellCheck={false}
              aria-label="six digits"
              className="absolute inset-0 h-full w-full bg-transparent opacity-0 outline-none"
            />
          )}
        </div>
        <span className="edge">
          {phase === 'feedback' ? <span className={result?.hit ? 'text-sage' : 'text-rust'}>{result?.hit ? '✓ exact' : '✕'}</span> : '◂ type six digits ▸'}
        </span>
        {result && phase === 'feedback' && !result.hit && (
          <div className="fade-up -mt-3">
            <AnswerDigits value={result.expected} />
          </div>
        )}
      </div>
    )
  }, [phase, drill, rep, frame, picks, typed, cursor, result, score, len, session.best, best, arm, pick, onType])

  const dots = Array.from({ length: 5 }, (_, i) => {
    const hit = session.hits[session.hits.length - 5 + i]
    return hit === undefined ? null : hit
  })

  return (
    <div className="fade-up mx-auto w-full max-w-4xl">
      <div className="frame animate-none!">
        <div className="sprockets" />

        {/* console rail */}
        <div className="flex items-center justify-between gap-3 px-3 py-2">
          <span className="edge hidden sm:inline">▸ trainer</span>
          <div className="flex flex-1 items-center justify-center gap-2">
            {DRILLS.map((d) => (
              <button
                key={d}
                onClick={() => choose(d)}
                aria-pressed={drill === d}
                aria-label={DRILL_NAMES[d]}
                data-tip={DRILL_NAMES[d]}
                className="drill"
              >
                <DrillIcon drill={d} />
              </button>
            ))}
          </div>
          <span className="edge tabular-nums">
            {pad(session.hits.length)} / {pad(len)}
          </span>
        </div>

        <div className="gate mx-2 mb-2 sm:mx-3">
          {/* HUD */}
          <div className="flex items-center justify-between gap-3 border-b border-cream/10 px-3 py-2">
            <span className="flex items-center gap-1.5 text-[10px] tabular-nums text-cream/45">
              <span aria-hidden>◷</span>
              {phase === 'input' || phase === 'feedback' ? `${elapsed.toFixed(1)}s` : '—'}
            </span>

            <span className="flex items-center gap-1" data-tip="last five" aria-label="recent results">
              {dots.map((hit, i) => (
                <span
                  key={`${i}-${String(hit)}`}
                  className={`text-[8px] leading-none ${
                    hit === null ? 'text-cream/10' : hit ? 'text-amber' : 'text-rust/60'
                  }`}
                  aria-hidden
                >
                  {hit === null ? '○' : hit ? '●' : '╳'}
                </span>
              ))}
            </span>

            <span
              className="text-[10px] tracking-[0.18em] text-amber/60"
              data-tip="personal best"
              aria-label={`personal best ${best} of ${len}`}
            >
              {bar(best / len, 5)}
            </span>
          </div>

          <div className="relative flex min-h-[340px] items-center justify-center px-3 py-7 sm:min-h-[380px] sm:px-6">
            {stage}
          </div>
        </div>

        <div className="sprockets" />
      </div>
    </div>
  )
}
