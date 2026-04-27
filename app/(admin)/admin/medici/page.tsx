import Link from "next/link";
import { getDoctors } from "@/lib/db/doctor";

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function AdminMediciPage({ searchParams }: PageProps) {
  const { q = "" } = await searchParams;

  const doctors = await getDoctors(q);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">
            Medici
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            {doctors.length} medici registrati
          </p>
        </div>

        <Link
          href="/admin/medici/nuovo"
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
        >
          Nuovo medico
        </Link>
      </div>

      <form method="GET" className="relative mb-6">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Cerca per nome, specializzazione, email…"
          className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm"
        />
      </form>

      <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50">
              <th className="px-5 py-3 text-left">Medico</th>
              <th className="px-5 py-3 text-left">Specializzazione</th>
              <th className="px-5 py-3 hidden md:table-cell text-left">
                Studio
              </th>
              <th className="px-5 py-3 hidden lg:table-cell text-left">
                Contatti
              </th>
              <th className="px-5 py-3 text-right" />
            </tr>
          </thead>

          <tbody className="divide-y divide-zinc-100">
            {doctors.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-10 text-center text-sm text-zinc-400"
                >
                  Nessun medico trovato
                </td>
              </tr>
            )}

            {doctors.map((doctor) => (
              <tr
                key={doctor.id}
                className="group hover:bg-zinc-50 transition"
              >
                <td className="px-5 py-4">
                  <p className="font-medium text-zinc-900">
                    Dr. {doctor.lastName} {doctor.firstName}
                  </p>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {doctor.licenseNumber}
                  </p>
                </td>

                <td className="px-5 py-4 text-zinc-600">
                  {doctor.specialization || "—"}
                </td>

                <td className="px-5 py-4 hidden md:table-cell text-zinc-500">
                  <p className="text-zinc-700">
                    {doctor.clinicName || "—"}
                  </p>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {doctor.clinicAddress || "—"}
                  </p>
                </td>

                <td className="px-5 py-4 hidden lg:table-cell text-zinc-500">
                  <p>{doctor.phone || "—"}</p>
                </td>

                <td className="px-5 py-4 text-right">
                  <Link
                    href={`/admin/medici/${doctor.id}`}
                    className="text-indigo-600 text-xs font-medium hover:text-indigo-800"
                  >
                    Modifica →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}