import Link from "next/link";
import { getPatientById } from "@/lib/db/patient";
import { getVisitsByPatientId } from "@/lib/db/visit";
import { formatDate, formatBirthDate, calcAge } from "@/lib/utils";

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
  params: { id: string };
};

export default async function PazienteDetailPage({ params }: Props) {
  const patient = await getPatientById(params.id);
  const visits = await getVisitsByPatientId(params.id);

  if (!patient) {
    return <div className="p-8">Paziente non trovato</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link href="/medico/pazienti" className="text-sm text-zinc-500">
        ← Torna ai pazienti
      </Link>

      <div className="rounded-xl border border-zinc-200 bg-white p-6 mb-6 mt-4">
        <h1 className="text-2xl font-semibold text-zinc-900">
          {patient.lastName} {patient.firstName}
        </h1>

        <p className="text-sm text-zinc-400 font-mono">
          {patient.fiscalCode}
        </p>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            {patient.birthDate
              ? `${formatBirthDate(patient.birthDate)} (${calcAge(patient.birthDate)} anni)`
              : "Data di nascita non disponibile"}
          </div>

          <div>{patient.birthPlace}</div>
          <div>{patient.phone}</div>
          <div>{patient.email}</div>
        </div>
      </div>

      <h2 className="mb-4 font-semibold">
        Storico visite ({visits.length})
      </h2>

      <div className="flex flex-col gap-3">
        {visits.map((visit) => (
          <Link
            key={visit.id}
            href={`/medico/visita/${visit.id}`}
            className="border p-4 rounded-lg flex justify-between"
          >
            <span>{formatDate(visit.visitDate)}</span>

            <span
              className={`px-2 py-1 text-xs rounded ${
                VISIT_STATUS_CLASSES[visit.status]
              }`}
            >
              {VISIT_STATUS_LABEL[visit.status]}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}