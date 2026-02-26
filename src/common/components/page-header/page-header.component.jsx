"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import PropTypes from "prop-types";

export default function PageHeader({
  backLink = null,
  title,
  subtitle,
  actions,
  className = "",
}) {
  return (
    <div
      className={`w-full border-b border-neutral-200 bg-white mb-4 sm:mb-5 ${className}`}
      role="banner"
    >
      <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-2">
        {/* Left block */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Back */}
          {backLink?.href && (
            <Link
              href={backLink.href}
              className="flex h-8 w-8 items-center justify-center rounded-md border bg-black text-white hover:bg-neutral-50 transition"
              aria-label={backLink.label || "Back"}
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
          )}

          {/* Divider */}
          {backLink?.href && <span className="h-5 w-px bg-black" />}

          {/* Title block */}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="truncate text-sm font-bold text-indigo-600">
                {title}
              </h1>
            </div>
            {subtitle && (
              <p className="truncate text-xs text-neutral-500 leading-tight">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right block */}
        {actions && (
          <div className="flex items-center gap-2 shrink-0">{actions}</div>
        )}
      </div>
    </div>
  );
}

PageHeader.propTypes = {
  backLink: PropTypes.shape({
    href: PropTypes.string.isRequired,
    label: PropTypes.string,
  }),
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  actions: PropTypes.node,
  className: PropTypes.string,
};
