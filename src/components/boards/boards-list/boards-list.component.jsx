"use client";

import Link from "next/link";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import Modal from "@/common/components/modal/modal.component";
import ConfirmationModal from "@/common/components/confirmation-modal/confirmation-modal.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import BoardsListSkeleton from "@/common/components/skeleton/boards-list-skeleton.component";
import TextArea from "@/common/components/text-area/text-area.component";
import NoResultFound from "@/common/components/no-result-found/no-result-found.jsx";
import OnboardingBanner from "@/components/onboarding/onboarding-banner.component";
import { LayoutList, Plus, LayoutGrid, Pencil, Trash2 } from "lucide-react";
import { BOARD_CARD_COLORS } from "@/common/constants/colors.constant";
import useBoardsList from "./use-boards-list.hook";

function getBoardColor(index) {
  return BOARD_CARD_COLORS[index % BOARD_CARD_COLORS.length];
}

export default function BoardsList() {
  const {
    boards,
    loading,
    showCreateModal,
    setShowCreateModal,
    editingBoard,
    setEditingBoard,
    boardToDeleteId,
    setBoardToDeleteId,
    createForm,
    editForm,
    handleSubmit,
    handleEditSubmit,
    errors,
    editErrors,
    register,
    editRegister,
    onSubmitCreate,
    onSubmitEdit,
    handleDeleteBoard,
    createLoading,
    updateLoading,
    deleteLoading,
  } = useBoardsList();

  return (
    <div className="min-h-full">
      <div className="page-header-bar p-4 sm:p-5">
        <div className="page-header-divider" />
        <div className="min-w-0 flex-1 overflow-hidden">
          <h1 className="page-header-title">Your projects</h1>
          <p className="page-header-subtitle">
            Create and manage projects with lists and cards
          </p>
        </div>
        <CustomButton
          text="Create project"
          onClick={() => setShowCreateModal(true)}
          variant="primary"
          startIcon={<Plus className="h-3.5 w-3.5 shrink-0" />}
          size="sm"
          className="shrink-0 rounded-lg px-3 py-1.5 typography-caption font-medium sm:px-4 sm:py-2 sm:typography-button"
        />
      </div>

      <div className="mb-5 flex items-center gap-1 sm:mb-6" aria-hidden>
        <span className="h-px flex-1 bg-gradient-to-r from-transparent via-neutral-300 to-transparent" />
        <span className="flex gap-1">
          {BOARD_CARD_COLORS.map((color, i) => (
            <span
              key={i}
              className={`h-1.5 w-1.5 rounded-full bg-gradient-to-br ${color}`}
            />
          ))}
        </span>
        <span className="h-px flex-1 bg-gradient-to-r from-transparent via-neutral-300 to-transparent" />
      </div>

      {!loading && !boards?.length && (
        <OnboardingBanner hasProjects={!!boards?.length} />
      )}

      {loading ? (
        <BoardsListSkeleton />
      ) : !boards?.length ? (
        <NoResultFound
          icon={LayoutGrid}
          title="No projects yet"
          description="Create your first project to organize tasks with lists and cards."
        />
      ) : (
        <div className="grid gap-4 p-4 sm:p-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {boards.map((board, index) => (
            <div
              key={board.Id}
              className={`group rounded-xl bg-gradient-to-br p-[2px] ${getBoardColor(index)}`}
            >
              <div className="flex h-full flex-col overflow-hidden rounded-[10px] bg-white">
                <Link
                  href={`/projects/${board.Id}`}
                  className="flex-1 block outline-none rounded-t-[10px]"
                >
                  <div
                    className={`relative flex h-20 items-end bg-gradient-to-br p-3 ${getBoardColor(index)}`}
                  >
                    <h3 className="card-title-gradient">{board.Name}</h3>
                  </div>
                  <div className="flex flex-col p-3">
                    <p className="line-clamp-2 text-xs text-neutral-600">
                      {(board.Description ?? board.description ?? "").trim() ||
                        "No description"}
                    </p>
                  </div>
                </Link>
                <div className="flex w-full items-center gap-2 border-t border-neutral-200 bg-neutral-50/50 p-2">
                  <div className="flex items-center gap-1.5 rounded-md bg-indigo-50 px-2 py-1">
                    <LayoutList className="h-3.5 w-3.5 text-indigo-600" />
                    <span className="text-xs font-semibold text-indigo-700">
                      {board.Lists?.length ?? 0} list
                      {(board.Lists?.length ?? 0) !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="h-4 w-px shrink-0 bg-neutral-200" />
                  <div className="flex flex-1 gap-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setEditingBoard(board);
                      }}
                      className="action-icon-edit min-w-0 flex-1 rounded-md bg-neutral-100 py-2 hover:bg-neutral-200"
                      aria-label="Edit project"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setBoardToDeleteId(board.Id);
                      }}
                      className="action-icon-delete min-w-0 flex-1 rounded-md bg-danger-50 py-2 hover:bg-danger-100"
                      aria-label="Delete project"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create project"
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmitCreate)} className="space-y-4">
          <CustomInput
            label="Project name"
            name="Name"
            placeholder="e.g. Project Alpha"
            register={register}
            errors={errors}
            isRequired
          />
          <TextArea
            label="Description (optional)"
            name="Description"
            placeholder="Brief description"
            register={register}
            errors={errors}
          />
          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end sm:gap-3">
            <CustomButton
              type="button"
              text="Cancel"
              variant="cancel"
              onClick={() => setShowCreateModal(false)}
              className="w-full sm:w-auto"
              disabled={createLoading}
            />
            <CustomButton
              type="submit"
              text="Create"
              variant="primary"
              className="w-full sm:w-auto"
              loading={createLoading}
            />
          </div>
        </form>
      </Modal>

      <Modal
        show={!!editingBoard}
        onClose={() => setEditingBoard(null)}
        title="Edit project"
        size="md"
      >
        <form
          onSubmit={handleEditSubmit(onSubmitEdit)}
          className="space-y-4 p-2"
        >
          <CustomInput
            label="Project name"
            name="Name"
            placeholder="e.g. Project Alpha"
            register={editRegister}
            errors={editErrors}
            isRequired
          />
          <TextArea
            label="Description (optional)"
            name="Description"
            placeholder="Brief description"
            register={editRegister}
            errors={editErrors}
          />
          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end sm:gap-3">
            <CustomButton
              type="button"
              text="Cancel"
              variant="cancel"
              onClick={() => setEditingBoard(null)}
              className="w-full sm:w-auto"
              disabled={updateLoading}
            />
            <CustomButton
              type="submit"
              text="Save"
              variant="primary"
              className="w-full sm:w-auto"
              loading={updateLoading}
            />
          </div>
        </form>
      </Modal>

      <ConfirmationModal
        show={!!boardToDeleteId}
        onClose={() => setBoardToDeleteId(null)}
        onConfirm={handleDeleteBoard}
        title="Delete project"
        description="This project and all its lists and cards will be permanently removed. This cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        loading={deleteLoading}
      />
    </div>
  );
}
