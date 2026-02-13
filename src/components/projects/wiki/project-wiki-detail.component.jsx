"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { DownloadCloud, Edit, FileText, Upload } from "lucide-react";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import useProjectWiki from "./use-project-wiki.hook";
import {
  fetchWikiAttachments,
  uploadWikiAttachment,
  deleteWikiAttachment,
} from "@/provider/features/wiki/wiki.slice";
import { useDispatch } from "react-redux";

export default function ProjectWikiDetail({ projectId, slug }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { currentPage, attachments, isAdmin } = useProjectWiki({
    projectId,
    slug,
  });

  const pageId = currentPage?.Id;
  const hasAttachments = attachments.length > 0;

  const handleUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file || !pageId) return;
    dispatch(
      uploadWikiAttachment({
        projectId,
        pageId,
        file,
        successCallBack: () =>
          dispatch(fetchWikiAttachments({ projectId, pageId })),
      }),
    );
  };

  const handleDelete = (attachmentId) => {
    if (!pageId) return;
    dispatch(
      deleteWikiAttachment({
        projectId,
        pageId,
        attachmentId,
        successCallBack: () =>
          dispatch(fetchWikiAttachments({ projectId, pageId })),
      }),
    );
  };

  const formattedUpdatedAt = useMemo(() => {
    if (!currentPage?.UpdatedAt) return "—";
    return new Date(currentPage.UpdatedAt).toLocaleString();
  }, [currentPage?.UpdatedAt]);

  if (!currentPage) {
    return (
      <div className="p-6">
        <p className="text-sm text-neutral-500">Loading wiki page…</p>
      </div>
    );
  }

  return (
    <div className="min-h-full">
      <div className="page-header-bar px-4 sm:px-5">
        <Link
          href={`/projects/${projectId}/wiki`}
          className="flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1.5 typography-body font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
        >
          <FileText className="h-4 w-4" />
          Wiki
        </Link>
        <div className="page-header-divider" />
        <div className="min-w-0 flex-1 overflow-hidden">
          <h1 className="page-header-title">{currentPage.Title}</h1>
          <p className="page-header-subtitle">Updated {formattedUpdatedAt}</p>
        </div>
        {isAdmin && (
          <CustomButton
            text="Edit"
            onClick={() =>
              router.push(`/projects/${projectId}/wiki/${slug}/edit`)
            }
            variant="primary"
            size="sm"
            startIcon={<Edit className="h-4 w-4" />}
            className="shrink-0 rounded-lg px-3 py-1.5 typography-caption font-medium sm:px-4 sm:py-2 sm:typography-button"
          />
        )}
      </div>

      <div className="grid gap-4 p-4 sm:p-6 lg:grid-cols-3">
        <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm lg:col-span-2">
          <ReactMarkdown className="prose prose-sm max-w-none">
            {currentPage.Content}
          </ReactMarkdown>
        </div>

        <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-neutral-800">
              Attachments
            </div>
            {isAdmin && (
              <label className="inline-flex cursor-pointer items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700">
                <Upload className="h-3.5 w-3.5" />
                Upload
                <input type="file" className="hidden" onChange={handleUpload} />
              </label>
            )}
          </div>

          <div className="mt-3 space-y-2">
            {!hasAttachments && (
              <p className="text-xs text-neutral-500">No attachments yet.</p>
            )}
            {attachments.map((item) => (
              <div
                key={item.Id}
                className="flex items-center justify-between rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2"
              >
                <a
                  href={item.Url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-xs font-medium text-neutral-700 hover:text-indigo-600"
                >
                  <DownloadCloud className="h-4 w-4" />
                  {item.FileName || "Attachment"}
                </a>
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => handleDelete(item.Id)}
                    className="text-xs font-semibold text-rose-600 hover:text-rose-700"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
