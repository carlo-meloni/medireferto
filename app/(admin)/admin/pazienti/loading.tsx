import { Skeleton } from "@/components/ui/skeleton";

export default function AdminPazientiLoading() {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Skeleton className="h-7 w-24" />
          <Skeleton className="mt-2 h-4 w-52" />
        </div>
        <Skeleton className="h-10 w-36 rounded-lg" />
      </div>

      {/* Search bar */}
      <Skeleton className="mb-6 h-10 w-full rounded-lg" />

      {/* Table */}
      <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-6 border-b border-zinc-100 bg-zinc-50 px-5 py-3 gap-4">
          {["Paziente", "Età / Sesso", "Contatti", "Ultima visita", "Visite", ""].map((col) => (
            <Skeleton key={col} className="h-3 w-16" />
          ))}
        </div>

        {/* Rows */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-6 items-center border-b border-zinc-100 px-5 py-4 gap-4 last:border-0"
          >
            <div>
              <Skeleton className="h-4 w-32" />
              <Skeleton className="mt-1.5 h-3 w-28 font-mono" />
            </div>
            <Skeleton className="h-4 w-20" />
            <div>
              <Skeleton className="h-4 w-36" />
              <Skeleton className="mt-1.5 h-3 w-24" />
            </div>
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-6" />
            <div className="flex justify-end">
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
