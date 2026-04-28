import Link from "next/link";
import { getPatientById } from "@/lib/db/patient";
import { getVisitsByPatientId } from "@/lib/db/visit";
import { formatDate, formatBirthDate, calcAge } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  APPROVATO: "bg-green-100 text-green-700 border-green-200",
  IN_REGISTRAZIONE: "bg-blue-100 text-blue-700 border-blue-200",
  IN_REVISIONE: "bg-yellow-100 text-yellow-700 border-yellow-200",
  DRAFT: "bg-yellow-100 text-yellow-700 border-yellow-200",
  ESPORTATO: "bg-gray-100 text-gray-700 border-gray-200",
};

const STATUS_LABELS: Record<string, string> = {
  APPROVATO: "Approvato",
  IN_REGISTRAZIONE: "In registrazione",
  IN_REVISIONE: "In revisione",
  DRAFT: "Bozza",
  ESPORTATO: "Esportato",
};

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id) {
    return <div className="p-8">ID paziente mancante</div>;
  }

  const patient = await getPatientById(id);
  const visits = await getVisitsByPatientId(id);

  if (!patient) {
    return <div className="p-8">Paziente non trovato</div>;
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* BACK */}
      <Link
        href="/medico/pazienti"
        className="text-sm text-zinc-500 hover:text-zinc-900 transition"
      >
        ← Torna ai pazienti
      </Link>

      {/* PATIENT CARD */}
      <div className="mt-5 bg-white border border-zinc-200 rounded-2xl shadow-sm p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900">
              {patient.lastName} {patient.firstName}
            </h1>

            <p className="text-sm text-zinc-400 font-mono mt-1">
              {patient.fiscalCode}
            </p>
          </div>

          <div className="text-right text-xs text-zinc-400">
            ID: {patient.id}
          </div>
        </div>

        {/* INFO GRID */}
        <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
          <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-100">
            <p className="text-zinc-500 text-xs">Data di nascita</p>
            <p className="text-zinc-800">
              {patient.birthDate
                ? `${formatBirthDate(patient.birthDate)} (${calcAge(
                    patient.birthDate
                  )} anni)`
                : "Non disponibile"}
            </p>
          </div>

          <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-100">
            <p className="text-zinc-500 text-xs">Luogo di nascita</p>
            <p className="text-zinc-800">{patient.birthPlace || "-"}</p>
          </div>

          <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-100">
            <p className="text-zinc-500 text-xs">Telefono</p>
            <p className="text-zinc-800">{patient.phone || "-"}</p>
          </div>

          <div className="p-3 rounded-lg bg-zinc-50 border border-zinc-100">
            <p className="text-zinc-500 text-xs">Email</p>
            <p className="text-zinc-800">{patient.email || "-"}</p>
          </div>
        </div>
      </div>

      {/* VISITS */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold text-zinc-900 mb-4">
          Storico visite ({visits?.length ?? 0})
        </h2>

        <div className="space-y-3">
          {(visits ?? []).map((visit) => {
            const status = visit.status ?? "DRAFT";

            return (
              <Link
                key={visit.id}
                href={`/medico/visita/${visit.id}`}
                className="flex items-center justify-between bg-white border border-zinc-200 rounded-xl p-4 hover:shadow-sm hover:border-zinc-300 transition"
              >
                <div>
                  <p className="text-sm font-medium text-zinc-900">
                    {formatDate(visit.visitDate)}
                  </p>
                  <p className="text-xs text-zinc-400">
                    Visita medica
                  </p>
                </div>

                <span
                  className={`text-xs px-3 py-1 rounded-full border font-medium ${
                    STATUS_STYLES[status]
                  }`}
                >
                  {STATUS_LABELS[status] ?? status}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}