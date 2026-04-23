import { notFound } from 'next/navigation';
import PatientForm from '@/components/admin/PatientForm';
import { prisma } from '@/lib/prisma';
import type { PatientFormValues } from '@/app/(admin)/admin/pazienti/validator';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ModificaPazientePage({
  params,
}: PageProps) {
  const { id } = await params;

  const patient = await prisma.patient.findUnique({
    where: {
      id,
    },
  });

  if (!patient) {
    notFound();
  }

  const initialValues: PatientFormValues = {
    firstName: patient.firstName,
    lastName: patient.lastName,
    fiscalCode: patient.fiscalCode,
    birthDate: patient.birthDate
      ? patient.birthDate.toISOString().split('T')[0]
      : '',
    birthPlace: patient.birthPlace || '',
    gender: patient.gender || 'M',
    phone: patient.phone || '',
    email: patient.email || '',
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">

      <PatientForm mode="edit" patientId={patient.id} initialValues={initialValues}/>

     <PatientForm
  mode="edit"
  patientId={patient.id}
  initialValues={initialValues}
/>

    </div>
  );
}