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

function SectionIcon({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 shrink-0">
      {children}
    </span>
  );
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Selezione paziente */}
      <section className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm ring-1 ring-zinc-900/5 transition-shadow hover:shadow-md">
        <div className="flex items-center gap-2.5 mb-5">
          <SectionIcon>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </SectionIcon>
          <h2 className="text-sm font-semibold text-zinc-900">Paziente</h2>
        </div>

        {selectedPatient ? (
          <div className="flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50/60 px-4 py-3 ring-1 ring-blue-200">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
              {selectedPatient.firstName[0]}{selectedPatient.lastName[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-zinc-900">
                {selectedPatient.firstName} {selectedPatient.lastName}
              </p>
              <p className="text-xs text-zinc-400 font-mono">{selectedPatient.fiscalCode}</p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedPatientId('')}
              className="text-xs font-medium text-blue-600 hover:text-blue-800 shrink-0 rounded-md px-2 py-1 hover:bg-blue-100 transition-colors"
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
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-9 pr-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>

            {dropdownOpen && filteredPatients.length > 0 && (
              <ul className="absolute z-10 mt-2 w-full rounded-xl border border-zinc-200 bg-white shadow-xl shadow-zinc-900/10 max-h-60 overflow-auto divide-y divide-zinc-50">
                {filteredPatients.map((patient) => (
                  <li key={patient.id}>
                    <button
                      type="button"
                      onMouseDown={() => selectPatient(patient.id)}
                      className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors group"
                    >
                      <p className="text-sm font-medium text-zinc-900 group-hover:text-blue-700">
                        {patient.firstName} {patient.lastName}
                      </p>
                      <p className="text-xs text-zinc-400 font-mono">{patient.fiscalCode}</p>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {dropdownOpen && searchQuery.trim() !== '' && filteredPatients.length === 0 && (
              <div className="absolute z-10 mt-2 w-full rounded-xl border border-zinc-200 bg-white shadow-xl shadow-zinc-900/10 px-4 py-4 text-center">
                <p className="text-sm text-zinc-400">Nessun paziente trovato</p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Dati esame */}
      <section className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm ring-1 ring-zinc-900/5 transition-shadow hover:shadow-md">
        <div className="flex items-center gap-2.5 mb-5">
          <SectionIcon>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </SectionIcon>
          <h2 className="text-sm font-semibold text-zinc-900">Dati esame</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="acceptanceDate" className="text-xs font-semibold text-zinc-600 tracking-wide">
              Data di accettazione <span className="text-red-500">*</span>
            </label>
            <input
              id="acceptanceDate"
              type="datetime-local"
              required
              value={acceptanceDate}
              onChange={(e) => setAcceptanceDate(e.target.value)}
              className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-900 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="examDate" className="text-xs font-semibold text-zinc-600 tracking-wide">
              Data di esecuzione esame <span className="text-red-500">*</span>
            </label>
            <input
              id="examDate"
              type="datetime-local"
              required
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-900 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
        </div>
      </section>

      {/* Registrazione audio */}
      <section className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm ring-1 ring-zinc-900/5 transition-shadow hover:shadow-md">
        <div className="flex items-start gap-2.5 mb-5">
          <SectionIcon>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </SectionIcon>
          <div>
            <h2 className="text-sm font-semibold text-zinc-900">Registrazione audio</h2>
            <p className="mt-0.5 text-xs text-zinc-400">
              Avvia la registrazione durante la visita. La trascrizione avviene in tempo reale.
            </p>
          </div>
        </div>
        <AudioRecorder onAudioReady={handleAudioReady} />
      </section>

      {/* Note interne */}
      <section className="rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm ring-1 ring-zinc-900/5 transition-shadow hover:shadow-md">
        <div className="flex items-start gap-2.5 mb-4">
          <SectionIcon>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </SectionIcon>
          <div>
            <h2 className="text-sm font-semibold text-zinc-900">
              Note interne <span className="font-normal text-zinc-400">(opzionale)</span>
            </h2>
            <p className="mt-0.5 text-xs text-zinc-400">Non incluse nel referto PDF.</p>
          </div>
        </div>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Annotazioni private per questa visita..."
          className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none transition-all"
        />
      </section>

      {error && (
        <div className="flex items-start gap-3 rounded-xl bg-red-50 border border-red-100 ring-1 ring-red-200/60 px-4 py-3.5">
          <svg className="w-4 h-4 text-red-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-300/40 transition-all"
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
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-blue-600/25 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {submitting ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Salvataggio…
              </>
            ) : (
              <>
                {selectedPatient
                  ? `Invia visita — ${selectedPatient.firstName} ${selectedPatient.lastName}`
                  : 'Invia visita'}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
