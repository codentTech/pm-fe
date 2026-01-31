"use client";

import Link from "next/link";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import Modal from "@/common/components/modal/modal.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import Loader from "@/common/components/loader/loader.component";
import { Plus, LayoutGrid } from "lucide-react";
import useBoardsList from "./use-boards-list.hook";

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
    <div className="p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-neutral-800">My Boards</h2>
          <p className="mt-1 text-sm text-neutral-500">
            Create and manage boards for your projects
          </p>
        </div>
        <CustomButton
          text="Create Board"
          onClick={() => setShowCreateModal(true)}
          variant="primary"
          startIcon={<Plus className="h-4 w-4" />}
          className="rounded-xl px-5 py-2.5"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <Loader loading />
        </div>
      ) : !boards?.length ? (
        <div className="card flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-200 bg-neutral-50/50 py-16 px-6 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary-100 text-primary-600">
            <LayoutGrid className="h-7 w-7" />
          </div>
          <h3 className="text-lg font-medium text-neutral-800">
            No boards yet
          </h3>
          <p className="mt-2 max-w-sm text-sm text-neutral-500">
            Create your first board to start organizing tasks with lists and
            cards.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {boards.map((board) => (
            <Link
              key={board.Id}
              href={`/boards/${board.Id}`}
              className="group block"
            >
              <div className="card h-full rounded-xl border-neutral-200 p-5 shadow-sm transition-all duration-200 group-hover:border-primary-200 group-hover:shadow-md">
                <h3 className="font-semibold text-neutral-800 group-hover:text-primary-600">
                  {board.Name}
                </h3>
                {board.Description ? (
                  <p className="mt-2 line-clamp-2 text-sm text-neutral-500">
                    {board.Description}
                  </p>
                ) : (
                  <p className="mt-2 text-sm text-neutral-400">
                    No description
                  </p>
                )}
                <p className="mt-4 text-xs font-medium text-neutral-400">
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
        title="Create new board"
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmitCreate)} className="space-y-4">
          <CustomInput
            label="Board name"
            name="Name"
            placeholder="e.g. Project Alpha"
            register={register}
            errors={errors}
            isRequired
          />
          <CustomInput
            label="Description"
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
