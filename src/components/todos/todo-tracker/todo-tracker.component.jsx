"use client";

import ConfirmationModal from "@/common/components/confirmation-modal/confirmation-modal.component";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select.jsx";
import Modal from "@/common/components/modal/modal.component";
import NoResultFound from "@/common/components/no-result-found/no-result-found.jsx";
import PageHeader from "@/common/components/page-header/page-header.component";
import TodoTrackerSkeleton from "@/common/components/skeleton/todo-tracker-skeleton.component";
import TextArea from "@/common/components/text-area/text-area.component";
import { LIST_CARD_COLORS } from "@/common/constants/colors.constant";
import {
  Calendar,
  Check,
  CheckSquare,
  Filter,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Controller } from "react-hook-form";
import useTodoTracker, {
  DUE_FILTER_OPTIONS,
  PRIORITY_OPTIONS,
  SORT_OPTIONS,
  SORT_ORDER_OPTIONS,
  STATUS_OPTIONS,
} from "./use-todo-tracker.hook";

export default function TodoTracker() {
  const {
    todoLists,
    togglingItemKey,
    filters,
    setFilters,
    hasActiveFilters,
    clearFilters,
    loading,
    showCreateListModal,
    setShowCreateListModal,
    editingList,
    setEditingList,
    listToDeleteId,
    setListToDeleteId,
    addingItemListId,
    setAddingItemListId,
    editingItem,
    setEditingItem,
    itemToDelete,
    setItemToDelete,
    listForm,
    editListForm,
    itemForm,
    editItemForm,
    handleCreateList,
    handleUpdateList,
    handleDeleteList,
    handleCreateItem,
    handleUpdateItem,
    handleDeleteItem,
    handleToggleItemStatus,
    openEditList,
    openEditItem,
    createListState,
    updateListState,
    deleteListState,
    createItemState,
    updateItemState,
    deleteItemState,
  } = useTodoTracker();

  function getListColor(index) {
    return LIST_CARD_COLORS[index % LIST_CARD_COLORS.length];
  }

  const statusFilterOptions = useMemo(
    () => [{ value: "", label: "All statuses" }, ...STATUS_OPTIONS],
    [],
  );
  const priorityFilterOptions = useMemo(
    () => [{ value: "", label: "All priorities" }, ...PRIORITY_OPTIONS],
    [],
  );

  const [showFilterModal, setShowFilterModal] = useState(false);

  return (
    <div className="min-h-full">
      <PageHeader
        title="Todo Tracker"
        subtitle="Manage tasks and to-do lists"
        actions={
          <CustomButton
            text="Create list"
            onClick={() => setShowCreateListModal(true)}
            variant="primary"
          />
        }
      />
      <div className="px-4 sm:px-5 space-y-4 pb-10">
        <div className="flex items-center gap-2">
          <CustomInput
            name="search"
            type="text"
            placeholder="Search tasks…"
            value={filters.search}
            onChange={(e) =>
              setFilters((f) => ({ ...f, search: e.target.value }))
            }
            startIcon={<Search className="h-4 w-4 text-neutral-400" />}
            className="min-w-[280px] max-w-lg flex-1 [&_.form-group]:!mb-0"
          />
          <div className="flex h-9 items-center gap-1.5">
            <button
              type="button"
              onClick={() => setShowFilterModal(true)}
              className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors focus:outline-none ${
                hasActiveFilters
                  ? "bg-indigo-100 text-indigo-700"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-neutral-800"
              }`}
              aria-label="Filters"
            >
              <Filter className="h-4 w-4" />
              {hasActiveFilters && (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-500 px-1 text-[10px] font-bold text-white">
                  {
                    [filters.status, filters.due, filters.priority].filter(
                      Boolean,
                    ).length
                  }
                </span>
              )}
            </button>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-800 focus:outline-none"
                aria-label="Clear filters"
              >
                <X className="h-4 w-4" />
                Clear
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <TodoTrackerSkeleton />
        ) : !todoLists?.length ? (
          <NoResultFound
            icon={CheckSquare}
            title="No todo lists yet"
            description="Create your first todo list to start tracking tasks."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {todoLists.map((list, listIndex) => (
              <div
                key={list.Id}
                className={`group rounded-lg bg-gradient-to-br p-[2px] ${getListColor(listIndex)}`}
              >
                <div className="flex h-full min-w-0 flex-col overflow-hidden rounded-lg bg-white">
                  <div
                    className={`relative flex h-16 items-end bg-gradient-to-br p-3 ${getListColor(listIndex)}`}
                  >
                    <h3 className="card-title-gradient">{list.Name}</h3>
                  </div>
                  <div className="min-h-[120px] flex-1 overflow-y-auto p-2.5">
                    <div className="space-y-1.5">
                      {(list.TodoItems || []).map((item) => {
                        const itemId = item.Id ?? item.id;
                        const isDone = (item.Status || item.status) === "done";
                        const isToggling =
                          togglingItemKey === `${list.Id}-${itemId}`;
                        return (
                          <div
                            key={itemId}
                            className={`group flex items-start gap-2.5 rounded-md border px-2.5 py-2 transition-colors ${
                              isDone
                                ? "border-transparent bg-neutral-50"
                                : "border-neutral-100 bg-white hover:border-neutral-200 hover:bg-neutral-50/50"
                            }`}
                          >
                            <button
                              type="button"
                              disabled={isToggling}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleItemStatus(list.Id, item);
                              }}
                              className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded transition-all focus:outline-none disabled:cursor-not-allowed disabled:opacity-70 ${
                                isDone
                                  ? "bg-indigo-500 text-white"
                                  : "bg-neutral-200 hover:bg-indigo-100"
                              }`}
                              aria-label={
                                isDone ? "Mark incomplete" : "Mark complete"
                              }
                              aria-busy={isToggling}
                            >
                              {isToggling ? (
                                <Loader2 className="h-2.5 w-2.5 animate-spin" />
                              ) : isDone ? (
                                <Check className="h-2.5 w-2.5" />
                              ) : null}
                            </button>
                            <div
                              className="min-w-0 flex-1 cursor-pointer py-0.5"
                              onClick={() => openEditItem(item, list.Id)}
                              onKeyDown={(e) =>
                                e.key === "Enter" && openEditItem(item, list.Id)
                              }
                              role="button"
                              tabIndex={0}
                            >
                              <p
                                className={`typography-body-sm leading-snug ${
                                  isDone
                                    ? "text-neutral-500 line-through"
                                    : "font-medium text-neutral-800"
                                }`}
                              >
                                {item.Title}
                              </p>
                              {item.DueDate && (
                                <span className="mt-0.5 inline-flex items-center gap-1 typography-caption text-neutral-500">
                                  <Calendar className="h-3 w-3 shrink-0" />
                                  {new Date(item.DueDate).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setItemToDelete({
                                  todoListId: list.Id,
                                  itemId: item.Id,
                                });
                              }}
                              className="shrink-0 rounded p-1 text-neutral-400 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-danger-50 hover:text-danger-600 focus:opacity-100 focus:outline-none"
                              aria-label="Delete item"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                    {addingItemListId === list.Id ? (
                      <form
                        onSubmit={itemForm.handleSubmit((v) =>
                          handleCreateItem(list.Id, v),
                        )}
                        className="w-full mt-2 space-y-1"
                      >
                        <CustomInput
                          name="Title"
                          placeholder="Task title"
                          register={itemForm.register}
                          errors={itemForm.formState.errors}
                          isRequired
                          size="sm"
                          escapeKey={() => setAddingItemListId(null)}
                        />
                        <p className="text-[10px] text-neutral-500">
                          Press <span className="font-bold">Enter</span> to add
                          the task or <span className="font-bold">Escape</span>{" "}
                          to cancel
                        </p>
                      </form>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setAddingItemListId(list.Id)}
                        className="mt-2 flex w-full items-center justify-center gap-2 rounded-md border-2 border-dashed border-neutral-200 py-1 typography-body-sm text-neutral-500 transition-colors hover:border-neutral-300 hover:bg-neutral-50 hover:text-neutral-600"
                      >
                        Add task
                      </button>
                    )}
                  </div>
                  <div className="flex w-full items-center gap-2 border-t border-neutral-200 bg-neutral-50/50 p-2">
                    <div className="flex items-center gap-1.5 rounded-md bg-indigo-50 px-2 py-1">
                      <CheckSquare className="h-3.5 w-3.5 text-indigo-600" />
                      <span className="text-xs font-semibold text-indigo-700">
                        {(list.TodoItems || []).length} task
                        {(list.TodoItems || []).length !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="h-4 w-px shrink-0 bg-neutral-200" />
                    <div className="flex flex-1 gap-1">
                      <button
                        type="button"
                        onClick={() => openEditList(list)}
                        className="action-icon-edit min-w-0 flex-1 rounded-md bg-neutral-100 py-2 hover:bg-neutral-200"
                        aria-label="Edit list"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setListToDeleteId(list.Id)}
                        className="action-icon-delete min-w-0 flex-1 rounded-md bg-danger-50 py-2 hover:bg-danger-100"
                        aria-label="Delete list"
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

        {/* Filter modal */}
        <Modal
          show={showFilterModal}
          onClose={() => setShowFilterModal(false)}
          title="Filters"
          size="md"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <SimpleSelect
              label="Status"
              options={statusFilterOptions}
              value={filters.status}
              onChange={(v) => setFilters((f) => ({ ...f, status: v }))}
              placeholder="All statuses"
              className="min-w-0"
            />
            <SimpleSelect
              label="Due date"
              options={DUE_FILTER_OPTIONS}
              value={filters.due}
              onChange={(v) => setFilters((f) => ({ ...f, due: v }))}
              placeholder="Any"
              className="min-w-0"
            />
            <SimpleSelect
              label="Priority"
              options={priorityFilterOptions}
              value={filters.priority}
              onChange={(v) => setFilters((f) => ({ ...f, priority: v }))}
              placeholder="All priorities"
              className="min-w-0"
            />
            <SimpleSelect
              label="Sort by"
              options={SORT_OPTIONS}
              value={filters.sort}
              onChange={(v) => setFilters((f) => ({ ...f, sort: v }))}
              placeholder="Sort"
              className="min-w-0"
            />
            <SimpleSelect
              label="Order"
              options={SORT_ORDER_OPTIONS}
              value={filters.order}
              onChange={(v) => setFilters((f) => ({ ...f, order: v }))}
              placeholder="Order"
              className="min-w-0"
            />
          </div>
        </Modal>

        {/* Create list modal */}
        <Modal
          show={showCreateListModal}
          onClose={() => setShowCreateListModal(false)}
          title="Create todo list"
          size="md"
        >
          <form
            onSubmit={listForm.handleSubmit(handleCreateList)}
            className="space-y-4"
          >
            <CustomInput
              label="List name"
              name="Name"
              placeholder="e.g. Work tasks"
              register={listForm.register}
              errors={listForm.formState.errors}
              isRequired
            />
            <div className="flex justify-end gap-3 pt-2 border-t border-neutral-200">
              <CustomButton
                type="button"
                text="Cancel"
                variant="cancel"
                onClick={() => setShowCreateListModal(false)}
              />
              <CustomButton
                type="submit"
                text="Create"
                variant="primary"
                loading={createListState?.isLoading}
              />
            </div>
          </form>
        </Modal>

        {/* Edit list modal */}
        <Modal
          show={!!editingList}
          onClose={() => setEditingList(null)}
          title="Edit todo list"
          size="md"
        >
          <form
            onSubmit={editListForm.handleSubmit(handleUpdateList)}
            className="space-y-4 p-2"
          >
            <CustomInput
              label="List name"
              name="Name"
              placeholder="e.g. Work tasks"
              register={editListForm.register}
              errors={editListForm.formState.errors}
              isRequired
            />
            <div className="flex justify-end gap-3 pt-2 border-t border-neutral-200">
              <CustomButton
                type="button"
                text="Cancel"
                variant="cancel"
                onClick={() => setEditingList(null)}
              />
              <CustomButton
                type="submit"
                text="Save"
                variant="primary"
                loading={updateListState?.isLoading}
              />
            </div>
          </form>
        </Modal>

        {/* Edit item modal */}
        <Modal
          show={!!editingItem}
          onClose={() => setEditingItem(null)}
          title="Edit task"
          size="md"
        >
          {editingItem && (
            <form
              onSubmit={editItemForm.handleSubmit((v) =>
                handleUpdateItem(editingItem._todoListId, editingItem.Id, v),
              )}
              className="space-y-4 p-2"
            >
              <CustomInput
                label="Title"
                name="Title"
                placeholder="Task title"
                register={editItemForm.register}
                errors={editItemForm.formState.errors}
                isRequired
              />
              <TextArea
                label="Description"
                name="Description"
                placeholder="Description (optional)"
                register={editItemForm.register}
                errors={editItemForm.formState.errors}
              />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Controller
                  name="Status"
                  control={editItemForm.control}
                  render={({ field }) => (
                    <SimpleSelect
                      label="Status"
                      options={STATUS_OPTIONS}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                <Controller
                  name="Priority"
                  control={editItemForm.control}
                  render={({ field }) => (
                    <SimpleSelect
                      label="Priority"
                      options={PRIORITY_OPTIONS}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
              <CustomInput
                label="Due date"
                name="DueDate"
                type="date"
                register={editItemForm.register}
                errors={editItemForm.formState.errors}
              />
              <div className="flex justify-end gap-3 pt-2 border-t border-neutral-200">
                <CustomButton
                  type="button"
                  text="Cancel"
                  variant="cancel"
                  onClick={() => setEditingItem(null)}
                />
                <CustomButton
                  type="submit"
                  text="Save"
                  variant="primary"
                  loading={updateItemState?.isLoading}
                />
              </div>
            </form>
          )}
        </Modal>

        {/* Delete list confirmation */}
        <ConfirmationModal
          show={!!listToDeleteId}
          onClose={() => setListToDeleteId(null)}
          onConfirm={handleDeleteList}
          title="Delete todo list"
          description="This list and all its tasks will be permanently removed."
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
          loading={deleteListState?.isLoading}
        />

        {/* Delete item confirmation */}
        <ConfirmationModal
          show={!!itemToDelete}
          onClose={() => setItemToDelete(null)}
          onConfirm={handleDeleteItem}
          title="Delete task"
          description="This task will be permanently removed."
          confirmText="Delete"
          cancelText="Cancel"
          variant="danger"
          loading={deleteItemState?.isLoading}
        />
      </div>
    </div>
  );
}
