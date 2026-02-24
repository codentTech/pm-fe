"use client";

import { useEffect, useMemo, useState } from "react";
import { Paperclip, Trash2, UploadCloud } from "lucide-react";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import useProjectWiki from "../../use-project-wiki.hook";

const formatSize = (bytes) => {
  if (!bytes && bytes !== 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
};

export default function ProjectWikiAttachments({ projectId, pageId, isAdmin }) {
  const {
    attachments,
    fetchAttachments,
    uploadAttachment,
    removeAttachment,
    wikiState,
  } = useProjectWiki({ projectId });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (pageId) fetchAttachments(pageId, { page: 1, limit: 50 });
  }, [fetchAttachments, pageId]);

  const items = useMemo(() => attachments || [], [attachments]);

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !pageId) return;
    setUploading(true);
    await uploadAttachment(pageId, file, () => setUploading(false));
    setUploading(false);
    event.target.value = "";
  };

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-neutral-700">
          <Paperclip className="h-4 w-4 text-indigo-600" />
          Attachments
        </div>
        {isAdmin && (
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-semibold text-neutral-600 hover:bg-neutral-100">
            <UploadCloud className="h-3.5 w-3.5" />
            Upload
            <input type="file" className="hidden" onChange={handleUpload} />
          </label>
        )}
      </div>

      {uploading || wikiState?.uploadAttachment?.isLoading ? (
        <p className="mt-3 text-xs text-neutral-500">Uploading…</p>
      ) : null}

      {items.length === 0 ? (
        <p className="mt-3 text-xs text-neutral-500">No attachments yet.</p>
      ) : (
        <div className="mt-3 space-y-2">
          {items.map((item) => (
            <div
              key={item.Id}
              className="flex items-center justify-between rounded-md border border-neutral-100 bg-neutral-50 px-3 py-2 text-xs text-neutral-700"
            >
              <a
                href={item.Url}
                target="_blank"
                rel="noreferrer"
                className="truncate text-indigo-600 hover:underline"
              >
                {item.FileName || "Attachment"}
              </a>
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-neutral-500">
                  {formatSize(item.FileSize)}
                </span>
                {isAdmin && (
                  <CustomButton
                    text="Remove"
                    size="sm"
                    variant="cancel"
                    startIcon={<Trash2 className="h-3.5 w-3.5" />}
                    onClick={() => removeAttachment(pageId, item.Id)}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
