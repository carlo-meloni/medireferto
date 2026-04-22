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

export async function getVisitsByPatientId(patientId: string) {
  return prisma.visit.findMany({
    where: {
      patientId: patientId,
    },
    orderBy: {
      visitDate: "desc",
    },
  });
}