"use client";

import Skeleton from "./skeleton.component";

export default function ProjectsListSkeleton() {
  return (
    <div className="min-h-full">
      <div className="border-b border-neutral-200 bg-white px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <Skeleton className="h-7 w-32" variant="default" />
            <Skeleton className="h-4 w-56" variant="default" />
          </div>
          <Skeleton className="h-9 w-28 rounded-lg" variant="default" />
        </div>
      </div>
      <div className="px-4 py-6 sm:px-6 lg:px-8">
        {/* Desktop table skeleton */}
        <div className="hidden overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm lg:block">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50/80">
                  {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <th key={i} className="px-4 py-3">
                      <Skeleton className="h-3 w-16" variant="default" />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="px-4 py-3">
                    <td className="px-4 py-3">
                      <Skeleton className="h-4 w-40" variant="default" />
                      <Skeleton className="mt-1 h-3 w-56" variant="default" />
                    </td>
                    <td className="px-4 py-3"><Skeleton className="h-4 w-24" variant="default" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-5 w-16 rounded-full" variant="default" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-4 w-20" variant="default" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-4 w-24" variant="default" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-4 w-8" variant="default" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-8 w-24 ml-auto" variant="default" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Mobile cards skeleton */}
        <div className="space-y-3 lg:hidden">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="overflow-hidden rounded-xl border border-neutral-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <Skeleton className="h-5 w-40" variant="default" />
                <Skeleton className="h-5 w-16 rounded-full" variant="default" />
              </div>
              <Skeleton className="mt-2 h-4 w-full" variant="default" />
              <Skeleton className="mt-2 h-4 w-3/4" variant="default" />
              <div className="mt-3 flex gap-3">
                <Skeleton className="h-3 w-12" variant="default" />
                <Skeleton className="h-3 w-16" variant="default" />
                <Skeleton className="h-3 w-14" variant="default" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
