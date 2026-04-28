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
