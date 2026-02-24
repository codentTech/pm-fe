"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookOpen, Plus } from "lucide-react";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import NoResultFound from "@/common/components/no-result-found/no-result-found.jsx";
import useProjectWiki from "../../use-project-wiki.hook";

export default function ProjectWikiList({ projectId }) {
  const router = useRouter();
  const { pages, currentProject, isAdmin } = useProjectWiki({ projectId });

  const projectName = useMemo(
    () => currentProject?.Name || "Project wiki",
    [currentProject?.Name],
  );

  return (
    <div className="min-h-full">
      <div className="page-header-bar px-4 sm:px-5">
        <Link
          href={`/projects/${projectId}`}
          className="flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1.5 typography-body font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
        >
          Back to project
        </Link>
        <div className="page-header-divider" />
        <div className="min-w-0 flex-1 overflow-hidden">
          <h1 className="page-header-title">Wiki</h1>
          <p className="page-header-subtitle">{projectName}</p>
        </div>
        {isAdmin && (
          <CustomButton
            text="New page"
            onClick={() => router.push(`/projects/${projectId}/wiki/new`)}
            variant="primary"
            size="sm"
            startIcon={<Plus className="h-4 w-4" />}
          />
        )}
      </div>

      {pages.length === 0 ? (
        <NoResultFound
          icon={BookOpen}
          title="No wiki pages yet"
          description={
            isAdmin
              ? "Create the first page to document this project."
              : "Ask an admin to create the first wiki page."
          }
        />
      ) : (
        <div className="p-4 sm:p-6">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {pages.map((page) => (
              <Link
                key={page.Id}
                href={`/projects/${projectId}/wiki/${page.Slug}`}
                className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <h3 className="text-sm font-semibold text-neutral-900">
                  {page.Title}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs text-neutral-500">
                  {page.Content || "No description yet."}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
