# Current Feature: Approve Report Flow

## Status: In Progress

## Overview

Implementazione del flusso di approvazione del referto medico. Dopo che l'AI genera la bozza,
il medico può modificarla nel textarea e approvarla. L'approvazione persiste il testo finale
nel DB (`Report.final`), imposta `Report.approvedAt`, e aggiorna `Visit.status = APPROVATO`.
La bozza AI viene anche persistita nel DB (`Report.draft`) al momento della generazione.

## Requirements

- `saveReportDraft(visitId, draft)` — upsert Report.draft + set Visit.status = IN_REVISIONE
- `approveReport(visitId, finalText)` — set Report.final + Report.approvedAt + Visit.status = APPROVATO
- VisitaDetailClient: mostra "Approva referto" button quando c'è contenuto nel textarea
- VisitaDetailClient: textarea diventa read-only dopo approvazione
- VisitaDetailClient: router.refresh() dopo approvazione per aggiornare il badge stato in header
- VisitaDetailPage: passa visitId, visitStatus, reportFinal come props

## Files Modified

- `context/current-feature.md` (questo file)
- `lib/db/visit.ts` — nuove server actions
- `components/medico/VisitaDetailClient.tsx` — approve flow
- `app/(medico)/medico/visita/[id]/page.tsx` — nuove props

## History

- **auth-setup** (2026-04-28): NextAuth v5 + credentials provider + role-based routing
- **admin-doctor-patient-forms** (2026-04-28): Form create/edit per medici e pazienti in admin
- **admin-pages** (2026-04-21): dashboard admin, medici, pazienti (UI + mock)
- **login-page** (2026-04-20): form di login UI-only in `app/page.tsx`, rimosso boilerplate Next.js
- **medico-area** (2026-04-20): layout + dashboard area medico, redirect temporaneo da login
- **visita-routes** (2026-04-20): pagine nuova visita e revisione referto, AudioRecorder component
- **pazienti-routes** (2026-04-20): lista pazienti e dettaglio paziente, centralizzato mock data
- **prisma-neon-setup** (2026-04-20): setup Prisma 7 + Neon + schema completo + seed
