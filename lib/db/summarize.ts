'use server';

import { geminiFlash } from '@/lib/gemini';

const PROMPT_PREFIX = `Sulla base del testo che trovi in fondo tra apici , ragiona come se fossi un medico esperto del tipo di esame da refertare. Per la riunione prepara un referto così composto
Anamnesi e Quesito Clinico: Breve descrizione delle informazioni fornite dal medico richiedente e il motivo dell'esame.
Tecnica Utilizzata: Descrizione dettagliata della metodica (es. uso di mezzo di contrasto in radiologia).
Corpo del Referto (Risultati): Descrizione obiettiva di ciò che è stato osservato (normale o anormale).
Conclusioni (Referto conclusivo): Sintesi dei reperti più importanti, interpretazione dei dati e diagnosi.

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
