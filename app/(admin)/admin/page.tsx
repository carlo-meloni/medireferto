import Link from 'next/link';
import {
  MOCK_ADMIN_ACTIVITY,
  MOCK_ADMIN_STATS,
  type AdminActivityType,
} from '@/lib/mocked-data';

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleDateString('it-IT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const ACTIVITY_META: Record<AdminActivityType, { label: string; dotClass: string }> = {
  doctor_added: { label: 'Nuovo medico', dotClass: 'bg-indigo-500' },
  patient_added: { label: 'Nuovo paziente', dotClass: 'bg-blue-500' },
  visit_approved: { label: 'Referto approvato', dotClass: 'bg-emerald-500' },
};

interface StatCardProps {
  label: string;
  value: number | string;
  hint?: string;
  href?: string;
}

function StatCard({ label, value, hint, href }: StatCardProps) {
  const body = (
    <div className="rounded-xl border border-zinc-200 bg-white px-5 py-4 hover:border-zinc-300 hover:shadow-sm transition">
      <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-zinc-900">{value}</p>
      {hint && <p className="mt-1 text-xs text-zinc-400">{hint}</p>}
    </div>
  );
  return href ? <Link href={href}>{body}</Link> : body;
}

export default function AdminDashboard() {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-zinc-900 tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-zinc-500">Panoramica del sistema</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard
          label="Medici"
          value={MOCK_ADMIN_STATS.totalDoctors}
          hint="registrati"
          href="/admin/medici"
        />
        <StatCard
          label="Pazienti"
          value={MOCK_ADMIN_STATS.totalPatients}
          hint="anagrafati"
          href="/admin/pazienti"
        />
        <StatCard
          label="Visite totali"
          value={MOCK_ADMIN_STATS.totalVisits}
          hint="dall'inizio"
        />
        <StatCard
          label="Questo mese"
          value={MOCK_ADMIN_STATS.visitsThisMonth}
          hint="visite effettuate"
        />
      </div>

      <div>
        <h2 className="text-sm font-semibold text-zinc-900 uppercase tracking-wide mb-4">
          Attività recente
        </h2>
        <div className="rounded-xl border border-zinc-200 bg-white divide-y divide-zinc-100 overflow-hidden">
          {MOCK_ADMIN_ACTIVITY.map((activity) => {
            const meta = ACTIVITY_META[activity.type];
            return (
              <div key={activity.id} className="flex items-start gap-4 px-5 py-4">
                <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${meta.dotClass}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide">
                    {meta.label}
                  </p>
                  <p className="mt-0.5 text-sm text-zinc-900">{activity.description}</p>
                </div>
                <span className="text-xs text-zinc-400 shrink-0">
                  {formatDateTime(activity.timestamp)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
