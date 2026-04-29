'use client';

import { useState, useRef, useEffect } from 'react';
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

  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const selectedPatient = patients.find((p) => p.id === selectedPatientId);
  const canSubmit = !!selectedPatientId && !!transcript && !!acceptanceDate && !!examDate && !submitting;

  const filteredPatients = searchQuery.trim()
    ? patients.filter((p) => {
        const q = searchQuery.toLowerCase();
        return (
          p.firstName.toLowerCase().includes(q) ||
          p.lastName.toLowerCase().includes(q) ||
          p.fiscalCode.toLowerCase().includes(q)
        );
      })
    : patients;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function selectPatient(id: string) {
    setSelectedPatientId(id);
    setDropdownOpen(false);
    setSearchQuery('');
  }

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

        {selectedPatient ? (
          <div className="flex items-center gap-4 rounded-lg border border-blue-500 bg-blue-50 ring-1 ring-blue-500 px-4 py-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-zinc-900">
                {selectedPatient.firstName} {selectedPatient.lastName}
              </p>
              <p className="text-xs text-zinc-400 font-mono">{selectedPatient.fiscalCode}</p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedPatientId('')}
              className="text-xs text-blue-600 hover:text-blue-800 shrink-0"
            >
              Cambia
            </button>
          </div>
        ) : (
          <div ref={searchRef} className="relative">
            <div className="relative">
              <svg
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input
                type="text"
                placeholder="Cerca per nome o codice fiscale…"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setDropdownOpen(true);
                }}
                onFocus={() => setDropdownOpen(true)}
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50 pl-9 pr-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition"
              />
            </div>

            {dropdownOpen && filteredPatients.length > 0 && (
              <ul className="absolute z-10 mt-1 w-full rounded-lg border border-zinc-200 bg-white shadow-lg max-h-60 overflow-auto">
                {filteredPatients.map((patient) => (
                  <li key={patient.id}>
                    <button
                      type="button"
                      onMouseDown={() => selectPatient(patient.id)}
                      className="w-full text-left px-4 py-3 hover:bg-zinc-50 transition"
                    >
                      <p className="text-sm font-medium text-zinc-900">
                        {patient.firstName} {patient.lastName}
                      </p>
                      <p className="text-xs text-zinc-400 font-mono">{patient.fiscalCode}</p>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {dropdownOpen && searchQuery.trim() !== '' && filteredPatients.length === 0 && (
              <div className="absolute z-10 mt-1 w-full rounded-lg border border-zinc-200 bg-white shadow-lg px-4 py-3">
                <p className="text-sm text-zinc-400">Nessun paziente trovato</p>
              </div>
            )}
          </div>
        )}
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
