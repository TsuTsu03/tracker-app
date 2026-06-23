import { Skeleton } from "./ui";

/**
 * Composed loading skeletons — each mirrors the real layout of a surface so the
 * page reserves its final shape while data streams in (no blank flash, no
 * spinner adrift). These are the building blocks the route-level `loading.tsx`
 * files assemble. Reduced-motion users get the static fill via the global
 * media query in globals.css.
 */

export function PageHeaderSkeleton({
  withAction = false,
}: {
  withAction?: boolean;
}) {
  return (
    <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
      <div className="flex items-center gap-3.5">
        <Skeleton className="h-11 w-11 rounded-xl" />
        <div className="space-y-2.5">
          <Skeleton className="h-6 w-44" />
          <Skeleton className="h-3.5 w-60" />
        </div>
      </div>
      {withAction && <Skeleton className="h-10 w-32 rounded-lg" />}
    </div>
  );
}

/** A KPI/stat card placeholder: icon chip, trailing pill, value, label, sub. */
export function KpiCardSkeleton() {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <Skeleton className="h-10 w-10 rounded-xl" />
        <Skeleton className="h-5 w-12 rounded-full" />
      </div>
      <Skeleton className="mt-4 h-7 w-24" />
      <Skeleton className="mt-2.5 h-4 w-20" />
      <Skeleton className="mt-1.5 h-3 w-14" />
    </div>
  );
}

export function KpiRowSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <KpiCardSkeleton key={i} />
      ))}
    </div>
  );
}

/** A generic panel placeholder with a heading and a body block (e.g. a chart). */
export function PanelSkeleton({
  className,
  bodyHeight = "h-56",
}: {
  className?: string;
  bodyHeight?: string;
}) {
  return (
    <div className={`card p-5 ${className ?? ""}`}>
      <div className="mb-4 flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-44" />
        </div>
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className={`w-full ${bodyHeight} rounded-lg`} />
    </div>
  );
}
