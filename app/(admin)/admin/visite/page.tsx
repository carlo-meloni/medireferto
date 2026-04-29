import Link from 'next/link';
import { ClipboardList } from 'lucide-react';
import { getAllVisits } from '@/lib/db/visit';

const STATUS_LABELS: Record<string, string> = {
  IN_REGISTRAZIONE: 'In registrazione',
  IN_REVISIONE: 'In revisione',
  APPROVATO: 'Approvato',
  ESPORTATO: 'Esportato',
};

const STATUS_STYLES: Record<string, { badge: string; dot: string }> = {
  IN_REGISTRAZIONE: { badge: 'bg-blue-50 text-blue-700 ring-1 ring-blue-100', dot: 'bg-blue-400' },
  IN_REVISIONE:     { badge: 'bg-amber-50 text-amber-700 ring-1 ring-amber-100', dot: 'bg-amber-400' },
  APPROVATO:        { badge: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100', dot: 'bg-emerald-400' },
  ESPORTATO:        { badge: 'bg-zinc-100 text-zinc-500 ring-1 ring-zinc-200', dot: 'bg-zinc-400' },
};

export default async function AdminVisitePage() {
  const visits = await getAllVisits();

  return (
    <div className="min-h-full bg-zinc-50/60 p-8">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-8 flex items-start gap-4 animate-fade-in">
          <div className="inline-flex items-center justify-center rounded-xl bg-violet-50 p-2.5">
            <ClipboardList size={18} className="text-violet-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Visite</h1>
            <p className="mt-1 text-sm text-zinc-500">
              {visits.length} {visits.length === 1 ? 'visita registrata' : 'visite registrate'}
            </p>
          </div>
        </div>

        {/* Table */}
        <div
          className="overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm animate-slide-up"
          style={{ animationDelay: '100ms' }}
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/80">
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
                  Data visita
                </th>
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
                  Paziente
                </th>
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
                  Medico
                </th>
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
                  Stato
                </th>
                <th className="px-5 py-3.5 text-right" />
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
                      <p className="text-sm font-medium text-zinc-400">Nessuna visita registrata</p>
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
                    <td className="px-5 py-4">
                      <p className="font-medium text-zinc-700">
                        {new Date(visit.visitDate).toLocaleDateString('it-IT', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })}
                      </p>
                      <p className="mt-0.5 text-[11px] text-zinc-400">
                        {new Date(visit.visitDate).toLocaleTimeString('it-IT', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-100 text-[11px] font-bold text-violet-600">
                          {patientInitials}
                        </div>
                        <div>
                          <p className="font-medium text-zinc-900">
                            {visit.patient.lastName} {visit.patient.firstName}
                          </p>
                          <p className="mt-0.5 font-mono text-[11px] text-zinc-400">
                            {visit.patient.fiscalCode}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-zinc-600">
                      {visit.doctor
                        ? `Dr. ${visit.doctor.lastName} ${visit.doctor.firstName}`
                        : <span className="italic text-zinc-400">Non assegnato</span>}
                    </td>

                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyle.badge}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`} />
                        {STATUS_LABELS[visit.status]}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/admin/visite/${visit.id}`}
                        className="text-xs font-medium text-indigo-600 transition-colors hover:text-indigo-800"
                      >
                        Dettaglio{' '}
                        <span className="inline-block transition-transform group-hover:translate-x-0.5">→</span>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
