import Sidebar from '@/components/medico/Sidebar';

export default function MedicoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-zinc-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
