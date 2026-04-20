# MediReferto — Project Overview

> Un sistema client–server per la refertazione medica automatizzata. Il medico registra l'audio della visita, l'app trascrive, genera un referto con AI, consente la revisione e lo esporta in PDF su carta intestata.

---

## Table of Contents

- [Problem](#problem)
- [Target Users](#target-users)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Data Models](#data-models)
- [Prisma Schema](#prisma-schema)
- [UI/UX Design System](#uiux-design-system)
- [Project Structure](#project-structure)

---

## Problem

Un medico gestisce la documentazione clinica in modo frammentato e manuale:

| Risorsa | Posizione tipica |
|---|---|
| Anamnesi paziente | Appunti cartacei, file Word |
| Referti e visite | Cartelle fisiche, PDF non strutturati |
| Dati paziente | Fogli Excel, gestionali datati |
| Firme e timbri | Manuale su carta stampata |
| Storico visite | Memoria del medico, archivio cartaceo |

Questo causa inefficienza, errori di trascrizione e perdita di tempo prezioso. **MediReferto** automatizza il flusso dalla registrazione vocale all'esportazione del PDF firmato.

---

## Target Users

| Utente | Necessità principale |
|---|---|
| **Il medico** | Registrare la visita, revisionare e approvare il referto generato dall'AI |
| **Il paziente** | Ricevere un referto chiaro e ben strutturato |
| **L'amministratore** | Gestire anagrafiche medici e pazienti, consultare lo storico |

---

## Tech Stack

| Layer | Tecnologia |
|---|---|
| **Framework** | Next.js 15 / React 19 — SSR + API routes, single repo |
| **Language** | TypeScript |
| **Database** | Neon (serverless PostgreSQL) |
| **ORM** | Prisma 6 — sempre migrations, mai `db push` |
| **AI (Trascrizione)** | Gemini API (o Whisper on-prem in futuro) |
| **AI (Referto)** | Gemini API — generazione testo strutturato |
| **File Storage** | UploadThing — upload audio e documenti |
| **Authentication** | NextAuth v5 — email/password (medico e admin) |
| **Styling** | Tailwind CSS v4 + shadcn/ui |
| **PDF** | react-pdf / puppeteer — export con carta intestata |
| **Deployment futuro** | On-prem (Mac mini ~1.500€) per ridurre dipendenze cloud |

> **Migration rule:** Non eseguire mai `prisma db push`. Generare e applicare sempre le migrations (`prisma migrate dev` / `prisma migrate deploy`).

---

## Features

### A. Registrazione e Trascrizione Audio

Il medico avvia la registrazione direttamente dall'interfaccia durante la visita.

| Fase | Descrizione |
|---|---|
| Registrazione | Audio acquisito via browser (MediaRecorder API) |
| Upload | File audio inviato al backend via UploadThing |
| Trascrizione | Backend invoca Gemini API (o Whisper) e ottiene testo |
| Salvataggio | Trascrizione salvata su DB collegata al paziente e alla visita |

---

### B. Generazione Referto AI

Dalla trascrizione, il backend costruisce un prompt strutturato e invoca Gemini per generare il referto.

- Il referto include: anamnesi, esame obiettivo, diagnosi, terapia consigliata
- L'output è testo strutturato, modificabile dal medico prima della firma
- Il codice fiscale del paziente è l'identificativo chiave per correlare l'output AI al paziente corretto

---

### C. Revisione e Approvazione

Il medico può:

- Leggere la trascrizione originale accanto al referto generato
- Modificare il referto in un editor inline (rich text o Markdown)
- Approvare il referto (cambia stato da `bozza` a `approvato`)
- Aggiungere note private non incluse nel PDF

---

### D. Esportazione PDF

Il PDF viene generato lato server con carta intestata del medico.

- Template con: logo/intestazione dello studio, dati paziente, data visita, corpo del referto, firma digitale o spazio firma
- Generazione preferibilmente offline / on-prem
- Download diretto dall'interfaccia medico
- PDF salvato su storage e collegato alla visita nel DB

---

### E. Anagrafiche

#### Medici
- `name`, `surname`, `email` — dati personali
- `specialization` — es. "Medicina Generale", "Cardiologia"
- `licenseNumber` — numero di iscrizione all'albo
- `clinicName`, `clinicAddress` — dati dello studio (per il PDF)
- `signature` — immagine firma (opzionale)

#### Pazienti
- `firstName`, `lastName` — nome e cognome
- `fiscalCode` — codice fiscale (identificativo univoco)
- `birthDate`, `birthPlace`
- `phone`, `email`
- `gender`

---

### F. Cartella Clinica e Storico Visite

Ogni visita è un'entità distinta collegata al paziente e al medico.

| Campo | Descrizione |
|---|---|
| `visitDate` | Data e ora della visita |
| `audioFile` | URL del file audio registrato |
| `transcript` | Testo trascritto |
| `reportDraft` | Referto generato dall'AI (modificabile) |
| `reportFinal` | Referto approvato (immutabile dopo firma) |
| `pdfUrl` | URL del PDF esportato |
| `status` | `in_registrazione` / `in_revisione` / `approvato` / `esportato` |
| `notes` | Note interne del medico (non nel PDF) |

---

### G. Interfacce

| Interfaccia | Route | Destinatario |
|---|---|---|
| Login | `/login` | Tutti gli utenti |
| Dashboard medico | `/medico` | Medico — lista visite, avvia registrazione |
| Nuova visita | `/medico/visita/nuova` | Medico — registra audio, seleziona paziente |
| Revisione referto | `/medico/visita/[id]` | Medico — modifica e approva |
| Anagrafica pazienti | `/medico/pazienti` | Medico — gestione pazienti |
| Dashboard admin | `/admin` | Amministratore |
| Gestione medici | `/admin/medici` | Admin — aggiungi/modifica medici |
| Gestione pazienti | `/admin/pazienti` | Admin — anagrafica centrale |

---

## Data Models

### Relationships Overview

```
Doctor (medico)
 ├── Visits (1:many)
 └── PDFTemplate (1:1)

Patient (paziente)
 ├── Visits (1:many)
 └── FiscalCode (unique identifier)

Visit (visita)
 ├── Doctor (many:1)
 ├── Patient (many:1)
 ├── AudioFile (1:1)
 ├── Transcript (1:1)
 └── Report (1:1)

Report (referto)
 ├── Visit (1:1)
 └── PDFExport (1:1, opzionale)
```

---

## Prisma Schema

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ─── Auth ────────────────────────────────────────────────────────────────────

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  role      Role     @default(DOCTOR)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  doctor   Doctor?
  sessions Session[]
}

enum Role {
  ADMIN
  DOCTOR
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

// ─── Doctors ─────────────────────────────────────────────────────────────────

model Doctor {
  id             String   @id @default(cuid())
  userId         String   @unique
  firstName      String
  lastName       String
  specialization String?
  licenseNumber  String?  @unique
  clinicName     String?
  clinicAddress  String?
  phone          String?
  signatureUrl   String?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt

  user   User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  visits Visit[]
}

// ─── Patients ────────────────────────────────────────────────────────────────

model Patient {
  id         String    @id @default(cuid())
  firstName  String
  lastName   String
  fiscalCode String    @unique
  birthDate  DateTime?
  birthPlace String?
  gender     Gender?
  phone      String?
  email      String?
  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @updatedAt

  visits Visit[]
}

enum Gender {
  M
  F
  ALTRO
}

// ─── Visits ──────────────────────────────────────────────────────────────────

enum VisitStatus {
  IN_REGISTRAZIONE
  IN_REVISIONE
  APPROVATO
  ESPORTATO
}

model Visit {
  id        String      @id @default(cuid())
  visitDate DateTime    @default(now())
  status    VisitStatus @default(IN_REGISTRAZIONE)
  notes     String?     @db.Text
  createdAt DateTime    @default(now())
  updatedAt DateTime    @updatedAt

  doctorId String
  doctor   Doctor @relation(fields: [doctorId], references: [id])

  patientId String
  patient   Patient @relation(fields: [patientId], references: [id])

  audioFile  AudioFile?
  transcript Transcript?
  report     Report?
}

// ─── Audio & Transcript ───────────────────────────────────────────────────────

model AudioFile {
  id        String   @id @default(cuid())
  url       String
  duration  Int?     // secondi
  createdAt DateTime @default(now())

  visitId String @unique
  visit   Visit  @relation(fields: [visitId], references: [id], onDelete: Cascade)
}

model Transcript {
  id        String   @id @default(cuid())
  text      String   @db.Text
  createdAt DateTime @default(now())

  visitId String @unique
  visit   Visit  @relation(fields: [visitId], references: [id], onDelete: Cascade)
}

// ─── Reports ─────────────────────────────────────────────────────────────────

model Report {
  id         String    @id @default(cuid())
  draft      String    @db.Text  // generato dall'AI
  final      String?   @db.Text  // approvato dal medico
  pdfUrl     String?
  approvedAt DateTime?
  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @updatedAt

  visitId String @unique
  visit   Visit  @relation(fields: [visitId], references: [id], onDelete: Cascade)
}
```

---

## UI/UX Design System

### Layout Dashboard Medico

```
┌──────────────────────────────────────────────────────┐
│  Sidebar (collassabile)    │  Main Content            │
│                            │                          │
│  • Nuova visita            │  [Lista visite recenti]  │
│  • Visite                  │                          │
│  • Pazienti                │  [Card visita con stato] │
│  ──────────────────        │                          │
│  [Avatar medico]           │  ← Apre dettaglio →     │
│  [Impostazioni]            │                          │
└──────────────────────────────────────────────────────┘
```

### Flusso Principale

```
[Registra audio] → [Trascrizione AI] → [Referto bozza]
        ↓                                      ↓
  [Upload audio]                    [Revisione medico]
                                           ↓
                                    [Approva referto]
                                           ↓
                                    [Esporta PDF]
```

### Stati Visita

| Stato | Colore | Hex | Significato |
|---|---|---|---|
| `in_registrazione` | Blu | `#3b82f6` | Audio in corso o caricato |
| `in_revisione` | Ambra | `#f59e0b` | Referto generato, attende revisione |
| `approvato` | Verde | `#10b981` | Referto firmato dal medico |
| `esportato` | Grigio | `#6b7280` | PDF generato e scaricato |

### Principi di Design

- Interfaccia clinica: pulita, leggibile, priva di distrazioni
- Font sans-serif chiaro per leggibilità su testi medici
- Densità media: le informazioni cliniche richiedono spazio
- Light mode di default; dark mode opzionale
- Mobile-friendly per tablet in corsia, desktop-first per studio
- Accessibilità: contrasti elevati, font size generosi

---

## Project Structure

```
medireferto/
├── app/
│   ├── (public)/
│   │   └── login/
│   │       └── page.tsx
│   ├── (medico)/                    # Area medico (auth required)
│   │   ├── layout.tsx               # Sidebar layout
│   │   ├── page.tsx                 # Dashboard overview
│   │   ├── visita/
│   │   │   ├── nuova/
│   │   │   │   └── page.tsx         # Registra nuova visita
│   │   │   └── [id]/
│   │   │       └── page.tsx         # Revisione e approvazione referto
│   │   └── pazienti/
│   │       ├── page.tsx             # Lista pazienti
│   │       └── [id]/
│   │           └── page.tsx         # Dettaglio paziente + storico
│   ├── (admin)/                     # Area admin (auth required)
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── medici/
│   │   │   └── page.tsx
│   │   └── pazienti/
│   │       └── page.tsx
│   └── api/
│       ├── auth/                    # NextAuth handlers
│       ├── visite/                  # CRUD visite + upload audio
│       ├── trascrizione/            # Invoca Gemini → trascrizione
│       ├── referto/                 # Invoca Gemini → genera referto
│       ├── pdf/                     # Genera e scarica PDF
│       ├── pazienti/
│       └── medici/
├── components/
│   ├── ui/                          # shadcn/ui primitives
│   ├── medico/
│   │   ├── AudioRecorder.tsx        # Registrazione audio in-browser
│   │   ├── TranscriptViewer.tsx
│   │   ├── ReportEditor.tsx         # Editor referto con diff AI vs finale
│   │   ├── VisitCard.tsx
│   │   └── Sidebar.tsx
│   └── admin/
│       ├── DoctorForm.tsx
│       └── PatientForm.tsx
├── lib/
│   ├── prisma.ts                    # Prisma client singleton
│   ├── auth.ts                      # NextAuth config
│   ├── gemini.ts                    # Gemini API client
│   ├── uploadthing.ts
│   └── pdf.ts                       # Template PDF + generazione
├── prisma/
│   ├── schema.prisma
│   └── migrations/
└── types/
    └── index.ts
```

---

*Last updated: April 2026*