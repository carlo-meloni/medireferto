import PatientForm from '@/components/medico/PatientForm';

export default function NuovoPazientePage() {
  return (
    <div className="min-h-full px-6 py-8 md:px-10 md:py-10">
      <div className="max-w-2xl mx-auto">
        <PatientForm mode="create" />
      </div>
    </div>
  );
}
