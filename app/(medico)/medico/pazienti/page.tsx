// import Link from 'next/link';
// import { MOCK_PATIENTS } from '@/lib/mocked-data';

// function formatDate(iso: string) {
//   return new Date(iso).toLocaleDateString('it-IT', {
//     day: '2-digit',
//     month: 'short',
//     year: 'numeric',
//   });
// }

// function calcAge(birthDate: string) {
//   const birth = new Date(birthDate);
//   const today = new Date();
//   let age = today.getFullYear() - birth.getFullYear();
//   const m = today.getMonth() - birth.getMonth();
//   if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
//   return age;
// }

// const GENDER_LABEL = { M: 'M', F: 'F', ALTRO: 'Altro' } as const;

// interface PageProps {
//   searchParams: Promise<{ q?: string }>;
// }

// export default async function PazientiPage({ searchParams }: PageProps) {
//   const { q = '' } = await searchParams;
//   const query = q.toLowerCase();

//   const filtered = query
//     ? MOCK_PATIENTS.filter(
//         (p) =>
//           p.firstName.toLowerCase().includes(query) ||
//           p.lastName.toLowerCase().includes(query) ||
//           p.fiscalCode.toLowerCase().includes(query),
//       )
//     : MOCK_PATIENTS;

//   return (
//     <div className="p-8 max-w-5xl mx-auto">
//       <div className="flex items-center justify-between mb-8">
//         <div>
//           <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">Pazienti</h1>
//           <p className="mt-1 text-sm text-zinc-500">{MOCK_PATIENTS.length} pazienti registrati</p>
//         </div>
//         <button
//           type="button"
//           className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition"
//         >
//           <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
//           </svg>
//           Nuovo paziente
//         </button>
//       </div>

//       <form method="GET" className="relative mb-6">
//         <svg
//           className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth={2}
//           viewBox="0 0 24 24"
//         >
//           <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
//         </svg>
//         <input
//           type="text"
//           name="q"
//           defaultValue={q}
//           placeholder="Cerca per nome o codice fiscale…"
//           className="w-full rounded-lg border border-zinc-200 bg-white pl-9 pr-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
//         />
//       </form>

//       <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
//         <table className="w-full text-sm">
//           <thead>
//             <tr className="border-b border-zinc-100 bg-zinc-50">
//               <th className="px-5 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide">
//                 Paziente
//               </th>
//               <th className="px-5 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide">
//                 Età / Sesso
//               </th>
//               <th className="px-5 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide hidden md:table-cell">
//                 Ultima visita
//               </th>
//               <th className="px-5 py-3 text-left text-xs font-semibold text-zinc-500 uppercase tracking-wide hidden lg:table-cell">
//                 Visite
//               </th>
//               <th className="px-5 py-3" />
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-zinc-100">
//             {filtered.length === 0 && (
//               <tr>
//                 <td colSpan={5} className="px-5 py-10 text-center text-sm text-zinc-400">
//                   Nessun paziente trovato per &ldquo;{q}&rdquo;
//                 </td>
//               </tr>
//             )}
//             {filtered.map((patient) => (
//               <tr key={patient.id} className="group hover:bg-zinc-50 transition">
//                 <td className="px-5 py-4">
//                   <p className="font-medium text-zinc-900">
//                     {patient.lastName} {patient.firstName}
//                   </p>
//                   <p className="text-xs text-zinc-400 font-mono mt-0.5">{patient.fiscalCode}</p>
//                 </td>
//                 <td className="px-5 py-4 text-zinc-600">
//                   {calcAge(patient.birthDate)} anni · {GENDER_LABEL[patient.gender]}
//                 </td>
//                 <td className="px-5 py-4 text-zinc-500 hidden md:table-cell">
//                   {patient.lastVisitDate ? formatDate(patient.lastVisitDate) : '—'}
//                 </td>
//                 <td className="px-5 py-4 hidden lg:table-cell">
//                   <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-zinc-100 text-xs font-semibold text-zinc-600">
//                     {patient.visitCount}
//                   </span>
//                 </td>
//                 <td className="px-5 py-4 text-right">
//                   <Link
//                     href={`/medico/pazienti/${patient.id}`}
//                     className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-800 transition"
//                   >
//                     Dettaglio
//                     <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
//                     </svg>
//                   </Link>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// }


import Link from "next/link";
import { getPatients } from "@/lib/db/patient";

type PageProps = {
  searchParams: {
    q?: string;
  };
};

export default async function PazientiPage({ searchParams }: PageProps) {
  const q = searchParams?.q || "";
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
