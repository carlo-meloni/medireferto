# Current Feature: Area Medico — Layout e Dashboard

## Status: in progress

## Description
Implementazione dell'area medico con:
- Redirect da `app/page.tsx` a `/medico` (auth non ancora implementata)
- `app/(medico)/layout.tsx` — sidebar layout collassabile
- `app/(medico)/page.tsx` — dashboard con lista visite mock
- `components/medico/Sidebar.tsx` — sidebar con navigazione

## Acceptance Criteria
- [x] `app/page.tsx` reindirizza a `/medico`
- [x] Layout con sidebar collassabile (Nuova visita, Visite, Pazienti, Avatar, Impostazioni)
- [x] Dashboard con card visite mock e badge stato colorati
- [x] Build passa senza errori

## History
- **login-page** (2026-04-20): form di login UI-only in `app/page.tsx`, rimosso boilerplate Next.js
- **medico-area** (2026-04-20): layout + dashboard area medico, redirect temporaneo da login
