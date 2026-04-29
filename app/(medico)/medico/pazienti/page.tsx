import Link from "next/link";
import { getPatientsPage } from "@/lib/db/patient";

const PAGE_SIZE = 20;

type PageProps = {
  searchParams: Promise<{
    q?: string;
    page?: string;
  }>;
};

export default async function PazientiPage({ searchParams }: PageProps) {
  const { q = "", page: pageParam = "1" } = await searchParams;

  const query = q.toLowerCase();
  const page = Math.max(1, parseInt(pageParam, 10) || 1);

  const { patients, total } = await getPatientsPage(query, page, PAGE_SIZE);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  function pageHref(p: number) {
    const params = new URLSearchParams();
    if (query) params.set("q", q);
    params.set("page", String(p));
    return `?${params.toString()}`;
  }

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-zinc-900 tracking-tight">
            Pazienti
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            {total} pazienti registrati
          </p>
        </div>

        <Link
          href="/medico/pazienti/nuovo"
          className="w-full md:w-auto text-center px-4 py-2 text-sm font-medium text-white bg-zinc-900 rounded-lg hover:bg-zinc-800"
        >
          Nuovo paziente
        </Link>
      </div>

      {/* SEARCH */}
      <form className="mb-4 md:mb-6 flex gap-2">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Cerca per nome, cognome o codice fiscale..."
          className="w-full px-4 py-2 text-sm border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-900"
        />

        {q && (
          <Link
            href="/medico/pazienti"
            className="px-4 py-2 text-sm rounded-lg border border-zinc-300 text-zinc-600 hover:bg-zinc-100 transition whitespace-nowrap"
          >
            Pulisci
          </Link>
        )}
      </form>

      {/* LISTA */}
      <div className="bg-white border border-zinc-200 rounded-xl divide-y">

        {patients.length === 0 && (
          <div className="p-6 text-sm text-zinc-500">
            Nessun paziente trovato
          </div>
        )}

        {patients.map((patient) => {
          if (!patient?.id) return null;

          return (
            <Link
              key={patient.id}
              href={`/medico/pazienti/${patient.id}`}
              className="block p-4 hover:bg-zinc-50 transition"
            >
              {/* MOBILE colonna, DESKTOP riga */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">

                <div>
                  <p className="text-sm font-medium text-zinc-900">
                    {patient.firstName} {patient.lastName}
                  </p>
                  <p className="text-xs text-zinc-500 break-all">
                    {patient.fiscalCode}
                  </p>
                </div>

                <div className="text-xs text-zinc-400 break-all md:text-right">
                  {patient.email}
                </div>

              </div>
            </Link>
          );
        })}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-zinc-500">
            Pagina {page} di {totalPages}
          </p>

          <div className="flex gap-2">
            {page > 1 ? (
              <Link
                href={pageHref(page - 1)}
                className="px-3 py-1.5 text-sm border border-zinc-300 rounded-lg hover:bg-zinc-50"
              >
                Precedente
              </Link>
            ) : (
              <span className="px-3 py-1.5 text-sm border border-zinc-200 rounded-lg text-zinc-300 cursor-not-allowed">
                Precedente
              </span>
            )}

            {page < totalPages ? (
              <Link
                href={pageHref(page + 1)}
                className="px-3 py-1.5 text-sm border border-zinc-300 rounded-lg hover:bg-zinc-50"
              >
                Successiva
              </Link>
            ) : (
              <span className="px-3 py-1.5 text-sm border border-zinc-200 rounded-lg text-zinc-300 cursor-not-allowed">
                Successiva
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
