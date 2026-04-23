// import { notFound } from 'next/navigation';
// import PatientForm from '@/components/admin/PatientForm';
// import { MOCK_PATIENTS } from '@/lib/mocked-data';
// import type { PatientFormValues } from '@/app/(admin)/admin/pazienti/validator';

// interface PageProps {
//   params: Promise<{ id: string }>;
// }

// export default async function ModificaPazientePage({ params }: PageProps) {
//   const { id } = await params;
//   const patient = MOCK_PATIENTS.find((p) => p.id === id);

//   if (!patient) notFound();

//   const initialValues: PatientFormValues = {
//     firstName: patient.firstName,
//     lastName: patient.lastName,
//     fiscalCode: patient.fiscalCode,
//     birthDate: patient.birthDate,
//     birthPlace: patient.birthPlace,
//     gender: patient.gender,
//     phone: patient.phone,
//     email: patient.email,
//   };

//   return (
//     <div className="p-8 max-w-3xl mx-auto">
//       <PatientForm mode="edit" patientId={patient.id} initialValues={initialValues} />
//     </div>
//   );
// }


import { notFound } from "next/navigation";
import PatientForm from "@/components/admin/PatientForm";
import { getPatientById } from "@/lib/db/patient";
import type { PatientFormValues } from "@/app/(admin)/admin/pazienti/validator";

interface PageProps {
  params: { id: string };
}

export default async function ModificaPazientePage({ params }: PageProps) {
  const patient = await getPatientById(params.id);

  if (!patient) notFound();
  if (!patient.birthDate) notFound();

const initialValues: PatientFormValues = {
  firstName: patient.firstName,
  lastName: patient.lastName,
  fiscalCode: patient.fiscalCode,

  birthDate: patient.birthDate.toISOString().split("T")[0],

  birthPlace: patient.birthPlace ?? "",

  gender: patient.gender as any,

  phone: patient.phone ?? "",
  email: patient.email ?? "",
};
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <PatientForm
        mode="edit"
        patientId={patient.id}
        initialValues={initialValues}
      />
    </div>
  );
}