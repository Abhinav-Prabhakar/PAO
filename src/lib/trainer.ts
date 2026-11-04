import { paoFor, type Pao } from './ascii'

export type Drill = 'decode' | 'encode' | 'reel'
export type Triple = [Pao, Pao, Pao]

export interface Rep {
  /** The digits the user must produce, grouped by frame. */
  digits: string
  /** One frame for decode/encode, three for a reel run. */
  triples: Triple[]
  /** Encode only: four options per role, shuffled, correct included. */
  options?: Pao[][]
}

export interface TrainerStats {
  attempts: number
  correct: number
  bestStreak: number
  bestScore: number
  /** Most recent results, oldest → newest, max 5. */
  last: boolean[]
}

export type TrainerStore = Record<Drill, TrainerStats>

export const STORE_KEY = 'pao-trainer-v1'
export const SESSION_LEN: Record<Drill, number> = { decode: 10, encode: 10, reel: 5 }
export const SHOW_MS = 2000
export const HOLD_MS = 1000

export const DRILLS: Drill[] = ['decode', 'encode', 'reel']

export const DRILL_NAMES: Record<Drill, string> = {
  decode: 'words → digits',
  encode: 'digits → images',
  reel: 'sequence recall',
}

const rint = (n: number) => Math.floor(Math.random() * n)

export function digitsOf(t: Triple): string {
  return t.map((p) => p.pair).join('')
}

function shuffle<T>(items: T[]): T[] {
  const a = [...items]
  for (let i = a.length - 1; i > 0; i--) {
    const j = rint(i + 1)
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/** A frame avoids repeated pairs so each role pulls its weight. */
function randomTriple(): Triple {
  const a = rint(100)
  let b = rint(100)
  while (b === a) b = rint(100)
  let c = rint(100)
  while (c === a || c === b) c = rint(100)
  return [paoFor(a), paoFor(b), paoFor(c)]
}

function pick4(correct: number): Pao[] {
  const nums = new Set<number>([correct])
  while (nums.size < 4) nums.add(rint(100))
  return shuffle([...nums]).map(paoFor)
}

export function makeRep(drill: Drill): Rep {
  if (drill === 'reel') {
    const triples: Triple[] = []
    const seen = new Set<string>()
    while (triples.length < 3) {
      const t = randomTriple()
      const d = digitsOf(t)
      if (seen.has(d)) continue
      seen.add(d)
      triples.push(t)
    }
    return { triples, digits: triples.map(digitsOf).join('') }
  }

  const triple = randomTriple()
  if (drill === 'encode') {
    return {
      triples: [triple],
      digits: digitsOf(triple),
      options: triple.map((p) => pick4(p.n)),
    }
  }
  return { triples: [triple], digits: digitsOf(triple) }
}

export function scoreMarks(expected: string, got: string): boolean[] {
  return expected.split('').map((d, i) => d === got[i])
}

const blank = (): TrainerStats => ({ attempts: 0, correct: 0, bestStreak: 0, bestScore: 0, last: [] })

const num = (v: unknown, fallback = 0) => (typeof v === 'number' && Number.isFinite(v) ? v : fallback)

export function loadStats(): TrainerStore {
  const base: TrainerStore = { decode: blank(), encode: blank(), reel: blank() }
  try {
    const raw = localStorage.getItem(STORE_KEY)
    if (!raw) return base
    const parsed = JSON.parse(raw) as Partial<Record<Drill, Partial<TrainerStats>>>
    for (const k of DRILLS) {
      const s = parsed[k]
      if (!s || typeof s !== 'object') continue
      base[k] = {
        attempts: Math.max(0, num(s.attempts)),
        correct: Math.max(0, num(s.correct)),
        bestStreak: Math.max(0, num(s.bestStreak)),
        bestScore: Math.max(0, num(s.bestScore)),
        last: Array.isArray(s.last) ? s.last.slice(-5).map(Boolean) : [],
      }
    }
  } catch {
    /* storage is optional; never block the drill */
  }
  return base
}

export function saveStats(store: TrainerStore) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(store))
  } catch {
    /* storage is optional */
  }
}
