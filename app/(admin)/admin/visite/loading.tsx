import { Skeleton } from "@/components/ui/skeleton";

export default function AdminVisiteLoading() {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Skeleton className="h-7 w-20" />
        <Skeleton className="mt-2 h-4 w-44" />
      </div>

      {/* Table */}
      <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-5 border-b border-zinc-100 bg-zinc-50 px-5 py-3 gap-4">
          {["Data visita", "Paziente", "Medico", "Stato", ""].map((col) => (
            <Skeleton key={col} className="h-3 w-20" />
          ))}
        </div>

        {/* Rows */}
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-5 items-center border-b border-zinc-100 px-5 py-4 gap-4 last:border-0"
          >
            <Skeleton className="h-4 w-24" />
            <div>
              <Skeleton className="h-4 w-36" />
              <Skeleton className="mt-1.5 h-3 w-28" />
            </div>
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-5 w-28 rounded-full" />
            <div className="flex justify-end">
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
