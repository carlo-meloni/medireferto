import Link from 'next/link';
import { getAllVisits } from '@/lib/db/visit';

const STATUS_LABELS: Record<string, string> = {
  IN_REGISTRAZIONE: 'In registrazione',
  IN_REVISIONE: 'In revisione',
  APPROVATO: 'Approvato',
  ESPORTATO: 'Esportato',
};

const STATUS_COLORS: Record<string, string> = {
  IN_REGISTRAZIONE: 'bg-blue-50 text-blue-700',
  IN_REVISIONE: 'bg-amber-50 text-amber-700',
  APPROVATO: 'bg-emerald-50 text-emerald-700',
  ESPORTATO: 'bg-zinc-100 text-zinc-500',
};

export default async function AdminVisitePage() {
  const visits = await getAllVisits();

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">Visite</h1>
        <p className="mt-1 text-sm text-zinc-500">{visits.length} visite registrate</p>
      </div>

      <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50">
              <th className="px-5 py-3 text-left font-medium text-zinc-500">Data visita</th>
              <th className="px-5 py-3 text-left font-medium text-zinc-500">Paziente</th>
              <th className="px-5 py-3 text-left font-medium text-zinc-500">Medico</th>
              <th className="px-5 py-3 text-left font-medium text-zinc-500">Stato</th>
              <th className="px-5 py-3 text-right" />
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-100">
            {visits.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-sm text-zinc-400">
                  Nessuna visita registrata
                </td>
              </tr>
            )}

            {visits.map((visit) => (
              <tr key={visit.id} className="hover:bg-zinc-50 transition">
                <td className="px-5 py-4 text-zinc-700">
                  {new Date(visit.visitDate).toLocaleDateString('it-IT', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  })}
                </td>

                <td className="px-5 py-4">
                  <p className="font-medium text-zinc-900">
                    {visit.patient.lastName} {visit.patient.firstName}
                  </p>
                  <p className="text-xs text-zinc-400 mt-0.5">{visit.patient.fiscalCode}</p>
                </td>

                <td className="px-5 py-4 text-zinc-600">
                  {visit.doctor
                    ? `Dr. ${visit.doctor.lastName} ${visit.doctor.firstName}`
                    : <span className="text-zinc-400 italic">Medico non assegnato</span>}
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[visit.status]}`}
                  >
                    {STATUS_LABELS[visit.status]}
                  </span>
                </td>

                <td className="px-5 py-4 text-right">
                  <Link
                    href={`/admin/visite/${visit.id}`}
                    className="text-indigo-600 text-xs font-medium hover:text-indigo-800"
                  >
                    Dettaglio →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
