# Current Feature: Pazienti Routes — Lista e Dettaglio Paziente

## Status: in progress

## Description
Implementazione delle route pazienti nell'area medico:
- `app/(medico)/medico/pazienti/page.tsx` — Lista pazienti con ricerca e filtro (UI-only, mock)
- `app/(medico)/medico/pazienti/[id]/page.tsx` — Dettaglio paziente con anagrafica e storico visite (UI-only, mock)

## Acceptance Criteria
- [ ] Lista pazienti: tabella/card con nome, CF, data nascita, numero visite; ricerca per nome/CF
- [ ] Dettaglio paziente: header con anagrafica completa, storico visite con link a ogni visita
- [ ] Build passa senza errori

## History
- **login-page** (2026-04-20): form di login UI-only in `app/page.tsx`, rimosso boilerplate Next.js
- **medico-area** (2026-04-20): layout + dashboard area medico, redirect temporaneo da login
- **visita-routes** (2026-04-20): pagine nuova visita e revisione referto, AudioRecorder component
