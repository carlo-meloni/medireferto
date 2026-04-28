import { prisma } from "@/lib/prisma";

export async function getAllVisits() {
  return prisma.visit.findMany({
    include: {
      patient: true,
    },
    orderBy: {
      visitDate: "desc",
    },
  });
}

export async function getVisitById(id: string) {
  return prisma.visit.findFirst({
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