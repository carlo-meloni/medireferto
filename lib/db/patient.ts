'use server';

import { prisma } from "@/lib/prisma";
import { patientFormSchema } from "@/app/(admin)/admin/pazienti/validator";
// aggiorna la pagina dopo una modifica 
import { revalidatePath } from "next/cache";


/**
 * Lista pazienti con ricerca + visite
 */
export async function getPatients(search?: string) {
  return prisma.patient.findMany({
    where: search
      ? {
          OR: [
            { firstName: { contains: search, mode: "insensitive" } },
            { lastName: { contains: search, mode: "insensitive" } },
            { fiscalCode: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        }
      : undefined,

    include: {
      visits: {
        orderBy: {
          visitDate: "desc",
        },
        select: {
          id: true,
          visitDate: true,
        },
      },
    },

    orderBy: {
      lastName: "asc",
    },
  });
}

/**
 * Paziente singolo SENZA visite
 */
export async function getPatientById(id: string) {
  return prisma.patient.findUnique({
    where: { id },
  });
}

/**
 * Paziente con visite (USATO NEL DETTAGLIO)
 */
export async function getPatientWithVisits(id: string) {
  return prisma.patient.findUnique({
    where: { id },
    include: {
      visits: {
        orderBy: {
          visitDate: "desc",
        },
      },
    },
  });
}

/**
 * AZIONI DI SCRITTURA (Server Actions)
 */

export async function createPatientAction(data: any) {

  // Validazione dati con lo schema Zod
  const validated = patientFormSchema.parse(data);

  const patient = await prisma.patient.create({
    data: {
      firstName: validated.firstName,
      lastName: validated.lastName,
      fiscalCode: validated.fiscalCode,
      birthPlace: validated.birthPlace,
      gender: validated.gender,
      phone: validated.phone || null,
      email: validated.email || null,
      // Convertiamo la stringa "YYYY-MM-DD" in oggetto Date per Prisma
      birthDate: validated.birthDate ? new Date(validated.birthDate) : null,
    },
  });

  revalidatePath("/admin/pazienti"); // Rinfresca la lista dei pazienti dopo la creazione
  return patient; 
}
export async function updatePatientAction(id: string, data: any) {
  const validated = patientFormSchema.parse(data);

  const patient = await prisma.patient.update({
    where: { id }, // Identifichiamo il paziente da aggiornare tramite ID
    data: {
      firstName: validated.firstName,
      lastName: validated.lastName,
      fiscalCode: validated.fiscalCode,
      birthPlace: validated.birthPlace,
      gender: validated.gender,
      phone: validated.phone || null,
      email: validated.email || null,
      birthDate: validated.birthDate ? new Date(validated.birthDate) : null,
    },
  });

  revalidatePath("/admin/pazienti");
  // Aggiorna anche la pagina di dettaglio del paziente
  revalidatePath(`/admin/pazienti/${id}`); 
  return patient;
}

// Delete patient
export async function deletePatientAction(id: string) {
  try {
    // 1. Eliminiamo direttamente il paziente.
    // NOTA: Se il paziente ha delle visite, Prisma darà errore perché 
    // nello schema non c'è il "onDelete: Cascade" sulla relazione tra Patient e Visit.
    await prisma.patient.delete({
      where: { id },
    });

    revalidatePath("/admin/pazienti"); 

  
  } catch (error: any) {
    console.error("ERRORE DELETE PAZIENTE:", error);
    
    // Messaggio se ci sono visite collegate
    if (error.code === 'P2003') {
      throw new Error("Impossibile eliminare: il paziente ha delle visite registrate. Elimina prima le visite.");
    }

    throw new Error("Si è verificato un errore durante l'eliminazione.");
  }
}