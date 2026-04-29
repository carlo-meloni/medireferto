import { Skeleton } from '@/components/ui/skeleton';

export default function PazientiLoading() {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-7 w-24" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="h-9 w-32 rounded-lg" />
      </div>

      {/* Search */}
      <Skeleton className="h-9 w-full rounded-lg mb-6" />

      {/* Patient list */}
      <div className="bg-white border border-zinc-200 rounded-xl divide-y">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="p-4 flex items-center justify-between">
            <div className="flex flex-col gap-1.5">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="h-3 w-44" />
          </div>
        ))}
      </div>
    </div>
  );
}
