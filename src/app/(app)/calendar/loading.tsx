import { Skeleton } from "@/components/ui";
import { PageHeaderSkeleton } from "@/components/skeletons";

export default function CalendarLoading() {
  return (
    <div>
      <PageHeaderSkeleton withAction />

      {/* Toolbar */}
      <div className="mb-4 flex items-center justify-between">
        <Skeleton className="h-9 w-52 rounded-lg" />
        <Skeleton className="h-9 w-40 rounded-lg" />
      </div>

      {/* Month grid */}
      <div className="card p-4">
        <div className="mb-2 grid grid-cols-7 gap-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-10" />
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 35 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
