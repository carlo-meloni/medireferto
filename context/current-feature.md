# Current Feature: Login Page

## Status: completed

## Description
Prima schermata dell'applicazione: form di login per utente non autenticato.
- Email e password
- Bottone "Accedi"
- Nessuna logica di autenticazione reale per ora (solo UI)
- Pagina: `app/page.tsx` (temporaneamente, verrà spostata su `app/(public)/login/page.tsx` quando si implementa l'auth)

## Acceptance Criteria
- [x] Rimosso tutto il boilerplate Next.js da `page.tsx`
- [x] Form con campo email, password e bottone submit
- [x] Design pulito, coerente con i principi del progetto (clinico, leggibile)
- [x] Build passa senza errori

## History
- **login-page** (2026-04-20): form di login UI-only in `app/page.tsx`, rimosso boilerplate Next.js
