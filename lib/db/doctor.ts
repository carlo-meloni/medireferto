import { prisma } from "@/lib/prisma";

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