import { Skeleton } from "@/components/ui/skeleton";

export default function ModificaMedicoLoading() {
  return (
    <div className="p-8 max-w-3xl mx-auto">
      {/* Form title */}
      <Skeleton className="mb-1 h-7 w-40" />
      <Skeleton className="mb-8 h-4 w-56" />

      <div className="space-y-5">
        {/* Row: firstName + lastName */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-9 w-full rounded-md" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-9 w-full rounded-md" />
          </div>
        </div>

        {/* specialization */}
        <div className="space-y-2">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-9 w-full rounded-md" />
        </div>

        {/* licenseNumber */}
        <div className="space-y-2">
          <Skeleton className="h-3 w-36" />
          <Skeleton className="h-9 w-full rounded-md" />
        </div>

        {/* clinicName */}
        <div className="space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-9 w-full rounded-md" />
        </div>

        {/* clinicAddress */}
        <div className="space-y-2">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-9 w-full rounded-md" />
        </div>

        {/* phone */}
        <div className="space-y-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-9 w-full rounded-md" />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-9 w-20 rounded-lg" />
          <Skeleton className="h-9 w-32 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
