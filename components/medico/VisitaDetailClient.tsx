'use client';

import { useState } from 'react';
import { summarizeTranscript } from '@/actions/summarize';

interface VisitaDetailClientProps {
  transcriptText: string | null;
  reportDraft: string | null;
}

export default function VisitaDetailClient({
  transcriptText,
  reportDraft,
}: VisitaDetailClientProps) {
  const [summary, setSummary] = useState(reportDraft);
  const [summarizing, setSummarizing] = useState(false);
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
    }
    setSummarizing(false);
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

          {transcriptText && (
            <div className="pt-3 border-t border-zinc-100 flex flex-col gap-2">
              {error && <p className="text-xs text-red-600">{error}</p>}
              <button
                onClick={handleSummarize}
                disabled={summarizing}
                className="self-start rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              >
                {summarizing ? 'Generazione in corso…' : 'Genera referto con AI'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* REFERTO */}
      <div className="flex flex-col gap-3">
        <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wide">
          Referto
        </h2>

        <div className="rounded-xl border border-zinc-200 bg-white min-h-40 overflow-hidden">
          {summarizing && !summary && (
            <div className="flex items-center gap-2 text-sm text-zinc-400 p-5">
              <span className="w-3 h-3 rounded-full border-2 border-blue-400 border-t-transparent animate-spin" />
              Generazione in corso…
            </div>
          )}
          {summary ? (
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={16}
              className="w-full p-5 text-sm text-zinc-700 leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500/20 rounded-xl"
            />
          ) : (
            !summarizing && (
              <p className="text-sm text-zinc-400 italic p-5">
                Nessun referto — usa il pulsante per generarlo.
              </p>
            )
          )}
        </div>
      </div>
    </div>
  );
}
