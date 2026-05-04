'use client'

const AUDIO_BARS = [8, 20, 36, 16, 28, 12, 32, 20, 8, 28, 36, 16, 24, 12, 20, 36, 8, 28]
const REPORT_LINES = [
  { width: '70%', delay: '0s' },
  { width: '55%', delay: '0.4s' },
  { width: '85%', delay: '0.8s' },
  { width: '60%', delay: '1.2s' },
  { width: '45%', delay: '1.6s' },
  { width: '75%', delay: '2s' },
  { width: '50%', delay: '2.4s' },
]

export function AnimatedAiDemo() {
  return (
    <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 shadow-2xl">
      {/* Window chrome */}
      <div className="bg-slate-800 px-4 py-2.5 flex items-center gap-2 text-[11px] text-slate-400 font-semibold">
        <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
        <span className="ml-2">Trascrizione → Referto AI</span>
      </div>

      <div className="grid grid-cols-2 min-h-[280px]">
        {/* Left: Audio */}
        <div className="p-5 border-r border-slate-800">
          <p className="text-[10px] font-bold uppercase tracking-widest text-red-400 mb-3">🎙 Audio visita</p>
          <div className="flex items-center gap-[3px] h-14 mb-4">
            {AUDIO_BARS.map((h, i) => (
              <span
                key={i}
                className="hp-audio-bar"
                style={{ animationDelay: `${i * 0.06}s`, height: `${h}px` }}
              />
            ))}
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            &ldquo;...il paziente riferisce dolore toracico da tre giorni, più intenso sotto sforzo.
            Nessuna irradiazione al braccio. Familiarità per cardiopatia ischemica...&rdquo;
          </p>
        </div>

        {/* Right: Generated report */}
        <div className="p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-purple-400 mb-3">🧠 Referto generato</p>
          <div className="flex flex-col gap-2 mb-4">
            {REPORT_LINES.map((line, i) => (
              <div
                key={i}
                className="hp-rtl"
                style={{ width: line.width, '--hp-delay': line.delay } as React.CSSProperties}
              />
            ))}
          </div>
          <div className="flex gap-1.5 flex-wrap">
            <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded font-bold">
              ICD-10: I20.0
            </span>
            <span className="text-[10px] bg-purple-950 text-purple-400 px-2 py-0.5 rounded font-bold">
              Angina pectoris
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
