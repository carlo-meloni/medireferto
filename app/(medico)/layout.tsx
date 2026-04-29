import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import Sidebar from '@/components/medico/Sidebar';

export default async function MedicoLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const doctor = session?.user?.id
    ? await prisma.doctor.findFirst({
        where: { userId: session.user.id },
        select: { firstName: true, lastName: true, specialization: true },
      })
    : null;

  console.log('session?', session)

  return (
    <div className="flex h-screen bg-zinc-50">
      <Sidebar doctor={doctor} />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
