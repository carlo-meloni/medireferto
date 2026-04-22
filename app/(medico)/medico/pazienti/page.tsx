import Link from "next/link";
import { getPatients } from "@/lib/db/patient";

type PageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function PazientiPage({ searchParams }: PageProps) {
  const { q = "" } = await searchParams;

  const query = q.toLowerCase();

  const patients = await getPatients(query);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">
            Pazienti
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            {patients.length} pazienti registrati
          </p>
        </div>

        <Link
          href="/pazienti/nuovo"
          className="px-4 py-2 text-sm font-medium text-white bg-zinc-900 rounded-lg hover:bg-zinc-800"
        >
          Nuovo paziente
        </Link>
      </div>

      {/* SEARCH */}
      <form className="mb-6">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Cerca per nome, cognome o codice fiscale..."
          className="w-full px-4 py-2 text-sm border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900"
        />
      </form>

      {/* LISTA */}
      <div className="bg-white border border-zinc-200 rounded-xl divide-y">
        {patients.length === 0 && (
          <div className="p-6 text-sm text-zinc-500">
            Nessun paziente trovato
          </div>
        )}

        {patients.map((patient) => (
          <Link
            key={patient.id}
            href={`/pazienti/${patient.id}`}
            className="block p-4 hover:bg-zinc-50 transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-900">
                  {patient.firstName} {patient.lastName}
                </p>
                <p className="text-xs text-zinc-500">
                  {patient.fiscalCode}
                </p>
              </div>

              <div className="text-xs text-zinc-400">
                {patient.email}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}