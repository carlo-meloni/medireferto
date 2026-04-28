import Link from "next/link";
import { getPatients } from "@/lib/db/patient";
import { formatDate, calcAge } from "@/lib/utils";
import { GENDER_LABEL } from "@/app/constants";
import { DeletePatientButton } from "./DeletePatientButton"; // Import del nuovo tasto

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function AdminPazientiPage({
  searchParams,
}: PageProps) {
  const { q = "" } = await searchParams;
  const patients = await getPatients(q);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">
            Pazienti
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Anagrafica centrale · {patients.length} pazienti
          </p>
        </div>

        <Link
          href="/admin/pazienti/nuovo"
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition"
        >
          Nuovo paziente
        </Link>
      </div>

      <form method="GET" className="relative mb-6">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Cerca per nome, codice fiscale, email…"
          className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
        />
      </form>

      <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50">
              <th className="px-5 py-3 text-left font-medium text-zinc-600">Paziente</th>
              <th className="px-5 py-3 text-left font-medium text-zinc-600">Età / Sesso</th>
              <th className="px-5 py-3 text-left hidden md:table-cell font-medium text-zinc-600">
                Contatti
              </th>
              <th className="px-5 py-3 text-left hidden lg:table-cell font-medium text-zinc-600">
                Ultima visita
              </th>
              <th className="px-5 py-3 text-left hidden lg:table-cell font-medium text-zinc-600">
                Visite
              </th>
              <th className="px-5 py-3" />
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-100">
            {patients.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-5 py-10 text-center text-sm text-zinc-400"
                >
                  Nessun paziente trovato
                </td>
              </tr>
            )}

            {patients.map((patient) => {
              const lastVisit = patient.visits[0];

              return (
                <tr 
                  key={patient.id}
                  className="group hover:bg-zinc-50/50 transition"
                >
                  <td className="px-5 py-4">
                    <p className="font-medium text-zinc-900">
                      {patient.lastName} {patient.firstName}
                    </p>
                    <p className="text-xs text-zinc-400 font-mono uppercase tracking-tighter">
                      {patient.fiscalCode}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-zinc-600">
                    {calcAge(patient.birthDate)} ·{" "}
                    {patient.gender
                      ? GENDER_LABEL[patient.gender]
                      : "—"}
                  </td>

                  <td className="px-5 py-4 hidden md:table-cell text-zinc-500">
                    <p>{patient.email || "—"}</p>
                    <p className="text-xs text-zinc-400">
                      {patient.phone || "—"}
                    </p>
                  </td>

                  <td className="px-5 py-4 hidden lg:table-cell text-zinc-500">
                    {lastVisit
                      ? formatDate(lastVisit.visitDate)
                      : "—"}
                  </td>

                  <td className="px-5 py-4 hidden lg:table-cell text-zinc-500">
                    <span className="inline-flex items-center justify-center bg-zinc-100 text-zinc-600 rounded-full px-2.5 py-0.5 text-xs font-medium">
                      {patient.visits.length}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/admin/pazienti/${patient.id}`}
                        className="text-zinc-400 hover:text-indigo-600 transition-colors text-xs font-medium"
                        title="Modifica paziente"
                      >
                        Modifica
                      </Link>
                      
                      {/* Bottone elimina con conferma inline */}
                      <DeletePatientButton id={patient.id} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}