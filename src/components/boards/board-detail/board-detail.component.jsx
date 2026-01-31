"use client";

import { useState } from "react";
import Link from "next/link";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import TextArea from "@/common/components/text-area/text-area.component";
import ConfirmationModal from "@/common/components/confirmation-modal/confirmation-modal.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select.jsx";
import Loader from "@/common/components/loader/loader.component";
import Modal from "@/common/components/modal/modal.component";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import useBoardDetail from "./use-board-detail.hook";
import BoardDnd from "@/components/boards/board-dnd/board-dnd.component";
import SortableListColumn from "@/components/boards/board-dnd/sortable-list-column.component";

export default function BoardDetail({ boardId }) {
  const [listToDeleteId, setListToDeleteId] = useState(null);
  const [showDeleteCardConfirm, setShowDeleteCardConfirm] = useState(false);

  const {
    currentBoard,
    fetchState,
    deleteCardState,
    deleteListState,
    createListState,
    createCardState,
    updateCardState,
    showAddList,
    setShowAddList,
    addingCardListId,
    setAddingCardListId,
    selectedCard,
    setSelectedCard,
    activeCard,
    setActiveCard,
    activeListId,
    setActiveListId,
    activeDropTarget,
    setActiveDropTarget,
    listForm,
    cardDetailForm,
    handleCreateList,
    handleCreateCard,
    handleUpdateCard,
    handleMoveCard,
    handleMoveCardAt,
    handleReorderLists,
    handleDeleteList,
    handleDeleteCard,
    closeCardDetail,
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
      <div className="p-6">
        <div className="rounded-xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
          <p className="text-neutral-600">Board not found.</p>
          <Link
            href="/boards"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to boards
          </Link>
        </div>
      </div>
    );
  }

  const lists = [...(currentBoard.Lists || [])].sort(
    (a, b) => (a.Position ?? 0) - (b.Position ?? 0),
  );
  const listIds = lists.map((l) => l.Id);

  return (
    <div className="min-h-full bg-neutral-100/80">
      <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-neutral-200 bg-white/95 px-4 py-3 shadow-sm backdrop-blur">
        <Link
          href="/boards"
          className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Boards</span>
        </Link>
        <div className="h-5 w-px bg-neutral-200" />
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-lg font-semibold text-neutral-900">
            {currentBoard.Name}
          </h1>
          {currentBoard.Description && (
            <p className="truncate text-xs text-neutral-500">
              {currentBoard.Description}
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto p-4 pb-6 scrollbar-thin">
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
          {lists.map((list) => (
            <SortableListColumn
              key={list.Id}
              list={list}
              activeDropTarget={activeDropTarget}
              activeCard={activeCard}
              onAddCard={() => setAddingCardListId(list.Id)}
              showAddCard={addingCardListId === list.Id}
              onSaveCard={(payload) => handleCreateCard(list.Id, payload)}
              onCancelCard={() => setAddingCardListId(null)}
              isSavingCard={createCardState?.isLoading}
              onMoveCard={handleMoveCard}
              onRequestDeleteList={() => setListToDeleteId(list.Id)}
              onDeleteCard={handleDeleteCard}
              onCardClick={setSelectedCard}
              otherLists={lists.filter((l) => l.Id !== list.Id)}
            />
          ))}
        </BoardDnd>

        {!showAddList ? (
          <button
            type="button"
            onClick={() => setShowAddList(true)}
            className="h-fit min-w-[280px] shrink-0 rounded-lg border-2 border-dashed border-neutral-300 bg-white/60 p-4 text-left text-sm font-medium text-neutral-500 transition-colors hover:border-neutral-400 hover:bg-white/80 hover:text-neutral-700"
          >
            <Plus className="mr-2 inline h-4 w-4" />
            Add another list
          </button>
        ) : (
          <div className="min-w-[280px] shrink-0 rounded-lg border border-neutral-200 bg-neutral-100 p-4">
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

      <Modal
        show={!!selectedCard}
        onClose={closeCardDetail}
        title="Card details"
        size="md"
      >
        {selectedCard && (
          <form
            onSubmit={cardDetailForm.handleSubmit(handleUpdateCard)}
            className="space-y-4"
          >
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
            <CustomInput
              label="Due date"
              name="DueDate"
              type="date"
              register={cardDetailForm.register}
              errors={cardDetailForm.formState.errors}
            />
            {lists.length > 1 && (
              <div>
                <SimpleSelect
                  label="Move to list"
                  name="moveToList"
                  options={lists.map((l) => ({ value: l.Id, label: l.Title }))}
                  value={selectedCard.ListId}
                  onChange={(listId) => {
                    if (listId && listId !== selectedCard.ListId) {
                      handleMoveCard(selectedCard.Id, listId);
                      closeCardDetail();
                    }
                  }}
                  placeholder="Select list…"
                />
              </div>
            )}
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-neutral-200 pt-4">
              <CustomButton
                type="button"
                text="Delete card"
                variant="danger"
                startIcon={<Trash2 className="h-4 w-4" />}
                onClick={() => setShowDeleteCardConfirm(true)}
                className="rounded-lg"
              />
              <div className="flex gap-2">
                <CustomButton
                  type="button"
                  text="Close"
                  variant="cancel"
                  onClick={closeCardDetail}
                  className="rounded-lg"
                />
                <CustomButton
                  type="submit"
                  text="Save"
                  variant="primary"
                  className="rounded-lg"
                  loading={updateCardState?.isLoading}
                />
              </div>
            </div>
          </form>
        )}
      </Modal>

      <ConfirmationModal
        show={showDeleteCardConfirm}
        onClose={() => setShowDeleteCardConfirm(false)}
        onConfirm={() => {
          if (selectedCard) handleDeleteCard(selectedCard.Id);
          setShowDeleteCardConfirm(false);
        }}
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
        onConfirm={() => {
          if (listToDeleteId) handleDeleteList(listToDeleteId);
          setListToDeleteId(null);
        }}
        title="Delete list"
        description={
          listToDeleteId
            ? `Delete "${lists.find((l) => l.Id === listToDeleteId)?.Title ?? "this list"}"? All cards in it will be removed.`
            : ""
        }
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        loading={deleteListState?.isLoading}
      />
    </div>
  );
}
