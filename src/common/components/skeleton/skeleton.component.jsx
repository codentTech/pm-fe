"use client";

import PropTypes from "prop-types";

/**
 * Skeleton loader for loading states.
 * Use with variant for different layouts.
 */
export default function Skeleton({ className = "", variant = "default" }) {
  const baseClasses = "animate-pulse rounded bg-neutral-200";

  if (variant === "text") {
    return <div className={`h-4 ${baseClasses} ${className}`} aria-hidden />;
  }

  if (variant === "avatar") {
    return <div className={`h-10 w-10 rounded-full ${baseClasses} ${className}`} aria-hidden />;
  }

  if (variant === "card") {
    return (
      <div className={`overflow-hidden rounded-lg border border-neutral-200 bg-white ${className}`}>
        <div className={`h-1.5 ${baseClasses}`} />
        <div className="space-y-3 p-3">
          <div className={`h-4 w-3/4 ${baseClasses}`} />
          <div className={`h-3 w-full ${baseClasses}`} />
          <div className={`h-3 w-1/2 ${baseClasses}`} />
        </div>
      </div>
    );
  }

  if (variant === "table-row") {
    return (
      <div className={`flex gap-4 border-b border-neutral-100 px-6 py-4 ${className}`}>
        <div className={`h-4 flex-1 ${baseClasses}`} />
        <div className={`h-4 w-24 ${baseClasses}`} />
        <div className={`h-4 w-24 ${baseClasses}`} />
        <div className={`h-4 w-16 ${baseClasses}`} />
      </div>
    );
  }

  return <div className={`${baseClasses} ${className}`} aria-hidden />;
}

Skeleton.propTypes = {
  className: PropTypes.string,
  variant: PropTypes.oneOf(["default", "text", "avatar", "card", "table-row"]),
};
