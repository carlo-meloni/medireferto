# Current Feature: Admin Pages (UI-only, mocked data)

## Status: In Progress

## Overview

Prime pagine per l'area amministratore: dashboard, gestione medici e anagrafica pazienti.
Implementazione solo UI, alimentata da dati mock in `lib/mocked-data.ts`. Nessuna integrazione
con Prisma/DB per questa iterazione.

## Requirements

- Route group `app/(admin)/` con:
  - `admin/page.tsx` — dashboard con contatori (medici, pazienti, visite totali)
    e lista attività recente
  - `admin/medici/page.tsx` — tabella medici con ricerca per nome/specializzazione
  - `admin/pazienti/page.tsx` — anagrafica pazienti centralizzata con ricerca
- Layout con sidebar admin dedicata (`components/admin/Sidebar.tsx`), pattern
  coerente con `components/medico/Sidebar.tsx`
- Mock data per medici aggiunti a `lib/mocked-data.ts`
- Nessuna autenticazione per ora (route accessibili direttamente)
- Server components (no `'use client'`) dove possibile; sidebar client per
  `usePathname`

## Out of Scope

- Form di creazione/modifica medico e paziente (solo bottoni placeholder)
- Dettaglio medico
- Autenticazione / guardia di route
- Persistenza dati su DB

## Files Created/Modified

- `lib/mocked-data.ts` — aggiunti `MOCK_DOCTORS` + tipi
- `components/admin/Sidebar.tsx` — nuovo
- `app/(admin)/layout.tsx` — nuovo
- `app/(admin)/admin/page.tsx` — nuovo
- `app/(admin)/admin/medici/page.tsx` — nuovo
- `app/(admin)/admin/pazienti/page.tsx` — nuovo
- `context/current-feature.md` — questo documento

## History

- **login-page** (2026-04-20): form di login UI-only in `app/page.tsx`, rimosso boilerplate Next.js
- **medico-area** (2026-04-20): layout + dashboard area medico, redirect temporaneo da login
- **visita-routes** (2026-04-20): pagine nuova visita e revisione referto, AudioRecorder component
- **pazienti-routes** (2026-04-20): lista pazienti e dettaglio paziente, centralizzato mock data
- **prisma-neon-setup** (2026-04-20): setup Prisma 7 + Neon + schema completo + seed
