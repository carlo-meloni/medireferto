'use server';

import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { doctorFormSchema, type DoctorFormValues } from '@/app/(admin)/admin/medici/validator';

type CreateResult = { success: true; doctorId: string } | { success: false; error: string };
type UpdateResult = { success: true } | { success: false; error: string };

export async function createMedico(values: DoctorFormValues): Promise<CreateResult> {
  const parsed = doctorFormSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: 'Dati non validi' };
  }

  const { firstName, lastName, specialization, licenseNumber, clinicName, clinicAddress, phone, email, password } =
    parsed.data;

  if (!email) return { success: false, error: "L'email è obbligatoria" };
  if (!password) return { success: false, error: 'La password è obbligatoria' };

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return { success: false, error: 'Esiste già un account con questa email' };
    }

    if (licenseNumber) {
      const existingDoctor = await prisma.doctor.findUnique({ where: { licenseNumber } });
      if (existingDoctor) {
        return { success: false, error: 'Esiste già un medico con questo numero di albo' };
      }
    }

    const hashed = await bcrypt.hash(password, 12);

    const doctor = await prisma.user.create({
      data: {
        email,
        password: hashed,
        role: 'DOCTOR',
        doctor: {
          create: {
            firstName,
            lastName,
            specialization: specialization || null,
            licenseNumber: licenseNumber || null,
            clinicName: clinicName || null,
            clinicAddress: clinicAddress || null,
            phone: phone || null,
          },
        },
      },
      select: { doctor: { select: { id: true } } },
    });

    return { success: true, doctorId: doctor.doctor!.id };
  } catch (err) {
    console.error('[createMedico]', err);
    return { success: false, error: 'Errore durante la creazione del medico' };
  }
}

export async function updateMedico(doctorId: string, values: DoctorFormValues): Promise<UpdateResult> {
  const parsed = doctorFormSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: 'Dati non validi' };
  }

  const { firstName, lastName, specialization, licenseNumber, clinicName, clinicAddress, phone } = parsed.data;

  try {
    if (licenseNumber) {
      const conflict = await prisma.doctor.findFirst({
        where: { licenseNumber, NOT: { id: doctorId } },
      });
      if (conflict) {
        return { success: false, error: 'Esiste già un altro medico con questo numero di albo' };
      }
    }

    await prisma.doctor.update({
      where: { id: doctorId },
      data: {
        firstName,
        lastName,
        specialization: specialization || null,
        licenseNumber: licenseNumber || null,
        clinicName: clinicName || null,
        clinicAddress: clinicAddress || null,
        phone: phone || null,
      },
    });

    return { success: true };
  } catch (err) {
    console.error('[updateMedico]', err);
    return { success: false, error: "Errore durante l'aggiornamento del medico" };
  }
}

export async function getDoctors(search?: string) {
  return prisma.doctor.findMany({
    where: search
      ? {
          OR: [
            {
              firstName: { contains: search, mode: "insensitive" },
            },
            {
              lastName: { contains: search, mode: "insensitive" },
            },
            {
              specialization: { contains: search, mode: "insensitive" },
            },
            {
              licenseNumber: { contains: search, mode: "insensitive" },
            },
          ],
        }
      : undefined,

    orderBy: {
      lastName: "asc",
    },
  });
}