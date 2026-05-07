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
    <div className="group flex flex-col gap-1 px-3 py-2.5 rounded-lg border border-transparent hover:border-blue-100 hover:bg-blue-50/40 transition-all duration-150">
      <span className="text-[10.5px] font-semibold text-zinc-400 uppercase tracking-widest group-hover:text-blue-500 transition-colors duration-150">
        {label}
      </span>
      <span className="text-sm font-medium text-zinc-800">
        {value || <span className="text-zinc-300 italic text-xs font-normal">Non impostato</span>}
      </span>
    </div>
  );
}

function SectionHeader({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description?: string }) {
  return (
    <div className="flex items-start gap-3 pb-4 border-b border-zinc-100">
      <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-blue-50 text-blue-600 shrink-0 mt-0.5 shadow-sm ring-1 ring-blue-100">
        <Icon size={16} />
      </div>
      <div>
        <h2 className="text-sm font-semibold text-zinc-900 leading-snug">{title}</h2>
        {description && <p className="mt-0.5 text-xs text-zinc-500">{description}</p>}
      </div>
    </div>
  );
}

function SubSectionLabel({ icon: Icon, label }: { icon?: React.ElementType; label: string }) {
  return (
    <div className="flex items-center gap-1.5 px-3 mb-1.5">
      {Icon && <Icon size={11} className="text-zinc-400" />}
      <p className="text-[10.5px] font-semibold text-zinc-400 uppercase tracking-widest">{label}</p>
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
    <div className="min-h-full bg-zinc-50/60 animate-fade-in">
      {/* Page header band */}
      <div className="bg-white border-b border-zinc-100 px-8 py-7 shadow-[0_1px_0_0_rgba(0,0,0,0.03)]">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <div className="relative shrink-0">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-linear-to-br from-blue-500 to-indigo-600 text-white text-lg font-bold tracking-tight shadow-md ring-2 ring-white">
              {initials}
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 ring-2 ring-white shadow-sm" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-zinc-900 tracking-tight leading-none">{fullName}</h1>
            <p className="mt-1.5 text-sm text-zinc-500">
              {doctor?.specialization ?? 'Impostazioni profilo e sicurezza'}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-8 max-w-2xl mx-auto flex flex-col gap-5">
        {/* Profile section */}
        <section className="bg-white rounded-2xl border border-zinc-200/80 overflow-hidden shadow-[0_2px_8px_0_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_0_rgba(0,0,0,0.07)] transition-shadow duration-300 animate-[slide-up_0.3s_ease-out_0.05s_both]">
          <div className="h-1 w-full bg-linear-to-r from-blue-500 to-indigo-500" />
          <div className="p-6 flex flex-col gap-5">
            <SectionHeader icon={User} title="Profilo medico" description="Le tue informazioni personali e di studio" />

            <div>
              <SubSectionLabel label="Informazioni personali" />
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
              <SubSectionLabel icon={Building2} label="Studio medico" />
              <div className="grid grid-cols-2 gap-1">
                <Field label="Nome studio" value={doctor?.clinicName} />
                <Field label="Indirizzo" value={doctor?.clinicAddress} />
              </div>
            </div>
          </div>
        </section>

        {/* Password section */}
        <section className="bg-white rounded-2xl border border-zinc-200/80 overflow-hidden shadow-[0_2px_8px_0_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_0_rgba(0,0,0,0.07)] transition-shadow duration-300 animate-[slide-up_0.3s_ease-out_0.15s_both]">
          <div className="h-1 w-full bg-linear-to-r from-violet-500 to-purple-500" />
          <div className="p-6 flex flex-col gap-5">
            <SectionHeader icon={Lock} title="Sicurezza" description="Aggiorna la password del tuo account" />
            <ChangePasswordForm />
          </div>
        </section>
      </div>
    </div>
  );
}
