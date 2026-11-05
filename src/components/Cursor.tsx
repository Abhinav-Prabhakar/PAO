import { useEffect, useRef } from 'react'

const TRAIL = ['@', '%', '#', '*', '+', '=', '-', ':', '.']
const IDLE = ['+', '*', '+', 'x']

/** ASCII cursor: crosshair head, glyph trail, bracket on hover, burst on click. */
export function Cursor() {
  const head = useRef<HTMLPreElement>(null)
  const trail = useRef<(HTMLSpanElement | null)[]>([])

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    const h = head.current!
    const mouse = { x: -100, y: -100 }
    const pos = TRAIL.map(() => ({ x: -100, y: -100 }))
    let state: 'idle' | 'link' | 'text' | 'down' = 'idle'
    let frame = 0
    let raf = 0
    let hp = { x: -100, y: -100 }
    let down = false

    const render = () => {
      if (state === 'link') h.textContent = '┌   ┐\n  ●  \n└   ┘'
      else if (state === 'text') h.textContent = ' ╷ \n │ \n ╵ '
      else if (state === 'down') h.textContent = ' # \n###\n # '
      else h.textContent = ` | \n-${IDLE[frame % IDLE.length]}-\n | `
      h.className = 'cur-head ' + (state === 'link' ? 'link' : state === 'down' ? 'down' : '')
    }
    const setState = (s: typeof state) => {
      if (s !== state) {
        state = s
        render()
      }
    }

    const move = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
      h.style.opacity = '1'
      const t = e.target as HTMLElement | null
      if (!down) {
        if (t?.closest('textarea,input')) setState('text')
        else if (t?.closest('button,a,[data-hover],[role=button],[role=slider]')) setState('link')
        else setState('idle')
      }
    }
    const leave = () => (h.style.opacity = '0')
    const press = (e: MouseEvent) => {
      down = true
      setState('down')
      // burst
      const chars = '*+.:#x'
      for (let i = 0; i < 10; i++) {
        const el = document.createElement('span')
        el.className = 'burst'
        el.textContent = chars[Math.floor(Math.random() * chars.length)]
        const a = (i / 10) * Math.PI * 2 + Math.random() * 0.5
        const d = 24 + Math.random() * 28
        el.style.left = e.clientX + 'px'
        el.style.top = e.clientY + 'px'
        el.style.setProperty('--dx', Math.cos(a) * d + 'px')
        el.style.setProperty('--dy', Math.sin(a) * d + 'px')
        el.style.setProperty('--rot', (Math.random() * 180 - 90) + 'deg')
        document.body.appendChild(el)
        setTimeout(() => el.remove(), 750)
      }
    }
    const release = (e: MouseEvent) => {
      down = false
      const t = e.target as HTMLElement | null
      setState(t?.closest('textarea,input') ? 'text' : t?.closest('button,a,[data-hover],[role=button],[role=slider]') ? 'link' : 'idle')
    }

    const loop = () => {
      hp.x += (mouse.x - hp.x) * 0.6
      hp.y += (mouse.y - hp.y) * 0.6
      h.style.transform = `translate3d(${hp.x}px,${hp.y}px,0) translate(-50%,-50%)`
      let prev = hp
      pos.forEach((p, i) => {
        p.x += (prev.x - p.x) * 0.38
        p.y += (prev.y - p.y) * 0.38
        const el = trail.current[i]
        if (el) {
          const dist = Math.hypot(p.x - mouse.x, p.y - mouse.y)
          const vis = Math.min(1, dist / 10)
          el.style.transform = `translate3d(${p.x}px,${p.y}px,0) translate(-50%,-50%) scale(${1 - i * 0.07})`
          el.style.opacity = String((1 - i / TRAIL.length) * 0.7 * vis)
        }
        prev = p
      })
      raf = requestAnimationFrame(loop)
    }

    render()
    const idleTimer = setInterval(() => {
      frame++
      if (state === 'idle') render()
    }, 220)
    window.addEventListener('mousemove', move)
    window.addEventListener('mousedown', press)
    window.addEventListener('mouseup', release)
    document.addEventListener('mouseleave', leave)
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      clearInterval(idleTimer)
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mousedown', press)
      window.removeEventListener('mouseup', release)
      document.removeEventListener('mouseleave', leave)
    }
  }, [])

  return (
    <>
      {TRAIL.map((c, i) => (
        <span key={i} ref={(el) => { trail.current[i] = el }} className="cur-trail" style={{ opacity: 0 }}>
          {c}
        </span>
      ))}
      <pre ref={head} className="cur-head" style={{ opacity: 0 }} />
    </>
  )
}
