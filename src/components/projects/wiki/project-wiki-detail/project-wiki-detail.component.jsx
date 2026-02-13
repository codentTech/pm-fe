"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { BookOpen, Pencil, Trash2 } from "lucide-react";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import ConfirmationModal from "@/common/components/confirmation-modal/confirmation-modal.component";
import NoResultFound from "@/common/components/no-result-found/no-result-found.jsx";
import useProjectWiki from "../use-project-wiki.hook";
import ProjectWikiAttachments from "../components/wiki-attachments/project-wiki-attachments.component";

export default function ProjectWikiDetail({ projectId, slug }) {
  const router = useRouter();
  const { currentPage, isAdmin, removePage, fetchAttachments } = useProjectWiki(
    {
      projectId,
      slug,
    },
  );
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    if (currentPage?.Id)
      fetchAttachments(currentPage.Id, { page: 1, limit: 50 });
  }, [currentPage?.Id, fetchAttachments]);

  const content = useMemo(
    () => currentPage?.Content || "",
    [currentPage?.Content],
  );

  if (!currentPage) {
    return (
      <NoResultFound
        icon={BookOpen}
        title="Wiki page not found"
        description="This page does not exist or you don't have access."
      />
    );
  }

  return (
    <div className="min-h-full">
      <div className="page-header-bar px-4 sm:px-5">
        <Link
          href={`/projects/${projectId}/wiki`}
          className="flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1.5 typography-body font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
        >
          Back to wiki
        </Link>
        <div className="page-header-divider" />
        <div className="min-w-0 flex-1 overflow-hidden">
          <h1 className="page-header-title">{currentPage.Title}</h1>
          <p className="page-header-subtitle">Project wiki</p>
        </div>
        {isAdmin && (
          <div className="flex items-center gap-2">
            <CustomButton
              text="Edit"
              variant="outline"
              size="sm"
              startIcon={<Pencil className="h-4 w-4" />}
              onClick={() =>
                router.push(
                  `/projects/${projectId}/wiki/${currentPage.Slug}/edit`,
                )
              }
            />
            <CustomButton
              text="Delete"
              variant="danger"
              size="sm"
              startIcon={<Trash2 className="h-4 w-4" />}
              onClick={() => setShowDelete(true)}
            />
          </div>
        )}
      </div>

      <div className="grid gap-4 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
          {content ? (
            <article className="prose prose-sm max-w-none">
              <ReactMarkdown>{content}</ReactMarkdown>
            </article>
          ) : (
            <p className="text-sm text-neutral-500">No content yet.</p>
          )}
        </div>
        <ProjectWikiAttachments
          projectId={projectId}
          pageId={currentPage.Id}
          isAdmin={isAdmin}
        />
      </div>

      <ConfirmationModal
        open={showDelete}
        title="Delete wiki page?"
        message="This action cannot be undone."
        onClose={() => setShowDelete(false)}
        onConfirm={() =>
          removePage(currentPage.Id, () => {
            setShowDelete(false);
            router.push(`/projects/${projectId}/wiki`);
          })
        }
      />
    </div>
  );
}
