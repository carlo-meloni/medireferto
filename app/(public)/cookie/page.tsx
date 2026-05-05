import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Cookie Policy — Doctor Twin',
}

export default function CookiePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/" className="text-sm text-slate-500 hover:text-slate-900 transition-colors mb-8 inline-block">
          ← Torna alla home
        </Link>
        <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-2">Cookie Policy</h1>
        <p className="text-sm text-slate-400 mb-10">Ultimo aggiornamento: maggio 2026</p>

        <div className="prose prose-slate max-w-none space-y-8 text-slate-700">
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">Cosa sono i cookie</h2>
            <p className="text-sm leading-relaxed">
              I cookie sono piccoli file di testo memorizzati nel browser quando visiti un sito web. Doctor Twin utilizza esclusivamente cookie tecnici strettamente necessari al funzionamento del servizio.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">Cookie utilizzati</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-2 pr-4 font-semibold text-slate-900">Nome</th>
                    <th className="text-left py-2 pr-4 font-semibold text-slate-900">Tipo</th>
                    <th className="text-left py-2 font-semibold text-slate-900">Scopo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-2 pr-4 font-mono text-xs">next-auth.session-token</td>
                    <td className="py-2 pr-4">Tecnico</td>
                    <td className="py-2">Sessione autenticata dell&apos;utente</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-mono text-xs">next-auth.csrf-token</td>
                    <td className="py-2 pr-4">Sicurezza</td>
                    <td className="py-2">Protezione CSRF per i form</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">Nessun cookie di profilazione</h2>
            <p className="text-sm leading-relaxed">
              Doctor Twin non utilizza cookie di profilazione, cookie di terze parti a scopo pubblicitario o strumenti di tracciamento comportamentale.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">Gestione dei cookie</h2>
            <p className="text-sm leading-relaxed">
              Poiché utilizziamo solo cookie tecnici necessari, non è richiesto il consenso ai sensi dell&apos;art. 122 del Codice Privacy. Puoi comunque eliminare i cookie in qualsiasi momento dalle impostazioni del tuo browser.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
