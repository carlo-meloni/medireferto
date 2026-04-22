import DoctorForm from '@/components/admin/DoctorForm';

export default function NuovoMedicoPage() {
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <DoctorForm mode="create" />
    </div>
  );
}
