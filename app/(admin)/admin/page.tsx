import Link from "next/link";
import { Activity, CalendarDays, ClipboardList, Stethoscope, Users } from "lucide-react";
import { getAdminStats } from "@/lib/db/admin";

interface StatCardProps {
  label: string;
  value: number | string;
  hint?: string;
  href?: string;
  icon: React.ReactNode;
  stripClass: string;
  iconBgClass: string;
  iconColorClass: string;
  delay?: number;
}

function StatCard({
  label,
  value,
  hint,
  href,
  icon,
  stripClass,
  iconBgClass,
  iconColorClass,
  delay = 0,
}: StatCardProps) {
  const body = (
    <div
      className="group relative overflow-hidden rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`absolute inset-x-0 top-0 h-1 ${stripClass}`} />
      <div
        className={`mb-5 inline-flex items-center justify-center rounded-xl p-2.5 ${iconBgClass}`}
      >
        <span className={iconColorClass}>{icon}</span>
      </div>
      <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
        {label}
      </p>
      <p className="mt-1.5 text-3xl font-bold tabular-nums text-zinc-900">{value}</p>
      {hint && <p className="mt-1 text-xs text-zinc-400">{hint}</p>}
      {href && (
        <p className="mt-5 text-xs font-medium text-zinc-300 transition-colors group-hover:text-zinc-500">
          Visualizza tutto{" "}
          <span className="inline-block transition-transform group-hover:translate-x-0.5">
            →
          </span>
        </p>
      )}
    </div>
  );
  return href ? <Link href={href}>{body}</Link> : body;
}

export default async function AdminDashboard() {
  const stats = await getAdminStats();

  return (
    <div className="min-h-full bg-zinc-50/60 p-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-10 flex items-start justify-between animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Dashboard</h1>
            <p className="mt-1.5 text-sm text-zinc-500">Panoramica del sistema Doctor Twin</p>
          </div>
          <div className="hidden items-center gap-2 rounded-xl border border-zinc-100 bg-white px-4 py-2 shadow-sm sm:flex">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
            <span className="text-xs font-medium text-zinc-500">Sistema attivo</span>
          </div>
        </div>

        {/* Stat cards */}
        <div className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            label="Medici"
            value={stats.totalDoctors}
            hint="registrati"
            href="/admin/medici"
            icon={<Stethoscope size={18} />}
            stripClass="bg-blue-500"
            iconBgClass="bg-blue-50"
            iconColorClass="text-blue-500"
            delay={0}
          />
          <StatCard
            label="Pazienti"
            value={stats.totalPatients}
            hint="anagrafati"
            href="/admin/pazienti"
            icon={<Users size={18} />}
            stripClass="bg-emerald-500"
            iconBgClass="bg-emerald-50"
            iconColorClass="text-emerald-500"
            delay={75}
          />
          <StatCard
            label="Visite totali"
            value={stats.totalVisits}
            hint="dall'inizio"
            icon={<ClipboardList size={18} />}
            stripClass="bg-violet-500"
            iconBgClass="bg-violet-50"
            iconColorClass="text-violet-500"
            delay={150}
          />
          <StatCard
            label="Questo mese"
            value={stats.visitsThisMonth}
            hint="visite effettuate"
            icon={<CalendarDays size={18} />}
            stripClass="bg-amber-500"
            iconBgClass="bg-amber-50"
            iconColorClass="text-amber-500"
            delay={225}
          />
        </div>

        {/* Recent activity */}
        <div className="animate-slide-up" style={{ animationDelay: "300ms" }}>
          <div className="mb-4 flex items-center gap-2">
            <Activity size={13} className="text-zinc-400" />
            <h2 className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
              Attività recente
            </h2>
          </div>
          <div className="rounded-2xl border border-zinc-100 bg-white shadow-sm">
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-50">
                <Activity size={20} className="text-zinc-300" />
              </div>
              <p className="text-sm font-medium text-zinc-400">Nessuna attività disponibile</p>
              <p className="mt-1 text-xs text-zinc-300">Le attività recenti appariranno qui</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
