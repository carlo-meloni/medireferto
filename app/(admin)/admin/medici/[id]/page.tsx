import { notFound } from 'next/navigation';
import DoctorForm from '@/components/admin/DoctorForm';
import { prisma } from '@/lib/prisma';
import type { DoctorFormValues } from '@/app/(admin)/admin/medici/validator';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ModificaMedicoPage({ params }: PageProps) {
  const { id } = await params;

  const doctor = await prisma.doctor.findUnique({
    where: { id },
    include: {
      user: true, // Per ottenere l'email associata al medico
    },
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
    email: doctor.user?.email ?? '', 

  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <DoctorForm
        mode="edit"
        doctorId={doctor.id}
        initialValues={initialValues}
      />
    </div>
  );
}