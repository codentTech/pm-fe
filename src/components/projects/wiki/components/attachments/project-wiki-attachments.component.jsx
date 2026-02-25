"use client";

import { DownloadCloud, Trash2, Upload } from "lucide-react";
import useProjectWiki from "../../use-wiki.hook";

export default function ProjectWikiAttachments({ projectId, pageId, isAdmin }) {
  const { attachments, handleUploadAttachment, handleDeleteAttachment } =
    useProjectWiki({ projectId });

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file || !pageId) return;
    handleUploadAttachment(pageId, file);
    e.target.value = "";
  };

  return (
    <div className="rounded-xl border-2 border-neutral-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-neutral-800">Attachments</p>
        {isAdmin && (
          <label className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700">
            <Upload className="h-4 w-4" />
            Upload
            <input type="file" className="hidden" onChange={handleUpload} />
          </label>
        )}
      </div>
      <div className="mt-3 space-y-2">
        {!attachments?.length ? (
          <div className="rounded-lg border border-dashed border-neutral-200 bg-neutral-50/50 py-4 text-center">
            <p className="text-sm text-neutral-500">No attachments yet.</p>
          </div>
        ) : (
          attachments.map((item) => (
            <div
              key={item.Id}
              className="flex items-center justify-between gap-2 rounded-lg border border-neutral-200 bg-neutral-50/50 px-3 py-2"
            >
              <a
                href={item.Url}
                target="_blank"
                rel="noreferrer"
                className="flex min-w-0 items-center gap-2 text-sm font-medium text-neutral-700 hover:text-indigo-600"
              >
                <DownloadCloud className="h-4 w-4 shrink-0" />
                <span className="truncate">
                  {item.FileName || "Attachment"}
                </span>
              </a>
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => handleDeleteAttachment(pageId, item.Id)}
                  className="shrink-0 text-sm font-medium text-rose-600 hover:text-rose-700"
                >
                  Remove
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
