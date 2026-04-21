import Link from 'next/link';
import {
  MOCK_PATIENTS,
  MOCK_PATIENT_VISITS,
  VISIT_STATUS_LABEL,
  VISIT_STATUS_CLASSES,
} from '@/lib/mocked-data';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('it-IT', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatBirthDate(iso: string) {
  return new Date(iso).toLocaleDateString('it-IT', {
    day: '2-digit',
    month: 'long',
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

interface InfoRowProps {
  label: string;
  value: string;
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-zinc-400 font-medium uppercase tracking-wide">{label}</span>
      <span className="text-sm text-zinc-900">{value}</span>
    </div>
  );
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PazienteDetailPage({ params }: PageProps) {
  const { id } = await params;

  // TODO: fetch from DB by id
  const patient = MOCK_PATIENTS.find((p) => p.id === id) ?? MOCK_PATIENTS[0];

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link
        href="/medico/pazienti"
        className="mb-6 inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-600 transition"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Torna ai pazienti
      </Link>

      <div className="rounded-xl border border-zinc-200 bg-white p-6 mb-6">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">
              {patient.lastName} {patient.firstName}
            </h1>
            <p className="mt-1 text-sm text-zinc-400 font-mono">{patient.fiscalCode}</p>
          </div>
          <button
            type="button"
            className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-xs font-medium text-zinc-700 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-300/40 transition"
          >
            Modifica anagrafica
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          <InfoRow
            label="Data di nascita"
            value={`${formatBirthDate(patient.birthDate)} (${calcAge(patient.birthDate)} anni)`}
          />
          <InfoRow label="Luogo di nascita" value={patient.birthPlace} />
          <InfoRow
            label="Sesso"
            value={patient.gender === 'M' ? 'Maschio' : patient.gender === 'F' ? 'Femmina' : 'Altro'}
          />
          <InfoRow label="Telefono" value={patient.phone} />
          <InfoRow label="Email" value={patient.email} />
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-zinc-900">
          Storico visite{' '}
          <span className="ml-1 text-zinc-400 font-normal">({MOCK_PATIENT_VISITS.length})</span>
        </h2>
        <Link
          href="/medico/visita/nuova"
          className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Nuova visita
        </Link>
      </div>

      <div className="flex flex-col gap-2.5">
        {MOCK_PATIENT_VISITS.map((visit) => (
          <Link
            key={visit.id}
            href={`/medico/visita/${visit.id}`}
            className="group flex items-center justify-between rounded-xl border border-zinc-200 bg-white px-5 py-4 hover:border-zinc-300 hover:shadow-sm transition"
          >
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium text-zinc-900 group-hover:text-blue-700 transition">
                {formatDate(visit.visitDate)}
              </span>
              {visit.notes && (
                <span className="text-xs text-zinc-400">{visit.notes}</span>
              )}
            </div>
            <div className="flex items-center gap-3 shrink-0 ml-4">
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${VISIT_STATUS_CLASSES[visit.status]}`}
              >
                {VISIT_STATUS_LABEL[visit.status]}
              </span>
              <svg
                className="w-4 h-4 text-zinc-300 group-hover:text-zinc-500 transition"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
