'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { summarizeTranscript } from '@/lib/db/summarize';
import { saveReportDraft, approveReport, markVisitExported } from '@/lib/db/visit';

interface VisitaDetailClientProps {
  visitId: string;
  visitStatus: string;
  transcriptText: string | null;
  reportDraft: string | null;
  reportFinal: string | null;
}

export default function VisitaDetailClient({
  visitId,
  visitStatus,
  transcriptText,
  reportDraft,
  reportFinal,
}: VisitaDetailClientProps) {
  const router = useRouter();
  const isAlreadyApproved = visitStatus === 'APPROVATO' || visitStatus === 'ESPORTATO';

  const [summary, setSummary] = useState(reportFinal ?? reportDraft);
  const [summarizing, setSummarizing] = useState(false);
  const [approving, setApproving] = useState(false);
  const [approved, setApproved] = useState(isAlreadyApproved);
  const [exported, setExported] = useState(visitStatus === 'ESPORTATO');
  const [error, setError] = useState<string | null>(null);

  async function handleSummarize() {
    if (!transcriptText) return;
    setSummarizing(true);
    setError(null);

    const result = await summarizeTranscript(transcriptText);

    if ('error' in result) {
      setError(result.error);
    } else {
      setSummary(result.summary);
      await saveReportDraft(visitId, result.summary);
    }
    setSummarizing(false);
  }

  async function handleExportPdf() {
    window.open(`/api/pdf/${visitId}`, '_blank');
    const result = await markVisitExported(visitId);
    if (!('error' in result)) {
      setExported(true);
      router.refresh();
    }
  }

  async function handleApprove() {
    if (!summary) return;
    setApproving(true);
    setError(null);

    const result = await approveReport(visitId, summary);

    if ('error' in result) {
      setError(result.error);
    } else {
      setApproved(true);
      router.refresh();
    }
    setApproving(false);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* TRASCRIZIONE */}
      <div className="flex flex-col gap-3">
        <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">
          Trascrizione audio
        </h2>

        <div className="rounded-xl border border-zinc-200 bg-white p-5 flex flex-col gap-4">
          <p className="text-sm text-zinc-700 whitespace-pre-wrap leading-relaxed">
            {transcriptText ?? <span className="text-zinc-400 italic">Nessuna trascrizione</span>}
          </p>

          {/* {transcriptText && !approved && (
            <div className="pt-3 border-t border-zinc-100">
              <button
                onClick={handleSummarize}
                disabled={summarizing || approving}
                className="self-start rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              >
                {summarizing ? 'Generazione in corso…' : 'Genera referto'}
              </button>
            </div>
          )} */}
        </div>
      </div>

      {/* REFERTO */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">
            Referto
          </h2>
          {approved && (
            <span className="text-xs font-medium text-green-700 bg-green-50 ring-1 ring-green-200 rounded-full px-2.5 py-0.5">
              Approvato
            </span>
          )}
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white min-h-40 overflow-hidden">
          {summarizing && !summary && (
            <div className="flex items-center gap-2 text-sm text-zinc-400 p-5">
              <span className="w-3 h-3 rounded-full border-2 border-blue-400 border-t-transparent animate-spin" />
              Generazione in corso…
            </div>
          )}
          {summary ? (
            approved ? (
              <p className="p-5 text-sm text-zinc-700 leading-relaxed whitespace-pre-wrap">
                {summary}
              </p>
            ) : (
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={16}
                className="w-full p-5 text-sm text-zinc-700 leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500/20 rounded-xl"
              />
            )
          ) : (
            !summarizing && (
              <p className="text-sm text-zinc-400 italic p-5">
                Nessun referto — usa il pulsante per generarlo.
              </p>
            )
          )}
        </div>

        {approved && !exported && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportPdf}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            >
              Esporta PDF
            </button>
          </div>
        )}


        {summary && !approved && (
          <div className="flex flex-col items-end gap-2">
            {error && <p className="text-xs text-red-600 self-start">{error}</p>}
            <button
              onClick={handleApprove}
              disabled={approving || summarizing}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition focus:outline-none focus:ring-2 focus:ring-green-500/40"
            >
              {approving ? 'Approvazione in corso…' : 'Approva referto'}
            </button>
          </div>
        )}
        {error && !summary && (
          <p className="text-xs text-red-600">{error}</p>
        )}
      </div>
    </div>
  );
}
