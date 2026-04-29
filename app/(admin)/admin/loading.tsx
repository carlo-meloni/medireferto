import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboardLoading() {
  return (
    <div className="min-h-full bg-zinc-50/60 p-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-10 flex items-start justify-between">
          <div>
            <Skeleton className="h-9 w-40" />
            <Skeleton className="mt-2 h-4 w-64" />
          </div>
          <Skeleton className="hidden h-9 w-36 rounded-xl sm:block" />
        </div>

        {/* Stat cards */}
        <div className="mb-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-2xl border border-zinc-100 bg-white p-6 shadow-sm"
            >
              <div className="absolute inset-x-0 top-0 h-1 rounded-t-2xl">
                <Skeleton className="h-1 w-full rounded-none" />
              </div>
              <Skeleton className="mb-5 h-10 w-10 rounded-xl" />
              <Skeleton className="h-3 w-20" />
              <Skeleton className="mt-2 h-8 w-12" />
              <Skeleton className="mt-1 h-3 w-16" />
            </div>
          ))}
        </div>

        {/* Activity section */}
        <div>
          <div className="mb-4 flex items-center gap-2">
            <Skeleton className="h-3 w-3 rounded-full" />
            <Skeleton className="h-3 w-28" />
          </div>
          <div className="rounded-2xl border border-zinc-100 bg-white shadow-sm">
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Skeleton className="h-12 w-12 rounded-2xl" />
              <Skeleton className="h-4 w-44" />
              <Skeleton className="h-3 w-56" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
