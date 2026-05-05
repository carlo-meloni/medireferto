import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy — Doctor Twin',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/" className="text-sm text-slate-500 hover:text-slate-900 transition-colors mb-8 inline-block">
          ← Torna alla home
        </Link>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-2">Privacy Policy</h1>
        <p className="text-sm text-slate-400 mb-10">Ultimo aggiornamento: maggio 2026</p>

        <div className="prose prose-slate max-w-none space-y-8 text-slate-700">
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">1. Titolare del trattamento</h2>
            <p className="text-sm leading-relaxed">
              Il titolare del trattamento dei dati personali è la società che gestisce Doctor Twin. Per qualsiasi questione relativa alla privacy, è possibile contattarci all&apos;indirizzo email indicato nella sezione &quot;Contattaci&quot;.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">2. Dati raccolti</h2>
            <p className="text-sm leading-relaxed">
              Raccogliamo i dati strettamente necessari per l&apos;erogazione del servizio: dati di registrazione (email, password cifrata), dati anagrafici dei pazienti inseriti dal medico, registrazioni audio delle visite e i referti generati.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">3. Finalità del trattamento</h2>
            <p className="text-sm leading-relaxed">
              I dati sono trattati esclusivamente per l&apos;erogazione del servizio di refertazione medica automatizzata, per la gestione dell&apos;account e per l&apos;assistenza tecnica.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">4. Conservazione dei dati</h2>
            <p className="text-sm leading-relaxed">
              I dati sono conservati per il tempo strettamente necessario all&apos;erogazione del servizio e nel rispetto degli obblighi di legge applicabili alla documentazione clinica.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">5. Diritti dell&apos;interessato</h2>
            <p className="text-sm leading-relaxed">
              L&apos;utente ha il diritto di accedere, rettificare, cancellare i propri dati e di opporsi al trattamento in qualsiasi momento, contattando il titolare del trattamento.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
