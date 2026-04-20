import Link from 'next/link';

type VisitStatus = 'IN_REGISTRAZIONE' | 'IN_REVISIONE' | 'APPROVATO' | 'ESPORTATO';

const STATUS_LABEL: Record<VisitStatus, string> = {
  IN_REGISTRAZIONE: 'In registrazione',
  IN_REVISIONE: 'In revisione',
  APPROVATO: 'Approvato',
  ESPORTATO: 'Esportato',
};

const STATUS_CLASSES: Record<VisitStatus, string> = {
  IN_REGISTRAZIONE: 'bg-blue-50 text-blue-700 ring-blue-200',
  IN_REVISIONE: 'bg-amber-50 text-amber-700 ring-amber-200',
  APPROVATO: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  ESPORTATO: 'bg-zinc-100 text-zinc-600 ring-zinc-200',
};

const MOCK_VISITS = [
  {
    id: '1',
    patientName: 'Mario Bianchi',
    fiscalCode: 'BNCMRA80A01H501X',
    visitDate: '2026-04-20T10:30:00',
    status: 'IN_REVISIONE' as VisitStatus,
  },
  {
    id: '2',
    patientName: 'Laura Verdi',
    fiscalCode: 'VRDLRA92C45F205Z',
    visitDate: '2026-04-19T15:00:00',
    status: 'APPROVATO' as VisitStatus,
  },
  {
    id: '3',
    patientName: 'Giuseppe Neri',
    fiscalCode: 'NRIGPP75E12G273K',
    visitDate: '2026-04-18T09:00:00',
    status: 'ESPORTATO' as VisitStatus,
  },
  {
    id: '4',
    patientName: 'Anna Russo',
    fiscalCode: 'RSSNAN88D55L219M',
    visitDate: '2026-04-20T14:00:00',
    status: 'IN_REGISTRAZIONE' as VisitStatus,
  },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('it-IT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function MedicoDashboard() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">Visite recenti</h1>
          <p className="mt-1 text-sm text-zinc-500">Gestisci le tue visite e i referti</p>
        </div>
        <Link
          href="/medico/visita/nuova"
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Nuova visita
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {MOCK_VISITS.map((visit) => (
          <Link
            key={visit.id}
            href={`/medico/visita/${visit.id}`}
            className="group flex items-center justify-between bg-white rounded-xl border border-zinc-200 px-5 py-4 hover:border-zinc-300 hover:shadow-sm transition"
          >
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-sm font-medium text-zinc-900 group-hover:text-blue-700 transition">
                {visit.patientName}
              </span>
              <span className="text-xs text-zinc-400 font-mono">{visit.fiscalCode}</span>
            </div>

            <div className="flex items-center gap-4 shrink-0 ml-4">
              <span className="text-xs text-zinc-500">{formatDate(visit.visitDate)}</span>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${STATUS_CLASSES[visit.status]}`}
              >
                {STATUS_LABEL[visit.status]}
              </span>
              <svg
                className="w-4 h-4 text-zinc-300 group-hover:text-zinc-500 transition"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
