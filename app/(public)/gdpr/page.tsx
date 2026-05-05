import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'GDPR & Dati Sanitari — Doctor Twin',
}

export default function GdprPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/" className="text-sm text-slate-500 hover:text-slate-900 transition-colors mb-8 inline-block">
          ← Torna alla home
        </Link>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-2">GDPR & Dati Sanitari</h1>
        <p className="text-sm text-slate-400 mb-10">Ultimo aggiornamento: maggio 2026</p>

        <div className="prose prose-slate max-w-none space-y-8 text-slate-700">
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">Conformità al GDPR</h2>
            <p className="text-sm leading-relaxed">
              Doctor Twin è conforme al Regolamento UE 2016/679 (GDPR) e al D.Lgs. 196/2003 (Codice Privacy italiano). Il trattamento di dati sanitari avviene nel rispetto dell&apos;art. 9 GDPR, che disciplina il trattamento di categorie particolari di dati.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">Dati sanitari (art. 9 GDPR)</h2>
            <p className="text-sm leading-relaxed">
              I dati sanitari dei pazienti sono trattati esclusivamente dal medico titolare dell&apos;account, nell&apos;ambito della relazione di cura. Doctor Twin agisce come responsabile del trattamento (data processor) ai sensi dell&apos;art. 28 GDPR.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">Misure di sicurezza</h2>
            <ul className="text-sm leading-relaxed space-y-1 list-disc list-inside">
              <li>Dati cifrati in transito (TLS 1.3) e a riposo (AES-256)</li>
              <li>Hosting su infrastruttura europea (EU-West)</li>
              <li>Accesso ai dati con autenticazione forte</li>
              <li>Log di accesso e audit trail per ogni operazione sui dati</li>
              <li>Backup giornalieri con retention di 30 giorni</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">Data Processing Agreement (DPA)</h2>
            <p className="text-sm leading-relaxed">
              Per gli studi professionali che necessitano di un contratto formale di responsabile del trattamento ai sensi dell&apos;art. 28 GDPR, è possibile richiedere il DPA contattando il nostro team.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
