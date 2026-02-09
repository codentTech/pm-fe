"use client";

import Link from "next/link";
import NoResultFound from "@/common/components/no-result-found/no-result-found.jsx";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <NoResultFound
      icon={FileQuestion}
      title="Page not found"
      description="The page you're looking for doesn't exist or has been moved."
      variant="page"
      action={
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-3 typography-button text-white shadow-sm transition-colors hover:bg-primary-700"
        >
          Return home
        </Link>
      }
    />
  );
}
