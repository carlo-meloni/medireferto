import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Termini di Servizio — Doctor Twin',
}

export default function TerminiPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/" className="text-sm text-slate-500 hover:text-slate-900 transition-colors mb-8 inline-block">
          ← Torna alla home
        </Link>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-2">Termini di Servizio</h1>
        <p className="text-sm text-slate-400 mb-10">Ultimo aggiornamento: maggio 2026</p>

        <div className="prose prose-slate max-w-none space-y-8 text-slate-700">
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">1. Accettazione dei termini</h2>
            <p className="text-sm leading-relaxed">
              Utilizzando Doctor Twin accetti i presenti Termini di Servizio. Se non accetti tali termini, non puoi utilizzare il servizio.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">2. Descrizione del servizio</h2>
            <p className="text-sm leading-relaxed">
              Doctor Twin è una piattaforma software per la refertazione medica automatizzata tramite AI. Il servizio è destinato esclusivamente a professionisti sanitari abilitati.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">3. Responsabilità del medico</h2>
            <p className="text-sm leading-relaxed">
              Il medico è il solo responsabile della revisione, approvazione e firma dei referti generati. Doctor Twin fornisce un supporto alla redazione e non sostituisce il giudizio clinico del professionista.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">4. Limitazioni di responsabilità</h2>
            <p className="text-sm leading-relaxed">
              Doctor Twin non è responsabile per eventuali errori nei referti generati dall&apos;AI. L&apos;accuratezza clinica del documento finale è responsabilità esclusiva del medico firmatario.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">5. Modifiche ai termini</h2>
            <p className="text-sm leading-relaxed">
              Ci riserviamo il diritto di modificare i presenti termini in qualsiasi momento. Le modifiche saranno comunicate agli utenti registrati via email.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
