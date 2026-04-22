import Link from 'next/link';
import { MOCK_DOCTORS } from '@/lib/mocked-data';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('it-IT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function AdminMediciPage({ searchParams }: PageProps) {
  const { q = '' } = await searchParams;
  const query = q.toLowerCase();

  const filtered = query
    ? MOCK_DOCTORS.filter(
        (d) =>
          d.firstName.toLowerCase().includes(query) ||
          d.lastName.toLowerCase().includes(query) ||
          d.specialization.toLowerCase().includes(query) ||
          d.email.toLowerCase().includes(query),
      )
    : MOCK_DOCTORS;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">Medici</h1>
          <p className="mt-1 text-sm text-zinc-500">{MOCK_DOCTORS.length} medici registrati</p>
        </div>
        <Link
          href="/admin/medici/nuovo"
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Nuovo medico
        </Link>
      </div>

      <form method="GET" className="relative mb-6">
        <svg
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Cerca per nome, specializzazione, email…"
          className="w-full rounded-lg border border-zinc-200 bg-white pl-9 pr-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
        />
      </form>

      <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50">
              <th className="px-5 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                Medico
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                Specializzazione
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide hidden md:table-cell">
                Studio
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide hidden lg:table-cell">
                Visite
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide hidden lg:table-cell">
                Registrato
              </th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-sm text-zinc-400">
                  Nessun medico trovato per &ldquo;{q}&rdquo;
                </td>
              </tr>
            )}
            {filtered.map((doctor) => (
              <tr key={doctor.id} className="group hover:bg-zinc-50 transition">
                <td className="px-5 py-4">
                  <p className="font-medium text-zinc-900">
                    Dr. {doctor.lastName} {doctor.firstName}
                  </p>
                  <p className="text-xs text-zinc-400 mt-0.5">{doctor.email}</p>
                </td>
                <td className="px-5 py-4 text-zinc-600">{doctor.specialization}</td>
                <td className="px-5 py-4 text-zinc-500 hidden md:table-cell">
                  <p className="text-zinc-700">{doctor.clinicName}</p>
                  <p className="text-xs text-zinc-400 mt-0.5">{doctor.clinicAddress}</p>
                </td>
                <td className="px-5 py-4 hidden lg:table-cell">
                  <span className="inline-flex items-center justify-center min-w-7 h-7 px-2 rounded-full bg-zinc-100 text-xs font-semibold text-zinc-600">
                    {doctor.visitCount}
                  </span>
                </td>
                
                <td className="px-5 py-4 text-right">
                  <Link
                    href={`/admin/medici/${doctor.id}`}
                    className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800 transition"
                  >
                    Modifica
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
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
