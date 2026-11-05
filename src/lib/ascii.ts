import { ACTIONS, OBJECTS, PERSONS } from './words'
import { OBJECT_SPRITES } from './sprites'

export const ART_W = 13
export const ART_H = 7

export type Role = 'P' | 'A' | 'O'

function mulberry32(seed: number) {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function center(s: string, w: number) {
  const total = Math.max(0, w - s.length)
  const left = Math.floor(total / 2)
  return ' '.repeat(left) + s + ' '.repeat(total - left)
}

/* ───────────── PERSON: procedural portrait ───────────── */

const HAIR_TOP = [
  `.-"""""-.`, `.:#####:.`, `/\\/\\/\\/\\/\\`, `,wwwwwww,`, `_.=====._`,
  `.oOOOOOo.`, `.-^^^^^-.`, `_/~~~~~\\_`, `.'#####'.`, `_.-~~~-._`,
]
const HAIR_FRINGE = [
  '         ', '~~~~~~~~~', '#########', "'.'.'.'.'", '/////////',
  '"""""""""', '|||||||||', '^^^^^^^^^', 'vvvvvvvvv', '=========',
]
const EYES: [string, string][] = [
  ['o', 'o'], ['O', 'O'], ['-', '-'], ['^', '^'], ['x', 'x'],
  ['@', '@'], ['*', '*'], ['.', '.'], ['>', '<'], ['0', 'o'],
]
const NOSES = ['|', 'L', 'v', '<', ',', '^']
const MOUTHS = ['\\___/', '-----', '~~~~~', '\\_O_/', '=====', '/---\\']
const COLLARS = [`__/'-----'\\__`, `__/ \\___/ \\__`, `_/|  VVV  |\\_`]

export function personArt(n: number): string[] {
  const a = Math.floor(n / 10)
  const b = n % 10
  const glasses = (a + b) % 3 === 0
  const beard = (a * 2 + b) % 4 === 1
  const [l, r] = EYES[b]
  const eyes = glasses ? `(${l})-(${r})` : `${l}   ${r}`
  const nose = NOSES[(a + b * 2) % NOSES.length]
  const mouth = MOUTHS[(a * 3 + b) % MOUTHS.length]
  return [
    center(HAIR_TOP[a], ART_W),
    '/' + center(HAIR_FRINGE[a], 11) + '\\',
    '|' + center(eyes, 11) + '|',
    '|' + center(nose, 11) + '|',
    '|' + center(mouth, 11) + '|',
    ' \\' + center(beard ? '#########' : "'.___.'", 9).slice(0, 9) + '/ '.slice(0, 2),
    COLLARS[(a + b) % COLLARS.length],
  ].map((row) => row.slice(0, ART_W).padEnd(ART_W, ' '))
}

/* ───────────── ACTION: stick figure + motion fx ───────────── */

const POSES: string[][] = [
  ['  \\O/  ', '   |   ', '   |   ', '  / \\  ', ' _/ \\_ '],
  ['   O   ', ' _/|\\  ', '   |   ', '  / \\  ', ' _/  \\_'],
  ['  \\O/  ', '   |   ', '  /_\\  ', ' _/ \\_ ', '       '],
  ['   O   ', '  /|\\  ', '   | __', '  / /  ', ' _/    '],
  ['   O   ', '  /|\\  ', '   |___', '   |  |', '  _|  |'],
  [' \\ O / ', '  \\|/  ', '   |   ', '  / >  ', ' _/  \\ '],
  ['   O   ', ' o=|   ', '   |==>', '  / \\  ', ' _/ \\_ '],
  ['       ', '   O   ', '  /|\\  ', '  _|_  ', ' /   \\ '],
  ['-=-O-=-', '   |   ', '  /_\\  ', '       ', '  ^ ^  '],
  ['  \\ /  ', '   |   ', '  /|\\  ', '   O   ', ' ===== '],
]
const FX = ['*+.', '=-~', '<>/', '#%@', '.:\'', '$!?', 'oO0', '/\\|', '~^`', '+x*']
const GROUND = ['_', '=', '~', '.', '-', '^', '#', ':', '_', '=']

export function actionArt(n: number): string[] {
  const a = Math.floor(n / 10)
  const b = n % 10
  const rng = mulberry32(n * 7919 + 13)
  const fx = FX[b]
  const pick = () => (rng() < 0.5 ? fx[Math.floor(rng() * fx.length)] : ' ')
  const side = () => pick() + pick() + pick()
  const rows: string[] = []
  let top = ''
  for (let i = 0; i < ART_W; i++) top += rng() < 0.28 ? fx[Math.floor(rng() * fx.length)] : ' '
  rows.push(top)
  for (const line of POSES[a]) rows.push(side() + line.padEnd(7, ' ').slice(0, 7) + side())
  rows.push(GROUND[b].repeat(ART_W))
  return rows
}

/* ───────────── OBJECT: hand-authored sprites ───────────── */

export function objectArt(n: number): string[] {
  const i = Number.isFinite(n) ? Math.min(OBJECT_SPRITES.length - 1, Math.max(0, Math.floor(n))) : 0
  return OBJECT_SPRITES[i]
}

export function artFor(role: Role, n: number): string[] {
  return role === 'P' ? personArt(n) : role === 'A' ? actionArt(n) : objectArt(n)
}

const cache = new Map<string, string[]>()
export function cachedArt(role: Role, n: number) {
  const k = role + n
  let v = cache.get(k)
  if (!v) {
    v = artFor(role, n)
    cache.set(k, v)
  }
  return v
}

/* ───────────── PAO lookup & chunking ───────────── */

export interface Pao {
  n: number
  pair: string
  person: string
  action: string
  object: string
}

export function paoFor(n: number): Pao {
  return {
    n,
    pair: String(n).padStart(2, '0'),
    person: PERSONS[n],
    action: ACTIONS[n],
    object: OBJECTS[n],
  }
}

export interface Chunk {
  index: number
  digits: string // always 6 chars (zero padded)
  padded: number // how many trailing digits are padding
  pairs: [Pao, Pao, Pao]
  key: string
}

export function chunkDigits(raw: string): Chunk[] {
  const clean = raw.replace(/\D/g, '')
  const chunks: Chunk[] = []
  for (let i = 0; i < clean.length; i += 6) {
    const slice = clean.slice(i, i + 6)
    const padded = 6 - slice.length
    const digits = slice.padEnd(6, '0')
    chunks.push({
      index: chunks.length,
      digits,
      padded,
      key: `${chunks.length}-${digits}-${padded}`,
      pairs: [
        paoFor(Number(digits.slice(0, 2))),
        paoFor(Number(digits.slice(2, 4))),
        paoFor(Number(digits.slice(4, 6))),
      ],
    })
  }
  return chunks
}

export function article(word: string) {
  if (/^(hour|honest|heir)/i.test(word)) return 'an'
  if (/^(uni|use|usu|eu|ewe|one)/i.test(word)) return 'a'
  return /^[aeiou]/i.test(word) ? 'an' : 'a'
}

export const PI_DIGITS =
  '314159265358979323846264338327950288419716939937510582097494459230781640628620899862803482534211706798214808651328230664709384460955058223172535940812848111745028410270193852110555964462294895493038196'

export function randomDigits(n: number) {
  let s = ''
  for (let i = 0; i < n; i++) s += Math.floor(Math.random() * 10)
  return s
}
