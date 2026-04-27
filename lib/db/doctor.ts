'use server';

import { prisma } from "@/lib/prisma";
import { doctorFormSchema } from "@/app/(admin)/admin/medici/validator";
import { revalidatePath } from "next/cache";

export async function createDoctorAction(data: any) {
  try {
    const validated = doctorFormSchema.parse(data);

    // --- CONTROLLO DUPLICATI ---
    if (validated.licenseNumber) {
      const existing = await prisma.doctor.findUnique({
        where: { licenseNumber: validated.licenseNumber }
      });
      if (existing) throw new Error("Il numero di albo inserito è già registrato.");
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: validated.email }
    });
    if (existingUser) throw new Error("L'indirizzo email è già associato a un altro account.");

    return await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: validated.email,
          role: "DOCTOR",
        },
      });

      const doctor = await tx.doctor.create({
        data: {
          userId: user.id,
          firstName: validated.firstName,
          lastName: validated.lastName,
          specialization: validated.specialization || null,
          licenseNumber: validated.licenseNumber || null,
          clinicName: validated.clinicName || null,
          clinicAddress: validated.clinicAddress || null,
          phone: validated.phone || null,
        },
      });

      revalidatePath("/admin/medici");
      return doctor;
    });
  } catch (error: any) {
    console.error("ERRORE SERVER (CREAZIONE):", error);
    throw new Error(error.message || "Errore durante la creazione");
  }
}

export async function updateDoctorAction(id: string, data: any) {
  try {
    const validated = doctorFormSchema.parse(data);

    // --- CONTROLLO DUPLICATI IN MODIFICA ---
    if (validated.licenseNumber) {
      const existing = await prisma.doctor.findFirst({
        where: { 
          licenseNumber: validated.licenseNumber,
          NOT: { id: id }
        }
      });
      if (existing) throw new Error("Il numero di albo è già usato da un altro medico.");
    }
   

    const updated = await prisma.$transaction(async (tx) => {
      const doc = await tx.doctor.update({
        where: { id },
        data: {
          firstName: validated.firstName,
          lastName: validated.lastName,
          specialization: validated.specialization || null,
          licenseNumber: validated.licenseNumber || null,
          clinicName: validated.clinicName || null,
          clinicAddress: validated.clinicAddress || null,
          phone: validated.phone || null,
        },
      });

      await tx.user.update({
        where: { id: doc.userId },
        data: { email: validated.email },
      });

      return doc;
    });

    revalidatePath("/admin/medici");
    revalidatePath(`/admin/medici/${id}`);
    return updated;
  } catch (error: any) {
    console.error("ERRORE SERVER (UPDATE):", error);
    throw new Error(error.message || "Errore durante l'aggiornamento");
  }
}

export async function getDoctors(search?: string) {
  return await prisma.doctor.findMany({
    where: search ? {
      OR: [
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
      ],
    } : undefined,
    include: { user: { select: { email: true } } },
    orderBy: { lastName: 'asc' }
  });
}

export async function deleteDoctorAction(id: string) {
  try {
   
    const doctor = await prisma.doctor.findUnique({
      where: { id },
      select: { userId: true }
    });

    if (!doctor) throw new Error("Medico non trovato");

    
    await prisma.user.delete({
      where: { id: doctor.userId }
    });

    revalidatePath("/admin/medici");
  } catch (error: any) {
    console.error("ERRORE SERVER (DELETE):", error);
    throw new Error("Impossibile eliminare il medico. Potrebbe avere visite associate.");
  }
}