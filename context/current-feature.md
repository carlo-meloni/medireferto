# Current Feature: Auth Setup — NextAuth v5 + Credentials

## Status: Completed

## Overview

Setup NextAuth v5 con split-config pattern per compatibilità edge. Credentials provider
con bcryptjs per email/password. Middleware che protegge `/admin/*` e `/medico/*`,
reindirizzando a `/api/auth/signin` se non autenticato. Role-based routing (ADMIN → /admin,
DOCTOR → /medico). API route `/api/auth/register` per creazione account.

## Requirements

- Installa `next-auth@beta` e `@auth/prisma-adapter`
- Split config pattern (edge compatibility):
  - `auth.config.ts` — edge-safe (providers placeholder + callbacks)
  - `auth.ts` — full config con Prisma adapter, bcrypt, JWT strategy
- Route handler `app/api/auth/[...nextauth]/route.ts`
- `middleware.ts` — protegge `/admin/*` e `/medico/*`, redirect basato su ruolo
- `types/next-auth.d.ts` — estende Session con `id` e `role`
- `app/api/auth/register` — POST: crea utente DOCTOR (default)
- Aggiorna `app/page.tsx` per redirect role-based

## Files Created/Modified

- `auth.config.ts`
- `auth.ts`
- `app/api/auth/[...nextauth]/route.ts`
- `middleware.ts`
- `types/next-auth.d.ts`
- `app/api/auth/register/route.ts`
- `app/page.tsx`
- `.env` — aggiunta `AUTH_SECRET`
- `package.json` — `bcryptjs` spostato a dependencies

## History

- **admin-doctor-patient-forms** (2026-04-28): Form create/edit per medici e pazienti in admin
- **admin-pages** (2026-04-21): dashboard admin, medici, pazienti (UI + mock)
- **login-page** (2026-04-20): form di login UI-only in `app/page.tsx`, rimosso boilerplate Next.js
- **medico-area** (2026-04-20): layout + dashboard area medico, redirect temporaneo da login
- **visita-routes** (2026-04-20): pagine nuova visita e revisione referto, AudioRecorder component
- **pazienti-routes** (2026-04-20): lista pazienti e dettaglio paziente, centralizzato mock data
- **prisma-neon-setup** (2026-04-20): setup Prisma 7 + Neon + schema completo + seed
