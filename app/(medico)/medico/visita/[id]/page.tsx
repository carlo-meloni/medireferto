'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

type VisitStatus = 'IN_REGISTRAZIONE' | 'IN_REVISIONE' | 'APPROVATO' | 'ESPORTATO';

const STATUS_LABEL: Record<VisitStatus, string> = {
  IN_REGISTRAZIONE: 'In registrazione',
  IN_REVISIONE: 'In revisione',
  APPROVATO: 'Approvato',
  ESPORTATO: 'Esportato',
};

const STATUS_CLASSES: Record<VisitStatus, string> = {
  IN_REGISTRAZIONE: 'bg-blue-50 text-blue-700 ring-blue-200',
  IN_REVISIONE: 'bg-amber-50 text-amber-700 ring-amber-200',
  APPROVATO: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  ESPORTATO: 'bg-zinc-100 text-zinc-600 ring-zinc-200',
};

const MOCK_VISIT = {
  id: '1',
  patientName: 'Mario Bianchi',
  fiscalCode: 'BNCMRA80A01H501X',
  visitDate: '2026-04-20T10:30:00',
  status: 'IN_REVISIONE' as VisitStatus,
  transcript: `Paziente maschio di 46 anni, iperteso in terapia con amlodipina 5 mg/die. Si presenta per controllo periodico.

Riferisce cefalea saltuaria nelle ultime due settimane, soprattutto al mattino. Nega dolore toracico, dispnea o palpitazioni. Nessun episodio sincopale. Sonno regolare. Attività fisica moderata (camminata 30 min/die).

All'esame obiettivo: PA 148/92 mmHg al braccio destro, confermata a 150/90 mmHg al braccio sinistro. FC 72 bpm ritmica. Toni cardiaci puri. MV conservato bilateralmente. Addome trattabile, non dolente. Nessun edema declive.

ECG: ritmo sinusale, PR 164 ms, asse normale, nessuna alterazione della ripolarizzazione.`,
  reportDraft: `**ANAMNESI**
Paziente: Mario Bianchi, 46 anni, M. CF: BNCMRA80A01H501X
Visita del: 20 aprile 2026

Ipertensione arteriosa nota in terapia con Amlodipina 5 mg/die. Accede per controllo periodico con riferita cefalea mattutina nelle ultime due settimane.

**ESAME OBIETTIVO**
- PA: 148/92 mmHg (dx) — 150/90 mmHg (sin)
- FC: 72 bpm, ritmica
- Toni cardiaci: puri, normofrequenti
- Torace: MV conservato bilateralmente
- Addome: trattabile, non dolente
- Arti inferiori: nessun edema declive
- ECG: ritmo sinusale, PR 164 ms, asse normale

**DIAGNOSI**
Ipertensione arteriosa, controllo subottimale dei valori pressori (PA media ~149/91 mmHg).

**PIANO TERAPEUTICO**
1. Uptitration Amlodipina a 10 mg/die
2. Monitoraggio domiciliare PA mattino e sera per 2 settimane
3. Riduzione apporto sodico; incremento attività aerobica
4. Controllo in 30 giorni con misurazione PA; da valutare aggiunta di ACE-inibitore se mancato target

**NOTE**
Paziente compliante alla terapia. Rivalutare EAB e creatinina al prossimo accesso.`,
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('it-IT', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function VisitaDetailPage() {
  const router = useRouter();
  const [report, setReport] = useState(MOCK_VISIT.reportDraft);
  const [status, setStatus] = useState<VisitStatus>(MOCK_VISIT.status);
  const [saved, setSaved] = useState(false);

  function handleApprove() {
    // TODO: call API to approve
    setStatus('APPROVATO');
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  function handleExportPdf() {
    // TODO: call PDF generation API
    setStatus('ESPORTATO');
  }

  const isApproved = status === 'APPROVATO' || status === 'ESPORTATO';

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <button
            type="button"
            onClick={() => router.back()}
            className="mb-3 flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-600 transition"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Torna alle visite
          </button>
          <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">{MOCK_VISIT.patientName}</h1>
          <div className="mt-1 flex items-center gap-3">
            <span className="text-sm text-zinc-500 font-mono">{MOCK_VISIT.fiscalCode}</span>
            <span className="text-zinc-300">·</span>
            <span className="text-sm text-zinc-500">{formatDate(MOCK_VISIT.visitDate)}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {saved && (
            <span className="text-xs text-emerald-600 font-medium animate-pulse">Salvato</span>
          )}
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${STATUS_CLASSES[status]}`}
          >
            {STATUS_LABEL[status]}
          </span>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transcript */}
        <div className="flex flex-col gap-3">
          <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Trascrizione audio</h2>
          <div className="rounded-xl border border-zinc-200 bg-white p-5 flex-1">
            <p className="text-sm text-zinc-700 leading-relaxed whitespace-pre-wrap">{MOCK_VISIT.transcript}</p>
          </div>
        </div>

        {/* Report editor */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">
              Referto {isApproved ? '(approvato)' : 'bozza AI'}
            </h2>
            {!isApproved && (
              <span className="text-xs text-zinc-400">Modificabile</span>
            )}
          </div>
          <textarea
            value={report}
            onChange={(e) => setReport(e.target.value)}
            readOnly={isApproved}
            rows={22}
            className={`w-full rounded-xl border px-4 py-4 text-sm leading-relaxed font-mono resize-none focus:outline-none focus:ring-2 transition ${
              isApproved
                ? 'border-zinc-200 bg-zinc-50 text-zinc-600 cursor-default'
                : 'border-zinc-200 bg-white text-zinc-900 focus:border-blue-400 focus:ring-blue-500/20'
            }`}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex items-center justify-end gap-3">
        {!isApproved && (
          <>
            <button
              type="button"
              onClick={() => setReport(MOCK_VISIT.reportDraft)}
              className="rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-300/40 transition"
            >
              Ripristina bozza AI
            </button>
            <button
              type="button"
              onClick={handleApprove}
              className="flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Approva referto
            </button>
          </>
        )}

        {isApproved && (
          <button
            type="button"
            onClick={handleExportPdf}
            className="flex items-center gap-2 rounded-lg bg-zinc-800 px-5 py-2.5 text-sm font-medium text-white hover:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-zinc-700/40 transition"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Esporta PDF
          </button>
        )}
      </div>
    </div>
  );
}
