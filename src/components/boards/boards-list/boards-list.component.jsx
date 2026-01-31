"use client";

import Link from "next/link";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import Modal from "@/common/components/modal/modal.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import Loader from "@/common/components/loader/loader.component";
import TextArea from "@/common/components/text-area/text-area.component";
import { Plus, LayoutGrid } from "lucide-react";
import useBoardsList from "./use-boards-list.hook";

const BOARD_CARD_COLORS = [
  "bg-gradient-to-br from-indigo-500 to-indigo-700",
  "bg-gradient-to-br from-emerald-500 to-emerald-700",
  "bg-gradient-to-br from-amber-500 to-amber-700",
  "bg-gradient-to-br from-rose-500 to-rose-700",
  "bg-gradient-to-br from-sky-500 to-sky-700",
  "bg-gradient-to-br from-violet-500 to-violet-700",
];

function getBoardColor(index) {
  return BOARD_CARD_COLORS[index % BOARD_CARD_COLORS.length];
}

export default function BoardsList() {
  const {
    boards,
    loading,
    showCreateModal,
    setShowCreateModal,
    register,
    handleSubmit,
    errors,
    onSubmitCreate,
  } = useBoardsList();

  return (
    <div className="min-h-full p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800">Your boards</h1>
          <p className="mt-0.5 text-sm text-neutral-500">
            Create and manage boards with lists and cards
          </p>
        </div>
        <CustomButton
          text="Create board"
          onClick={() => setShowCreateModal(true)}
          variant="primary"
          startIcon={<Plus className="h-4 w-4" />}
          className="rounded-lg px-4 py-2.5 text-sm font-medium"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <Loader loading />
        </div>
      ) : !boards?.length ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-200 bg-neutral-50/60 py-20 px-6 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-100 text-primary-600">
            <LayoutGrid className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-semibold text-neutral-800">
            No boards yet
          </h2>
          <p className="mt-2 max-w-sm text-sm text-neutral-500">
            Create your first board to organize tasks with lists and cards—just
            like Trello.
          </p>
          <CustomButton
            text="Create your first board"
            onClick={() => setShowCreateModal(true)}
            variant="primary"
            className="mt-6 rounded-lg px-5 py-2.5"
          />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {boards.map((board, index) => (
            <Link
              key={board.Id}
              href={`/boards/${board.Id}`}
              className="group block outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-lg"
            >
              <div className="relative h-[10px] overflow-hidden rounded-t-lg transition-opacity group-hover:opacity-95">
                <div className={`absolute inset-0 ${getBoardColor(index)}`} />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5" />
              </div>
              <div className="rounded-b-lg border border-t-0 border-neutral-200 bg-white p-4 shadow-sm transition-shadow group-hover:shadow-md">
                <h3 className="font-semibold text-neutral-800 group-hover:text-primary-600">
                  {board.Name}
                </h3>
                {board.Description ? (
                  <p className="mt-1 line-clamp-2 text-sm text-neutral-500">
                    {board.Description}
                  </p>
                ) : (
                  <p className="mt-1 text-sm text-neutral-400">
                    No description
                  </p>
                )}
                <p className="mt-3 text-xs font-medium text-neutral-400">
                  {board.Lists?.length ?? 0} list
                  {(board.Lists?.length ?? 0) !== 1 ? "s" : ""}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      <Modal
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Board"
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmitCreate)} className="space-y-4 p-2">
          <CustomInput
            label="Board Name"
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
          <div className="flex justify-end gap-3 pt-2">
            <CustomButton
              type="button"
              text="Cancel"
              variant="cancel"
              onClick={() => setShowCreateModal(false)}
            />
            <CustomButton type="submit" text="Create" variant="primary" />
          </div>
        </form>
      </Modal>
    </div>
  );
}
