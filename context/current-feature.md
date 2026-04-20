# Current Feature: Visita Routes — Nuova Visita e Revisione Referto

## Status: in progress

## Description
Implementazione delle route visita nell'area medico:
- `app/(medico)/medico/visita/nuova/page.tsx` — Selezione paziente + registrazione audio (UI-only, mock)
- `app/(medico)/medico/visita/[id]/page.tsx` — Revisione trascrizione e referto, approvazione (UI-only, mock)
- `components/medico/AudioRecorder.tsx` — Componente client per registrazione audio via MediaRecorder API

## Acceptance Criteria
- [x] Pagina nuova visita: selezione paziente da lista mock, recorder audio con start/stop/preview
- [x] Pagina dettaglio visita: header con info paziente + stato, trascrizione mock, editor referto, pulsante approva
- [x] Build passa senza errori

## History
- **login-page** (2026-04-20): form di login UI-only in `app/page.tsx`, rimosso boilerplate Next.js
- **medico-area** (2026-04-20): layout + dashboard area medico, redirect temporaneo da login
