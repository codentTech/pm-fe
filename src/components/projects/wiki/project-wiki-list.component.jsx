"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, Plus } from "lucide-react";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import NoResultFound from "@/common/components/no-result-found/no-result-found.jsx";
import useProjectWiki from "./use-project-wiki.hook";

export default function ProjectWikiList({ projectId }) {
  const router = useRouter();
  const { pages, isAdmin } = useProjectWiki({ projectId });

  return (
    <div className="min-h-full">
      <div className="page-header-bar px-4 sm:px-5">
        <div className="page-header-divider" />
        <div className="min-w-0 flex-1 overflow-hidden">
          <h1 className="page-header-title">Project wiki</h1>
          <p className="page-header-subtitle">
            Capture shared knowledge for this project.
          </p>
        </div>
        {isAdmin && (
          <CustomButton
            text="New page"
            onClick={() => router.push(`/projects/${projectId}/wiki/new`)}
            variant="primary"
            size="sm"
            startIcon={<Plus className="h-4 w-4" />}
            className="shrink-0 rounded-lg px-3 py-1.5 typography-caption font-medium sm:px-4 sm:py-2 sm:typography-button"
          />
        )}
      </div>

      <div className="p-4 sm:p-6">
        {pages.length === 0 ? (
          <NoResultFound
            icon={BookOpen}
            title="No wiki pages"
            description="Create the first page to document project knowledge."
          />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {pages.map((page) => (
              <Link
                key={page.Id}
                href={`/projects/${projectId}/wiki/${page.Slug}`}
                className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="text-sm font-semibold text-neutral-800">
                  {page.Title}
                </div>
                <div className="mt-1 text-xs text-neutral-500">
                  /{page.Slug}
                </div>
                <div className="mt-3 text-xs text-neutral-400">
                  Updated{" "}
                  {page.UpdatedAt
                    ? new Date(page.UpdatedAt).toLocaleDateString()
                    : "—"}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
