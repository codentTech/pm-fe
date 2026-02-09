"use client";

import { SKELETON_COLORS } from "@/common/constants/colors.constant";
import Skeleton from "./skeleton.component";

export default function BoardsListSkeleton() {
  return (
    <div className="min-h-full p-4 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3 sm:mb-5">
        <div className="min-w-0 space-y-2">
          <Skeleton className="h-7 w-40" variant="default" />
          <Skeleton className="h-4 w-56" variant="default" />
        </div>
        <Skeleton className="h-9 w-32 rounded-lg" variant="default" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="flex flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white"
          >
            <div className={`h-1.5 animate-pulse ${SKELETON_COLORS[i % SKELETON_COLORS.length]}`} />
            <div className="flex flex-col gap-2 p-3">
              <Skeleton className="h-4 w-3/4" variant="default" />
              <Skeleton className="h-3 w-full" variant="default" />
              <Skeleton className="h-3 w-1/2" variant="default" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
