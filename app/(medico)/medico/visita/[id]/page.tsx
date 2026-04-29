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
    <div className="p-4 sm:p-8 max-w-5xl mx-auto">
      {/* Header Responsive */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight break-words">
            {visit.patient.firstName} {visit.patient.lastName}
          </h1>
          
          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="text-xs sm:text-sm text-zinc-500 font-mono bg-zinc-100 px-1.5 py-0.5 rounded">
              {visit.patient.fiscalCode}
            </span>
            <span className="hidden sm:block text-zinc-300">·</span>
            <span className="text-xs sm:text-sm text-zinc-500 font-medium">
              {formatDate(visit.visitDate)}
            </span>
          </div>
        </div>

        {/* Badge Status - ora si posiziona bene sia sopra che a lato */}
        <div className="shrink-0">
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ring-1 ring-inset shadow-sm ${VISIT_STATUS_CLASSES[status]}`}
          >
            {VISIT_STATUS_LABEL[status]}
          </span>
        </div>
      </div>

      {/* Contenuto principale (Trascrizione e Referto) */}
      <div className="mt-6">
        <VisitaDetailClient
        visitId={visit.id}
        visitStatus={status}
          transcriptText={visit.transcript?.text ?? null}
          reportDraft={visit.report?.draft ?? null}
        reportFinal={visit.report?.final ?? null}
        />
      </div>
    </div>
  );
}