"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Users } from "lucide-react";
import { formatDate, calcAge } from "@/lib/utils";
import { GENDER_LABEL } from "@/app/constants";
import type { getPatients } from "@/lib/db/patient";

type Patient = Awaited<ReturnType<typeof getPatients>>[number];

interface PazientiTableClientProps {
  patients: Patient[];
  emptyMessage: string;
  showAddLink: boolean;
}

export function PazientiTableClient({
  patients,
  emptyMessage,
  showAddLink,
}: PazientiTableClientProps) {
  const router = useRouter();

  if (patients.length === 0) {
    return (
      <tr>
        <td colSpan={6} className="px-5 py-16 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-50">
              <Users size={20} className="text-zinc-300" />
            </div>
            <p className="text-sm font-medium text-zinc-400">{emptyMessage}</p>
            {showAddLink && (
              <Link
                href="/admin/pazienti/nuovo"
                className="mt-1 text-xs font-medium text-indigo-600 hover:text-indigo-700"
              >
                Aggiungi il primo paziente →
              </Link>
            )}
          </div>
        </td>
      </tr>
    );
  }

  return patients.map((patient) => {
    const lastVisit = patient.visits[0];
    const initials =
      `${patient.firstName[0] ?? ""}${patient.lastName[0] ?? ""}`.toUpperCase();

    return (
      <tr
        key={patient.id}
        className="group cursor-pointer transition-colors duration-150 hover:bg-emerald-50/40"
        onClick={() => router.push(`/admin/pazienti/${patient.id}`)}
      >
        <td className="px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[11px] font-bold text-emerald-600">
              {initials}
            </div>
            <div>
              <p className="font-medium text-zinc-900">
                {patient.lastName} {patient.firstName}
              </p>
              <p className="mt-0.5 font-mono text-[11px] text-zinc-400">
                {patient.fiscalCode}
              </p>
            </div>
          </div>
        </td>

        <td className="px-5 py-4">
          {patient.gender ? (
            <span className="inline-flex items-center rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600">
              {calcAge(patient.birthDate)} · {GENDER_LABEL[patient.gender]}
            </span>
          ) : (
            <span className="text-zinc-400">
              {calcAge(patient.birthDate) || "—"}
            </span>
          )}
        </td>

        <td className="hidden px-5 py-4 md:table-cell">
          <p className="font-medium text-zinc-700">{patient.email || "—"}</p>
          <p className="mt-0.5 text-xs text-zinc-400">{patient.phone || "—"}</p>
        </td>

        <td className="hidden px-5 py-4 text-zinc-500 lg:table-cell">
          {lastVisit ? formatDate(lastVisit.visitDate) : "—"}
        </td>

        <td className="hidden px-5 py-4 lg:table-cell">
          {patient.visits.length > 0 ? (
            <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">
              {patient.visits.length}
            </span>
          ) : (
            <span className="text-zinc-400">0</span>
          )}
        </td>

        <td className="px-5 py-4 text-right">
          <Link
            href={`/admin/pazienti/${patient.id}`}
            className="text-xs font-medium text-indigo-600 transition-colors hover:text-indigo-800"
            onClick={(e) => e.stopPropagation()}
          >
            Modifica{" "}
            <span className="inline-block transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </Link>
        </td>
      </tr>
    );
  });
}
