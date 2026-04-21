import { MOCK_PATIENTS } from '@/lib/mocked-data';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('it-IT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function calcAge(birthDate: string) {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

const GENDER_LABEL = { M: 'M', F: 'F', ALTRO: 'Altro' } as const;

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function AdminPazientiPage({ searchParams }: PageProps) {
  const { q = '' } = await searchParams;
  const query = q.toLowerCase();

  const filtered = query
    ? MOCK_PATIENTS.filter(
        (p) =>
          p.firstName.toLowerCase().includes(query) ||
          p.lastName.toLowerCase().includes(query) ||
          p.fiscalCode.toLowerCase().includes(query) ||
          (p.email ?? '').toLowerCase().includes(query),
      )
    : MOCK_PATIENTS;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">Pazienti</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Anagrafica centrale · {MOCK_PATIENTS.length} pazienti
          </p>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Nuovo paziente
        </button>
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
          placeholder="Cerca per nome, codice fiscale, email…"
          className="w-full rounded-lg border border-zinc-200 bg-white pl-9 pr-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
        />
      </form>

      <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50">
              <th className="px-5 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                Paziente
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide">
                Età / Sesso
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide hidden md:table-cell">
                Contatti
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide hidden lg:table-cell">
                Ultima visita
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide hidden lg:table-cell">
                Visite
              </th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-sm text-zinc-400">
                  Nessun paziente trovato per &ldquo;{q}&rdquo;
                </td>
              </tr>
            )}
            {filtered.map((patient) => (
              <tr key={patient.id} className="group hover:bg-zinc-50 transition">
                <td className="px-5 py-4">
                  <p className="font-medium text-zinc-900">
                    {patient.lastName} {patient.firstName}
                  </p>
                  <p className="text-xs text-zinc-400 font-mono mt-0.5">{patient.fiscalCode}</p>
                </td>
                <td className="px-5 py-4 text-zinc-600">
                  {calcAge(patient.birthDate)} anni · {GENDER_LABEL[patient.gender]}
                </td>
                <td className="px-5 py-4 text-zinc-500 hidden md:table-cell">
                  <p className="text-zinc-700">{patient.email}</p>
                  <p className="text-xs text-zinc-400 mt-0.5">{patient.phone}</p>
                </td>
                <td className="px-5 py-4 text-zinc-500 hidden lg:table-cell">
                  {patient.lastVisitDate ? formatDate(patient.lastVisitDate) : '—'}
                </td>
                <td className="px-5 py-4 hidden lg:table-cell">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-zinc-100 text-xs font-semibold text-zinc-600">
                    {patient.visitCount}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800 transition"
                  >
                    Modifica
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
