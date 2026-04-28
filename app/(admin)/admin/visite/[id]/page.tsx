import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getVisitById } from '@/lib/db/visit';
import { formatDate } from '@/lib/utils';

const STATUS_LABELS: Record<string, string> = {
  IN_REGISTRAZIONE: 'In registrazione',
  IN_REVISIONE: 'In revisione',
  APPROVATO: 'Approvato',
  ESPORTATO: 'Esportato',
};

const STATUS_COLORS: Record<string, string> = {
  IN_REGISTRAZIONE: 'bg-blue-100 text-blue-800 ring-blue-200',
  IN_REVISIONE: 'bg-amber-100 text-amber-800 ring-amber-200',
  APPROVATO: 'bg-green-100 text-green-800 ring-green-200',
  ESPORTATO: 'bg-zinc-100 text-zinc-600 ring-zinc-200',
};

type Props = { params: Promise<{ id: string }> };

export default async function AdminVisitaDetailPage({ params }: Props) {
  const { id } = await params;
  const visit = await getVisitById(id);

  if (!visit) notFound();

  const status = visit.status ?? 'IN_REGISTRAZIONE';

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <Link
          href="/admin/visite"
          className="text-xs text-zinc-400 hover:text-zinc-600 font-medium"
        >
          ← Visite
        </Link>
      </div>

      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">
            {visit.patient.firstName} {visit.patient.lastName}
          </h1>
          <div className="mt-1 flex items-center gap-3 flex-wrap">
            <span className="text-sm text-zinc-500 font-mono">{visit.patient.fiscalCode}</span>
            <span className="text-zinc-300">·</span>
            <span className="text-sm text-zinc-500">{formatDate(visit.visitDate)}</span>
            {visit.doctor && (
              <>
                <span className="text-zinc-300">·</span>
                <span className="text-sm text-zinc-500">
                  Dr. {visit.doctor.lastName} {visit.doctor.firstName}
                </span>
              </>
            )}
            {!visit.doctor && (
              <>
                <span className="text-zinc-300">·</span>
                <span className="text-sm text-zinc-400 italic">Medico non assegnato</span>
              </>
            )}
          </div>
        </div>

        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${STATUS_COLORS[status]}`}
        >
          {STATUS_LABELS[status]}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex flex-col gap-3">
          <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">
            Trascrizione audio
          </h2>
          <div className="rounded-xl border border-zinc-200 bg-white p-5 min-h-40">
            {visit.transcript?.text ? (
              <p className="text-sm text-zinc-700 whitespace-pre-wrap leading-relaxed">
                {visit.transcript.text}
              </p>
            ) : (
              <p className="text-sm text-zinc-400 italic">Nessuna trascrizione</p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">
            Referto
          </h2>
          <div className="rounded-xl border border-zinc-200 bg-white p-5 min-h-40">
            {visit.report?.draft ? (
              <p className="text-sm text-zinc-700 whitespace-pre-wrap leading-relaxed">
                {visit.report.draft}
              </p>
            ) : (
              <p className="text-sm text-zinc-400 italic">Nessun referto</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
