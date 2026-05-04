import './homepage.css'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { auth } from '@/auth'
import { HomeNavbar } from '@/components/home/HomeNavbar'
import { ChaosHero } from '@/components/home/ChaosHero'
import { AnimatedAiDemo } from '@/components/home/AnimatedAiDemo'
import { RevealController } from '@/components/home/RevealController'

// ─── SEO ──────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'Doctor Twin — Refertazione Medica con AI',
  description:
    'Il tuo Digital Twin per refertare, con te. Trascrive la visita, comprende il contenuto e propone il referto — dalla registrazione vocale all\'esportazione PDF in pochi secondi.',
  keywords: [
    'refertazione medica',
    'AI medica',
    'trascrizione medica',
    'referto digitale',
    'digital twin medico',
    'Doctor Twin',
  ],
  openGraph: {
    title: 'Doctor Twin — Refertazione Medica con AI',
    description:
      'Il tuo Digital Twin per refertare, con te. Trascrive, comprende e propone il referto automaticamente.',
    url: '/',
    siteName: 'Doctor Twin',
    images: [{ url: '/logo.webp', width: 900, height: 900, alt: 'Doctor Twin logo' }],
    locale: 'it_IT',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Doctor Twin — Refertazione Medica con AI',
    description: 'Il tuo Digital Twin per refertare, con te.',
    images: ['/logo.webp'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

// ─── Feature cards data ────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: '🎙️',
    color: 'bg-red-50 text-red-500',
    title: 'Registrazione Vocale',
    desc: 'Avvia la registrazione direttamente dal browser durante la visita. Nessun hardware aggiuntivo richiesto.',
  },
  {
    icon: '⚡',
    color: 'bg-blue-50 text-blue-500',
    title: 'Trascrizione Istantanea',
    desc: 'Il parlato viene trascritto in testo strutturato in pochi secondi grazie all\'API Gemini.',
  },
  {
    icon: '🧠',
    color: 'bg-purple-50 text-purple-500',
    title: 'Refertazione AI',
    desc: 'L\'AI genera automaticamente anamnesi, esame obiettivo, diagnosi e terapia in formato clinico standard.',
  },
  {
    icon: '📄',
    color: 'bg-slate-100 text-slate-500',
    title: 'Export PDF Professionale',
    desc: 'Il referto approvato viene esportato su carta intestata dello studio, con firma e timbro digitale.',
  },
  {
    icon: '🗂️',
    color: 'bg-emerald-50 text-emerald-500',
    title: 'Archivio Storico',
    desc: 'Tutte le visite, referti e audio archiviate e consultabili per paziente, data e specializzazione.',
  },
  {
    icon: '🔒',
    color: 'bg-sky-50 text-sky-500',
    title: 'Sicurezza Dati (GDPR)',
    desc: 'Dati cifrati, hosting europeo, controllo accessi per ruolo. Conforme al GDPR e alle normative sanitarie italiane.',
  },
]

const AI_CHECKS = [
  'Codifica automatica ICD-10',
  'Correzione terminologia specialistica',
  'Anamnesi, esame obiettivo, diagnosi, terapia',
  'Riconoscimento farmaci e dosaggi',
  'Revisione e modifica inline prima della firma',
  'Note private del medico (non incluse nel PDF)',
]

// ─── Page ─────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const session = await auth()
  return (
    <>
      <RevealController />
      <HomeNavbar role={session?.user?.role} />

      <main>

        {/* ── Hero ────────────────────────────────────────────────────── */}
        <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-28 pb-16 text-center">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight bg-gradient-to-br from-slate-900 via-blue-800 to-teal-700 bg-clip-text text-transparent max-w-3xl mb-5">
            Più tempo per il paziente,<br />meno per la burocrazia
          </h1>
          <p className="text-lg text-slate-500 max-w-xl mb-10">
            Doctor Twin trascrive la visita, genera il referto con AI e lo esporta in PDF
            su carta intestata — tutto in pochi secondi.
          </p>
         
          <ChaosHero />
        </section>

        {/* ── Features ────────────────────────────────────────────────── */}
        <section id="vantaggi" className="max-w-6xl mx-auto px-6 py-24">
          <div className="hp-reveal">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full mb-4">
              ✦ Funzionalità
            </span>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-3">
              Tutto il workflow clinico,<br />in un&apos;unica piattaforma
            </h2>
            <p className="text-slate-500 text-lg max-w-lg">
              Dalla registrazione vocale all&apos;esportazione PDF firmata — senza toccare la tastiera durante la visita.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
            {FEATURES.map((f) => (
              <div key={f.title} className="hp-reveal bg-white border border-slate-200 rounded-xl p-7 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 ${f.color}`}>
                  {f.icon}
                </div>
                <h3 className="font-bold text-base mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── AI Section ──────────────────────────────────────────────── */}
        <section id="ai" className="bg-white border-y border-slate-200">
          <div className="max-w-6xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

            <div className="hp-reveal">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-purple-600 bg-purple-50 border border-purple-200 px-3 py-1.5 rounded-full mb-5">
                <LayersIcon />
                Medical Grade AI
              </span>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-4">
                Intelligenza clinica<br />al servizio del medico
              </h2>
              <p className="text-slate-500 text-lg mb-6">
                Il modello AI è ottimizzato per la terminologia medica italiana, con capacità avanzate di strutturazione del documento clinico.
              </p>
              <ul className="space-y-3">
                {AI_CHECKS.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm">
                    <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] font-black flex items-center justify-center shrink-0">
                      ✓
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="hp-reveal">
              <AnimatedAiDemo />
            </div>

          </div>
        </section>

        {/* ── Pricing ─────────────────────────────────────────────────── */}
        {/* <section id="prezzi" className="max-w-6xl mx-auto px-6 py-24">
          <div className="hp-reveal text-center mb-12">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full mb-4">
              ✦ Prezzi
            </span>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-3">Semplice, trasparente</h2>
            <p className="text-slate-500 text-lg">
              Nessun costo nascosto. Inizia gratis e passa allo studio professionale quando sei pronto.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">

            <div className="hp-reveal bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">Medico Singolo</p>
              <div className="text-5xl font-black tracking-tighter mb-1">
                <span className="text-xl font-semibold align-top mt-2 inline-block">€</span>0
              </div>
              <p className="text-sm text-slate-400 mb-6">per sempre · piano test</p>
              <ul className="space-y-2.5 mb-8 text-sm">
                {['5 referti al mese', 'Trascrizione AI', 'Export PDF standard', '1 profilo medico'].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="text-emerald-500 font-black text-xs">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/login" className="block text-center px-5 py-2.5 rounded-lg text-sm font-semibold border border-slate-200 hover:bg-slate-50 transition-colors text-slate-900 no-underline">
                Inizia gratis
              </Link>
            </div>

            <div className="hp-reveal relative bg-white border-2 border-blue-500 rounded-xl p-8 shadow-[0_0_0_4px_rgba(59,130,246,.12)]">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-[10px] font-black uppercase tracking-widest px-3.5 py-1 rounded-full whitespace-nowrap">
                ⭐ Consigliato
              </div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-2">Studio Professionale</p>
              <div className="text-5xl font-black tracking-tighter mb-1">
                <span className="text-xl font-semibold align-top mt-2 inline-block">€</span>49
              </div>
              <p className="text-sm text-slate-400 mb-6">al mese · fatturazione annua</p>
              <ul className="space-y-2.5 mb-8 text-sm">
                {[
                  'Referti illimitati',
                  'PDF su carta intestata personalizzata',
                  'Firma digitale',
                  'Archivio storico completo',
                  'Fino a 5 medici',
                  'Supporto prioritario',
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="text-emerald-500 font-black text-xs">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <a href="#" className="block text-center px-5 py-2.5 rounded-lg text-sm font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-[0_2px_12px_rgba(59,130,246,.35)] hover:-translate-y-px hover:shadow-[0_4px_20px_rgba(59,130,246,.45)] transition-all no-underline">
                Attiva Studio
              </a>
            </div>

          </div>
        </section> */}

        {/* ── CTA Banner ──────────────────────────────────────────────── */}
        <div className="hp-reveal max-w-6xl mx-auto px-6 pb-24">
          <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-teal-900 rounded-2xl px-8 py-16 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-3">
              Rivoluziona il tuo modo di visitare
            </h2>
            <p className="text-white/70 text-lg mb-8">
              Unisciti ai medici che hanno già ridotto il tempo burocratico dell&apos;80%.
              Prova Doctor Twin senza impegno.
            </p>
            <a
              href="#"
              className="inline-flex items-center gap-2 bg-white text-blue-900 font-black px-8 py-3.5 rounded-xl text-base shadow-[0_4px_20px_rgba(0,0,0,.2)] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,0,0,.3)] transition-all no-underline"
            >
              <CalendarIcon />
              Richiedi Demo
            </a>
          </div>
        </div>

      </main>

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <footer className="bg-slate-950 text-slate-400">
        <div className="max-w-6xl mx-auto px-6 pt-12 pb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-slate-800">

            <div className="lg:col-span-1">
              <Link href="/" className="flex items-center gap-2 font-bold text-lg text-slate-200 no-underline mb-3">
                <Image src="/logo.webp" alt="Doctor Twin" width={36} height={36} className="rounded-lg" />
                Doctor Twin
              </Link>
              <p className="text-sm leading-relaxed max-w-xs">
                Refertazione medica automatizzata con AI. Dalla registrazione vocale all&apos;esportazione PDF in pochi secondi.
              </p>
            </div>

            <FooterCol
              title="Prodotto"
              links={[
           
                { label: 'Changelog', href: '#' },
              ]}
            />

            <FooterCol
              title="Legale"
              links={[
                { label: 'Privacy Policy', href: '#' },
                { label: 'Termini di Servizio', href: '#' },
                { label: 'GDPR & Dati Sanitari', href: '#' },
                { label: 'Cookie Policy', href: '#' },
              ]}
            />

            <FooterCol
              title="Supporto"
              links={[
                { label: 'Documentazione', href: '#' },
                { label: 'FAQ', href: '#' },
                { label: 'Contattaci', href: '#' },
                { label: 'Status', href: '#' },
              ]}
            />
          </div>

          <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs">
            <span>© {new Date().getFullYear()} Doctor Twin · Tutti i diritti riservati</span>
            <span>Fatto con ❤️ per i medici italiani</span>
          </div>
        </div>
      </footer>
    </>
  )
}

// ─── Small local components ────────────────────────────────────────────────

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h4 className="text-slate-200 text-sm font-bold mb-4">{title}</h4>
      <ul className="space-y-2.5 list-none p-0 m-0">
        {links.map((l) => (
          <li key={l.label}>
            <a href={l.href} className="text-sm hover:text-slate-200 transition-colors no-underline">
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}


function PlayIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polygon points="10 8 16 12 10 16 10 8" />
    </svg>
  )
}

function LayersIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}
