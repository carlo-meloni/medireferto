'use client'

import { useEffect, useRef } from 'react'

const CHAOS_ICONS = ['📄', '📁', '✒️', '🎙️', '📊', '📝', '🗒️', '🔏']
const WF_DELAYS = [0, 0.1, 0.2, 0.3, 0.4, 0.3, 0.2]
const LIVE_BAR_HEIGHTS = [8, 16, 24, 12, 20, 8, 28, 16, 12, 20, 8, 24, 16, 12, 8, 20, 24, 16, 8, 12]
const REPORT_WIDTHS = [60, 85, 72, 50, 78]

const ICON_SIZE = 40
const REPEL_RADIUS = 80
const REPEL_FORCE = 2.5
const MAX_SPEED = 3

interface IconState {
  x: number; y: number
  vx: number; vy: number
  rot: number; vr: number
}

export function ChaosHero() {
  const arenaRef = useRef<HTMLDivElement>(null)
  const iconRefs = useRef<(HTMLSpanElement | null)[]>([])
  const stateRef = useRef<IconState[]>([])
  const mouseRef = useRef({ x: -999, y: -999 })
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const arena = arenaRef.current
    if (!arena) return

    const W = arena.offsetWidth
    const H = arena.offsetHeight

    stateRef.current = iconRefs.current.map((el) => {
      const x = Math.random() * (W - ICON_SIZE)
      const y = Math.random() * (H - ICON_SIZE)
      if (el) {
        el.style.left = x + 'px'
        el.style.top = y + 'px'
      }
      return {
        x, y,
        vx: (Math.random() - 0.5) * 1.4,
        vy: (Math.random() - 0.5) * 1.4,
        rot: Math.random() * 360,
        vr: (Math.random() - 0.5) * 1.2,
      }
    })

    const onMouseMove = (e: MouseEvent) => {
      const rect = arena.getBoundingClientRect()
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }
    const onMouseLeave = () => { mouseRef.current = { x: -999, y: -999 } }

    arena.addEventListener('mousemove', onMouseMove)
    arena.addEventListener('mouseleave', onMouseLeave)

    const tick = () => {
      const cW = arena.offsetWidth
      const cH = arena.offsetHeight
      const { x: mx, y: my } = mouseRef.current

      stateRef.current.forEach((s, i) => {
        const el = iconRefs.current[i]
        if (!el) return

        const dx = s.x + ICON_SIZE / 2 - mx
        const dy = s.y + ICON_SIZE / 2 - my
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < REPEL_RADIUS && dist > 1) {
          const force = ((REPEL_RADIUS - dist) / REPEL_RADIUS) * REPEL_FORCE
          s.vx += (dx / dist) * force
          s.vy += (dy / dist) * force
        }

        const speed = Math.sqrt(s.vx * s.vx + s.vy * s.vy)
        if (speed > MAX_SPEED) {
          s.vx = (s.vx / speed) * MAX_SPEED
          s.vy = (s.vy / speed) * MAX_SPEED
        }

        s.vx *= 0.985; s.vy *= 0.985
        s.x += s.vx; s.y += s.vy; s.rot += s.vr

        if (s.x < 0)              { s.x = 0;              s.vx = Math.abs(s.vx) }
        if (s.x > cW - ICON_SIZE) { s.x = cW - ICON_SIZE; s.vx = -Math.abs(s.vx) }
        if (s.y < 0)              { s.y = 0;              s.vy = Math.abs(s.vy) }
        if (s.y > cH - ICON_SIZE) { s.y = cH - ICON_SIZE; s.vy = -Math.abs(s.vy) }

        el.style.transform = `rotate(${s.rot}deg)`
        el.style.left = s.x + 'px'
        el.style.top  = s.y + 'px'
      })

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafRef.current)
      arena.removeEventListener('mousemove', onMouseMove)
      arena.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 items-center w-full max-w-5xl">

      {/* Chaos box */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-md">
        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">
          ⚡ La burocrazia medica oggi...
        </p>
        <div ref={arenaRef} className="relative h-52 overflow-hidden rounded-lg bg-red-50">
          {CHAOS_ICONS.map((icon, i) => (
            <span
              key={i}
              ref={(el) => { iconRefs.current[i] = el }}
              className="hp-chaos-icon"
            >
              {icon}
            </span>
          ))}
        </div>
      </div>

      {/* Transform arrow */}
      <div className="flex flex-row md:flex-col items-center gap-2 mx-auto">
        <WaveformBars />
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl shadow-[0_0_0_0_rgba(59,130,246,.5)] hp-pulse-arrow shrink-0">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="md:block hidden">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="md:hidden">
            <line x1="12" y1="5" x2="12" y2="19" />
            <polyline points="5 12 12 19 19 12" />
          </svg>
        </div>
        <WaveformBars />
      </div>

      {/* Dashboard mockup */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
        <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-3">
          ✨ ...con Doctor Twin
        </p>
        <div className="grid grid-cols-[72px_1fr] gap-2.5 h-52">
          {/* Sidebar */}
          <div className="bg-slate-800 rounded-lg p-1.5 flex flex-col gap-1">
            {['🏥 Referti', '👤 Pazienti', '📂 Archivio', '⚙️ Config'].map((item, i) => (
              <div
                key={item}
                className={`px-1.5 py-1 rounded-md text-[9px] font-semibold truncate ${
                  i === 0 ? 'bg-blue-500 text-white' : 'text-slate-400'
                }`}
              >
                {item}
              </div>
            ))}
          </div>
          {/* Main */}
          <div className="flex flex-col gap-2 overflow-hidden">
            {/* Live waveform */}
            <div className="bg-slate-800 rounded-lg h-12 flex items-center px-2.5 gap-[3px]">
              {LIVE_BAR_HEIGHTS.map((h, i) => (
                <span
                  key={i}
                  className="hp-live-bar"
                  style={{ animationDelay: `${i * 0.07}s`, height: `${h}px` }}
                />
              ))}
            </div>
            {/* Report preview */}
            <div className="bg-slate-800 rounded-lg p-2 flex-1 flex flex-col gap-2">
              {REPORT_WIDTHS.map((w, i) => (
                <div
                  key={i}
                  className="hp-rtl"
                  style={{ width: `${w}%`, '--hp-delay': `${i * 0.3}s` } as React.CSSProperties}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

function WaveformBars() {
  return (
    <div className="flex gap-[3px] items-end h-7">
      {WF_DELAYS.map((delay, i) => (
        <span key={i} className="hp-wf-bar" style={{ animationDelay: `${delay}s` }} />
      ))}
    </div>
  )
}
