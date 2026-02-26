"use client";

import { Building2, Plus } from "lucide-react";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomDataTable from "@/common/components/custom-data-table/custom-data-table.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import Loader from "@/common/components/loader/loader.component";
import Modal from "@/common/components/modal/modal.component";
import PageHeader from "@/common/components/page-header/page-header.component";
import useSuperAdminOrganizationsList from "./organizations-list.hook";

export default function SuperAdminOrganizationsList() {
  const {
    loading,
    error,
    message,
    list,
    tableData,
    ORG_TABLE_COLUMNS,
    ORG_TABLE_ACTIONS,
    handleActionClick,
    editOrgId,
    editName,
    setEditName,
    editSlug,
    setEditSlug,
    editLoading,
    closeEdit,
    handleSaveEdit,
    updateState,
    deleteOrgId,
    deleteOrgName,
    closeDelete,
    handleDelete,
    deleteState,
    showCreateModal,
    openCreateModal,
    closeCreateModal,
    createForm,
    handleCreateSubmit,
    createState,
    createSuccessMessage,
    setCreateSuccessMessage,
  } = useSuperAdminOrganizationsList();

  return (
    <div className="min-h-full">
      <PageHeader
        title="Organizations"
        subtitle="All workspaces. Create a new one and assign an org admin by email; org admins manage members and settings."
        actions={
          <CustomButton
            type="button"
            text="Create organization"
            variant="primary"
            onClick={openCreateModal}
          />
        }
        className="px-4 sm:px-5"
      />
      <div className="px-4 sm:px-5">
        {createSuccessMessage && (
          <div className="mb-4 flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
            <span>
              Organization created. An invitation was sent to{" "}
              <strong>{createSuccessMessage}</strong> to sign up and accept to
              become org admin.
            </span>
            <button
              type="button"
              onClick={() => setCreateSuccessMessage(null)}
              className="shrink-0 rounded p-1 text-green-600 hover:bg-green-100"
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
        )}
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {message || "Failed to load organizations."}
          </div>
        )}
        {!error && list.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-neutral-200 bg-white py-12 text-center">
            <Building2 className="mb-3 h-12 w-12 text-neutral-400" />
            <p className="typography-body text-neutral-600">
              No organizations yet.
            </p>
            <p className="mt-1 typography-caption text-neutral-500">
              Create one and assign an org admin by email.
            </p>
            <CustomButton
              type="button"
              text="Create organization"
              variant="primary"
              startIcon={<Plus className="h-4 w-4" />}
              onClick={openCreateModal}
              className="mt-4"
            />
          </div>
        )}
        {!error && list.length > 0 && (
          <div className="w-full overflow-hidden">
            <CustomDataTable
              className="w-full"
              columns={ORG_TABLE_COLUMNS}
              data={tableData}
              loading={false}
              selectable={false}
              searchable={false}
              paginated={tableData.length > 10}
              pageSize={10}
              actions={ORG_TABLE_ACTIONS}
              onActionClick={handleActionClick}
              emptyMessage="No organizations yet. Create one and assign an org admin by email."
              tableClassName="min-w-full divide-y divide-neutral-200"
              headerClassName="border-neutral-200"
            />
          </div>
        )}
      </div>

      <Modal
        show={!!editOrgId}
        onClose={closeEdit}
        title="Edit organization"
        size="md"
      >
        <div className="space-y-4 px-1">
          {editLoading ? (
            <div className="flex justify-center py-4">
              <Loader loading />
            </div>
          ) : (
            <>
              <CustomInput
                label="Name"
                name="editName"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Organization name"
              />
              <CustomInput
                label="Slug (optional)"
                name="editSlug"
                value={editSlug}
                onChange={(e) => setEditSlug(e.target.value)}
                placeholder="e.g. acme-inc"
                helperText="Lowercase, numbers and hyphens only."
              />
              <div className="flex justify-end gap-2 pt-2">
                <CustomButton
                  type="button"
                  text="Cancel"
                  variant="cancel"
                  onClick={closeEdit}
                />
                <CustomButton
                  type="button"
                  text="Save"
                  variant="primary"
                  onClick={handleSaveEdit}
                  loading={updateState?.isLoading}
                  disabled={!editName?.trim()}
                />
              </div>
            </>
          )}
        </div>
      </Modal>

      <Modal
        show={showCreateModal}
        onClose={closeCreateModal}
        title="Create organization"
        size="md"
      >
        <form
          onSubmit={createForm.handleSubmit(handleCreateSubmit)}
          className="space-y-4"
        >
          <CustomInput
            label="Workspace name"
            name="Name"
            placeholder="Acme Inc"
            register={createForm.register}
            errors={createForm.formState.errors}
            isRequired
          />
          <CustomInput
            label="Org admin email"
            name="OwnerEmail"
            type="email"
            placeholder="orgadmin@example.com"
            register={createForm.register}
            errors={createForm.formState.errors}
            isRequired
          />
          <CustomInput
            label="Slug (optional)"
            name="Slug"
            placeholder="acme-inc"
            register={createForm.register}
            errors={createForm.formState.errors}
            helperText="Lowercase, numbers and hyphens only. Auto-generated if empty."
          />
          <div className="flex justify-end gap-2 pt-2">
            <CustomButton
              type="button"
              text="Cancel"
              variant="cancel"
              onClick={closeCreateModal}
            />
            <CustomButton
              type="submit"
              text="Create organization"
              variant="primary"
              loading={createState?.isLoading}
              disabled={createForm.formState.isSubmitting}
            />
          </div>
        </form>
      </Modal>

      <Modal
        show={!!deleteOrgId}
        onClose={closeDelete}
        title="Delete organization"
        size="md"
        variant="danger"
      >
        <div className="space-y-4">
          <p className="typography-body text-neutral-700">
            Are you sure you want to delete <strong>{deleteOrgName}</strong>?
            This will permanently remove the workspace and its data. This action
            cannot be undone.
          </p>
          <div className="flex justify-end gap-2">
            <CustomButton
              type="button"
              text="Cancel"
              variant="cancel"
              onClick={closeDelete}
            />
            <CustomButton
              type="button"
              text="Delete"
              variant="danger"
              onClick={handleDelete}
              loading={deleteState?.isLoading}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
