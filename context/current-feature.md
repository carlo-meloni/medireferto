# Current Feature: Admin Doctor & Patient Forms (create & edit)

## Status: In Progress

## Overview

Form di creazione e modifica medico (`/admin/medici`) e paziente (`/admin/pazienti`).
Componenti client condivisi `DoctorForm.tsx` e `PatientForm.tsx`, riutilizzati in
`nuovo` e `[id]`. Submit ancora UI-only (console.log + redirect alla lista).

Stack form adottato a livello progetto: `react-hook-form` + `zod` +
`@hookform/resolvers/zod` + shadcn/ui (`Form`, `FormField`, `FormItem`, `FormLabel`,
`FormControl`, `FormMessage`, `Input`, `Button`). Shadcn inizializzato in `base-nova`.

## Requirements

- Setup globale:
  - Installazione `react-hook-form`, `zod`, `@hookform/resolvers`
  - `shadcn init` (stile `base-nova`, baseColor `neutral`) — aggiunge `components.json`,
    `lib/utils.ts`, variabili CSS in `app/globals.css`
  - Componenti shadcn: `button`, `input`, `label`, `form`
- Medici:
  - `components/admin/DoctorForm.tsx`
  - `app/(admin)/admin/medici/validator.ts` — `doctorFormSchema`
  - Pagine `nuovo/page.tsx` e `[id]/page.tsx`
  - Lista `medici/page.tsx` con `Link` ai nuovi route
- Pazienti:
  - `components/admin/PatientForm.tsx`
  - `app/(admin)/admin/pazienti/validator.ts` — `patientFormSchema` (CF italiano,
    data non futura, email/phone opzionali)
  - Pagine `nuovo/page.tsx` e `[id]/page.tsx`
  - Lista `pazienti/page.tsx` con `Link` ai nuovi route

## Out of Scope

- Persistenza DB e server action (resta mocked)
- Eliminazione medico/paziente
- Reset password utente medico

## Files Created/Modified

- `components.json`, `lib/utils.ts`, `components/ui/{button,input,label,form}.tsx` — shadcn init
- `app/globals.css` — variabili CSS shadcn
- `package.json` — rhf, zod, resolvers, shadcn deps
- `components/admin/DoctorForm.tsx` — nuovo
- `components/admin/PatientForm.tsx` — nuovo
- `app/(admin)/admin/medici/validator.ts` — nuovo
- `app/(admin)/admin/medici/nuovo/page.tsx` — nuovo
- `app/(admin)/admin/medici/[id]/page.tsx` — nuovo
- `app/(admin)/admin/medici/page.tsx` — bottoni → Link
- `app/(admin)/admin/pazienti/validator.ts` — nuovo
- `app/(admin)/admin/pazienti/nuovo/page.tsx` — nuovo
- `app/(admin)/admin/pazienti/[id]/page.tsx` — nuovo
- `app/(admin)/admin/pazienti/page.tsx` — bottoni → Link
- `context/current-feature.md` — questo documento

## History

- **admin-pages** (2026-04-21): dashboard admin, medici, pazienti (UI + mock)
- **login-page** (2026-04-20): form di login UI-only in `app/page.tsx`, rimosso boilerplate Next.js
- **medico-area** (2026-04-20): layout + dashboard area medico, redirect temporaneo da login
- **visita-routes** (2026-04-20): pagine nuova visita e revisione referto, AudioRecorder component
- **pazienti-routes** (2026-04-20): lista pazienti e dettaglio paziente, centralizzato mock data
- **prisma-neon-setup** (2026-04-20): setup Prisma 7 + Neon + schema completo + seed
