import { getFilteredVisits } from '@/lib/db/visit';
import VisitFilters from '@/components/medico/VisitFilters';
import Pagination from '@/components/medico/Pagination';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { Suspense } from 'react';

const VISIT_STATUS_LABEL: Record<string, string> = {
  IN_REGISTRAZIONE: 'In registrazione',
  IN_REVISIONE: 'In revisione',
  APPROVATO: 'Approvato',
  ESPORTATO: 'Esportato',
};

const VISIT_STATUS_BADGE: Record<string, string> = {
  IN_REGISTRAZIONE: 'bg-blue-50 text-blue-700 ring-blue-200',
  IN_REVISIONE: 'bg-amber-50 text-amber-700 ring-amber-200',
  APPROVATO: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  ESPORTATO: 'bg-zinc-100 text-zinc-500 ring-zinc-200',
};

const VISIT_STATUS_DOT: Record<string, string> = {
  IN_REGISTRAZIONE: 'bg-blue-500',
  IN_REVISIONE: 'bg-amber-500',
  APPROVATO: 'bg-emerald-500',
  ESPORTATO: 'bg-zinc-400',
};

const VISIT_STATUS_BORDER: Record<string, string> = {
  IN_REGISTRAZIONE: 'border-l-blue-400',
  IN_REVISIONE: 'border-l-amber-400',
  APPROVATO: 'border-l-emerald-400',
  ESPORTATO: 'border-l-zinc-300',
};

interface SearchParams {
  patientSearch?: string;
  dateFrom?: string;
  dateTo?: string;
  status?: string;
  page?: string;
}

export default async function MedicoDashboard({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const { visits, total, page, pageSize } = await getFilteredVisits(params);

  return (
    <div className="min-h-full p-8 max-w-5xl mx-auto">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">
            Visite recenti
          </h1>
          <p className="mt-1.5 text-sm text-zinc-500">
            {total} {total === 1 ? 'visita trovata' : 'visite trovate'}
          </p>
        </div>

        <Link
          href="/medico/visita/nuova"
          className="group flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 hover:shadow-md active:scale-95 transition-all duration-150"
        >
          <svg
            className="w-4 h-4 transition-transform duration-200 group-hover:rotate-90"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Nuova visita
        </Link>
      </div>

      <Suspense>
        <VisitFilters />
      </Suspense>

      <div className="flex flex-col gap-2">
        {visits.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 rounded-2xl bg-zinc-100 flex items-center justify-center mb-4">
              <svg
                className="w-7 h-7 text-zinc-400"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z"
                />
              </svg>
            </div>
            <p className="text-sm font-semibold text-zinc-700">Nessuna visita trovata</p>
            <p className="text-xs text-zinc-400 mt-1">
              Prova a modificare i filtri o crea una nuova visita
            </p>
          </div>
        )}

        {visits.map((visit) => {
          const initials = `${visit.patient.firstName[0]}${visit.patient.lastName[0]}`.toUpperCase();
          return (
            <Link
              key={visit.id}
              href={`/medico/visita/${visit.id}`}
              className={`group flex items-center gap-4 bg-white rounded-xl border border-zinc-200 border-l-4 ${VISIT_STATUS_BORDER[visit.status]} px-5 py-4 hover:shadow-md hover:-translate-y-px transition-all duration-150`}
            >
              <div className="w-9 h-9 rounded-full bg-zinc-100 flex items-center justify-center text-xs font-bold text-zinc-600 shrink-0 select-none">
                {initials}
              </div>

              <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                <span className="text-sm font-semibold text-zinc-900 group-hover:text-blue-700 transition-colors duration-150">
                  {visit.patient.firstName} {visit.patient.lastName}
                </span>
                <span className="text-xs text-zinc-400 font-mono">
                  {visit.patient.fiscalCode}
                </span>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs text-zinc-400 tabular-nums">
                  {formatDate(visit.visitDate)}
                </span>

                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${VISIT_STATUS_BADGE[visit.status]}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${VISIT_STATUS_DOT[visit.status]}`} />
                  {VISIT_STATUS_LABEL[visit.status]}
                </span>

                <svg
                  className="w-4 h-4 text-zinc-300 group-hover:text-zinc-500 group-hover:translate-x-0.5 transition-all duration-150"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          );
        })}
      </div>

      <Suspense>
        <Pagination page={page} total={total} pageSize={pageSize} />
      </Suspense>
    </div>
  );
}
