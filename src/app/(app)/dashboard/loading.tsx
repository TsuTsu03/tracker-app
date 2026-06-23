import { Skeleton } from "@/components/ui";
import { KpiRowSkeleton, PanelSkeleton } from "@/components/skeletons";

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="space-y-2.5">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-80" />
      </div>

      <KpiRowSkeleton />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <PanelSkeleton className="lg:col-span-2" bodyHeight="h-64" />
        <PanelSkeleton bodyHeight="h-60" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <PanelSkeleton bodyHeight="h-48" />
        <PanelSkeleton bodyHeight="h-48" />
        <PanelSkeleton bodyHeight="h-48" />
      </div>
    </div>
  );
}
