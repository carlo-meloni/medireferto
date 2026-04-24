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
            {
              email: {
                contains: search,
                mode: "insensitive",
              },
            },
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