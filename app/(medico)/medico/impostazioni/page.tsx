import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import ChangePasswordForm from './ChangePasswordForm';

async function getDoctorProfile(userId: string) {
  return prisma.doctor.findFirst({
    where: { userId },
    select: {
      firstName: true,
      lastName: true,
      specialization: true,
      licenseNumber: true,
      clinicName: true,
      clinicAddress: true,
      phone: true,
      user: { select: { email: true } },
    },
  });
}

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide">{label}</span>
      <span className="text-sm text-zinc-900">{value || '—'}</span>
    </div>
  );
}

export default async function ImpostazioniPage() {
  const session = await auth();
  const doctor = session?.user?.id ? await getDoctorProfile(session.user.id) : null;

  return (
    <div className="p-8 max-w-2xl mx-auto flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">Impostazioni</h1>
        <p className="mt-1 text-sm text-zinc-500">Dati del tuo profilo e sicurezza dell&apos;account</p>
      </div>

      {/* Profile section */}
      <section className="bg-white rounded-xl border border-zinc-200 p-6 flex flex-col gap-6">
        <h2 className="text-base font-semibold text-zinc-900">Profilo medico</h2>

        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <Field label="Nome" value={doctor?.firstName} />
          <Field label="Cognome" value={doctor?.lastName} />
          <Field label="Email" value={doctor?.user?.email} />
          <Field label="Specializzazione" value={doctor?.specialization} />
          <Field label="Numero albo" value={doctor?.licenseNumber} />
          <Field label="Telefono" value={doctor?.phone} />
          <Field label="Nome studio" value={doctor?.clinicName} />
          <Field label="Indirizzo studio" value={doctor?.clinicAddress} />
        </div>
      </section>

      {/* Password section */}
      <section className="bg-white rounded-xl border border-zinc-200 p-6 flex flex-col gap-6">
        <div>
          <h2 className="text-base font-semibold text-zinc-900">Cambia password</h2>
          <p className="mt-1 text-sm text-zinc-500">La nuova password deve essere di almeno 8 caratteri</p>
        </div>
        <ChangePasswordForm />
      </section>
    </div>
  );
}
