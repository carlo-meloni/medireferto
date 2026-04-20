# Current Feature: Prisma + Neon PostgreSQL Setup

## Status: In Progress

## Overview

Set up Prisma ORM 7 with Neon (serverless PostgreSQL).

## Requirements

- Prisma 7 (with breaking changes: ESM, driver adapters, prisma.config.ts)
- Neon PostgreSQL — pooled URL for queries, direct URL for migrations
- Full schema: User/Session/Account/VerificationToken (NextAuth v5) + Doctor/Patient/Visit/AudioFile/Transcript/Report
- Indexes and cascade deletes
- Always use migrations — never `prisma db push`

## Key Prisma 7 Changes Applied

- `generator client { provider = "prisma-client" output = "../generated/prisma" }` (no longer `prisma-client-js`)
- `url` removed from `datasource` block → moved to `prisma.config.ts`
- `prisma.config.ts` required at project root
- `@prisma/adapter-pg` driver adapter mandatory
- `"type": "module"` in package.json
- Imports from `@/generated/prisma` (not `@prisma/client`)

## Files Created/Modified

- `prisma/schema.prisma` — full schema
- `prisma.config.ts` — Prisma 7 config
- `lib/prisma.ts` — PrismaClient singleton with PrismaPg adapter
- `.env.example` — required env vars template
- `package.json` — added `"type": "module"`, Prisma deps
- `tsconfig.json` — updated target to ES2023

## History

- **login-page** (2026-04-20): form di login UI-only in `app/page.tsx`, rimosso boilerplate Next.js
- **medico-area** (2026-04-20): layout + dashboard area medico, redirect temporaneo da login
- **visita-routes** (2026-04-20): pagine nuova visita e revisione referto, AudioRecorder component
- **pazienti-routes** (2026-04-20): lista pazienti e dettaglio paziente, centralizzato mock data
