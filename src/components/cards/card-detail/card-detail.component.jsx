"use client";

import ConfirmationModal from "@/common/components/confirmation-modal/confirmation-modal.component";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select.jsx";
import Loader from "@/common/components/loader/loader.component";
import NoResultFound from "@/common/components/no-result-found/no-result-found.jsx";
import TextArea from "@/common/components/text-area/text-area.component";
import capitalizeFirstLetter from "@/common/utils/capitalize-first-letter";
import {
  ArrowLeft,
  CheckCircle,
  LayoutGrid,
  Link2,
  ListChecks,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import PropTypes from "prop-types";
import { Controller } from "react-hook-form";
import CardAttachmentsSection from "./components/card-attachments-section/card-attachments-section.component";
import CardChecklistsSection from "./components/card-checklists-section/card-checklists-section.component";
import CardCommentsSection from "./components/card-comments-section/card-comments-section.component";
import useCardDetail from "./use-card-detail.hook";

function SelectedLabels({ labelIds, labels }) {
  const selectedLabels = (labels || []).filter((l) => labelIds?.includes(l.Id));
  if (selectedLabels.length === 0) return null;

  return (
    <div>
      <p className="typography-caption text-neutral-500 mb-1">Labels</p>
      <div className="flex flex-wrap gap-1.5">
        {selectedLabels.map((label) => (
          <span
            key={label.Id}
            className="inline-flex items-center rounded-md px-2.5 py-1 typography-body-sm"
            style={
              label.Color
                ? { backgroundColor: label.Color, color: "#fff" }
                : { backgroundColor: "rgb(243 244 246)", color: "rgb(17 24 39)" }
            }
          >
            {label.Name}
          </span>
        ))}
      </div>
    </div>
  );
}

SelectedLabels.propTypes = {
  labelIds: PropTypes.array,
  labels: PropTypes.array,
};

function SelectedAssignees({ assigneeIds, orgMembers }) {
  const selectedAssignees = (orgMembers || []).filter((m) => {
    const userId = m.User?.Id || m.UserId;
    return assigneeIds?.includes(userId);
  });
  if (selectedAssignees.length === 0) return null;

  return (
    <div>
      <p className="typography-caption text-neutral-500 mb-1">Assignees</p>
      <div className="flex flex-wrap gap-1.5">
        {selectedAssignees.map((m) => (
          <span
            key={m.User?.Id || m.UserId}
            className="inline-flex items-center rounded-md bg-neutral-100 px-2.5 py-1 typography-body-sm text-neutral-800"
          >
            {m.User?.FullName || "Unknown"}
          </span>
        ))}
      </div>
    </div>
  );
}

SelectedAssignees.propTypes = {
  assigneeIds: PropTypes.array,
  orgMembers: PropTypes.array,
};

export default function CardDetail({ boardId, cardId }) {
  const {
    card,
    currentBoard,
    lists,
    labels,
    orgMembers,
    loading,
    deleteCardState,
    updateCardState,
    cardDetailForm,
    showDeleteConfirm,
    setShowDeleteConfirm,
    linkCopied,
    handleCopyLink,
    handleUpdateCard,
    handleMoveCard,
    handleDeleteCard,
    handleAddAttachment,
    handleRemoveAttachment,
    handleAddComment,
    handleAddChecklist,
    handleAddChecklistItem,
    handleToggleChecklistItem,
    handleDeleteChecklist,
    handleDeleteChecklistItem,
  } = useCardDetail(boardId, cardId);

  if (loading && !currentBoard) {
    return (
      <div className="flex min-h-[400px] items-center justify-center p-6">
        <Loader loading />
      </div>
    );
  }

  if (!card) {
    return (
      <div className="p-4 sm:p-6">
        <div className="flex flex-col items-center gap-4">
          <NoResultFound
            icon={LayoutGrid}
            title="Card not found"
            description="This card doesn't exist or you don't have access to it."
            variant="compact"
          />
          <Link
            href={`/projects/${boardId}`}
            className="inline-flex items-center gap-2 typography-body font-medium text-primary-600 hover:text-primary-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to project
          </Link>
        </div>
      </div>
    );
  }

  const SEPARATOR_COLORS = [
    "from-indigo-500 to-indigo-700",
    "from-emerald-500 to-emerald-700",
    "from-amber-500 to-amber-700",
    "from-rose-500 to-rose-700",
    "from-sky-500 to-sky-700",
    "from-violet-500 to-violet-700",
  ];

  return (
    <div className="flex min-w-0 flex-col bg-white">
      <div className="sticky top-0 z-10 page-header-bar">
        <Link
          href={`/projects/${boardId}`}
          className="flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1.5 typography-body font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">
            {currentBoard?.Name || "Project"}
          </span>
        </Link>
        <div className="page-header-divider" />
        <div className="min-w-0 flex-1 overflow-hidden">
          <h1 className="truncate font-bold typography-h4 !text-indigo-600 sm:typography-h3">
            {capitalizeFirstLetter(card.Title)}
          </h1>
        </div>
        <button
          type="button"
          onClick={handleCopyLink}
          className="flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1.5 typography-body-sm text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus:outline-none"
          title="Copy card link"
        >
          {linkCopied ? (
            <>
              <CheckCircle className="h-4 w-4 text-success-600" />
              <span className="hidden sm:inline">Copied</span>
            </>
          ) : (
            <>
              <Link2 className="h-4 w-4" />
              <span className="hidden sm:inline">Copy link</span>
            </>
          )}
        </button>
      </div>

      <div className="page-separator" aria-hidden>
        <span className="page-separator-line" />
        <span className="flex gap-1">
          {SEPARATOR_COLORS.map((color, i) => (
            <span
              key={i}
              className={`page-separator-dot bg-gradient-to-br ${color}`}
            />
          ))}
        </span>
        <span className="page-separator-line" />
      </div>

      <form
        onSubmit={cardDetailForm.handleSubmit(handleUpdateCard)}
        className="flex min-w-0 flex-1 flex-col"
      >
        <div className="flex min-w-0 flex-1 flex-col gap-6 p-4 pb-24 sm:flex-row sm:gap-8 sm:pb-32">
          {/* Main content - left */}
          <div className="min-w-0 flex-1 space-y-6">
            <div className="rounded-md border border-neutral-200 bg-gradient-to-b from-indigo-100 via-white to-neutral-100 p-4 shadow-sm">
              <div className="flex flex-col gap-4">
                <CustomInput
                  label="Title"
                  name="Title"
                  placeholder="Card title"
                  register={cardDetailForm.register}
                  errors={cardDetailForm.formState.errors}
                  isRequired
                />
                <TextArea
                  label="Description"
                  name="Description"
                  placeholder="Add a more detailed description…"
                  register={cardDetailForm.register}
                  errors={cardDetailForm.formState.errors}
                />
              </div>
            </div>

            <div className="rounded-md border border-neutral-200 bg-white p-4 shadow-sm">
              <CardAttachmentsSection
                attachments={card.Attachments || []}
                onAdd={handleAddAttachment}
                onRemove={handleRemoveAttachment}
              />
            </div>
            <div className="rounded-md border border-neutral-200 bg-white p-4 shadow-sm">
              <CardChecklistsSection
                checklists={card.Checklists || []}
                onAddChecklist={handleAddChecklist}
                onAddItem={handleAddChecklistItem}
                onToggleItem={handleToggleChecklistItem}
                onDeleteChecklist={handleDeleteChecklist}
                onDeleteItem={handleDeleteChecklistItem}
              />
            </div>
            <div className="rounded-md border border-neutral-200 bg-white p-4 shadow-sm">
              <CardCommentsSection
                comments={card.Comments || []}
                orgMembers={orgMembers}
                onAdd={handleAddComment}
              />
            </div>
          </div>

          {/* Sidebar - right */}
          <aside className="flex w-full shrink-0 flex-col gap-4 sm:w-72 lg:w-80">
            <div className="sticky top-20 space-y-4 rounded-md border border-neutral-200 bg-white p-4 shadow-sm">
              <h3 className="flex items-center gap-2 typography-body font-semibold text-indigo-600">
                <ListChecks className="h-4 w-4 shrink-0" />
                Details
              </h3>
              <CustomInput
                label="Due date"
                name="DueDate"
                type="date"
                register={cardDetailForm.register}
                errors={cardDetailForm.formState.errors}
              />
              {labels?.length > 0 && (
                <Controller
                  name="LabelIds"
                  control={cardDetailForm.control}
                  render={({ field }) => (
                    <SimpleSelect
                      label="Labels"
                      options={labels.map((l) => ({
                        value: l.Id,
                        label: l.Name,
                        color: l.Color,
                      }))}
                      value={field.value}
                      onChange={field.onChange}
                      isMulti
                      showPillsBelow
                      placeholder="Select labels…"
                    />
                  )}
                />
              )}
              <SelectedLabels
                labelIds={cardDetailForm.watch("LabelIds") || []}
                labels={labels}
              />
              {orgMembers?.length > 0 && (
                <Controller
                  name="AssigneeIds"
                  control={cardDetailForm.control}
                  render={({ field }) => (
                    <SimpleSelect
                      label="Assignees"
                      options={orgMembers.map((m) => ({
                        value: m.User?.Id || m.UserId,
                        label: m.User?.FullName || "Unknown",
                      }))}
                      value={field.value}
                      onChange={field.onChange}
                      isMulti
                      showPillsBelow
                      placeholder="Select assignees…"
                    />
                  )}
                />
              )}
              <SelectedAssignees
                assigneeIds={cardDetailForm.watch("AssigneeIds") || []}
                orgMembers={orgMembers}
              />
              {lists.length > 1 && (
                <div>
                  <SimpleSelect
                    label="Move to list"
                    name="moveToList"
                    options={lists.map((l) => ({
                      value: l.Id,
                      label: l.Title,
                    }))}
                    value={card.ListId}
                    onChange={(listId) => {
                      if (listId && listId !== card.ListId)
                        handleMoveCard(listId);
                    }}
                    placeholder="Select list…"
                  />
                </div>
              )}

              <div className="flex flex-col gap-2 border-t border-neutral-100 pt-4">
                <CustomButton
                  type="button"
                  text="Save"
                  variant="primary"
                  onClick={cardDetailForm.handleSubmit(handleUpdateCard)}
                  className="w-full rounded-md"
                  loading={updateCardState?.isLoading}
                />
                <CustomButton
                  type="button"
                  text="Delete card"
                  variant="danger"
                  startIcon={<Trash2 className="h-4 w-4 shrink-0" />}
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full rounded-md"
                />
              </div>
            </div>
          </aside>
        </div>
      </form>

      <ConfirmationModal
        show={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          handleDeleteCard();
          setShowDeleteConfirm(false);
        }}
        title="Delete card"
        description="This card will be permanently removed. This cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        loading={deleteCardState?.isLoading}
      />
    </div>
  );
}

CardDetail.propTypes = {
  boardId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  cardId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};
