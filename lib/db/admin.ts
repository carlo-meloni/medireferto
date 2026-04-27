import { prisma } from "@/lib/prisma";

export async function getAdminStats() {
  const [totalDoctors, totalPatients, totalVisits, visitsThisMonth] =
    await Promise.all([
      prisma.doctor.count(),
      prisma.patient.count(),
      prisma.visit.count(),
      prisma.visit.count({
        where: {
          visitDate: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
    ]);

  return {
    totalDoctors,
    totalPatients,
    totalVisits,
    visitsThisMonth,
  };
}