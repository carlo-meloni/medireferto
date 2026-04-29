import { Skeleton } from "@/components/ui/skeleton";

export default function AdminVisitaDetailLoading() {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Back link */}
      <div className="mb-6">
        <Skeleton className="h-3 w-16" />
      </div>

      {/* Page header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <Skeleton className="h-7 w-52" />
          <div className="mt-2 flex items-center gap-3 flex-wrap">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-1 rounded-full" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-1 rounded-full" />
            <Skeleton className="h-4 w-36" />
          </div>
        </div>
        <Skeleton className="h-6 w-28 rounded-full" />
      </div>

      {/* 2-column content panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transcript panel */}
        <div className="flex flex-col gap-3">
          <Skeleton className="h-3 w-36" />
          <div className="rounded-xl border border-zinc-200 bg-white p-5 min-h-40 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/6" />
          </div>
        </div>

        {/* Report panel */}
        <div className="flex flex-col gap-3">
          <Skeleton className="h-3 w-20" />
          <div className="rounded-xl border border-zinc-200 bg-white p-5 min-h-40 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/6" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/6" />
          </div>
        </div>
      </div>
    </div>
  );
}
