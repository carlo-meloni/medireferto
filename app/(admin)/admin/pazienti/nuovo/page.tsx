import PatientForm from '@/components/admin/PatientForm';

export default function NuovoPazientePage() {
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <PatientForm mode="create" />
    </div>
  );
}
