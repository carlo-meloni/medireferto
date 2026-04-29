# Current Feature: PDF Export

## Status: Completed (2026-04-29)

## Overview

Generazione e download del referto medico in formato PDF. Disponibile dopo che il medico
ha approvato il referto. Il PDF contiene: intestazione studio, dati identificativi paziente,
dati esame, corpo del referto, firma e data.

## Requirements

- API route `GET /api/pdf/[visitId]` — genera il PDF lato server con @react-pdf/renderer e lo
  streamma come `application/pdf`
- Template PDF con:
  - **Intestazione**: nome/indirizzo studio + specializzazione/iscrizione all'albo del medico
  - **Dati paziente**: nome, cognome, sesso, data di nascita, codice fiscale
  - **Dati esame**: data accettazione, data esecuzione, ora esecuzione
  - **Corpo referto**: testo finale approvato
  - **Piè di pagina**: nome medico + spazio firma + data approvazione
- `markVisitExported(visitId)` — aggiorna `Visit.status = ESPORTATO` dopo il download
- VisitaDetailClient: bottone "Esporta PDF" visibile solo quando `status === APPROVATO`
  - al click apre il PDF in un nuovo tab
  - dopo il download chiama `markVisitExported` e aggiorna lo stato locale

## Files Modified

- `context/current-feature.md` (questo file)
- `lib/pdf/ReportPDF.tsx` — template PDF React
- `app/api/pdf/[visitId]/route.ts` — API route
- `lib/db/visit.ts` — `markVisitExported` action
- `components/medico/VisitaDetailClient.tsx` — bottone esporta

## History

- **approve-report-flow** (2026-04-28): Flusso approvazione referto — saveReportDraft + approveReport
- **auth-setup** (2026-04-28): NextAuth v5 + credentials provider + role-based routing
- **admin-doctor-patient-forms** (2026-04-28): Form create/edit per medici e pazienti in admin
- **admin-pages** (2026-04-21): dashboard admin, medici, pazienti (UI + mock)
- **login-page** (2026-04-20): form di login UI-only in `app/page.tsx`, rimosso boilerplate Next.js
- **medico-area** (2026-04-20): layout + dashboard area medico, redirect temporaneo da login
- **visita-routes** (2026-04-20): pagine nuova visita e revisione referto, AudioRecorder component
- **pazienti-routes** (2026-04-20): lista pazienti e dettaglio paziente, centralizzato mock data
- **prisma-neon-setup** (2026-04-20): setup Prisma 7 + Neon + schema completo + seed
