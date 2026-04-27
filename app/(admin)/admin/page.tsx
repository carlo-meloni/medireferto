import Link from "next/link";
import { getAdminStats } from "@/lib/db/admin";

function formatDateTime(date: Date) {
  return new Date(date).toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface StatCardProps {
  label: string;
  value: number | string;
  hint?: string;
  href?: string;
}

function StatCard({ label, value, hint, href }: StatCardProps) {
  const body = (
    <div className="rounded-xl border border-zinc-200 bg-white px-5 py-4 hover:border-zinc-300 hover:shadow-sm transition">
      <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-zinc-900">
        {value}
      </p>
      {hint && <p className="mt-1 text-xs text-zinc-400">{hint}</p>}
    </div>
  );
  return href ? <Link href={href}>{body}</Link> : body;
}

export default async function AdminDashboard() {
  const stats = await getAdminStats();

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-zinc-500">
          Panoramica del sistema
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard
          label="Medici"
          value={stats.totalDoctors}
          hint="registrati"
          href="/admin/medici"
        />
        <StatCard
          label="Pazienti"
          value={stats.totalPatients}
          hint="anagrafati"
          href="/admin/pazienti"
        />
        <StatCard
          label="Visite totali"
          value={stats.totalVisits}
          hint="dall'inizio"
        />
        <StatCard
          label="Questo mese"
          value={stats.visitsThisMonth}
          hint="visite effettuate"
        />
      </div>

      {/* attività vuota */}
      <div>
        <h2 className="text-sm font-semibold text-zinc-900 uppercase tracking-wide mb-4">
          Attività recente
        </h2>

        <div className="rounded-xl border border-zinc-200 bg-white p-5 text-sm text-zinc-400">
          Nessuna attività disponibile
        </div>
      </div>
    </div>
  );
}