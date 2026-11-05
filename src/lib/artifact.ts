import { article, cachedArt, type Chunk } from './ascii'
import { ROLE_ORDER, ROLES } from './roles'

const pad3 = (n: number) => String(n).padStart(3, '0')

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const thumb = (chunk: Chunk) =>
  chunk.digits.replace(/./g, (d, i) => (i >= 6 - chunk.padded ? '·' : d))

const sourceLabel = (source: string) => {
  try {
    const u = new URL(source)
    return `${u.host}${u.pathname}`
  } catch {
    return 'local'
  }
}

export function permalinkFor(digits: string) {
  const base = `${location.origin}${location.pathname}${location.search}`
  return digits ? `${base}#${digits}` : base
}

/** A clean plain-text copy of the whole reel, art included. */
export function reelText(chunks: Chunk[], digits: string, source: string) {
  const line = '─'.repeat(46)
  const head = [
    'PAO REEL',
    line,
    `${pad3(chunks.length)} frames · ${String(digits.length).padStart(4, '0')} digits`,
    `source ${sourceLabel(source)}`,
  ]
  const body = chunks.map((chunk) => {
    const words = [chunk.pairs[0].person, chunk.pairs[1].action, chunk.pairs[2].object]
    const arts = ROLE_ORDER.map((role, i) => cachedArt(role, chunk.pairs[i].n))
    const art = Array.from({ length: 7 }, (_, row) => '  ' + arts.map((a) => a[row]).join('   '))
    const block = [
      '',
      `▤ ${pad3(chunk.index + 1)} ${line.slice(0, 38)}`,
      `  ${thumb(chunk)}`,
      `  P ${chunk.pairs[0].pair} ${words[0]}`,
      `  A ${chunk.pairs[1].pair} ${words[1]}`,
      `  O ${chunk.pairs[2].pair} ${words[2]}`,
      `  ${words[0]} ${words[1]} with ${article(words[2])} ${words[2]}.`,
      '',
      ...art,
    ]
    return block.join('\n')
  })
  return [...head, ...body, '', line].join('\n')
}

/** A cream-paper zine contact sheet: one cell per frame, digits + words. */
export function contactSheetHtml(chunks: Chunk[], digits: string, source: string) {
  const cells = chunks
    .map((chunk) => {
      const pairs = chunk.pairs.map((p, i) => {
        const role = ROLE_ORDER[i]
        const cls = role.toLowerCase()
        const value = p.pair
          .split('')
          .map((d, j) => {
            const index = i * 2 + j
            const padded = index >= 6 - chunk.padded
            return `<span class="${padded ? 'pad' : ''}">${d}</span>`
          })
          .join('')
        return `<div class="pair ${cls}"><span class="pair-n">${value}</span><span class="pair-w">${escapeHtml(
          role === 'P' ? p.person : role === 'A' ? p.action : p.object,
        )}</span></div>`
      })

      return `<article class="cell">
  <div class="cell-head"><span class="n">${pad3(chunk.index + 1)}</span><span class="mark">▤</span></div>
  <div class="digits">${chunk.digits
    .split('')
    .map((d, i) => {
      const role = ROLE_ORDER[Math.floor(i / 2)].toLowerCase()
      const padded = i >= 6 - chunk.padded
      return `<span class="${role}${padded ? ' pad' : ''}">${d}</span>`
    })
    .join('')}</div>
  <div class="pairs">${pairs.join('')}</div>
</article>`
    })
    .join('\n')

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>PAO Reel — Contact Sheet</title>
<style>
  @page { size: A4 portrait; margin: 10mm; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; background: #f3ead6; color: #171008; }
  body {
    font-family: "JetBrains Mono", ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
    font-size: 8pt;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .sheet {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 8mm;
    border-bottom: 1.5px solid #171008;
    padding-bottom: 3mm;
    margin-bottom: 4mm;
  }
  h1 { margin: 0; font-size: 16pt; line-height: 1; letter-spacing: .22em; text-transform: uppercase; }
  .sub { margin-top: 2mm; font-size: 7pt; letter-spacing: .12em; opacity: .65; }
  .legend { font-size: 6.5pt; letter-spacing: .04em; text-align: right; line-height: 1.6; white-space: nowrap; }
  .legend .p { color: #8a5a10; }
  .legend .a { color: #2f6f62; }
  .legend .o { color: #9c3b24; }
  .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 3mm; }
  .cell {
    break-inside: avoid;
    min-height: 24mm;
    padding: 2.4mm 2.6mm;
    border: 1px solid rgba(23, 16, 8, .34);
  }
  .cell-head { display: flex; justify-content: space-between; align-items: baseline; }
  .n { font-size: 6.5pt; letter-spacing: .16em; opacity: .55; font-variant-numeric: tabular-nums; }
  .mark { font-size: 7pt; opacity: .45; }
  .digits {
    font-size: 13pt;
    font-weight: 700;
    line-height: 1.1;
    letter-spacing: .08em;
    margin: 1.2mm 0 1mm;
    font-variant-numeric: tabular-nums;
  }
  .digits span:nth-child(2n) { margin-right: 1.6mm; }
  .digits .p { color: #8a5a10; }
  .digits .a { color: #2f6f62; }
  .digits .o { color: #9c3b24; }
  .pad { opacity: .28; }
  .pairs { display: flex; flex-direction: column; gap: .5mm; }
  .pair { display: flex; gap: 1.4mm; align-items: baseline; min-width: 0; }
  .pair-n { font-size: 6.5pt; letter-spacing: .08em; opacity: .55; font-variant-numeric: tabular-nums; }
  .pair-w { font-size: 7.5pt; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .pair.p .pair-w { color: #8a5a10; }
  .pair.a .pair-w { color: #2f6f62; }
  .pair.o .pair-w { color: #9c3b24; }
  footer.sheet {
    margin-top: 4mm;
    padding-top: 2mm;
    border-top: 1px solid rgba(23, 16, 8, .4);
    font-size: 6.5pt;
    letter-spacing: .14em;
    display: flex;
    justify-content: space-between;
    opacity: .6;
  }
</style>
</head>
<body>
<header class="sheet">
  <div>
    <h1>PAO Reel</h1>
    <div class="sub">contact sheet · ${pad3(chunks.length)} frames · ${String(digits.length).padStart(4, '0')} digits · source ${escapeHtml(
      sourceLabel(source),
    )}</div>
  </div>
  <div class="legend"><span class="p">${ROLES.P.glyph} person</span><br><span class="a">${ROLES.A.glyph} action</span><br><span class="o">${ROLES.O.glyph} object</span></div>
</header>
<main class="grid">
${cells}
</main>
<footer class="sheet"><span>00–99 · personal number memory</span><span>▤ ${pad3(chunks.length)}</span></footer>
</body>
</html>`
}

export function downloadReel(chunks: Chunk[], digits: string, source: string) {
  if (!chunks.length) return
  const blob = new Blob([reelText(chunks, digits, source)], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `pao-reel-${chunks.length}f.txt`
  document.body.appendChild(a)
  a.click()
  a.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 1500)
}

export function printContactSheet(chunks: Chunk[], digits: string, source: string) {
  if (!chunks.length) return
  const frame = document.createElement('iframe')
  frame.setAttribute('aria-hidden', 'true')
  frame.tabIndex = -1
  frame.style.cssText = 'position:fixed;left:-10000px;top:0;width:794px;height:1123px;border:0;'
  frame.srcdoc = contactSheetHtml(chunks, digits, source)

  const cleanup = () => window.setTimeout(() => frame.remove(), 0)
  frame.addEventListener(
    'load',
    () => {
      const win = frame.contentWindow
      if (!win) return cleanup()
      win.addEventListener('afterprint', cleanup, { once: true })
      win.focus()
      win.print()
      window.setTimeout(() => {
        if (frame.isConnected) frame.remove()
      }, 60_000)
    },
    { once: true },
  )

  document.body.appendChild(frame)
}
