'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { summarizeTranscript } from '@/lib/db/summarize';
import { saveReportDraft, approveReport } from '@/lib/db/visit';

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

  function handleExportPdf() {
    window.open(`/api/pdf/${visitId}`, '_blank');
    router.refresh();
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
      <div className="flex flex-col gap-3 animate-slide-up" style={{ animationDelay: '0.05s' }}>
        <div className="flex items-center gap-2">
          <div className="w-1 h-3.5 rounded-full bg-zinc-300" />
          <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
            Trascrizione audio
          </h2>
        </div>

        <div className="rounded-2xl border border-zinc-100 bg-white shadow-sm min-h-64 p-6 flex flex-col gap-4 transition-shadow duration-200 hover:shadow-md hover:shadow-zinc-100/80">
          {transcriptText ? (
            <>
              <p className="text-sm text-zinc-600 whitespace-pre-wrap leading-7">
                {transcriptText}
              </p>

              {!approved && (
                <div className="pt-4 border-t border-zinc-50">
                  <button
                    onClick={handleSummarize}
                    disabled={summarizing || approving}
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  >
                    {summarizing ? (
                      <>
                        <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        Generazione in corso…
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                        </svg>
                        Genera referto
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center flex-1 h-40 gap-3 text-center">
              <div className="w-9 h-9 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center">
                <svg className="w-4 h-4 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                </svg>
              </div>
              <p className="text-sm text-zinc-400 italic">Nessuna trascrizione disponibile</p>
            </div>
          )}
        </div>
      </div>

      {/* REFERTO */}
      <div className="flex flex-col gap-3 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-1 h-3.5 rounded-full transition-colors duration-300 ${approved ? 'bg-green-400' : 'bg-blue-400'}`} />
            <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
              Referto
            </h2>
          </div>
          {approved && (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 ring-1 ring-green-200 rounded-full px-2.5 py-0.5">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
              </svg>
              Approvato
            </span>
          )}
        </div>

        <div className="rounded-2xl border border-zinc-100 bg-white shadow-sm min-h-64 overflow-hidden transition-shadow duration-200 hover:shadow-md hover:shadow-zinc-100/80">
          {summarizing && !summary && (
            <div className="flex items-center gap-3 text-sm text-zinc-400 p-6">
              <span className="w-4 h-4 rounded-full border-2 border-blue-400 border-t-transparent animate-spin shrink-0" />
              <span>Generazione del referto in corso…</span>
            </div>
          )}

          {summary ? (
            approved ? (
              <p className="p-6 text-sm text-zinc-600 leading-7 whitespace-pre-wrap">
                {summary}
              </p>
            ) : (
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={16}
                className="w-full p-6 text-sm text-zinc-600 leading-7 resize-none focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-400/25 rounded-2xl bg-transparent placeholder:text-zinc-300"
                placeholder="Il referto apparirà qui..."
              />
            )
          ) : (
            !summarizing && (
              <div className="flex flex-col items-center justify-center h-40 gap-3 text-center p-6">
                <div className="w-9 h-9 rounded-full bg-zinc-50 border border-zinc-100 flex items-center justify-center">
                  <svg className="w-4 h-4 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
                <p className="text-sm text-zinc-400 italic">
                  Nessun referto — usa il pulsante per generarlo.
                </p>
              </div>
            )
          )}
        </div>

        <div className="flex flex-col gap-2.5">
          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-100 px-3.5 py-2.5">
              <svg className="w-3.5 h-3.5 text-red-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
              </svg>
              <p className="text-xs text-red-600">{error}</p>
            </div>
          )}

          {approved && (
            <button
              onClick={handleExportPdf}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 active:scale-[0.98] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              Esporta PDF
            </button>
          )}

          {summary && !approved && (
            <div className="flex justify-end">
              <button
                onClick={handleApprove}
                disabled={approving || summarizing}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-green-700 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-green-500/40"
              >
                {approving ? (
                  <>
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    Approvazione in corso…
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Approva referto
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
