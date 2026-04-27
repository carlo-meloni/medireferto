// import { spec } from "node:test/reporters";

// export type VisitStatus = 'IN_REGISTRAZIONE' | 'IN_REVISIONE' | 'APPROVATO' | 'ESPORTATO';
// export type Gender = 'M' | 'F' | 'ALTRO';

// export const VISIT_STATUS_LABEL: Record<VisitStatus, string> = {
//   IN_REGISTRAZIONE: 'In registrazione',
//   IN_REVISIONE: 'In revisione',
//   APPROVATO: 'Approvato',
//   ESPORTATO: 'Esportato',
// };

// export const VISIT_STATUS_CLASSES: Record<VisitStatus, string> = {
//   IN_REGISTRAZIONE: 'bg-blue-50 text-blue-700 ring-blue-200',
//   IN_REVISIONE: 'bg-amber-50 text-amber-700 ring-amber-200',
//   APPROVATO: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
//   ESPORTATO: 'bg-zinc-100 text-zinc-600 ring-zinc-200',
// };

// // ─── Patients ────────────────────────────────────────────────────────────────

// export interface MockPatient {
//   id: string;
//   firstName: string;
//   lastName: string;
//   fiscalCode: string;
//   birthDate: string;
//   birthPlace: string;
//   gender: Gender;
//   phone: string;
//   email: string;
//   visitCount: number;
//   lastVisitDate: string | null;
// }

// export interface MockDoctor {
//   id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   specialization: string;
//   licenseNumber: string;
//   clinicName: string;
//   clinicAddress: string;
//   phone: string;
//   visitCount: number;
// }

// export const MOCK_PATIENTS: MockPatient[] = [
//   {
//     id: 'p1',
//     firstName: 'Mario',
//     lastName: 'Bianchi',
//     fiscalCode: 'BNCMRA80A01H501X',
//     birthDate: '1980-01-01',
//     birthPlace: 'Roma (RM)',
//     gender: 'M',
//     phone: '+39 333 1234567',
//     email: 'mario.bianchi@email.it',
//     visitCount: 4,
//     lastVisitDate: '2026-04-20T10:30:00',
//   },
//   {
//     id: 'p2',
//     firstName: 'Laura',
//     lastName: 'Verdi',
//     fiscalCode: 'VRDLRA92C45F205Z',
//     birthDate: '1992-03-05',
//     birthPlace: 'Milano (MI)',
//     gender: 'F',
//     phone: '+39 347 9876543',
//     email: 'laura.verdi@email.it',
//     visitCount: 2,
//     lastVisitDate: '2026-04-19T15:00:00',
//   },
//   {
//     id: 'p3',
//     firstName: 'Giuseppe',
//     lastName: 'Neri',
//     fiscalCode: 'NRIGPP75E12G273K',
//     birthDate: '1975-05-12',
//     birthPlace: 'Napoli (NA)',
//     gender: 'M',
//     phone: '+39 320 5554433',
//     email: 'giuseppe.neri@email.it',
//     visitCount: 7,
//     lastVisitDate: '2026-04-18T09:00:00',
//   },
//   {
//     id: 'p4',
//     firstName: 'Anna',
//     lastName: 'Russo',
//     fiscalCode: 'RSSNAN88D55L219M',
//     birthDate: '1988-04-15',
//     birthPlace: 'Torino (TO)',
//     gender: 'F',
//     phone: '+39 366 7778899',
//     email: 'anna.russo@email.it',
//     visitCount: 1,
//     lastVisitDate: '2026-04-20T14:00:00',
//   },
// ];

// // ─── Dashboard visits ─────────────────────────────────────────────────────────

// export interface MockDashboardVisit {
//   id: string;
//   patientName: string;
//   fiscalCode: string;
//   visitDate: string;
//   status: VisitStatus;
// }

// export const MOCK_DASHBOARD_VISITS: MockDashboardVisit[] = [
//   {
//     id: '1',
//     patientName: 'Mario Bianchi',
//     fiscalCode: 'BNCMRA80A01H501X',
//     visitDate: '2026-04-20T10:30:00',
//     status: 'IN_REVISIONE',
//   },
//   {
//     id: '2',
//     patientName: 'Laura Verdi',
//     fiscalCode: 'VRDLRA92C45F205Z',
//     visitDate: '2026-04-19T15:00:00',
//     status: 'APPROVATO',
//   },
//   {
//     id: '3',
//     patientName: 'Giuseppe Neri',
//     fiscalCode: 'NRIGPP75E12G273K',
//     visitDate: '2026-04-18T09:00:00',
//     status: 'ESPORTATO',
//   },
//   {
//     id: '4',
//     patientName: 'Anna Russo',
//     fiscalCode: 'RSSNAN88D55L219M',
//     visitDate: '2026-04-20T14:00:00',
//     status: 'IN_REGISTRAZIONE',
//   },
// ];

// // ─── Visit detail (revisione referto) ────────────────────────────────────────

// export interface MockVisitDetail {
//   id: string;
//   patientName: string;
//   fiscalCode: string;
//   visitDate: string;
//   status: VisitStatus;
//   transcript: string;
//   reportDraft: string;
// }

// export const MOCK_VISIT_DETAIL: MockVisitDetail = {
//   id: '1',
//   patientName: 'Mario Bianchi',
//   fiscalCode: 'BNCMRA80A01H501X',
//   visitDate: '2026-04-20T10:30:00',
//   status: 'IN_REVISIONE',
//   transcript: `Paziente maschio di 46 anni, iperteso in terapia con amlodipina 5 mg/die. Si presenta per controllo periodico.

// Riferisce cefalea saltuaria nelle ultime due settimane, soprattutto al mattino. Nega dolore toracico, dispnea o palpitazioni. Nessun episodio sincopale. Sonno regolare. Attività fisica moderata (camminata 30 min/die).

// All'esame obiettivo: PA 148/92 mmHg al braccio destro, confermata a 150/90 mmHg al braccio sinistro. FC 72 bpm ritmica. Toni cardiaci puri. MV conservato bilateralmente. Addome trattabile, non dolente. Nessun edema declive.

// ECG: ritmo sinusale, PR 164 ms, asse normale, nessuna alterazione della ripolarizzazione.`,
//   reportDraft: `**ANAMNESI**
// Paziente: Mario Bianchi, 46 anni, M. CF: BNCMRA80A01H501X
// Visita del: 20 aprile 2026

// Ipertensione arteriosa nota in terapia con Amlodipina 5 mg/die. Accede per controllo periodico con riferita cefalea mattutina nelle ultime due settimane.

// **ESAME OBIETTIVO**
// - PA: 148/92 mmHg (dx) — 150/90 mmHg (sin)
// - FC: 72 bpm, ritmica
// - Toni cardiaci: puri, normofrequenti
// - Torace: MV conservato bilateralmente
// - Addome: trattabile, non dolente
// - Arti inferiori: nessun edema declive
// - ECG: ritmo sinusale, PR 164 ms, asse normale

// **DIAGNOSI**
// Ipertensione arteriosa, controllo subottimale dei valori pressori (PA media ~149/91 mmHg).

// **PIANO TERAPEUTICO**
// 1. Uptitration Amlodipina a 10 mg/die
// 2. Monitoraggio domiciliare PA mattino e sera per 2 settimane
// 3. Riduzione apporto sodico; incremento attività aerobica
// 4. Controllo in 30 giorni con misurazione PA; da valutare aggiunta di ACE-inibitore se mancato target

// **NOTE**
// Paziente compliante alla terapia. Rivalutare EAB e creatinina al prossimo accesso.`,
// };

// // ─── Patient visit history ────────────────────────────────────────────────────

// export interface MockPatientVisit {
//   id: string;
//   visitDate: string;
//   status: VisitStatus;
//   notes: string | null;
// }

// export const MOCK_PATIENT_VISITS: MockPatientVisit[] = [
//   { id: '1', visitDate: '2026-04-20T10:30:00', status: 'IN_REVISIONE', notes: null },
//   { id: '5', visitDate: '2026-02-14T11:00:00', status: 'ESPORTATO', notes: 'Follow-up ipertensione' },
//   { id: '6', visitDate: '2025-11-03T09:30:00', status: 'ESPORTATO', notes: null },
//   { id: '7', visitDate: '2025-07-22T16:00:00', status: 'ESPORTATO', notes: 'Prima visita' },
// ];

// export const MOCK_DOCTORS: MockDoctor[] = [
//     {
//         id: 'd1',
//         firstName: 'Giovanni',
//         lastName: 'Rossi',
//         email: 'giovanni.rossi@example.com',
//         specialization: 'Cardiologia',
//         licenseNumber: 'MI-12345',
//         clinicName: 'Studio Medico Rossi',
//         clinicAddress: 'Via Roma 123, Milano',
//         phone: '+39 02 1234567',
//         visitCount: 25
//     },
//     {
//         id: 'd2',
//         firstName: 'Maria',
//         lastName: 'Bianchi',
//         email: 'maria.bianchi@example.com',
//         specialization: 'Dermatologia',
//         licenseNumber: 'TO-67890',
//         clinicName: 'Clinica Bianchi',
//         clinicAddress: 'Corso Venezia 45, Torino',
//         phone: '+39 011 9876543',
//         visitCount: 18
//     }
// ];

// // ─── Admin dashboard activity ────────────────────────────────────────────────

// export type AdminActivityType = 'doctor_added' | 'patient_added' | 'visit_approved';

// export interface MockAdminActivity {
//   id: string;
//   type: AdminActivityType;
//   description: string;
//   timestamp: string;
// }

// export const MOCK_ADMIN_ACTIVITY: MockAdminActivity[] = [
//   {
//     id: 'a1',
//     type: 'visit_approved',
//     description: 'Referto approvato per Mario Bianchi — Dr. Rossi',
//     timestamp: '2026-04-20T11:10:00',
//   },
//   {
//     id: 'a2',
//     type: 'patient_added',
//     description: 'Nuovo paziente registrato: Anna Russo',
//     timestamp: '2026-04-20T09:45:00',
//   },
//   {
//     id: 'a3',
//     type: 'doctor_added',
//     description: 'Nuovo medico registrato: Dr.ssa Giulia Moretti',
//     timestamp: '2026-03-05T11:15:00',
//   },
//   {
//     id: 'a4',
//     type: 'visit_approved',
//     description: 'Referto approvato per Laura Verdi — Dr.ssa Conti',
//     timestamp: '2026-04-19T16:20:00',
//   },
// ];

// export const MOCK_ADMIN_STATS = {
//   totalDoctors: MOCK_DOCTORS.length,
//   totalPatients: MOCK_PATIENTS.length,
//   totalVisits: MOCK_DOCTORS.reduce((sum, d) => sum + d.visitCount, 0),
//   visitsThisMonth: 42,
// };

