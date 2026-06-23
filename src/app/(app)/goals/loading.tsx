import { Skeleton } from "@/components/ui";
import { PageHeaderSkeleton } from "@/components/skeletons";

export default function GoalsLoading() {
  return (
    <div>
      <PageHeaderSkeleton withAction />
      <div className="space-y-5">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="card p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-3.5 w-32" />
              </div>
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
            <Skeleton className="mt-6 h-3 w-full rounded-full" />
            <div className="mt-5 grid grid-cols-3 gap-3">
              <Skeleton className="h-16 rounded-lg" />
              <Skeleton className="h-16 rounded-lg" />
              <Skeleton className="h-16 rounded-lg" />
            </div>
            <Skeleton className="mt-5 h-10 w-44 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}
