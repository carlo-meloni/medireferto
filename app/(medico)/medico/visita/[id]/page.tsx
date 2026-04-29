import { getVisitById } from '@/lib/db/visit';
import { formatDate } from '@/lib/utils';
import VisitaDetailClient from '@/components/medico/VisitaDetailClient';
import Link from 'next/link';

const VISIT_STATUS_LABEL: Record<string, string> = {
  IN_REGISTRAZIONE: 'In registrazione',
  IN_REVISIONE: 'In revisione',
  APPROVATO: 'Approvato',
  ESPORTATO: 'Esportato',
};

const VISIT_STATUS_CONFIG: Record<string, { classes: string; dot: string }> = {
  IN_REGISTRAZIONE: {
    classes: 'bg-blue-50 text-blue-700 ring-blue-200',
    dot: 'bg-blue-400',
  },
  IN_REVISIONE: {
    classes: 'bg-amber-50 text-amber-700 ring-amber-200',
    dot: 'bg-amber-400',
  },
  APPROVATO: {
    classes: 'bg-green-50 text-green-700 ring-green-200',
    dot: 'bg-green-400',
  },
  ESPORTATO: {
    classes: 'bg-zinc-100 text-zinc-500 ring-zinc-200',
    dot: 'bg-zinc-400',
  },
};

type Props = {
  params: Promise<{ id: string }>;
};

export default async function VisitaDetailPage({ params }: Props) {
  const { id } = await params;
  const visit = await getVisitById(id);

  if (!visit) {
    return (
      <div className="flex items-center justify-center h-64 text-zinc-400 text-sm">
        Visita non trovata
      </div>
    );
  }

  const status = visit.status ?? 'IN_REGISTRAZIONE';
  const statusConfig = VISIT_STATUS_CONFIG[status];

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6 animate-fade-in">
      <Link
        href="/medico"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-600 transition-colors group"
      >
        <svg
          className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Tutte le visite
      </Link>

      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1.5">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
            {visit.patient.firstName} {visit.patient.lastName}
          </h1>
          <div className="flex items-center gap-2.5">
            <span className="text-sm text-zinc-400 font-mono tracking-wider">
              {visit.patient.fiscalCode}
            </span>
            <span className="w-1 h-1 rounded-full bg-zinc-300" />
            <span className="text-sm text-zinc-400">{formatDate(visit.visitDate)}</span>
          </div>
        </div>

        <span
          className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${statusConfig.classes}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
          {VISIT_STATUS_LABEL[status]}
        </span>
      </div>

      <div className="h-px bg-linear-to-r from-zinc-200 via-zinc-100 to-transparent" />

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
