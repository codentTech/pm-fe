"use client";

import CustomButton from "@/common/components/custom-button/custom-button.component";
import { FileUp, Paperclip, Plus, Trash2 } from "lucide-react";
import PropTypes from "prop-types";
import useCardAttachmentsSection from "./use-card-attachments-section.hook";

function CardAttachmentsSection({ attachments, onAdd, onRemove }) {
  const {
    showForm,
    setShowForm,
    selectedFile,
    isDragging,
    fileInputRef,
    handleFileChange,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    handleSubmit,
    handleCancel,
  } = useCardAttachmentsSection(onAdd);

  const getAttachmentUrl = (attachment) => {
    if (attachment.Type === "file" && attachment.Url?.startsWith("/")) {
      const base = process.env.NEXT_PUBLIC_MAIN_URL || "";
      return `${base}${attachment.Url}`;
    }
    return attachment.Url;
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <h4 className="min-w-0 flex-1 flex items-center gap-2 typography-body font-semibold text-indigo-600">
          <Paperclip className="h-4 w-4 shrink-0" />
          <span className="truncate">Attachments ({attachments?.length || 0})</span>
        </h4>
        {!showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-500 text-white transition-colors hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            aria-label="Add attachment"
          >
            <Plus className="h-3 w-3" />
          </button>
        )}
      </div>
      {showForm && (
        <div className="space-y-3 rounded-md bg-neutral-50 p-4">
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex w-full cursor-pointer flex-col items-center justify-center gap-1.5 rounded-md border-2 border-dashed py-5 transition-colors ${
              isDragging
                ? "border-indigo-400 bg-indigo-50/50"
                : "border-neutral-300 bg-white hover:border-indigo-300 hover:bg-indigo-50/30"
            }`}
          >
            <FileUp className={`h-8 w-8 ${isDragging ? "text-indigo-500" : "text-neutral-400"}`} />
            <span className="typography-body-sm font-medium text-neutral-600">
              Choose a file or drag and drop
            </span>
            <span className="typography-caption text-neutral-500">
              PDF, images, documents
            </span>
          </button>
          {selectedFile && (
            <div className="flex items-center justify-between gap-2 rounded-md border border-neutral-200 bg-white px-3 py-2">
              <div className="min-w-0 flex-1">
                <p className="truncate typography-body-sm font-medium text-neutral-800">
                  {selectedFile.name}
                </p>
                <p className="typography-caption text-neutral-500">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <CustomButton
                type="button"
                text="Change"
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="!p-1 typography-body-sm text-indigo-600 hover:text-indigo-700"
              />
            </div>
          )}
          <div className="flex justify-end gap-2">
            <CustomButton
              type="button"
              text="Cancel"
              variant="cancel"
              size="sm"
              onClick={handleCancel}
            />
            <CustomButton
              type="button"
              text="Upload"
              variant="primary"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                handleSubmit(e);
              }}
              disabled={!selectedFile}
            />
          </div>
        </div>
      )}
      {attachments?.length > 0 && (
        <ul className="space-y-1">
          {attachments.map((a) => (
            <li
              key={a.Id}
              className="flex items-center justify-between gap-2 rounded-md bg-neutral-50 p-4"
            >
              <a
                href={getAttachmentUrl(a)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-w-0 flex-1 items-center gap-2 truncate text-primary-600 hover:underline"
              >
                <FileUp className="h-4 w-4 shrink-0" />
                <span className="truncate">{a.FileName || a.Url}</span>
              </a>
              <CustomButton
                variant="ghost"
                size="sm"
                text=" "
                startIcon={<Trash2 className="h-4 w-4" />}
                onClick={() => onRemove(a.Id)}
                className="!p-1 shrink-0 text-neutral-400 hover:bg-danger-50 hover:text-danger-600 [&_.btn]:!p-1"
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

CardAttachmentsSection.propTypes = {
  attachments: PropTypes.arrayOf(
    PropTypes.shape({
      Id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      Url: PropTypes.string.isRequired,
      FileName: PropTypes.string,
      Type: PropTypes.string,
    })
  ),
  onAdd: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default CardAttachmentsSection;
