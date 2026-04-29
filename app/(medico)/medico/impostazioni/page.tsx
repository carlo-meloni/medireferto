import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { User, Building2, Lock } from 'lucide-react';
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
    <div className="group flex flex-col gap-1 p-3 rounded-lg hover:bg-zinc-50 transition-colors duration-150">
      <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest">{label}</span>
      <span className="text-sm font-medium text-zinc-800">{value || <span className="text-zinc-300">—</span>}</span>
    </div>
  );
}

function SectionHeader({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description?: string }) {
  return (
    <div className="flex items-start gap-3 pb-4 border-b border-zinc-100">
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-100 text-zinc-600 shrink-0 mt-0.5">
        <Icon size={15} />
      </div>
      <div>
        <h2 className="text-sm font-semibold text-zinc-900 leading-snug">{title}</h2>
        {description && <p className="mt-0.5 text-xs text-zinc-500">{description}</p>}
      </div>
    </div>
  );
}

export default async function ImpostazioniPage() {
  const session = await auth();
  const doctor = session?.user?.id ? await getDoctorProfile(session.user.id) : null;

  const initials = doctor
    ? `${doctor.firstName?.[0] ?? ''}${doctor.lastName?.[0] ?? ''}`.toUpperCase()
    : '?';

  const fullName = doctor ? `${doctor.firstName} ${doctor.lastName}` : 'Medico';

  return (
    <div className="p-8 max-w-2xl mx-auto flex flex-col gap-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-zinc-900 text-white text-lg font-bold tracking-tight shadow-sm shrink-0">
          {initials}
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight leading-none">{fullName}</h1>
          <p className="mt-1.5 text-sm text-zinc-500">
            {doctor?.specialization ?? 'Impostazioni profilo e sicurezza'}
          </p>
        </div>
      </div>

      {/* Profile section */}
      <section
        className="bg-white rounded-2xl border border-zinc-200 p-6 flex flex-col gap-5 shadow-[0_1px_4px_0_rgba(0,0,0,0.04)] animate-[slide-up_0.3s_ease-out_0.05s_both]"
      >
        <SectionHeader icon={User} title="Profilo medico" description="Le tue informazioni personali e di studio" />

        <div>
          <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest px-3 mb-1">Informazioni personali</p>
          <div className="grid grid-cols-2 gap-1">
            <Field label="Nome" value={doctor?.firstName} />
            <Field label="Cognome" value={doctor?.lastName} />
            <Field label="Email" value={doctor?.user?.email} />
            <Field label="Telefono" value={doctor?.phone} />
            <Field label="Specializzazione" value={doctor?.specialization} />
            <Field label="Numero albo" value={doctor?.licenseNumber} />
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 px-3 mb-1">
            <Building2 size={12} className="text-zinc-400" />
            <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest">Studio medico</p>
          </div>
          <div className="grid grid-cols-2 gap-1">
            <Field label="Nome studio" value={doctor?.clinicName} />
            <Field label="Indirizzo" value={doctor?.clinicAddress} />
          </div>
        </div>
      </section>

      {/* Password section */}
      <section
        className="bg-white rounded-2xl border border-zinc-200 p-6 flex flex-col gap-5 shadow-[0_1px_4px_0_rgba(0,0,0,0.04)] animate-[slide-up_0.3s_ease-out_0.12s_both]"
      >
        <SectionHeader icon={Lock} title="Sicurezza" description="Aggiorna la password del tuo account" />
        <ChangePasswordForm />
      </section>
    </div>
  );
}
