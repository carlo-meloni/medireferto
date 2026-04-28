'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AudioRecorder from '@/components/medico/AudioRecorder';
import { createVisita } from '@/lib/db/visit';

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  fiscalCode: string;
}

interface NuovaVisitaFormProps {
  patients: Patient[];
}

function toLocalDatetimeValue(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function NuovaVisitaForm({ patients }: NuovaVisitaFormProps) {
  const router = useRouter();
  const now = toLocalDatetimeValue(new Date());
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [acceptanceDate, setAcceptanceDate] = useState(now);
  const [examDate, setExamDate] = useState(now);
  const [transcript, setTranscript] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedPatient = patients.find((p) => p.id === selectedPatientId);
  const canSubmit = !!selectedPatientId && !!transcript && !!acceptanceDate && !!examDate && !submitting;

  function handleAudioReady(transcriptText: string) {
    setTranscript(transcriptText);
  }

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const result = await createVisita({
      patientId: selectedPatientId,
      notes,
      transcript,
      acceptanceDate: new Date(acceptanceDate),
      examDate: new Date(examDate),
    });

    if ('error' in result) {
      setError(result.error);
      setSubmitting(false);
      return;
    }

    router.push(`/medico/visita/${result.visitId}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {/* Selezione paziente */}
      <section className="rounded-xl border border-zinc-200 bg-white p-6">
        <h2 className="text-sm font-semibold text-zinc-900 mb-4">Paziente</h2>
        <div className="flex flex-col gap-3">
          {patients.map((patient) => (
            <label
              key={patient.id}
              className={`flex items-center gap-4 rounded-lg border px-4 py-3 cursor-pointer transition ${
                selectedPatientId === patient.id
                  ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                  : 'border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'
              }`}
            >
              <input
                type="radio"
                name="patient"
                value={patient.id}
                checked={selectedPatientId === patient.id}
                onChange={() => setSelectedPatientId(patient.id)}
                className="sr-only"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-900">
                  {patient.firstName} {patient.lastName}
                </p>
                <p className="text-xs text-zinc-400 font-mono">{patient.fiscalCode}</p>
              </div>
              {selectedPatientId === patient.id && (
                <svg className="w-4 h-4 text-blue-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </label>
          ))}
        </div>
      </section>

      {/* Dati esame */}
      <section className="rounded-xl border border-zinc-200 bg-white p-6">
        <h2 className="text-sm font-semibold text-zinc-900 mb-4">Dati esame</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="acceptanceDate" className="text-xs font-medium text-zinc-700">
              Data di accettazione <span className="text-red-500">*</span>
            </label>
            <input
              id="acceptanceDate"
              type="datetime-local"
              required
              value={acceptanceDate}
              onChange={(e) => setAcceptanceDate(e.target.value)}
              className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="examDate" className="text-xs font-medium text-zinc-700">
              Data di esecuzione esame <span className="text-red-500">*</span>
            </label>
            <input
              id="examDate"
              type="datetime-local"
              required
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
            />
          </div>
        </div>
      </section>

      {/* Registrazione audio */}
      <section className="rounded-xl border border-zinc-200 bg-white p-6">
        <h2 className="text-sm font-semibold text-zinc-900 mb-1">Registrazione audio</h2>
        <p className="text-xs text-zinc-500 mb-4">
          Avvia la registrazione durante la visita. La trascrizione avviene in tempo reale.
        </p>
        <AudioRecorder onAudioReady={handleAudioReady} />
      </section>

      {/* Note interne */}
      <section className="rounded-xl border border-zinc-200 bg-white p-6">
        <h2 className="text-sm font-semibold text-zinc-900 mb-1">Note interne (opzionale)</h2>
        <p className="text-xs text-zinc-500 mb-3">Non incluse nel referto PDF.</p>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Annotazioni private per questa visita..."
          className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none transition"
        />
      </section>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3 border border-red-100">
          {error}
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-300/40 transition"
        >
          Annulla
        </button>

        <div className="flex items-center gap-3">
          {!canSubmit && !submitting && (
            <p className="text-xs text-zinc-400">
              {!selectedPatientId ? 'Seleziona un paziente' : "Registra l'audio"}
            </p>
          )}
          <button
            type="submit"
            disabled={!canSubmit}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            {submitting
              ? 'Salvataggio…'
              : selectedPatient
                ? `Invia visita — ${selectedPatient.firstName} ${selectedPatient.lastName}`
                : 'Invia visita'}
          </button>
        </div>
      </div>
    </form>
  );
}
