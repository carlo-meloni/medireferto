'use server';

import { prisma } from '@/lib/prisma';
import { patientFormSchema, type PatientFormValues } from '@/app/(medico)/medico/pazienti/validator';

type ActionResult = { success: true; patientId: string } | { success: false; error: string };

export async function createPaziente(values: PatientFormValues): Promise<ActionResult> {
  const parsed = patientFormSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: 'Dati non validi' };
  }

  const { firstName, lastName, fiscalCode, birthDate, birthPlace, gender, phone, email } =
    parsed.data;

  try {
    const existing = await prisma.patient.findUnique({ where: { fiscalCode } });
    if (existing) {
      return { success: false, error: 'Esiste già un paziente con questo codice fiscale' };
    }

    const patient = await prisma.patient.create({
      data: {
        firstName,
        lastName,
        fiscalCode,
        birthDate: new Date(birthDate),
        birthPlace: birthPlace || null,
        gender: gender ?? null,
        phone: phone || null,
        email: email || null,
      },
    });

    return { success: true, patientId: patient.id };
  } catch (err) {
    console.error('[createPaziente]', err);
    return { success: false, error: 'Errore durante la creazione del paziente' };
  }
}

export async function updatePaziente(
  patientId: string,
  values: PatientFormValues
): Promise<ActionResult> {
  const parsed = patientFormSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: 'Dati non validi' };
  }

  const { firstName, lastName, fiscalCode, birthDate, birthPlace, gender, phone, email } =
    parsed.data;

  try {
    const conflict = await prisma.patient.findFirst({
      where: { fiscalCode, NOT: { id: patientId } },
    });
    if (conflict) {
      return { success: false, error: 'Esiste già un altro paziente con questo codice fiscale' };
    }

    const patient = await prisma.patient.update({
      where: { id: patientId },
      data: {
        firstName,
        lastName,
        fiscalCode,
        birthDate: new Date(birthDate),
        birthPlace: birthPlace || null,
        gender: gender ?? null,
        phone: phone || null,
        email: email || null,
      },
    });

    return { success: true, patientId: patient.id };
  } catch (err) {
    console.error('[updatePaziente]', err);
    return { success: false, error: "Errore durante l'aggiornamento del paziente" };
  }
}
