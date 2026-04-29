import NuovaVisitaForm from '@/components/medico/NuovaVisitaForm';
import { getPatients } from '@/lib/db/patient';

export default async function NuovaVisitaPage() {
  const data = await getPatients();

  const patients = data.map(({ id, firstName, lastName, fiscalCode }) => ({
    id,
    firstName,
    lastName,
    fiscalCode,
  }));

  return (
    <div className="px-8 py-10 max-w-2xl mx-auto">
      <div className="mb-10">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-4 ring-1 ring-blue-100">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
          </svg>
          Nuova visita
        </span>
        <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">
          Registra una visita
        </h1>
        <p className="mt-2 text-zinc-500">
          Seleziona il paziente e registra l&apos;audio della visita
        </p>
      </div>

      <NuovaVisitaForm patients={patients} />
    </div>
  );
}