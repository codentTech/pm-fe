"use client";

import Skeleton from "./skeleton.component";

export default function KpiTableSkeleton() {
  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 space-y-2">
          <Skeleton className="h-7 w-28" variant="default" />
          <Skeleton className="h-4 w-40" variant="default" />
        </div>
        <Skeleton className="h-10 w-24 rounded-xl" variant="default" />
      </div>
      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <div className="border-b border-neutral-200 bg-neutral-50 px-6 py-3">
          <div className="flex gap-4">
            <Skeleton className="h-4 w-20" variant="default" />
            <Skeleton className="h-4 w-16" variant="default" />
            <Skeleton className="h-4 w-16" variant="default" />
            <Skeleton className="h-4 w-20" variant="default" />
            <Skeleton className="h-4 w-16" variant="default" />
            <Skeleton className="h-4 w-16" variant="default" />
          </div>
        </div>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <Skeleton key={i} variant="table-row" />
        ))}
      </div>
    </div>
  );
}
