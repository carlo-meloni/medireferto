import Link from 'next/link';
import NuovaVisitaForm from '@/components/medico/NuovaVisitaForm';
import { getPatients, getPatientById } from '@/lib/db/patient';
import { getVisitsByPatientId } from '@/lib/db/visit';
import { formatDate } from '@/lib/utils';

type Props = {
  searchParams: Promise<{ patientId?: string }>;
};

const STATUS_LABEL: Record<string, string> = {
  IN_REGISTRAZIONE: 'In registrazione',
  IN_REVISIONE: 'In revisione',
  APPROVATO: 'Approvato',
  ESPORTATO: 'Esportato',
};

const STATUS_CONFIG: Record<string, { classes: string; dot: string }> = {
  IN_REGISTRAZIONE: { classes: 'bg-blue-50 text-blue-700 ring-blue-200', dot: 'bg-blue-400' },
  IN_REVISIONE:     { classes: 'bg-amber-50 text-amber-700 ring-amber-200', dot: 'bg-amber-400' },
  APPROVATO:        { classes: 'bg-green-50 text-green-700 ring-green-200', dot: 'bg-green-400' },
  ESPORTATO:        { classes: 'bg-zinc-100 text-zinc-500 ring-zinc-200', dot: 'bg-zinc-400' },
};

export default async function NuovaVisitaPage({ searchParams }: Props) {
  const { patientId } = await searchParams;

  const [data, patient, visits] = await Promise.all([
    getPatients(),
    patientId ? getPatientById(patientId) : null,
    patientId ? getVisitsByPatientId(patientId) : null,
  ]);

  const patients = data.map(({ id, firstName, lastName, fiscalCode }) => ({
    id,
    firstName,
    lastName,
    fiscalCode,
  }));

  const header = (
    <div className="mb-10">
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-4 ring-1 ring-blue-100">
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
        </svg>
        Nuova visita
      </span>
      <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">
        Registra una visita
      </h1>
      <p className="mt-2 text-zinc-500">
        Seleziona il paziente e registra l&apos;audio della visita
      </p>
    </div>
  );

  if (patient && visits) {
    return (
      <div className="px-8 py-10">
        <div className="max-w-5xl mx-auto flex gap-8 items-start">
          <div className="flex-1 min-w-0">
            {header}
            <NuovaVisitaForm patients={patients} initialPatientId={patientId} />
          </div>

          <aside className="w-72 shrink-0 sticky top-8">
            <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-zinc-100 bg-zinc-50/60">
                <Link
                  href={`/medico/pazienti/${patient.id}`}
                  className="group flex items-center gap-3"
                >
                  <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-sm font-bold text-blue-600 shrink-0 select-none">
                    {patient.firstName[0]}{patient.lastName[0]}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-zinc-900 group-hover:text-blue-700 transition-colors truncate">
                      {patient.lastName} {patient.firstName}
                    </p>
                    <p className="text-xs text-zinc-400 font-mono truncate">{patient.fiscalCode}</p>
                  </div>
                </Link>
              </div>

              <div className="px-5 py-3 border-b border-zinc-100 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
                  Storico visite
                </p>
                <span className="text-xs text-zinc-400">{visits.length}</span>
              </div>

              {visits.length === 0 ? (
                <div className="px-5 py-8 text-center">
                  <p className="text-sm text-zinc-400">Nessuna visita precedente</p>
                </div>
              ) : (
                <ul className="divide-y divide-zinc-100 max-h-[calc(100vh-280px)] overflow-y-auto">
                  {visits.map((visit) => {
                    const cfg = STATUS_CONFIG[visit.status] ?? STATUS_CONFIG.ESPORTATO;
                    return (
                      <li key={visit.id}>
                        <Link
                          href={`/medico/visita/${visit.id}`}
                          className="group flex items-center justify-between gap-3 px-5 py-3.5 hover:bg-zinc-50 transition-colors"
                        >
                          <p className="text-xs font-medium text-zinc-700 group-hover:text-blue-700 transition-colors">
                            {formatDate(visit.visitDate)}
                          </p>
                          <span className={`shrink-0 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${cfg.classes}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                            {STATUS_LABEL[visit.status] ?? visit.status}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </aside>
        </div>
      </div>
    );
  }

  return (
    <div className="px-8 py-10 max-w-2xl mx-auto">
      {header}
      <NuovaVisitaForm patients={patients} initialPatientId={patientId} />
    </div>
  );
}