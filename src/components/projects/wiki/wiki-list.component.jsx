"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, BookOpen, ChevronRight, FileText, Plus } from "lucide-react";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import NoResultFound from "@/common/components/no-result-found/no-result-found.jsx";
import useProjectWiki from "./use-wiki.hook";
import {
  WIKI_SEPARATOR_COLORS,
  formatRelativeTime,
  stripMarkdown,
} from "./wiki.utils";

export default function ProjectWikiList({ projectId }) {
  const router = useRouter();
  const {
    pages,
    displayPages,
    searchQuery,
    setSearchQuery,
    searchPagesLoading,
    fetchPagesLoading,
    currentProject,
    isAdmin,
  } = useProjectWiki({ projectId });

  const projectName = currentProject?.Name ?? "Project";
  const hasPages = pages.length > 0;
  const initialLoading = fetchPagesLoading;

  const skeletonRows = useMemo(() => [1, 2, 3, 4], []);

  return (
    <div className="min-h-full">
      <div className="page-header-bar">
        <Link
          href={`/projects/${projectId}`}
          className="flex shrink-0 items-center gap-1.5 typography-body font-medium text-neutral-600 transition-colors hover:text-neutral-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to project
        </Link>
        <div className="page-header-divider" />
        <div className="min-w-0 flex-1 overflow-hidden">
          <h1 className="page-header-title">Project wiki</h1>
          <p className="page-header-subtitle">{projectName}</p>
        </div>
        {isAdmin && (
          <CustomButton
            type="button"
            text="New page"
            variant="primary"
            size="sm"
            startIcon={<Plus className="h-4 w-4" />}
            onClick={() => router.push(`/projects/${projectId}/wiki/new`)}
            className="shrink-0"
          />
        )}
      </div>

      <div className="page-separator" aria-hidden>
        <span className="page-separator-line" />
        <span className="flex gap-1">
          {WIKI_SEPARATOR_COLORS.map((color, i) => (
            <span
              key={i}
              className={`page-separator-dot bg-gradient-to-br ${color}`}
            />
          ))}
        </span>
        <span className="page-separator-line" />
      </div>

      <div className="px-4 pb-8 sm:px-5">
        <div className="mx-auto max-w-3xl">
          {initialLoading ? (
            <div className="rounded-xl border-2 border-neutral-200 bg-white shadow-sm">
              {skeletonRows.map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 border-b border-neutral-100 px-4 py-4 last:border-b-0 sm:px-5"
                >
                  <div className="h-9 w-9 shrink-0 rounded-lg bg-neutral-100 animate-pulse" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="h-4 w-48 rounded bg-neutral-100 animate-pulse" />
                    <div className="h-3 w-full max-w-sm rounded bg-neutral-50 animate-pulse" />
                  </div>
                  <div className="h-3 w-16 shrink-0 rounded bg-neutral-50 animate-pulse" />
                </div>
              ))}
            </div>
          ) : !hasPages ? (
            <div className="rounded-xl border-2 border-neutral-200 bg-white p-8">
              <NoResultFound
                icon={BookOpen}
                title="No wiki pages yet"
                description={
                  isAdmin
                    ? "Create the first page to document this project."
                    : "Ask an org admin to create the first wiki page."
                }
                variant="compact"
              />
              {isAdmin && (
                <div className="mt-6 flex justify-center">
                  <CustomButton
                    type="button"
                    text="Create first page"
                    variant="primary"
                    size="sm"
                    startIcon={<Plus className="h-4 w-4" />}
                    onClick={() =>
                      router.push(`/projects/${projectId}/wiki/new`)
                    }
                  />
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="mb-4">
                <CustomInput
                  name="wikiSearch"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search wiki…"
                  startIcon={<span className="text-neutral-400">⌕</span>}
                />
              </div>
              <div className="rounded-xl border-2 border-neutral-200 bg-white overflow-hidden">
                {displayPages.length === 0 ? (
                  <div className="px-5 py-8 text-center">
                    <p className="typography-body text-neutral-600">
                      No matching pages.
                    </p>
                    <p className="mt-1 typography-caption text-neutral-500">
                      Try a different search or create a new page.
                    </p>
                  </div>
                ) : (
                  <ul className="divide-y divide-neutral-100">
                    {displayPages.map((page) => {
                      const excerpt = stripMarkdown(page.Content || "").slice(
                        0,
                        120,
                      );
                      return (
                        <li key={page.Id}>
                          <Link
                            href={`/projects/${projectId}/wiki/${page.Slug}`}
                            className="flex items-start gap-4 px-4 py-3 transition-colors hover:bg-neutral-50/80 sm:px-5"
                          >
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                              <FileText className="h-4 w-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-neutral-800 truncate">
                                {page.Title}
                              </p>
                              {excerpt && (
                                <p className="mt-0.5 line-clamp-2 typography-caption text-neutral-500">
                                  {excerpt}
                                  {excerpt.length >= 120 ? "…" : ""}
                                </p>
                              )}
                            </div>
                            <p className="shrink-0 typography-caption text-neutral-400">
                              {formatRelativeTime(page.UpdatedAt)}
                            </p>
                            <ChevronRight className="h-4 w-4 shrink-0 text-neutral-300" />
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
              {searchPagesLoading && (
                <p className="mt-2 typography-caption text-neutral-500">
                  Searching…
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
