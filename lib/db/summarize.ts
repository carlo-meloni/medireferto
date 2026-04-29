'use server';

import { geminiFlash } from '@/lib/gemini';

const PROMPT_PREFIX = `Sei un medico esperto nel tipo di esame da refertare. Basandoti sulla trascrizione in fondo, produci direttamente il referto, senza frasi introduttive, presentazioni o commenti preliminari. Non usare formattazione Markdown (niente asterischi, grassetti o simboli speciali). Struttura il referto esattamente così:

ANAMNESI E QUESITO CLINICO: Breve descrizione delle informazioni fornite dal medico richiedente e il motivo dell'esame.

TECNICA UTILIZZATA: Descrizione dettagliata della metodica (es. uso di mezzo di contrasto in radiologia).

RISULTATI: Descrizione obiettiva di ciò che è stato osservato (normale o anormale).

CONCLUSIONI: Sintesi dei reperti più importanti, interpretazione dei dati e diagnosi.

Trascrizione:
`;

export async function summarizeTranscript(
  transcript: string
): Promise<{ summary: string } | { error: string }> {
  try {
    const result = await geminiFlash.generateContent(PROMPT_PREFIX + transcript);
    const summary = result.response.text();
    return { summary };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[summarizeTranscript]', message);
    return { error: message };
  }
}
