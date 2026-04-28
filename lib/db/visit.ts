'use server';

import { prisma } from '@/lib/prisma';

interface CreateVisitaInput {
  patientId: string;
  notes: string;
  transcript: string;
  acceptanceDate: Date;
  examDate: Date;
}

export async function createVisita(
  input: CreateVisitaInput
): Promise<{ visitId: string } | { error: string }> {
  try {
    const { patientId, notes, transcript, acceptanceDate, examDate } = input;

    if (!patientId) return { error: 'Paziente non selezionato' };
    if (!transcript.trim()) return { error: 'Trascrizione mancante' };

    // TODO: replace with authenticated user's doctor record
    const doctor = await prisma.doctor.findFirst();
    if (!doctor) return { error: 'Nessun medico trovato' };

    const visit = await prisma.visit.create({
      data: {
        patientId,
        doctorId: doctor.id,
        notes: notes || null,
        acceptanceDate,
        examDate,
        transcript: {
          create: { text: transcript.trim() },
        },
      },
    });

    return { visitId: visit.id };
  } catch (err) {
    console.error('[createVisita]', err);
    return { error: 'Errore durante la creazione della visita' };
  }
}

export async function getAllVisits() {
  return prisma.visit.findMany({
    include: {
      patient: true,
    },
    orderBy: {
      visitDate: "desc",
    },
  });
}

export async function getVisitById(id: string) {
  return prisma.visit.findFirst({
    where: { id },
    include: {
      patient: true,
      transcript: true,
      report: true,
    },
  });
}

export async function getVisitsByPatientId(patientId: string) {
  return prisma.visit.findMany({
    where: {
      patientId: patientId,
    },
    orderBy: {
      visitDate: "desc",
    },
  });
}