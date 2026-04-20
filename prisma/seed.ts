import "dotenv/config";
import { hash } from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminPassword = await hash("Admin1234!", 12);
  const doctorPassword = await hash("Doctor1234!", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@medireferto.it" },
    update: {},
    create: {
      email: "admin@medireferto.it",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  const rossi = await prisma.user.upsert({
    where: { email: "dott.rossi@medireferto.it" },
    update: {},
    create: {
      email: "dott.rossi@medireferto.it",
      password: doctorPassword,
      role: "DOCTOR",
      doctor: {
        create: {
          firstName: "Mario",
          lastName: "Rossi",
          specialization: "Medicina Generale",
          licenseNumber: "RM12345",
          clinicName: "Studio Medico Rossi",
          clinicAddress: "Via Roma 1, 00100 Roma",
          phone: "+39 06 1234567",
        },
      },
    },
    include: { doctor: true },
  });

  const bianchi = await prisma.user.upsert({
    where: { email: "dott.bianchi@medireferto.it" },
    update: {},
    create: {
      email: "dott.bianchi@medireferto.it",
      password: doctorPassword,
      role: "DOCTOR",
      doctor: {
        create: {
          firstName: "Laura",
          lastName: "Bianchi",
          specialization: "Cardiologia",
          licenseNumber: "MI67890",
          clinicName: "Centro Cardiologico Bianchi",
          clinicAddress: "Via Milano 15, 20100 Milano",
          phone: "+39 02 9876543",
        },
      },
    },
    include: { doctor: true },
  });

  // Clear transactional data so the seed is idempotent.
  // Visit deletes cascade to AudioFile, Transcript, Report.
  await prisma.visit.deleteMany({});
  await prisma.patient.deleteMany({});

  const verdi = await prisma.patient.create({
    data: {
      firstName: "Giuseppe",
      lastName: "Verdi",
      fiscalCode: "VRDGPP70A01H501A",
      birthDate: new Date("1970-01-01"),
      birthPlace: "Roma",
      gender: "M",
      phone: "+39 333 1111111",
      email: "g.verdi@example.it",
    },
  });

  const esposito = await prisma.patient.create({
    data: {
      firstName: "Anna",
      lastName: "Esposito",
      fiscalCode: "SPSNNA85T45F839L",
      birthDate: new Date("1985-12-05"),
      birthPlace: "Napoli",
      gender: "F",
      phone: "+39 333 2222222",
      email: "a.esposito@example.it",
    },
  });

  const ferrari = await prisma.patient.create({
    data: {
      firstName: "Luca",
      lastName: "Ferrari",
      fiscalCode: "FRRLCU92M15L219X",
      birthDate: new Date("1992-08-15"),
      birthPlace: "Torino",
      gender: "M",
      phone: "+39 333 3333333",
    },
  });

  const conti = await prisma.patient.create({
    data: {
      firstName: "Maria",
      lastName: "Conti",
      fiscalCode: "CNTMRA60E55D612K",
      birthDate: new Date("1960-05-15"),
      birthPlace: "Firenze",
      gender: "F",
      phone: "+39 333 4444444",
    },
  });

  const romano = await prisma.patient.create({
    data: {
      firstName: "Paolo",
      lastName: "Romano",
      fiscalCode: "RMNPLA78C20H501Q",
      birthDate: new Date("1978-03-20"),
      birthPlace: "Roma",
      gender: "M",
    },
  });

  // APPROVATO — audio + transcript + report (final)
  await prisma.visit.create({
    data: {
      doctorId: rossi.doctor!.id,
      patientId: verdi.id,
      visitDate: new Date("2026-04-15T10:00:00Z"),
      status: "APPROVATO",
      notes: "Paziente iperteso, controllo regolare",
      audioFile: {
        create: {
          url: "https://uploadthing.example/audio/visita-verdi-001.m4a",
          duration: 420,
        },
      },
      transcript: {
        create: {
          text: "Il paziente Giuseppe Verdi, 56 anni, riferisce cefalee occasionali al risveglio. PA 140/90. Si consiglia proseguimento terapia in atto.",
        },
      },
      report: {
        create: {
          draft:
            "ANAMNESI: Paziente iperteso in terapia.\n\nESAME OBIETTIVO: PA 140/90 mmHg. FC 76 bpm regolare.\n\nDIAGNOSI: Ipertensione arteriosa lieve.\n\nTERAPIA: Proseguimento terapia in atto.",
          final:
            "ANAMNESI: Paziente iperteso in terapia antiipertensiva da 3 anni.\n\nESAME OBIETTIVO: PA 140/90 mmHg. FC 76 bpm, ritmico. Toni cardiaci validi.\n\nDIAGNOSI: Ipertensione arteriosa lieve in buon controllo.\n\nTERAPIA: Proseguimento terapia in atto. Controllo tra 3 mesi.",
          approvedAt: new Date("2026-04-15T10:45:00Z"),
        },
      },
    },
  });

  // ESPORTATO — audio + transcript + report (with pdfUrl)
  await prisma.visit.create({
    data: {
      doctorId: bianchi.doctor!.id,
      patientId: esposito.id,
      visitDate: new Date("2026-04-10T14:30:00Z"),
      status: "ESPORTATO",
      audioFile: {
        create: {
          url: "https://uploadthing.example/audio/visita-esposito-001.m4a",
          duration: 680,
        },
      },
      transcript: {
        create: {
          text: "La paziente Anna Esposito riferisce palpitazioni saltuarie. ECG nella norma. Si richiede Holter cardiaco di 24 ore.",
        },
      },
      report: {
        create: {
          draft: "Visita cardiologica di controllo.",
          final:
            "ANAMNESI: Palpitazioni saltuarie da circa un mese, non associate a dolore toracico.\n\nESAME OBIETTIVO: Toni cardiaci validi, ritmici, nessun soffio.\n\nDIAGNOSI: Extrasistolia sopraventricolare benigna.\n\nTERAPIA: Holter ECG 24h. Controllo dopo esame.",
          pdfUrl: "https://uploadthing.example/pdf/referto-esposito-001.pdf",
          approvedAt: new Date("2026-04-10T15:15:00Z"),
        },
      },
    },
  });

  // IN_REVISIONE — audio + transcript + report (draft only)
  await prisma.visit.create({
    data: {
      doctorId: rossi.doctor!.id,
      patientId: ferrari.id,
      visitDate: new Date("2026-04-19T09:00:00Z"),
      status: "IN_REVISIONE",
      audioFile: {
        create: {
          url: "https://uploadthing.example/audio/visita-ferrari-001.m4a",
          duration: 360,
        },
      },
      transcript: {
        create: {
          text: "Il paziente Luca Ferrari si presenta per dolore lombare insorto da tre giorni dopo sforzo fisico.",
        },
      },
      report: {
        create: {
          draft:
            "ANAMNESI: Lombalgia acuta post-sforzo.\n\nESAME OBIETTIVO: Dolenzia alla palpazione del tratto lombare. ROT normo-elicitabili.\n\nDIAGNOSI: Lombalgia meccanica.\n\nTERAPIA: FANS al bisogno, riposo relativo.",
        },
      },
    },
  });

  // IN_REGISTRAZIONE — audio only, no transcript yet
  await prisma.visit.create({
    data: {
      doctorId: bianchi.doctor!.id,
      patientId: conti.id,
      visitDate: new Date("2026-04-20T11:00:00Z"),
      status: "IN_REGISTRAZIONE",
      audioFile: {
        create: {
          url: "https://uploadthing.example/audio/visita-conti-001.m4a",
          duration: 240,
        },
      },
    },
  });

  // IN_REGISTRAZIONE — fresh visit, no audio yet
  await prisma.visit.create({
    data: {
      doctorId: rossi.doctor!.id,
      patientId: romano.id,
      visitDate: new Date("2026-04-20T15:30:00Z"),
      status: "IN_REGISTRAZIONE",
    },
  });

  console.log("Seed completed:");
  console.log(`  Admin:    ${admin.email}`);
  console.log(`  Doctors:  ${rossi.email}, ${bianchi.email}`);
  console.log(`  Patients: 5`);
  console.log(`  Visits:   5 (one per status, plus extra IN_REGISTRAZIONE)`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
