"use client";

import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomDataTable from "@/common/components/custom-data-table/custom-data-table.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import Modal from "@/common/components/modal/modal.component";
import NoResultFound from "@/common/components/no-result-found/no-result-found.jsx";
import { Building2 } from "lucide-react";
import useWorkspaceSettings from "./use-workspace-settings.hook";

const SEPARATOR_COLORS = [
  "from-indigo-500 to-indigo-700",
  "from-emerald-500 to-emerald-700",
  "from-amber-500 to-amber-700",
  "from-rose-500 to-rose-700",
  "from-sky-500 to-sky-700",
  "from-violet-500 to-violet-700",
];

export default function WorkspaceSettings() {
  const {
    organizations,
    showCreateModal,
    showDeleteModal,
    orgToEditId,
    orgToDelete,
    editWorkspaceNameValue,
    setEditWorkspaceNameValue,
    createForm,
    createState,
    updateState,
    deleteState,
    workspaceTableColumns,
    workspaceTableData,
    getActions,
    openCreateModal,
    closeEditOrgModal,
    handleSaveEditOrg,
    openDeleteOrgModal,
    closeDeleteOrgModal,
    handleDeleteOrg,
    onSubmitCreate,
    setShowCreateModal,
    handleWorkspaceActionClick,
  } = useWorkspaceSettings();

  return (
    <div className="min-h-full">
      <div className="page-header-bar">
        <div className="page-header-divider" />
        <div className="min-w-0 flex-1 overflow-hidden">
          <h1 className="page-header-title">Manage workspaces</h1>
          <p className="page-header-subtitle">Switch or manage a workspace</p>
        </div>
        <CustomButton
          type="button"
          text="Create workspace"
          variant="primary"
          size="sm"
          onClick={openCreateModal}
          className="shrink-0"
        />
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

      {!organizations?.length ? (
        <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
          <NoResultFound
            icon={Building2}
            title="No workspaces yet"
            description="Create one using the Create workspace button."
            variant="compact"
          />
        </div>
      ) : (
        <div className="w-full overflow-hidden px-4 sm:px-5">
          <CustomDataTable
            className="w-full"
            columns={workspaceTableColumns}
            data={workspaceTableData}
            loading={false}
            selectable={false}
            searchable={false}
            paginated={workspaceTableData.length > 10}
            pageSize={10}
            getActions={getActions}
            onActionClick={handleWorkspaceActionClick}
            emptyMessage="No workspaces yet. Create one using the Create workspace button."
            tableClassName="min-w-full divide-y divide-neutral-200"
            headerClassName="border-neutral-200"
          />
        </div>
      )}

      <Modal
        show={!!orgToEditId}
        onClose={closeEditOrgModal}
        title="Edit workspace"
        size="md"
      >
        <div className="space-y-4">
          <CustomInput
            label="Workspace name"
            name="editWorkspaceName"
            value={editWorkspaceNameValue}
            onChange={(e) => setEditWorkspaceNameValue(e.target.value)}
            placeholder="e.g. Acme Inc"
          />
          <div className="flex justify-end gap-2 pt-2">
            <CustomButton
              type="button"
              text="Cancel"
              variant="cancel"
              onClick={closeEditOrgModal}
            />
            <CustomButton
              type="button"
              text="Save"
              variant="primary"
              onClick={handleSaveEditOrg}
              loading={updateState?.isLoading}
            />
          </div>
        </div>
      </Modal>

      <Modal
        show={showDeleteModal}
        onClose={closeDeleteOrgModal}
        title="Delete workspace"
        size="md"
        variant="danger"
      >
        <div className="space-y-4">
          <p className="typography-body text-neutral-700">
            Are you sure you want to delete{" "}
            <strong>{orgToDelete?.Name || "this workspace"}</strong>? This will
            permanently remove all projects, KPIs, and members. This action
            cannot be undone.
          </p>
          <div className="flex justify-end gap-2">
            <CustomButton
              type="button"
              text="Cancel"
              variant="cancel"
              onClick={closeDeleteOrgModal}
            />
            <CustomButton
              type="button"
              text="Delete"
              variant="danger"
              onClick={handleDeleteOrg}
              loading={deleteState?.isLoading}
            />
          </div>
        </div>
      </Modal>

      <Modal
        show={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          createForm.reset();
        }}
        title="Create workspace"
        size="md"
      >
        <form
          onSubmit={createForm.handleSubmit(onSubmitCreate)}
          className="space-y-5"
        >
          <CustomInput
            label="Workspace name"
            name="Name"
            placeholder="e.g. Acme Inc"
            register={createForm.register}
            errors={createForm.formState.errors}
            isRequired
          />
          <div className="flex justify-end gap-2 border-t border-neutral-200 pt-2">
            <CustomButton
              type="button"
              text="Cancel"
              variant="cancel"
              onClick={() => {
                setShowCreateModal(false);
                createForm.reset({ Name: "" });
              }}
            />
            <CustomButton
              type="submit"
              text="Create"
              variant="primary"
              loading={createState?.isLoading}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
