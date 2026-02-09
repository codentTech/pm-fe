"use client";

import Skeleton from "./skeleton.component";

export default function TodoTrackerSkeleton() {
  return (
    <div className="min-h-full p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3 sm:mb-5">
        <div className="min-w-0 space-y-2">
          <Skeleton className="h-7 w-32" variant="default" />
          <Skeleton className="h-4 w-48" variant="default" />
        </div>
        <Skeleton className="h-9 w-28 rounded-lg" variant="default" />
      </div>
      <div className="mb-4 rounded-lg border border-neutral-200 bg-white p-2">
        <div className="flex flex-wrap items-center gap-2">
          <Skeleton className="h-8 w-20" variant="default" />
          <Skeleton className="h-8 flex-1 min-w-[140px] max-w-[200px] rounded-md" variant="default" />
          <Skeleton className="h-8 w-24 rounded-md" variant="default" />
          <Skeleton className="h-8 w-28 rounded-md" variant="default" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="flex min-w-0 flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white"
          >
            <div className="h-1 animate-pulse bg-primary-200" />
            <div className="border-b border-neutral-100 px-3 py-2.5">
              <Skeleton className="h-4 w-24" variant="default" />
            </div>
            <div className="space-y-2 p-2.5">
              <Skeleton className="h-8 w-full rounded-md" variant="default" />
              <Skeleton className="h-8 w-4/5 rounded-md" variant="default" />
              <Skeleton className="h-8 w-3/4 rounded-md" variant="default" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
