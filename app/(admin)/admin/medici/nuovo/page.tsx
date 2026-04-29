import DoctorForm from '@/components/admin/DoctorForm';

export default function NuovoMedicoPage() {
  return (
    <div className="min-h-full bg-zinc-50/60 p-8">
      <div className="mx-auto max-w-3xl">
        <DoctorForm mode="create" />
      </div>
    </div>
  );
}
