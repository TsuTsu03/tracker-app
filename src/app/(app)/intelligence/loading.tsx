import { Skeleton } from "@/components/ui";
import { PageHeaderSkeleton, PanelSkeleton } from "@/components/skeletons";

export default function IntelligenceLoading() {
  return (
    <div>
      <PageHeaderSkeleton />

      {/* Ask box + suggested prompts */}
      <div className="card mb-6 p-5">
        <Skeleton className="h-11 w-full rounded-xl" />
        <div className="mt-3 flex flex-wrap gap-2">
          <Skeleton className="h-8 w-56 rounded-full" />
          <Skeleton className="h-8 w-64 rounded-full" />
          <Skeleton className="h-8 w-52 rounded-full" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <PanelSkeleton className="lg:col-span-2" bodyHeight="h-64" />
        <div className="space-y-4">
          <div className="card p-5">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="mt-2 h-7 w-28" />
          </div>
          <div className="card p-5">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="mt-2 h-7 w-28" />
          </div>
          <div className="card p-5">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="mt-2 h-7 w-28" />
          </div>
        </div>
      </div>
    </div>
  );
}
