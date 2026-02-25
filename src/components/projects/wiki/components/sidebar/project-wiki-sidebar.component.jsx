"use client";

import Link from "next/link";
import { Search, FileText } from "lucide-react";
import CustomInput from "@/common/components/custom-input/custom-input.component";

export default function ProjectWikiSidebar({
  projectId,
  pages,
  currentSlug = null,
  searchQuery = "",
  onSearchChange,
  showSearch = true,
  showNewPageLink = false,
  onNewPageClick,
}) {
  const hasSearchQuery = (searchQuery || "").trim().length > 0;

  return (
    <div className="space-y-5">
      <div className="rounded-xl border-2 border-neutral-200 bg-white p-4 shadow-sm">
        <p className="mb-3 typography-body font-semibold text-neutral-800">
          Pages
        </p>
        {showSearch && onSearchChange && (
          <div className="mb-3">
            <CustomInput
              name="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search wiki"
              startIcon={<Search className="h-4 w-4 text-neutral-400" />}
            />
          </div>
        )}
        {!pages?.length ? (
          <p className="py-2 typography-caption text-neutral-500">
            {hasSearchQuery ? "No matching pages." : "No pages yet."}
          </p>
        ) : (
          <ul className="max-h-[280px] space-y-0.5 overflow-y-auto">
            {pages.map((page) => {
              const isCurrent = currentSlug && page.Slug === currentSlug;
              return (
                <li key={page.Id}>
                  <Link
                    href={`/projects/${projectId}/wiki/${page.Slug}`}
                    className={`flex items-center gap-2 rounded-lg px-2.5 py-2 typography-body transition-colors ${
                      isCurrent
                        ? "bg-indigo-100 font-medium text-indigo-800"
                        : "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
                    }`}
                  >
                    <FileText className="h-4 w-4 shrink-0 text-neutral-500" />
                    <span className="min-w-0 truncate">{page.Title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
        {showNewPageLink && onNewPageClick && (
          <button
            type="button"
            onClick={onNewPageClick}
            className="mt-3 w-full rounded-lg border-2 border-dashed border-neutral-200 py-2.5 typography-body font-medium text-neutral-600 transition-colors hover:border-indigo-300 hover:bg-indigo-50/40 hover:text-indigo-700"
          >
            New page
          </button>
        )}
      </div>
    </div>
  );
}
