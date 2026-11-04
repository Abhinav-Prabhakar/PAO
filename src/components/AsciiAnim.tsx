import { useEffect, useState } from 'react'

interface Props {
  frames: string[]
  fps?: number
  className?: string
  style?: React.CSSProperties
}

/** Cycles through ASCII frames. */
export function AsciiAnim({ frames, fps = 5, className = '', style }: Props) {
  const [i, setI] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % frames.length), 1000 / fps)
    return () => clearInterval(id)
  }, [frames.length, fps])
  return (
    <pre aria-hidden className={`ascii ${className}`} style={style}>
      {frames[i]}
    </pre>
  )
}

export const REEL_FRAMES = [
  ['   .-"""-.   ', '  /   O   \\  ', '|  O (+) O  |', '  \\   O   /  ', "   '-...-'   "].join('\n'),
  ['   .-"""-.   ', '  / O   O \\  ', '|    (+)    |', '  \\ O   O /  ', "   '-...-'   "].join('\n'),
]

export const SPIN = ['|', '/', '-', '\\']

export const PROJECTOR_FRAMES = [
  [
    '      .-.   .-.        ',
    '     ( o ) ( o )       ',
    '  .---`-´---`-´---.    ',
    '  |  ___________  |=>>>',
    '  | |▒▓█ 314 █▓▒| |=>>>',
    '  |_|___________|_|    ',
    '   /_/         \\_\\     ',
  ].join('\n'),
  [
    '      .-.   .-.        ',
    '     ( + ) ( + )       ',
    '  .---`-´---`-´---.    ',
    '  |  ___________  |->>>',
    '  | |░▒▓ 159 ▓▒░| |->>>',
    '  |_|___________|_|    ',
    '   /_/         \\_\\     ',
  ].join('\n'),
]
