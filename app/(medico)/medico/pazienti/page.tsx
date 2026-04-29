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
    <div className="min-h-full p-8 max-w-5xl mx-auto">
      {/* HEADER */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">
            Pazienti
          </h1>
          <p className="mt-1.5 text-sm text-zinc-500">
            {total} {total === 1 ? "paziente registrato" : "pazienti registrati"}
          </p>
        </div>

        <Link
          href="/medico/pazienti/nuovo"
          className="group flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 hover:shadow-md active:scale-95 transition-all duration-150"
        >
          <svg
            className="w-4 h-4 transition-transform duration-200 group-hover:rotate-90"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Nuovo paziente
        </Link>
      </div>

      {/* SEARCH */}
      <form className="mb-6">
        <div className="relative">
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Cerca per nome, cognome o codice fiscale..."
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-zinc-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-150 placeholder:text-zinc-400"
          />
        </div>
      </form>

      {/* LISTA */}
      <div className="flex flex-col gap-2">
        {patients.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 rounded-2xl bg-zinc-100 flex items-center justify-center mb-4">
              <svg
                className="w-7 h-7 text-zinc-400"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                />
              </svg>
            </div>
            <p className="text-sm font-semibold text-zinc-700">Nessun paziente trovato</p>
            <p className="text-xs text-zinc-400 mt-1">
              {query ? "Prova a modificare la ricerca" : "Aggiungi il primo paziente"}
            </p>
          </div>
        )}

        {patients.map((patient) => {
          const initials = `${patient.firstName[0]}${patient.lastName[0]}`.toUpperCase();
          return (
            <Link
              key={patient.id}
              href={`/medico/pazienti/${patient.id}`}
              className="group flex items-center gap-4 bg-white rounded-xl border border-zinc-200 px-5 py-4 hover:shadow-md hover:-translate-y-px transition-all duration-150"
            >
              <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-xs font-bold text-blue-600 shrink-0 select-none">
                {initials}
              </div>

              <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                <span className="text-sm font-semibold text-zinc-900 group-hover:text-blue-700 transition-colors duration-150">
                  {patient.firstName} {patient.lastName}
                </span>
                <span className="text-xs text-zinc-400 font-mono tracking-wide">
                  {patient.fiscalCode}
                </span>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {patient.email && (
                  <span className="text-xs text-zinc-400 hidden sm:block">
                    {patient.email}
                  </span>
                )}
                <svg
                  className="w-4 h-4 text-zinc-300 group-hover:text-zinc-500 group-hover:translate-x-0.5 transition-all duration-150"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
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
                className="px-3 py-1.5 text-sm font-medium border border-zinc-200 rounded-lg hover:bg-zinc-50 hover:border-zinc-300 transition-all duration-150"
              >
                Precedente
              </Link>
            ) : (
              <span className="px-3 py-1.5 text-sm font-medium border border-zinc-100 rounded-lg text-zinc-300 cursor-not-allowed">
                Precedente
              </span>
            )}

            {page < totalPages ? (
              <Link
                href={pageHref(page + 1)}
                className="px-3 py-1.5 text-sm font-medium border border-zinc-200 rounded-lg hover:bg-zinc-50 hover:border-zinc-300 transition-all duration-150"
              >
                Successiva
              </Link>
            ) : (
              <span className="px-3 py-1.5 text-sm font-medium border border-zinc-100 rounded-lg text-zinc-300 cursor-not-allowed">
                Successiva
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
