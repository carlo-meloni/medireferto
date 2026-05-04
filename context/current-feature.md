# Current Feature: Auth Rate Limiting

## Status: In Progress

## Overview

Rate limiting on authentication endpoints to prevent brute force attacks and credential stuffing.
Uses Upstash Redis with `@upstash/ratelimit` (sliding window). Fails open if Upstash is unavailable.

## Requirements

- `/api/auth/register` — 3 attempts per 1 hour, keyed by IP
- Login via `loginAction` — 5 attempts per 15 minutes, keyed by IP + email
- 429 response with `{ error: "..." }` and `Retry-After` header
- Login page displays rate limit errors inline
- Fail open (allow request) if Upstash env vars are missing

## Files Modified

- `context/current-feature.md` (questo file)
- `lib/rate-limit.ts` — Upstash client + limiter factory
- `app/(public)/login/actions.ts` — rate limit before signIn
- `app/api/auth/register/route.ts` — rate limit before registration
- `.env.example` — UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN

## Environment Variables

```
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

## History

- **pdf-export** (2026-04-29): Generazione e download PDF referto con @react-pdf/renderer
- **approve-report-flow** (2026-04-28): Flusso approvazione referto — saveReportDraft + approveReport
- **auth-setup** (2026-04-28): NextAuth v5 + credentials provider + role-based routing
- **admin-doctor-patient-forms** (2026-04-28): Form create/edit per medici e pazienti in admin
- **admin-pages** (2026-04-21): dashboard admin, medici, pazienti (UI + mock)
- **login-page** (2026-04-20): form di login UI-only in `app/page.tsx`, rimosso boilerplate Next.js
- **medico-area** (2026-04-20): layout + dashboard area medico, redirect temporaneo da login
- **visita-routes** (2026-04-20): pagine nuova visita e revisione referto, AudioRecorder component
- **pazienti-routes** (2026-04-20): lista pazienti e dettaglio paziente, centralizzato mock data
- **prisma-neon-setup** (2026-04-20): setup Prisma 7 + Neon + schema completo + seed
