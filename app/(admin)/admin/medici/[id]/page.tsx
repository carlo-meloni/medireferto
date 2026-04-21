import { notFound } from 'next/navigation';
import DoctorForm from '@/components/admin/DoctorForm';
import { MOCK_DOCTORS } from '@/lib/mocked-data';
import type { DoctorFormValues } from '@/app/(admin)/admin/medici/validator';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ModificaMedicoPage({ params }: PageProps) {
  const { id } = await params;
  const doctor = MOCK_DOCTORS.find((d) => d.id === id);

  if (!doctor) notFound();

  const initialValues: DoctorFormValues = {
    firstName: doctor.firstName,
    lastName: doctor.lastName,
    email: doctor.email,
    specialization: doctor.specialization,
    licenseNumber: doctor.licenseNumber,
    clinicName: doctor.clinicName,
    clinicAddress: doctor.clinicAddress,
    phone: doctor.phone,
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <DoctorForm mode="edit" doctorId={doctor.id} initialValues={initialValues} />
    </div>
  );
}
