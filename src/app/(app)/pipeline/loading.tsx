import { Skeleton } from "@/components/ui";
import { PageHeaderSkeleton } from "@/components/skeletons";

export default function PipelineLoading() {
  return (
    <div>
      <PageHeaderSkeleton />

      {/* Kanban columns */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {Array.from({ length: 5 }).map((_, col) => (
          <div key={col} className="w-72 shrink-0">
            <div className="card border-t-2 border-t-slate-200 p-3">
              <div className="mb-3 flex items-center justify-between">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-8" />
              </div>
              <div className="space-y-2.5">
                {Array.from({ length: 3 - (col % 2) }).map((_, i) => (
                  <div key={i} className="rounded-xl border border-hairline p-3">
                    <div className="flex items-center gap-2.5">
                      <Skeleton className="h-9 w-9 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-3.5 w-24" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                    <Skeleton className="mt-3 h-3 w-20" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
