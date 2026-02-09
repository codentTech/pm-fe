"use client";

import ConfirmationModal from "@/common/components/confirmation-modal/confirmation-modal.component";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import Loader from "@/common/components/loader/loader.component";
import NoResultFound from "@/common/components/no-result-found/no-result-found.jsx";
import BoardDnd from "@/components/boards/board-dnd/board-dnd.component";
import SortableListColumn from "@/components/boards/board-dnd/components/sortable-list-column/sortable-list-column.component";
import { ArrowLeft, LayoutGrid, Plus } from "lucide-react";
import Link from "next/link";
import useBoardDetail from "./use-board-detail.hook";
import { LIST_COLORS } from "@/common/constants/colors.constant";

export default function BoardDetail({ boardId }) {
  const {
    currentBoard,
    fetchState,
    deleteCardState,
    deleteListState,
    createListState,
    createCardState,
    showAddList,
    setShowAddList,
    addingCardListId,
    setAddingCardListId,
    activeCard,
    setActiveCard,
    activeListId,
    setActiveListId,
    activeDropTarget,
    setActiveDropTarget,
    listForm,
    lists,
    listIds,
    listToDeleteId,
    setListToDeleteId,
    cardToDeleteId,
    setCardToDeleteId,
    handleCreateList,
    handleCreateCard,
    handleMoveCard,
    handleMoveCardAt,
    handleReorderLists,
    requestDeleteList,
    requestDeleteCard,
    confirmDeleteCard,
    confirmDeleteList,
    handleCardClick,
  } = useBoardDetail(boardId);

  if (fetchState?.isLoading && !currentBoard) {
    return (
      <div className="flex min-h-[400px] items-center justify-center p-6">
        <Loader loading />
      </div>
    );
  }

  if (!currentBoard) {
    return (
      <div className="p-4 sm:p-6">
        <div className="flex flex-col items-center gap-4">
          <NoResultFound
            icon={LayoutGrid}
            title="Project not found"
            description="This project doesn't exist or you don't have access to it."
            variant="compact"
          />
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 typography-body font-medium text-primary-600 hover:text-primary-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to projects
          </Link>
        </div>
      </div>
    );
  }

  const listToDeleteTitle =
    lists.find((l) => l.Id === listToDeleteId)?.Title ?? "this list";

  return (
    <div className="min-h-full ">
      <div className="sticky top-0 z-10 page-header-bar">
        <Link
          href="/projects"
          className="flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1.5 typography-body font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Projects</span>
        </Link>
        <div className="page-header-divider" />
        <div className="min-w-0 flex-1 overflow-hidden">
          <h1 className="truncate font-bold !text-indigo-600 typography-h4 sm:typography-h3">
            {currentBoard.Name}
          </h1>
          {currentBoard.Description && (
            <p className="page-header-subtitle">
              {currentBoard.Description}
            </p>
          )}
        </div>
      </div>

      <div className="page-separator" aria-hidden>
        <span className="page-separator-line" />
        <span className="flex gap-1">
          {LIST_COLORS.map((color, i) => (
            <span
              key={i}
              className={`page-separator-dot bg-gradient-to-br ${color}`}
            />
          ))}
        </span>
        <span className="page-separator-line" />
      </div>

      <div className="flex gap-3 overflow-x-auto p-3 pb-6 scrollbar-thin sm:gap-4 sm:p-4 [-webkit-overflow-scrolling:touch]">
        <BoardDnd
          listIds={listIds}
          lists={lists}
          onMoveCardAt={handleMoveCardAt}
          onReorderLists={handleReorderLists}
          activeCard={activeCard}
          setActiveCard={setActiveCard}
          setActiveListId={setActiveListId}
          setActiveDropTarget={setActiveDropTarget}
        >
          {lists.map((list, index) => (
            <SortableListColumn
              key={list.Id}
              list={list}
              listIndex={index}
              activeDropTarget={activeDropTarget}
              activeCard={activeCard}
              onAddCard={() => setAddingCardListId(list.Id)}
              showAddCard={addingCardListId === list.Id}
              onSaveCard={(payload) => handleCreateCard(list.Id, payload)}
              onCancelCard={() => setAddingCardListId(null)}
              isSavingCard={createCardState?.isLoading}
              onMoveCard={handleMoveCard}
              onRequestDeleteList={() => requestDeleteList(list.Id)}
              onDeleteCard={requestDeleteCard}
              onCardClick={handleCardClick}
              otherLists={lists.filter((l) => l.Id !== list.Id)}
            />
          ))}
        </BoardDnd>

        {!showAddList ? (
          <CustomButton
            type="button"
            text="Add another list"
            variant="ghost"
            startIcon={<Plus className="h-4 w-4 shrink-0" />}
            onClick={() => setShowAddList(true)}
            className="h-fit min-w-[240px] shrink-0 justify-start rounded-lg border-2 border-dashed border-neutral-300 p-3 text-left font-medium text-neutral-600 typography-body transition-colors hover:border-neutral-400 hover:bg-neutral-100 hover:text-neutral-800 sm:min-w-[280px] sm:p-4 [&_.btn]:!justify-start"
          />
        ) : (
          <div className="min-w-[240px] shrink-0 rounded-lg border border-neutral-200 p-3 sm:min-w-[280px] sm:p-4">
            <form
              onSubmit={listForm.handleSubmit(handleCreateList)}
              className="space-y-3"
            >
              <CustomInput
                name="Title"
                placeholder="Enter list title…"
                register={listForm.register}
                errors={listForm.formState.errors}
              />
              <div className="flex gap-2">
                <CustomButton
                  type="submit"
                  text="Add list"
                  variant="primary"
                  className="rounded-lg"
                  loading={createListState?.isLoading}
                />
                <CustomButton
                  type="button"
                  text="Cancel"
                  variant="cancel"
                  onClick={() => setShowAddList(false)}
                  className="rounded-lg"
                />
              </div>
            </form>
          </div>
        )}
      </div>

      <ConfirmationModal
        show={!!cardToDeleteId}
        onClose={() => setCardToDeleteId(null)}
        onConfirm={confirmDeleteCard}
        title="Delete card"
        description="This card will be permanently removed. This cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        loading={deleteCardState?.isLoading}
      />

      <ConfirmationModal
        show={!!listToDeleteId}
        onClose={() => setListToDeleteId(null)}
        onConfirm={confirmDeleteList}
        title="Delete list"
        description={`Delete "${listToDeleteTitle}"? All cards in it will be removed.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        loading={deleteListState?.isLoading}
      />
    </div>
  );
}
