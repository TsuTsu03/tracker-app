import { Skeleton } from "@/components/ui";
import { PageHeaderSkeleton } from "@/components/skeletons";

export default function LeadsLoading() {
  return (
    <div>
      <PageHeaderSkeleton withAction />

      {/* Controls row: search + filter chips + sort */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Skeleton className="h-10 min-w-[220px] flex-1 rounded-xl" />
        <Skeleton className="h-10 w-44 rounded-xl" />
        <Skeleton className="h-10 w-32 rounded-xl" />
      </div>

      {/* Lead cards grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="card p-5">
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
              <Skeleton className="h-14 w-14 rounded-full" />
            </div>
            <div className="mt-4 flex items-center gap-2">
              <Skeleton className="h-5 w-14 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
