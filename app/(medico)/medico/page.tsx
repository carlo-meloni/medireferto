import { getAllVisits } from '@/lib/db/visit';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

const VISIT_STATUS_LABEL: Record<string, string> = {
  IN_REGISTRAZIONE: 'In registrazione',
  IN_REVISIONE: 'In revisione',
  APPROVATO: 'Approvato',
  ESPORTATO: 'Esportato',
};

const VISIT_STATUS_CLASSES: Record<string, string> = {
  IN_REGISTRAZIONE: 'bg-blue-50 text-blue-700 ring-blue-600/20',
  IN_REVISIONE: 'bg-yellow-50 text-yellow-700 ring-yellow-600/20',
  APPROVATO: 'bg-green-50 text-green-700 ring-green-600/20',
  ESPORTATO: 'bg-zinc-50 text-zinc-600 ring-zinc-500/10',
};

export default async function MedicoDashboard() {
  const visits = await getAllVisits();

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto bg-zinc-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
            Visite recenti
          </h1>
          <p className="text-sm text-zinc-500">
            Gestisci le tue visite e i referti
          </p>
        </div>

        <Link
          href="/medico/visita/nuova"
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 shadow-md transition-all active:scale-[0.98]"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Nuova visita
        </Link>
      </div>

      {/* Lista Visite */}
      <div className="grid gap-3">
        {visits.map((visit) => (
          <Link
            key={visit.id}
            href={`/medico/visita/${visit.id}`}
            className="group flex flex-col bg-white rounded-2xl border border-zinc-200 p-4 hover:border-blue-400 hover:shadow-md transition-all"
          >
            {/* Sezione Superiore: Nome Paziente */}
            <div className="mb-3">
              <h2 className="text-base font-bold text-zinc-900 group-hover:text-blue-600 transition-colors">
                {visit.patient.firstName} {visit.patient.lastName}
              </h2>
              <p className="text-[11px] text-zinc-400 font-mono mt-0.5 tracking-wider">
                {visit.patient.fiscalCode}
              </p>
            </div>

            {/* Sezione Inferiore: Metadati (Data e Stato) */}
            <div className="flex items-end justify-between border-t border-zinc-50 pt-3">
              <div className="flex flex-col gap-2">
                <span className={`w-fit inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1 ring-inset ${VISIT_STATUS_CLASSES[visit.status]}`}>
                  {VISIT_STATUS_LABEL[visit.status]}
                </span>
                
                <div className="flex items-center gap-1.5 text-zinc-500">
                   <svg className="w-3.5 h-3.5 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xs font-medium italic">
                    {formatDate(visit.visitDate)}
                  </span>
                </div>
              </div>

              {/* Tasto Vai */}
              <div className="bg-zinc-50 p-2 rounded-xl group-hover:bg-blue-600 transition-colors">
                <svg className="w-4 h-4 text-zinc-400 group-hover:text-white transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}