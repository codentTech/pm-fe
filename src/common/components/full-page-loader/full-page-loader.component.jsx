"use client";

import { PanelsTopLeft } from "lucide-react";

function FullPageLoader() {
  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background-secondary"
      role="status"
      aria-label="Loading"
    >
      <div className="relative flex h-16 w-16 items-center justify-center sm:h-20 sm:w-20">
        {/* Spinner ring */}
        <svg
          className="absolute h-full w-full -rotate-90 animate-spin"
          viewBox="0 0 64 64"
          fill="none"
        >
          <circle
            cx="32"
            cy="32"
            r="28"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            className="text-primary-200"
            strokeDasharray="44 132"
          />
          <circle
            cx="32"
            cy="32"
            r="28"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            className="text-primary-600"
            strokeDasharray="44 132"
            strokeDashoffset="-88"
          />
        </svg>
        {/* Center icon */}
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-500 text-white shadow-lg shadow-primary-500/25 sm:h-10 sm:w-10">
          <PanelsTopLeft className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>
      </div>
      {/* <p className="mt-6 typography-body font-medium text-neutral-500">
        Loading…
      </p>
      <div className="mt-2 flex items-end gap-1.5">
        <span
          className="h-1.5 w-1.5 rounded-full bg-primary-400 animate-bounce"
          style={{ animationDelay: "0ms" }}
        />
        <span
          className="h-1.5 w-1.5 rounded-full bg-primary-500 animate-bounce"
          style={{ animationDelay: "150ms" }}
        />
        <span
          className="h-1.5 w-1.5 rounded-full bg-primary-600 animate-bounce"
          style={{ animationDelay: "300ms" }}
        />
      </div> */}
    </div>
  );
}

export default FullPageLoader;
