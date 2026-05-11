import { Suspense } from 'react';
import Link from 'next/link';
import { ClipboardList, ChevronLeft, ChevronRight } from 'lucide-react';
import { getFilteredVisits } from '@/lib/db/visit';
import { VisiteFilters } from '@/components/admin/VisiteFilters';

const STATUS_LABELS: Record<string, string> = {
  IN_REGISTRAZIONE: 'In registrazione',
  IN_REVISIONE:     'In revisione',
  APPROVATO:        'Approvato',
  ESPORTATO:        'Esportato',
};

const STATUS_STYLES: Record<string, { badge: string; dot: string }> = {
  IN_REGISTRAZIONE: { badge: 'bg-blue-50 text-blue-700 ring-1 ring-blue-100', dot: 'bg-blue-400' },
  IN_REVISIONE:     { badge: 'bg-amber-50 text-amber-700 ring-1 ring-amber-100', dot: 'bg-amber-400' },
  APPROVATO:        { badge: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100', dot: 'bg-emerald-400' },
  ESPORTATO:        { badge: 'bg-zinc-100 text-zinc-500 ring-1 ring-zinc-200', dot: 'bg-zinc-400' },
};

function buildPageUrl(params: Record<string, string>, newPage: number) {
  const p = new URLSearchParams(params);
  p.set('page', String(newPage));
  return `/admin/visite?${p.toString()}`;
}

export default async function AdminVisitePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;
  const { visits, total, page, pageSize } = await getFilteredVisits(params);
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="min-h-full bg-zinc-50/60 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-8 flex items-start gap-4 animate-fade-in">
          <div className="inline-flex items-center justify-center rounded-xl bg-violet-50 p-2.5">
            <ClipboardList size={18} className="text-violet-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Visite</h1>
            <p className="mt-1 text-sm text-zinc-500">
              {total} {total === 1 ? 'visita trovata' : 'visite trovate'}
            </p>
          </div>
        </div>

        {/* Filters */}
        <Suspense>
          <VisiteFilters />
        </Suspense>

        {/* Table */}
        <div
          className="overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm animate-slide-up"
          style={{ animationDelay: '100ms' }}
        >
          <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/80">
                <th className="px-3 py-3.5 text-left text-[11px] font-semibold uppercase tracking-widest text-zinc-400 sm:px-5">
                  Data visita
                </th>
                <th className="px-3 py-3.5 text-left text-[11px] font-semibold uppercase tracking-widest text-zinc-400 sm:px-5">
                  Paziente
                </th>
                <th className="hidden px-3 py-3.5 text-left text-[11px] font-semibold uppercase tracking-widest text-zinc-400 md:table-cell sm:px-5">
                  Medico
                </th>
                <th className="hidden px-3 py-3.5 text-left text-[11px] font-semibold uppercase tracking-widest text-zinc-400 sm:table-cell sm:px-5">
                  Stato
                </th>
                <th className="px-3 py-3.5 text-right sm:px-5" />
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-100">
              {visits.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-50">
                        <ClipboardList size={20} className="text-zinc-300" />
                      </div>
                      <p className="text-sm font-medium text-zinc-400">Nessuna visita trovata</p>
                    </div>
                  </td>
                </tr>
              )}

              {visits.map((visit) => {
                const patientInitials = (
                  `${visit.patient.firstName[0] ?? ''}${visit.patient.lastName[0] ?? ''}`
                ).toUpperCase();

                const statusStyle = STATUS_STYLES[visit.status] ?? STATUS_STYLES.ESPORTATO;

                return (
                  <tr key={visit.id} className="group transition-colors duration-150 hover:bg-violet-50/30">
                    <td className="px-3 py-4 sm:px-5">
                      <p className="font-medium text-zinc-700">
                        {new Date(visit.visitDate).toLocaleDateString('it-IT', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })}
                      </p>
                      <p className="hidden mt-0.5 text-[11px] text-zinc-400 sm:block">
                        {new Date(visit.visitDate).toLocaleTimeString('it-IT', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </td>

                    <td className="px-3 py-4 sm:px-5">
                      <div className="flex items-center gap-3">
                        <div className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-100 text-[11px] font-bold text-violet-600 sm:flex">
                          {patientInitials}
                        </div>
                        <div>
                          <p className="font-medium text-zinc-900">
                            {visit.patient.lastName} {visit.patient.firstName}
                          </p>
                          <p className="hidden mt-0.5 font-mono text-[11px] text-zinc-400 sm:block">
                            {visit.patient.fiscalCode}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="hidden px-3 py-4 text-zinc-600 md:table-cell sm:px-5">
                      {visit.doctor
                        ? `Dr. ${visit.doctor.lastName} ${visit.doctor.firstName}`
                        : <span className="italic text-zinc-400">Non assegnato</span>}
                    </td>

                    <td className="hidden px-3 py-4 sm:table-cell sm:px-5">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyle.badge}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`} />
                        {STATUS_LABELS[visit.status]}
                      </span>
                    </td>

                    <td className="px-3 py-4 text-right sm:px-5">
                      <Link
                        href={`/admin/visite/${visit.id}`}
                        className="text-xs font-medium text-indigo-600 transition-colors hover:text-indigo-800"
                      >
                        <span className="hidden sm:inline">Dettaglio </span>
                        <span className="inline-block transition-transform group-hover:translate-x-0.5">→</span>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-zinc-100 px-5 py-3">
              <p className="text-xs text-zinc-400">
                Pagina {page} di {totalPages} · {total} visite
              </p>
              <div className="flex items-center gap-1">
                {page > 1 ? (
                  <Link
                    href={buildPageUrl(params, page - 1)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 transition-colors hover:border-zinc-300 hover:text-zinc-700"
                  >
                    <ChevronLeft size={14} />
                  </Link>
                ) : (
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-100 text-zinc-300">
                    <ChevronLeft size={14} />
                  </span>
                )}
                {page < totalPages ? (
                  <Link
                    href={buildPageUrl(params, page + 1)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 transition-colors hover:border-zinc-300 hover:text-zinc-700"
                  >
                    <ChevronRight size={14} />
                  </Link>
                ) : (
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-zinc-100 text-zinc-300">
                    <ChevronRight size={14} />
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
