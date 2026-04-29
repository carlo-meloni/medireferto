import Link from "next/link";
import { Plus, Search, Users } from "lucide-react";
import { getPatients } from "@/lib/db/patient";
import { formatDate, calcAge } from "@/lib/utils";
import { GENDER_LABEL } from "@/app/constants";

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function AdminPazientiPage({
  searchParams,
}: PageProps) {
  const { q = "" } = await searchParams;
  const patients = await getPatients(q);

  return (
    <div className="min-h-full bg-zinc-50/60 p-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8 flex items-start justify-between animate-fade-in">
          <div className="flex items-start gap-4">
            <div className="inline-flex items-center justify-center rounded-xl bg-emerald-50 p-2.5">
              <Users size={18} className="text-emerald-500" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
                Pazienti
              </h1>
              <p className="mt-1 text-sm text-zinc-500">
                {patients.length}{" "}
                {patients.length === 1 ? "paziente anagrafato" : "pazienti anagrafati"}
              </p>
            </div>
          </div>

          <Link
            href="/admin/pazienti/nuovo"
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all duration-200 hover:bg-indigo-700 hover:shadow-md hover:-translate-y-0.5"
          >
            <Plus size={15} />
            Nuovo paziente
          </Link>
        </div>

        {/* Search */}
        <form method="GET" className="relative mb-6 animate-fade-in" style={{ animationDelay: "75ms" }}>
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
          />
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Cerca per nome, codice fiscale, email…"
            className="w-full rounded-xl border border-zinc-200 bg-white py-2.5 pl-9 pr-4 text-sm text-zinc-900 shadow-sm placeholder:text-zinc-400 transition-colors focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </form>

        {/* Table */}
        <div
          className="overflow-hidden rounded-2xl border border-zinc-100 bg-white shadow-sm animate-slide-up"
          style={{ animationDelay: "150ms" }}
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/80">
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
                  Paziente
                </th>
                <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
                  Età / Sesso
                </th>
                <th className="hidden px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-widest text-zinc-400 md:table-cell">
                  Contatti
                </th>
                <th className="hidden px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-widest text-zinc-400 lg:table-cell">
                  Ultima visita
                </th>
                <th className="hidden px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-widest text-zinc-400 lg:table-cell">
                  Visite
                </th>
                <th className="px-5 py-3.5 text-right" />
              </tr>
            </thead>

            <tbody className="divide-y divide-zinc-100">
              {patients.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-50">
                        <Users size={20} className="text-zinc-300" />
                      </div>
                      <p className="text-sm font-medium text-zinc-400">
                        {q ? "Nessun paziente corrisponde alla ricerca" : "Nessun paziente registrato"}
                      </p>
                      {!q && (
                        <Link
                          href="/admin/pazienti/nuovo"
                          className="mt-1 text-xs font-medium text-indigo-600 hover:text-indigo-700"
                        >
                          Aggiungi il primo paziente →
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              )}

              {patients.map((patient) => {
                const lastVisit = patient.visits[0];
                const initials =
                  `${patient.firstName[0] ?? ""}${patient.lastName[0] ?? ""}`.toUpperCase();

                return (
                  <tr
                    key={patient.id}
                    className="group transition-colors duration-150 hover:bg-emerald-50/40"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[11px] font-bold text-emerald-600">
                          {initials}
                        </div>
                        <div>
                          <p className="font-medium text-zinc-900">
                            {patient.lastName} {patient.firstName}
                          </p>
                          <p className="mt-0.5 font-mono text-[11px] text-zinc-400">
                            {patient.fiscalCode}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      {patient.gender ? (
                        <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600">
                          {calcAge(patient.birthDate)} · {GENDER_LABEL[patient.gender]}
                        </span>
                      ) : (
                        <span className="text-zinc-400">{calcAge(patient.birthDate) || "—"}</span>
                      )}
                    </td>

                    <td className="hidden px-5 py-4 md:table-cell">
                      <p className="font-medium text-zinc-700">{patient.email || "—"}</p>
                      <p className="mt-0.5 text-xs text-zinc-400">
                        {patient.phone || "—"}
                      </p>
                    </td>

                    <td className="hidden px-5 py-4 text-zinc-500 lg:table-cell">
                      {lastVisit ? formatDate(lastVisit.visitDate) : "—"}
                    </td>

                    <td className="hidden px-5 py-4 lg:table-cell">
                      {patient.visits.length > 0 ? (
                        <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
                          {patient.visits.length}
                        </span>
                      ) : (
                        <span className="text-zinc-400">0</span>
                      )}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/admin/pazienti/${patient.id}`}
                        className="text-xs font-medium text-indigo-600 transition-colors hover:text-indigo-800"
                      >
                        Modifica{" "}
                        <span className="inline-block transition-transform group-hover:translate-x-0.5">
                          →
                        </span>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}