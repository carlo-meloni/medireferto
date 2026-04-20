import NuovaVisitaForm from '@/components/medico/NuovaVisitaForm';
import { MOCK_PATIENTS } from '@/lib/mocked-data';

export default function NuovaVisitaPage() {
  const patients = MOCK_PATIENTS.map(({ id, firstName, lastName, fiscalCode }) => ({
    id,
    firstName,
    lastName,
    fiscalCode,
  }));

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">Nuova visita</h1>
        <p className="mt-1 text-sm text-zinc-500">Seleziona il paziente e registra l&apos;audio della visita</p>
      </div>
      <NuovaVisitaForm patients={patients} />
    </div>
  );
}
