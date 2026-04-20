'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  MOCK_VISIT_DETAIL,
  VISIT_STATUS_LABEL,
  VISIT_STATUS_CLASSES,
  type VisitStatus,
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

export default function VisitaDetailPage() {
  const router = useRouter();
  const [report, setReport] = useState(MOCK_VISIT_DETAIL.reportDraft);
  const [status, setStatus] = useState<VisitStatus>(MOCK_VISIT_DETAIL.status);
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
          <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">
            {MOCK_VISIT_DETAIL.patientName}
          </h1>
          <div className="mt-1 flex items-center gap-3">
            <span className="text-sm text-zinc-500 font-mono">{MOCK_VISIT_DETAIL.fiscalCode}</span>
            <span className="text-zinc-300">·</span>
            <span className="text-sm text-zinc-500">{formatDate(MOCK_VISIT_DETAIL.visitDate)}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {saved && (
            <span className="text-xs text-emerald-600 font-medium animate-pulse">Salvato</span>
          )}
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${VISIT_STATUS_CLASSES[status]}`}
          >
            {VISIT_STATUS_LABEL[status]}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex flex-col gap-3">
          <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">Trascrizione audio</h2>
          <div className="rounded-xl border border-zinc-200 bg-white p-5 flex-1">
            <p className="text-sm text-zinc-700 leading-relaxed whitespace-pre-wrap">
              {MOCK_VISIT_DETAIL.transcript}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">
              Referto {isApproved ? '(approvato)' : 'bozza AI'}
            </h2>
            {!isApproved && <span className="text-xs text-zinc-400">Modificabile</span>}
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

      <div className="mt-6 flex items-center justify-end gap-3">
        {!isApproved && (
          <>
            <button
              type="button"
              onClick={() => setReport(MOCK_VISIT_DETAIL.reportDraft)}
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
