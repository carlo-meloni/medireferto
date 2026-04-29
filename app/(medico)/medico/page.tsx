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

const VISIT_STATUS_CLASSES: Record<string, string> = {
  IN_REGISTRAZIONE: 'bg-blue-100 text-blue-800',
  IN_REVISIONE: 'bg-yellow-100 text-yellow-800',
  APPROVATO: 'bg-green-100 text-green-800',
  ESPORTATO: 'bg-zinc-100 text-zinc-600',
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
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">
            Visite recenti
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Gestisci le tue visite e i referti
          </p>
        </div>

        <Link
          href="/medico/visita/nuova"
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
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

      <div className="flex flex-col gap-3">
        {visits.length === 0 && (
          <div className="text-sm text-zinc-500">
            Nessuna visita trovata
          </div>
        )}

        {visits.map((visit) => (
          <Link
            key={visit.id}
            href={`/medico/visita/${visit.id}`}
            className="group flex items-center justify-between bg-white rounded-xl border border-zinc-200 px-5 py-4 hover:border-zinc-300 hover:shadow-sm transition"
          >
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-sm font-medium text-zinc-900 group-hover:text-blue-700 transition">
                {visit.patient.firstName} {visit.patient.lastName}
              </span>

              <span className="text-xs text-zinc-400 font-mono">
                {visit.patient.fiscalCode}
              </span>
            </div>

            <div className="flex items-center gap-4 shrink-0 ml-4">
              <span className="text-xs text-zinc-500">
                {formatDate(visit.visitDate)}
              </span>

              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${
                  VISIT_STATUS_CLASSES[visit.status]
                }`}
              >
                {VISIT_STATUS_LABEL[visit.status]}
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

      <Suspense>
        <Pagination page={page} total={total} pageSize={pageSize} />
      </Suspense>
    </div>
  );
}
