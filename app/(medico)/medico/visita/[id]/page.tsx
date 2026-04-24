import { getVisitById } from "@/lib/db/visit";
import { formatDate } from "@/lib/utils";

const VISIT_STATUS_LABEL: Record<string, string> = {
  DRAFT: "Bozza",
  APPROVATO: "Approvato",
  ESPORTATO: "Esportato",
};

const VISIT_STATUS_CLASSES: Record<string, string> = {
  DRAFT: "bg-yellow-100 text-yellow-800",
  APPROVATO: "bg-green-100 text-green-800",
  ESPORTATO: "bg-blue-100 text-blue-800",
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

  const status = visit.status ?? "DRAFT";

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">
            {visit.patient.firstName} {visit.patient.lastName}
          </h1>

          <div className="mt-1 flex items-center gap-3">
            <span className="text-sm text-zinc-500 font-mono">
              {visit.patient.fiscalCode}
            </span>

            <span className="text-zinc-300">·</span>

            <span className="text-sm text-zinc-500">
              {formatDate(visit.visitDate)}
            </span>
          </div>
        </div>

        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${
            VISIT_STATUS_CLASSES[status]
          }`}
        >
          {VISIT_STATUS_LABEL[status]}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* TRASCRIZIONE */}
        <div className="flex flex-col gap-3">
          <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">
            Trascrizione audio
          </h2>

          <div className="rounded-xl border border-zinc-200 bg-white p-5 flex-1">
            <p className="text-sm text-zinc-700 whitespace-pre-wrap">
              {visit.transcript ? "Trascrizione presente" : "Nessuna trascrizione"}
            </p>
          </div>
        </div>

        {/* REFERTO */}
        <div className="flex flex-col gap-3">
          <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">
            Referto
          </h2>

          <div className="rounded-xl border border-zinc-200 bg-white p-5">
            <p className="text-sm text-zinc-700 whitespace-pre-wrap">
              {visit.report ? "Referto presente" : "Nessun referto"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}