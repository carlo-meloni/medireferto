import { getVisitById, savePdfUrl, markVisitExported } from '@/lib/db/visit';
import { generateReportPDF } from '@/lib/pdf/ReportPDF';
import { utapi } from '@/lib/uploadthing';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ visitId: string }> }
) {
  const { visitId } = await params;

  const visit = await getVisitById(visitId);
  if (!visit) {
    return new Response('Visita non trovata', { status: 404 });
  }

  if (!visit.report?.final) {
    return new Response('Referto non ancora approvato', { status: 422 });
  }

  if (!visit.doctor) {
    return new Response('Dati medico mancanti', { status: 422 });
  }

  // PDF already uploaded — redirect and mark downloaded
  if (visit.report.pdfUrl) {
    await markVisitExported(visitId);
    return Response.redirect(visit.report.pdfUrl, 302);
  }

  // Fallback: approval-time upload failed, generate on demand
  const buffer = await generateReportPDF({
    patient: {
      firstName: visit.patient.firstName,
      lastName: visit.patient.lastName,
      fiscalCode: visit.patient.fiscalCode,
      birthDate: visit.patient.birthDate,
      birthPlace: visit.patient.birthPlace,
      gender: visit.patient.gender as 'M' | 'F' | 'ALTRO' | null,
    },
    doctor: {
      firstName: visit.doctor.firstName,
      lastName: visit.doctor.lastName,
      specialization: visit.doctor.specialization,
      licenseNumber: visit.doctor.licenseNumber,
      clinicName: visit.doctor.clinicName,
      clinicAddress: visit.doctor.clinicAddress,
      phone: visit.doctor.phone,
    },
    visit: {
      acceptanceDate: visit.acceptanceDate,
      examDate: visit.examDate,
    },
    report: {
      final: visit.report.final,
      approvedAt: visit.report.approvedAt,
    },
  });

  const lastName = visit.patient.lastName.toLowerCase().replace(/\s+/g, '-');
  const filename = `referto-${lastName}-${visitId.slice(0, 8)}.pdf`;
  const file = new File([new Uint8Array(buffer)], filename, { type: 'application/pdf' });
  const { data, error } = await utapi.uploadFiles(file);

  if (!error && data?.ufsUrl) {
    await savePdfUrl(visitId, data.ufsUrl);
    await markVisitExported(visitId);
    return Response.redirect(data.ufsUrl, 302);
  }

  // Last resort: stream directly
  await markVisitExported(visitId);
  return new Response(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${filename}"`,
    },
  });
}
