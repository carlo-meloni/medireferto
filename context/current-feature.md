# Current Feature: Marketing Homepage

## Status: In Progress

## Overview

Static marketing homepage for MediReferto in `prototypes/homepage/` (plain HTML/CSS/JS, no framework).
Showcases the product to prospective doctors with a "Stress to Flow" hero, feature cards, AI demo, pricing, and CTA.

## Requirements

- `prototypes/homepage/index.html` + `styles.css` + `script.js`
- Hero: chaos icons (floating/animated) → transform arrow → dashboard mockup
- Sections: Nav, Hero text, Features (6 cards), AI split-screen, Pricing (2 tiers), CTA, Footer
- Animations: floating chaos icons, waveform pulse, scroll reveal, navbar blur-on-scroll
- Responsive: mobile stacks vertically, arrow rotates 90°
- Color palette per spec (red/blue/purple/emerald/amber/slate/sky)

## Files Modified

- `context/current-feature.md` (questo file)
- `prototypes/homepage/index.html`
- `prototypes/homepage/styles.css`
- `prototypes/homepage/script.js`

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
