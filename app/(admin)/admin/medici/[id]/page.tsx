import { notFound } from 'next/navigation';
import DoctorForm from '@/components/admin/DoctorForm';
import { prisma } from '@/lib/prisma';
import type { DoctorFormValues } from '@/app/(admin)/admin/medici/validator';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ModificaMedicoPage({ params }: PageProps) {
  const { id } = await params;

  const doctor = await prisma.doctor.findFirst({
    where: { id },
  });

  if (!doctor) notFound();

  const initialValues: DoctorFormValues = {
    firstName: doctor.firstName ?? '',
    lastName: doctor.lastName ?? '',
    specialization: doctor.specialization ?? '',
    licenseNumber: doctor.licenseNumber ?? '',
    clinicName: doctor.clinicName ?? '',
    clinicAddress: doctor.clinicAddress ?? '',
    phone: doctor.phone ?? '',
  };

  return (
    <div className="min-h-full bg-zinc-50/60 p-8">
      <div className="mx-auto max-w-3xl">
        <DoctorForm
          mode="edit"
          doctorId={doctor.id}
          initialValues={initialValues}
        />
      </div>
    </div>
  );
}