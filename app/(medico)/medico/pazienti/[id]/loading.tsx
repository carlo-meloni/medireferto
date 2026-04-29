import { Skeleton } from '@/components/ui/skeleton';

export default function PazienteDetailLoading() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Back link */}
      <Skeleton className="h-4 w-28 mb-4" />

      {/* Patient card */}
      <div className="rounded-xl border border-zinc-200 bg-white p-6 mb-6 mt-4">
        <Skeleton className="h-7 w-52 mb-1" />
        <Skeleton className="h-4 w-36 mb-4" />

        <div className="grid grid-cols-2 gap-4 mt-4">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-44" />
        </div>
      </div>

      {/* Visits section */}
      <Skeleton className="h-5 w-36 mb-4" />

      <div className="flex flex-col gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="border rounded-lg p-4 flex items-center justify-between"
          >
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-5 w-20 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
