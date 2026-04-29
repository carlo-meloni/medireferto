'use server';

import { prisma } from '@/lib/prisma';
import { VisitStatus } from '@/generated/prisma/enums';

interface CreateVisitaInput {
  patientId: string;
  notes: string;
  transcript: string;
  acceptanceDate: Date;
  examDate: Date;
}

export async function createVisita(
  input: CreateVisitaInput
): Promise<{ visitId: string } | { error: string }> {
  try {
    const { patientId, notes, transcript, acceptanceDate, examDate } = input;

    if (!patientId) return { error: 'Paziente non selezionato' };
    if (!transcript.trim()) return { error: 'Trascrizione mancante' };

    // TODO: replace with authenticated user's doctor record
    const doctor = await prisma.doctor.findFirst();
    if (!doctor) return { error: 'Nessun medico trovato' };

    const visit = await prisma.visit.create({
      data: {
        patientId,
        doctorId: doctor.id,
        notes: notes || null,
        acceptanceDate,
        examDate,
        transcript: {
          create: { text: transcript.trim() },
        },
      },
    });

    return { visitId: visit.id };
  } catch (err) {
    console.error('[createVisita]', err);
    return { error: 'Errore durante la creazione della visita' };
  }
}

export async function getAllVisits() {
  return prisma.visit.findMany({
    include: {
      patient: true,
      doctor: true,
    },
    orderBy: {
      visitDate: "desc",
    },
  });
}

export interface VisitFilters {
  patientSearch?: string;
  dateFrom?: string;
  dateTo?: string;
  status?: string;
  page?: string;
}

const PAGE_SIZE = 5;
const VALID_STATUSES = new Set(['IN_REGISTRAZIONE', 'IN_REVISIONE', 'APPROVATO', 'ESPORTATO']);

export async function getFilteredVisits(filters: VisitFilters) {
  const { patientSearch, dateFrom, dateTo, status, page } = filters;

  const patientWhere = patientSearch?.trim()
    ? {
        OR: [
          { firstName: { contains: patientSearch, mode: 'insensitive' as const } },
          { lastName: { contains: patientSearch, mode: 'insensitive' as const } },
          { fiscalCode: { contains: patientSearch, mode: 'insensitive' as const } },
        ],
      }
    : undefined;

  const dateWhere: { gte?: Date; lte?: Date } = {};
  if (dateFrom) dateWhere.gte = new Date(dateFrom);
  if (dateTo) {
    const end = new Date(dateTo);
    end.setHours(23, 59, 59, 999);
    dateWhere.lte = end;
  }

  const validStatus = status && VALID_STATUSES.has(status) ? status : undefined;

  const currentPage = Math.max(1, parseInt(page ?? '1', 10));
  const skip = (currentPage - 1) * PAGE_SIZE;

  const where = {
    ...(patientWhere ? { patient: patientWhere } : {}),
    ...(Object.keys(dateWhere).length ? { visitDate: dateWhere } : {}),
    ...(validStatus ? { status: validStatus as VisitStatus } : {}),
  };

  const [visits, total] = await prisma.$transaction([
    prisma.visit.findMany({
      where,
      skip,
      take: PAGE_SIZE,
      include: { patient: true, doctor: true },
      orderBy: { visitDate: 'desc' },
    }),
    prisma.visit.count({ where }),
  ]);

  return { visits, total, page: currentPage, pageSize: PAGE_SIZE };
}

export async function getVisitById(id: string) {
  return prisma.visit.findFirst({
    where: { id },
    include: {
      patient: true,
      doctor: true,
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

export async function saveReportDraft(
  visitId: string,
  draft: string
): Promise<{ success: true } | { error: string }> {
  try {
    await prisma.$transaction([
      prisma.report.upsert({
        where: { visitId },
        create: { visitId, draft },
        update: { draft },
      }),
      prisma.visit.update({
        where: { id: visitId },
        data: { status: 'IN_REVISIONE' },
      }),
    ]);
    return { success: true };
  } catch (err) {
    console.error('[saveReportDraft]', err);
    return { error: 'Errore durante il salvataggio della bozza' };
  }
}

export async function approveReport(
  visitId: string,
  finalText: string
): Promise<{ success: true } | { error: string }> {
  try {
    await prisma.$transaction([
      prisma.report.update({
        where: { visitId },
        data: { final: finalText, approvedAt: new Date() },
      }),
      prisma.visit.update({
        where: { id: visitId },
        data: { status: 'APPROVATO' },
      }),
    ]);
    return { success: true };
  } catch (err) {
    console.error('[approveReport]', err);
    return { error: "Errore durante l'approvazione del referto" };
  }
}

export async function markVisitExported(
  visitId: string
): Promise<{ success: true } | { error: string }> {
  try {
    await prisma.visit.update({
      where: { id: visitId },
      data: { status: 'ESPORTATO' },
    });
    return { success: true };
  } catch (err) {
    console.error('[markVisitExported]', err);
    return { error: "Errore durante l'aggiornamento dello stato" };
  }
}