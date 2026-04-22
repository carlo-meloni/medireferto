// import { prisma } from "@/lib/prisma";

// export async function getPatients() {
  
// }

// export async function getPatientById() {}


import { prisma } from "@/lib/prisma";

export async function getPatients(search?: string) {
  return prisma.patient.findMany({
    where: search
      ? {
          OR: [
            {
              firstName: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              lastName: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              fiscalCode: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        }
      : {},
    orderBy: {
      lastName: "asc",
    },
  });
}

export async function getPatientById(id: string) {
  return prisma.patient.findUnique({
    where: { id },
  });
}