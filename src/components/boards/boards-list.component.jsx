"use client";

import ConfirmationModal from "@/common/components/confirmation-modal/confirmation-modal.component";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select.jsx";
import Modal from "@/common/components/modal/modal.component";
import NoResultFound from "@/common/components/no-result-found/no-result-found.jsx";
import ProjectsListSkeleton from "@/common/components/skeleton/projects-list-skeleton.component";
import TextArea from "@/common/components/text-area/text-area.component";
import { BOARD_CARD_COLORS } from "@/common/constants/colors.constant";
import {
  PROJECT_DELIVERY_TYPE_OPTIONS,
  PROJECT_RISK_LEVEL_OPTIONS,
  PROJECT_STATUS_OPTIONS,
} from "@/common/constants/project.constant";
import OnboardingBanner from "@/components/onboarding/onboarding-banner.component";
import { LayoutGrid, LayoutList, Pencil, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { Controller } from "react-hook-form";
import useBoardsList from "./use-boards-list.hook";

function getProjectColor(index) {
  return BOARD_CARD_COLORS[index % BOARD_CARD_COLORS.length];
}

function getProjectStatusLabel(status) {
  return (
    PROJECT_STATUS_OPTIONS.find((s) => s.value === (status || "").toLowerCase())
      ?.label ||
    status ||
    "—"
  );
}

export default function BoardsList() {
  const {
    projects,
    loading,
    showCreateModal,
    setShowCreateModal,
    editingProject,
    setEditingProject,
    projectToDeleteId,
    setProjectToDeleteId,
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
    handleDeleteProject,
    createLoading,
    updateLoading,
    deleteLoading,
  } = useBoardsList();

  return (
    <div className="min-h-full">
      <div className="page-header-bar px-4 sm:px-5">
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
          size="sm"
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

      {!loading && !projects?.length && (
        <OnboardingBanner hasProjects={!!projects?.length} />
      )}

      {loading ? (
        <ProjectsListSkeleton />
      ) : !projects?.length ? (
        <NoResultFound
          icon={LayoutGrid}
          title="No projects yet"
          description="Create your first project to organize tasks with lists and cards."
        />
      ) : (
        <div className="grid gap-4 px-4 sm:px-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {projects.map((project, index) => (
            <div
              key={project.Id}
              className={`group rounded-lg bg-gradient-to-br p-[2px] ${getProjectColor(index)}`}
            >
              <div className="flex h-full flex-col overflow-hidden rounded-lg bg-white">
                <Link
                  href={`/projects/${project.Id}`}
                  className="flex-1 block outline-none rounded-t-lg"
                >
                  <div
                    className={`relative flex h-20 items-start bg-gradient-to-br p-3 ${getProjectColor(index)}`}
                  >
                    <h3 className="card-title-gradient">{project.Name}</h3>
                    <span className="absolute right-3 bottom-3 rounded-lg bg-white/90 px-2 py-0.5 text-[12px] font-semibold text-neutral-700">
                      {getProjectStatusLabel(project.Status)}
                    </span>
                  </div>
                  <div className="flex flex-col p-3">
                    <p className="line-clamp-2 text-xs text-neutral-600">
                      {(
                        project.Description ??
                        project.description ??
                        ""
                      ).trim() || "No description"}
                    </p>
                  </div>
                </Link>
                <div className="flex w-full items-center gap-2 border-t border-neutral-200 bg-neutral-50/50 p-2">
                  <div className="flex items-center gap-1.5 rounded-md bg-indigo-50 px-2 py-1">
                    <LayoutList className="h-3.5 w-3.5 text-indigo-600" />
                    <span className="text-xs font-semibold text-indigo-700">
                      {project.Lists?.length ?? 0} list
                      {(project.Lists?.length ?? 0) !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="h-4 w-px shrink-0 bg-neutral-200" />
                  <div className="flex flex-1 gap-1">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setEditingProject(project);
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
                        setProjectToDeleteId(project.Id);
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
        size="xl"
      >
        <form
          onSubmit={handleSubmit(onSubmitCreate)}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4"
        >
          {/* Project name */}
          <CustomInput
            label="Project name"
            name="Name"
            placeholder="e.g. Project Alpha"
            register={register}
            errors={errors}
            isRequired
          />

          {/* Client name */}
          <CustomInput
            label="Client name"
            name="ClientDisplayName"
            placeholder="Client"
            register={register}
            errors={errors}
          />

          {/* Start date */}
          <CustomInput
            label="Start date"
            name="StartDate"
            type="date"
            register={register}
            errors={errors}
          />

          {/* Delivery type */}
          <Controller
            name="DeliveryType"
            control={createForm.control}
            render={({ field }) => (
              <SimpleSelect
                label="Delivery type"
                options={PROJECT_DELIVERY_TYPE_OPTIONS}
                value={field.value}
                onChange={field.onChange}
                placeholder="Select delivery type…"
              />
            )}
          />

          {/* Status */}
          <Controller
            name="Status"
            control={createForm.control}
            render={({ field }) => (
              <SimpleSelect
                label="Status"
                options={PROJECT_STATUS_OPTIONS}
                value={field.value}
                onChange={field.onChange}
                placeholder="Select status…"
              />
            )}
          />

          {/* Risk level */}
          <Controller
            name="RiskLevel"
            control={createForm.control}
            render={({ field }) => (
              <SimpleSelect
                label="Risk level"
                options={PROJECT_RISK_LEVEL_OPTIONS}
                value={field.value}
                onChange={field.onChange}
                placeholder="Select risk…"
              />
            )}
          />

          {/* External reference ID */}
          <CustomInput
            label="External reference ID"
            name="ExternalReferenceId"
            placeholder="External ID"
            register={register}
            errors={errors}
          />

          {/* ✅ Full-width TextArea */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-4">
            <TextArea
              label="Description (optional)"
              name="Description"
              placeholder="Brief description"
              register={register}
              errors={errors}
            />
          </div>

          {/* Footer buttons */}
          <div className="col-span-full flex justify-end gap-3 pt-4 mt-2 border-t border-neutral-200">
            <CustomButton
              type="button"
              text="Cancel"
              variant="cancel"
              onClick={() => setShowCreateModal(false)}
              disabled={createLoading}
            />
            <CustomButton
              type="submit"
              text="Create"
              variant="primary"
              loading={createLoading}
            />
          </div>
        </form>
      </Modal>

      <Modal
        show={!!editingProject}
        onClose={() => setEditingProject(null)}
        title="Edit project"
        size="xl"
      >
        <form
          onSubmit={handleEditSubmit(onSubmitEdit)}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-4 sm:px-5"
        >
          <CustomInput
            label="Project name"
            name="Name"
            placeholder="e.g. Project Alpha"
            register={editRegister}
            errors={editErrors}
            isRequired
          />

          <CustomInput
            label="Client name"
            name="ClientDisplayName"
            placeholder="Client"
            register={editRegister}
            errors={editErrors}
          />

          <CustomInput
            label="Start date"
            name="StartDate"
            type="date"
            register={editRegister}
            errors={editErrors}
          />

          <Controller
            name="DeliveryType"
            control={editForm.control}
            render={({ field }) => (
              <SimpleSelect
                label="Delivery type"
                options={PROJECT_DELIVERY_TYPE_OPTIONS}
                value={field.value}
                onChange={field.onChange}
                placeholder="Select delivery type…"
              />
            )}
          />

          <Controller
            name="Status"
            control={editForm.control}
            render={({ field }) => (
              <SimpleSelect
                label="Status"
                options={PROJECT_STATUS_OPTIONS}
                value={field.value}
                onChange={field.onChange}
                placeholder="Select status…"
              />
            )}
          />

          <Controller
            name="RiskLevel"
            control={editForm.control}
            render={({ field }) => (
              <SimpleSelect
                label="Risk level"
                options={PROJECT_RISK_LEVEL_OPTIONS}
                value={field.value}
                onChange={field.onChange}
                placeholder="Select risk…"
              />
            )}
          />

          <CustomInput
            label="External reference ID"
            name="ExternalReferenceId"
            placeholder="External ID"
            register={editRegister}
            errors={editErrors}
          />

          <div className="col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-4 mt-2">
            <TextArea
              label="Description (optional)"
              name="Description"
              placeholder="Brief description"
              register={editRegister}
              errors={editErrors}
            />
          </div>

          <div className="col-span-full flex justify-end gap-3 pt-4 mt-2 border-t border-neutral-200">
            <CustomButton
              type="button"
              text="Cancel"
              variant="cancel"
              onClick={() => setEditingProject(null)}
              disabled={updateLoading}
            />
            <CustomButton
              type="submit"
              text="Save"
              variant="primary"
              loading={updateLoading}
            />
          </div>
        </form>
      </Modal>

      <ConfirmationModal
        show={!!projectToDeleteId}
        onClose={() => setProjectToDeleteId(null)}
        onConfirm={handleDeleteProject}
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
