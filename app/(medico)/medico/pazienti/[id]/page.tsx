import Link from "next/link";
import { getPatientById } from "@/lib/db/patient";
import { getVisitsByPatientId } from "@/lib/db/visit";
import { formatDate, formatBirthDate, calcAge } from "@/lib/utils";

const VISIT_STATUS_LABEL: Record<string, string> = {
  DRAFT: "Bozza",
  IN_REGISTRAZIONE: "In registrazione",
  IN_REVISIONE: "In revisione",
  APPROVATO: "Approvato",
  ESPORTATO: "Esportato",
};

const VISIT_STATUS_CONFIG: Record<string, { classes: string; dot: string }> = {
  DRAFT: {
    classes: "bg-yellow-50 text-yellow-700 ring-yellow-200",
    dot: "bg-yellow-400",
  },
  IN_REGISTRAZIONE: {
    classes: "bg-blue-50 text-blue-700 ring-blue-200",
    dot: "bg-blue-400",
  },
  IN_REVISIONE: {
    classes: "bg-amber-50 text-amber-700 ring-amber-200",
    dot: "bg-amber-400",
  },
  APPROVATO: {
    classes: "bg-green-50 text-green-700 ring-green-200",
    dot: "bg-green-400",
  },
  ESPORTATO: {
    classes: "bg-zinc-100 text-zinc-500 ring-zinc-200",
    dot: "bg-zinc-400",
  },
};

type Props = {
  params: { id: string };
};

export default async function PazienteDetailPage({ params }: Props) {
  const patient = await getPatientById(params.id);
  const visits = await getVisitsByPatientId(params.id);

  if (!patient) {
    return (
      <div className="flex items-center justify-center h-64 text-zinc-400 text-sm">
        Paziente non trovato
      </div>
    );
  }

  const initials = `${patient.firstName[0]}${patient.lastName[0]}`.toUpperCase();

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6 animate-fade-in">
      <Link
        href="/medico/pazienti"
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
        Tutti i pazienti
      </Link>

      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-lg font-bold text-blue-600 shrink-0 select-none">
          {initials}
        </div>
        <div className="space-y-1 pt-1">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
            {patient.lastName} {patient.firstName}
          </h1>
          <span className="text-sm text-zinc-400 font-mono tracking-wider">
            {patient.fiscalCode}
          </span>
        </div>
      </div>

      <div className="h-px bg-linear-to-r from-zinc-200 via-zinc-100 to-transparent" />

      <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
        <div className="px-5 py-3 border-b border-zinc-100 bg-zinc-50/60">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
            Anagrafica
          </p>
        </div>
        <div className="grid grid-cols-2 gap-px bg-zinc-100">
          <InfoField
            label="Data di nascita"
            value={
              patient.birthDate
                ? `${formatBirthDate(patient.birthDate)} (${calcAge(patient.birthDate)} anni)`
                : null
            }
          />
          <InfoField label="Luogo di nascita" value={patient.birthPlace} />
          <InfoField label="Telefono" value={patient.phone} />
          <InfoField label="Email" value={patient.email} />
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-zinc-700">Storico visite</h2>
          <span className="text-xs text-zinc-400">
            {visits.length} {visits.length === 1 ? "visita" : "visite"}
          </span>
        </div>

        {visits.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 text-center rounded-xl border border-dashed border-zinc-200">
            <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center mb-3">
              <svg
                className="w-5 h-5 text-zinc-400"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                />
              </svg>
            </div>
            <p className="text-sm font-medium text-zinc-600">Nessuna visita registrata</p>
            <p className="text-xs text-zinc-400 mt-0.5">
              Le visite di questo paziente appariranno qui
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {visits.map((visit) => {
              const config =
                VISIT_STATUS_CONFIG[visit.status] ?? VISIT_STATUS_CONFIG.ESPORTATO;
              return (
                <Link
                  key={visit.id}
                  href={`/medico/visita/${visit.id}`}
                  className="group flex items-center gap-4 bg-white rounded-xl border border-zinc-200 px-5 py-4 hover:shadow-md hover:-translate-y-px transition-all duration-150"
                >
                  <p className="flex-1 text-sm font-medium text-zinc-900 group-hover:text-blue-700 transition-colors duration-150">
                    {formatDate(visit.visitDate)}
                  </p>

                  <span
                    className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${config.classes}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                    {VISIT_STATUS_LABEL[visit.status] ?? visit.status}
                  </span>

                  <svg
                    className="w-4 h-4 text-zinc-300 group-hover:text-zinc-500 group-hover:translate-x-0.5 transition-all duration-150 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function InfoField({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="bg-white px-5 py-4">
      <p className="text-xs text-zinc-400 mb-0.5">{label}</p>
      {value ? (
        <p className="text-sm text-zinc-800">{value}</p>
      ) : (
        <p className="text-sm text-zinc-300">—</p>
      )}
    </div>
  );
}
