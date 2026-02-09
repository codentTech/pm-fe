"use client";

import { useEffect } from "react";
import Link from "next/link";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import { AlertTriangle } from "lucide-react";

/**
 * Next.js App Router error.jsx - catches errors in the route segment.
 * Renders when an error is thrown in a child component.
 */
export default function Error({ error, reset }) {
  useEffect(() => {
    if (typeof window !== "undefined" && window.console?.error) {
      console.error("Route error:", error);
    }
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12 sm:py-16">
      <div className="flex w-full max-w-md flex-col items-center rounded-xl border-2 border-dashed border-danger-200 bg-danger-50/50 px-6 py-12 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-danger-100 text-danger-600">
          <AlertTriangle className="h-8 w-8" aria-hidden />
        </div>
        <h1 className="typography-h2 text-neutral-800">Something went wrong</h1>
        <p className="mt-2 typography-body text-neutral-600">
          An unexpected error occurred. Please try again or return home.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <CustomButton
            text="Try again"
            variant="primary"
            onClick={reset}
            className="rounded-lg px-5 py-2.5"
          />
          <Link href="/">
            <CustomButton
              text="Go to home"
              variant="secondary"
              className="rounded-lg px-5 py-2.5"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
