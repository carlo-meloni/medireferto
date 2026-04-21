import { prisma } from "@/lib/prisma";

export async function getVisitById(id: string) {
  return prisma.visit.findUnique({
    where: { id },
    include: {
      patient: true,
      transcript: true, 
      report: true,     
    },
  });
}