import { getVisitById } from '@/lib/db/visit';
import { formatDate } from '@/lib/utils';
import VisitaDetailClient from '@/components/medico/VisitaDetailClient';

const VISIT_STATUS_LABEL: Record<string, string> = {
  IN_REGISTRAZIONE: 'In registrazione',
  IN_REVISIONE: 'In revisione',
  APPROVATO: 'Approvato',
  ESPORTATO: 'Esportato',
};

const VISIT_STATUS_CLASSES: Record<string, string> = {
  IN_REGISTRAZIONE: 'bg-blue-100 text-blue-800 ring-blue-200',
  IN_REVISIONE: 'bg-amber-100 text-amber-800 ring-amber-200',
  APPROVATO: 'bg-green-100 text-green-800 ring-green-200',
  ESPORTATO: 'bg-zinc-100 text-zinc-600 ring-zinc-200',
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function VisitaDetailPage({ params }: Props) {
  const { id } = await params;
  const visit = await getVisitById(id);

  if (!visit) {
    return <div className="p-8">Visita non trovata</div>;
  }

  const status = visit.status ?? 'IN_REGISTRAZIONE';

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">
            {visit.patient.firstName} {visit.patient.lastName}
          </h1>
          <div className="mt-1 flex items-center gap-3">
            <span className="text-sm text-zinc-500 font-mono">{visit.patient.fiscalCode}</span>
            <span className="text-zinc-300">·</span>
            <span className="text-sm text-zinc-500">{formatDate(visit.visitDate)}</span>
          </div>
        </div>

        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${VISIT_STATUS_CLASSES[status]}`}
        >
          {VISIT_STATUS_LABEL[status]}
        </span>
      </div>

      <VisitaDetailClient
        visitId={visit.id}
        visitStatus={status}
        transcriptText={visit.transcript?.text ?? null}
        reportDraft={visit.report?.draft ?? null}
        reportFinal={visit.report?.final ?? null}
      />
    </div>
  );
}
