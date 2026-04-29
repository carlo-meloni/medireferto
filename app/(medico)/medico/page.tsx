import { getAllVisits } from '@/lib/db/visit';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

const VISIT_STATUS_LABEL: Record<string, string> = {
  IN_REGISTRAZIONE: 'In registrazione',
  IN_REVISIONE: 'In revisione',
  APPROVATO: 'Approvato',
  ESPORTATO: 'Esportato',
};

// --- CONFIGURAZIONE COLORI ---
// Assegna classi Tailwind specifiche per i colori dei badge in base allo stato
const VISIT_STATUS_CLASSES: Record<string, string> = {
  IN_REGISTRAZIONE: 'bg-blue-100 text-blue-800',
  IN_REVISIONE: 'bg-yellow-100 text-yellow-800',
  APPROVATO: 'bg-green-100 text-green-800',
  ESPORTATO: 'bg-zinc-100 text-zinc-600',
};

export default async function MedicoDashboard() {
  // Recupera la lista delle visite dal database
  const visits = await getAllVisits();

  return (
    // CONTENITORE PRINCIPALE: Gestisce i margini esterni e la larghezza massima della pagina
    <div className="p-4 sm:p-8 max-w-4xl mx-auto">
      
      {/* SEZIONE HEADER: Contiene Titolo, Sottotitolo e il Bottone "Nuova visita" */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
            Visite recenti
          </h1>
          <p className="mt-1 text-sm text-zinc-500">
            Gestisci le tue visite e i referti
          </p>
        </div>

        {/* BOTTONE AZIONE: Link per creare una nuova visita. Su mobile è a larghezza piena. */}
        <Link
          href="/medico/visita/nuova"
          className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Nuova visita
        </Link>
      </div>

      {/* CONTENITORE LISTA: Spazia verticalmente le card delle visite */}
      <div className="flex flex-col gap-3">
        
        {/* STATO VUOTO: Messaggio mostrato solo se non ci sono visite nel database */}
        {visits.length === 0 && (
          <div className="text-sm text-zinc-500 py-8 text-center border border-dashed border-zinc-200 rounded-xl">
            Nessuna visita disponibile
          </div>
        )}

        {/* CICLO RENDERIZZAZIONE: Crea una Card cliccabile per ogni visita trovata */}
        {visits.map((visit) => (
          <Link
            key={visit.id}
            href={`/medico/visita/${visit.id}`}
            // CARD: Il rettangolo bianco. Cambia disposizione (colonna/riga) in base allo schermo.
            className="group flex flex-col sm:flex-row sm:items-center justify-between bg-white rounded-xl border border-zinc-200 p-4 sm:px-5 sm:py-4 hover:border-zinc-300 hover:shadow-sm transition gap-4"
          >
            
            {/* PARTE SINISTRA: Anagrafica Paziente (Nome e Codice Fiscale) */}
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-sm font-medium text-zinc-900 group-hover:text-blue-700 transition truncate">
                {visit.patient.firstName} {visit.patient.lastName}
              </span>
              <span className="text-xs text-zinc-400 font-mono truncate">
                {visit.patient.fiscalCode}
              </span>
            </div>

            {/* PARTE DESTRA: Informazioni temporali e di stato */}
            {/* Su mobile aggiunge un bordo superiore per separarsi dal nome */}
            <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 sm:ml-4 border-t sm:border-t-0 pt-3 sm:pt-0">
              
              {/* SOTTO-GRUPPO: Data e Badge dello Stato */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <span className="text-xs text-zinc-500">
                  {formatDate(visit.visitDate)}
                </span>

                {/* BADGE STATO: Colorato dinamicamente in base a VISIT_STATUS_CLASSES */}
                <span
                  className={`w-fit inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${
                    VISIT_STATUS_CLASSES[visit.status]
                  }`}
                >
                  {VISIT_STATUS_LABEL[visit.status]}
                </span>
              </div>

              {/* ICONA FRECCIA: Indica che la card è cliccabile (decorativa) */}
              <svg
                className="w-4 h-4 text-zinc-300 group-hover:text-zinc-500 transition"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}