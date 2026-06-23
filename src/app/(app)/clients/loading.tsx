import { Skeleton } from "@/components/ui";
import { PageHeaderSkeleton } from "@/components/skeletons";

export default function ClientsLoading() {
  return (
    <div>
      <PageHeaderSkeleton withAction />

      {/* Mini stat row */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card p-5">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="mt-2 h-6 w-20" />
          </div>
        ))}
      </div>

      {/* Client cards grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="card p-5">
            <div className="flex items-start gap-4">
              <Skeleton className="h-13 w-13 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            <Skeleton className="mt-4 h-2 w-full rounded-full" />
            <div className="mt-4 grid grid-cols-3 gap-2">
              <Skeleton className="h-12 rounded-lg" />
              <Skeleton className="h-12 rounded-lg" />
              <Skeleton className="h-12 rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
