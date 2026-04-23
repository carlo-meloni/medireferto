import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { formatDate, calcAge } from "@/lib/utils";
import { GENDER_LABEL } from '@/app/constants';

/*
//Formattiamo la data
function formatDate(date: Date) {
  //convertiamo la data in un formato italiano
  return new Date(date).toLocaleDateString('it-IT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

//Calcoliamo l'età partendo dalla data di nascita
function calcAge(birthDate: Date | null) {
  if (!birthDate) return '—';

  const birth = new Date(birthDate);
  const today = new Date();

  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return `${age} anni`;
}
*/

//const GENDER_LABEL = { M: 'M', F: 'F', ALTRO: 'Altro' } as const;

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function AdminPazientiPage({ searchParams }: PageProps) {
  const { q = '' } = await searchParams;

  const patients = await prisma.patient.findMany({
    where: q
      ? {
          OR: [
            {
              firstName: {
                contains: q,
                mode: 'insensitive',
              },
            },
            {
              lastName: {
                contains: q,
                mode: 'insensitive',
              },
            },
            {
              fiscalCode: {
                contains: q,
                mode: 'insensitive',
              },
            },
            {
              email: {
                contains: q,
                mode: 'insensitive',
              },
            },
          ],
        }
      : undefined,

    include: {
      visits: {
        orderBy: {
          visitDate: 'desc',
        },
        select: {
          id: true,
          visitDate: true,
        },
      },
    },

    orderBy: {
      lastName: 'asc',
    },
  });

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">Pazienti</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Anagrafica centrale · {patients.length} pazienti
          </p>
        </div>
        <Link
          href="/admin/pazienti/nuovo"
          className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
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
          className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm"
        />
      </form>

      <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50">
              <th className="px-5 py-3 text-left">Paziente</th>
              <th className="px-5 py-3 text-left">Età / Sesso</th>
              <th className="px-5 py-3 text-left hidden md:table-cell">
                Contatti
              </th>
              <th className="px-5 py-3 text-left hidden lg:table-cell">
                Ultima visita
              </th>
              <th className="px-5 py-3 text-left hidden lg:table-cell">
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
                <tr key={patient.id}>
                  <td className="px-5 py-4">
                    <p className="font-medium text-zinc-900">
                      {patient.lastName} {patient.firstName}
                    </p>
                    <p className="text-xs text-zinc-400 font-mono">
                      {patient.fiscalCode}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-zinc-600">
                    {calcAge(patient.birthDate)} ·{' '}
                    {patient.gender
                      ? GENDER_LABEL[patient.gender]
                      : '—'}
                  </td>

                  <td className="px-5 py-4 hidden md:table-cell">
                    <p>{patient.email || '—'}</p>
                    <p className="text-xs text-zinc-400">
                      {patient.phone || '—'}
                    </p>
                  </td>

                  <td className="px-5 py-4 hidden lg:table-cell">
                    {lastVisit ? formatDate(lastVisit.visitDate) : '—'}
                  </td>

                  <td className="px-5 py-4 hidden lg:table-cell">
                    {patient.visits.length}
                  </td>

                  <td className="px-5 py-4 text-right">
                    <Link
                      href={`/admin/pazienti/${patient.id}`}
                      className="text-indigo-600 text-sm font-medium"
                    >
                      Modifica
                    </Link>
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
