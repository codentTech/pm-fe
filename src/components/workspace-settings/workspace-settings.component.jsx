"use client";

import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomDataTable from "@/common/components/custom-data-table/custom-data-table.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select.jsx";
import InlineEditInput from "@/common/components/inline-edit-input/inline-edit-input.component";
import Loader from "@/common/components/loader/loader.component";
import Modal from "@/common/components/modal/modal.component";
import NoResultFound from "@/common/components/no-result-found/no-result-found.jsx";
import {
  LABEL_COLORS,
  WORKSPACE_ROLE_LABELS,
  WORKSPACE_ROLE_OPTIONS,
} from "@/common/constants/workspace-role.constant";
import {
  Building2,
  Mail,
  Pencil,
  Plus,
  Send,
  Tag,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import { Controller } from "react-hook-form";
import useWorkspaceSettings from "./use-workspace-settings.hook";

export default function WorkspaceSettings() {
  const {
    view,
    organizations,
    currentOrganizationId,
    selectedOrgId,
    selectedOrg,
    orgToEditId,
    orgToDelete,
    editWorkspaceNameValue,
    setEditWorkspaceNameValue,
    members,
    membersLoading,
    cancellingId,
    resendingId,
    showInviteForm,
    showCreateModal,
    editingWorkspaceName,
    workspaceNameValue,
    setWorkspaceNameValue,
    showDeleteModal,
    showLabelForm,
    editingLabelId,
    editingLabelNameValue,
    setEditingLabelNameValue,
    editingLabelColorId,
    showLabelDeleteModal,
    labelToDelete,
    createState,
    createInvitationState,
    updateState,
    deleteState,
    fetchState,
    fetchLabelsState,
    createLabelState,
    updateLabelState,
    deleteLabelState,
    inviteForm,
    createForm,
    labelForm,
    handleSelectOrg,
    handleBack,
    handleStartWorkspaceRename,
    handleSaveWorkspaceRename,
    handleCancelWorkspaceRename,
    handleStartLabelNameEdit,
    handleSaveLabelNameEdit,
    handleCancelLabelNameEdit,
    handleStartLabelColorEdit,
    handleSaveLabelColorEdit,
    handleCancelLabelColorEdit,
    handleDeleteLabel,
    handleSwitchWorkspace,
    handleCancelInvite,
    handleResendInvite,
    handleDeleteOrg,
    onSubmitLabelCreate,
    onSubmitInvite,
    onSubmitCreate,
    toggleShowInviteForm,
    toggleShowLabelForm,
    openCreateModal,
    openEditOrgModal,
    closeEditOrgModal,
    handleSaveEditOrg,
    openDeleteOrgModal,
    closeDeleteOrgModal,
    setShowCreateModal,
    setShowLabelDeleteModal,
    setLabelToDelete,
    setShowInviteForm,
    pendingByOrg,
    labels,
    workspaceTableColumns,
    workspaceTableData,
    workspaceTableActions,
    handleWorkspaceActionClick,
  } = useWorkspaceSettings();

  return (
    <div className="min-h-full">
      <div>
        {view === "list" ? (
          <>
            <div className="page-header-bar mt-4">
              <div className="page-header-divider" />
              <div className="min-w-0 flex-1 overflow-hidden">
                <h1 className="page-header-title">Manage workspaces</h1>
                <p className="page-header-subtitle">
                  Select a workspace to manage members and invitations
                </p>
              </div>
              <CustomButton
                type="button"
                text="Create workspace"
                variant="primary"
                size="sm"
                startIcon={<Plus className="h-4 w-4" />}
                onClick={openCreateModal}
                className="shrink-0"
              />
            </div>

            <div className="page-separator" aria-hidden>
              <span className="page-separator-line" />
              <span className="flex gap-1">
                {[
                  "from-indigo-500 to-indigo-700",
                  "from-emerald-500 to-emerald-700",
                  "from-amber-500 to-amber-700",
                  "from-rose-500 to-rose-700",
                  "from-sky-500 to-sky-700",
                  "from-violet-500 to-violet-700",
                ].map((color, i) => (
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
              <div className="w-full overflow-hidden px-4">
                <CustomDataTable
                  className="w-full"
                  columns={workspaceTableColumns}
                  data={workspaceTableData}
                  loading={false}
                  selectable={false}
                  searchable={false}
                  paginated={workspaceTableData.length > 10}
                  pageSize={10}
                  actions={workspaceTableActions}
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
                  <strong>{orgToDelete?.Name || "this workspace"}</strong>? This
                  will permanently remove all projects, KPIs, and members. This
                  action cannot be undone.
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
              variant="neutral"
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
                <div className="flex justify-end gap-2">
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
          </>
        ) : (
          <>
            <div className="mb-4 page-header-bar">
              <div className="page-header-divider" />
              <div className="min-w-0 flex-1 overflow-hidden">
                {editingWorkspaceName ? (
                  <InlineEditInput
                    name="workspaceName"
                    value={workspaceNameValue}
                    onChange={setWorkspaceNameValue}
                    onSave={handleSaveWorkspaceRename}
                    onCancel={handleCancelWorkspaceRename}
                    loading={updateState?.isLoading}
                    placeholder="Workspace name"
                    className="typography-h2 font-bold !text-indigo-600"
                  />
                ) : (
                  <>
                    <h1 className="page-header-title">
                      {selectedOrg?.Name || "Workspace"}
                    </h1>
                    <p className="truncate typography-caption font-medium text-neutral-700">
                      Manage members and invitations
                    </p>
                  </>
                )}
              </div>
              {!editingWorkspaceName && (
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  {selectedOrgId !== currentOrganizationId && (
                    <CustomButton
                      type="button"
                      text="Switch to this workspace"
                      variant="primary"
                      size="sm"
                      onClick={() => handleSwitchWorkspace(selectedOrgId)}
                    />
                  )}
                  <CustomButton
                    type="button"
                    text="Edit"
                    variant="outline"
                    size="sm"
                    startIcon={<Pencil className="h-4 w-4" />}
                    onClick={handleStartWorkspaceRename}
                  />
                  <CustomButton
                    type="button"
                    text="Delete"
                    variant="danger"
                    size="sm"
                    startIcon={<Trash2 className="h-4 w-4" />}
                    onClick={() => openDeleteOrgModal(selectedOrgId)}
                  />
                </div>
              )}
            </div>

            <div className="page-separator" aria-hidden>
              <span className="page-separator-line" />
              <span className="flex gap-1">
                {[
                  "from-indigo-500 to-indigo-700",
                  "from-emerald-500 to-emerald-700",
                  "from-amber-500 to-amber-700",
                  "from-rose-500 to-rose-700",
                  "from-sky-500 to-sky-700",
                  "from-violet-500 to-violet-700",
                ].map((color, i) => (
                  <span
                    key={i}
                    className={`page-separator-dot bg-gradient-to-br ${color}`}
                  />
                ))}
              </span>
              <span className="page-separator-line" />
            </div>

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              <section className="rounded-lg border border-neutral-200 bg-white">
                <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
                  <h3 className="flex items-center gap-2 typography-body font-semibold text-primary-600">
                    <Users className="h-4 w-4 text-primary-500" />
                    Members
                  </h3>
                  <CustomButton
                    type="button"
                    text="Invite"
                    variant="primary"
                    size="sm"
                    startIcon={<UserPlus className="h-4 w-4" />}
                    onClick={toggleShowInviteForm}
                  />
                </div>

                {showInviteForm && (
                  <form
                    onSubmit={inviteForm.handleSubmit(onSubmitInvite)}
                    className="border-b border-neutral-100 bg-neutral-50/30 p-4"
                  >
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <CustomInput
                        label="Email address"
                        name="Email"
                        type="email"
                        placeholder="colleague@example.com"
                        register={inviteForm.register}
                        errors={inviteForm.formState.errors}
                        isRequired
                      />
                      <Controller
                        name="Role"
                        control={inviteForm.control}
                        render={({ field }) => (
                          <SimpleSelect
                            label="Role"
                            name="Role"
                            options={WORKSPACE_ROLE_OPTIONS}
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Select role…"
                            errors={inviteForm.formState.errors}
                          />
                        )}
                      />
                    </div>
                    <div className="mt-4 flex justify-end gap-2">
                      <CustomButton
                        type="button"
                        text="Cancel"
                        variant="cancel"
                        size="sm"
                        onClick={() => {
                          setShowInviteForm(false);
                          inviteForm.reset();
                        }}
                      />
                      <CustomButton
                        type="submit"
                        text="Send invite"
                        variant="primary"
                        size="sm"
                        loading={createInvitationState?.isLoading}
                      />
                    </div>
                  </form>
                )}

                <div className="p-4">
                  {membersLoading ? (
                    <div className="flex justify-center py-10">
                      <Loader loading />
                    </div>
                  ) : members?.length === 0 ? (
                    <NoResultFound
                      icon={Users}
                      title="No members yet"
                      description="Invite teammates to collaborate on this workspace."
                      variant="compact"
                    />
                  ) : (
                    <ul className="divide-y divide-neutral-100">
                      {members.map((m) => (
                        <li
                          key={m.Id}
                          className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                        >
                          <div>
                            <p className="font-medium text-neutral-800">
                              {m.User?.FullName || "Unknown"}
                            </p>
                            <p className="typography-body text-neutral-500">
                              {m.User?.Email}
                            </p>
                          </div>
                          <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 typography-caption font-medium text-indigo-700">
                            {WORKSPACE_ROLE_LABELS[m.Role] || m.Role}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </section>

              <section className="rounded-lg border border-neutral-200 bg-white overflow-hidden">
                <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
                  <h3 className="flex items-center gap-2 typography-body font-semibold text-indigo-600">
                    <Tag className="h-4 w-4 shrink-0 text-indigo-500" />
                    Labels
                  </h3>
                  <CustomButton
                    type="button"
                    text="Add label"
                    variant="primary"
                    size="sm"
                    startIcon={<Plus className="h-4 w-4" />}
                    onClick={toggleShowLabelForm}
                  />
                </div>

                <div className="p-4">
                  {fetchLabelsState?.isLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader loading />
                    </div>
                  ) : !labels?.length ? (
                    <NoResultFound
                      icon={Tag}
                      title="No labels yet"
                      description="Create labels to organize cards across your boards."
                      variant="compact"
                    />
                  ) : (
                    <ul className="divide-y divide-neutral-100">
                      {labels.map((label) => (
                        <li
                          key={label.Id}
                          className="flex flex-col gap-2 py-3 first:pt-0 last:pb-0"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex min-w-0 flex-1 items-center gap-3">
                              {editingLabelColorId === label.Id ? (
                                <div
                                  className="inline-flex flex-wrap gap-1 rounded border border-neutral-200 bg-neutral-50/50 p-1"
                                  onKeyDown={(e) =>
                                    e.key === "Escape" &&
                                    handleCancelLabelColorEdit()
                                  }
                                >
                                  {LABEL_COLORS.map((color) => (
                                    <button
                                      key={color}
                                      type="button"
                                      onClick={() =>
                                        handleSaveLabelColorEdit(
                                          label.Id,
                                          color,
                                        )
                                      }
                                      className={`h-6 w-6 rounded border-2 shadow-sm transition-all focus:outline-none hover:scale-105 ${
                                        (label.Color || "#6b7280") === color
                                          ? "border-neutral-800 ring-2 ring-neutral-400"
                                          : "border-transparent hover:border-neutral-300"
                                      }`}
                                      style={{ backgroundColor: color }}
                                      title={color}
                                    />
                                  ))}
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() =>
                                    !updateLabelState?.isLoading &&
                                    !deleteLabelState?.isLoading &&
                                    handleStartLabelColorEdit(label)
                                  }
                                  className="h-6 w-6 shrink-0 rounded border-[0.5px] border-transparent transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-neutral-300"
                                  style={{
                                    backgroundColor: label.Color || "#6b7280",
                                  }}
                                  aria-label="Change label color"
                                />
                              )}
                              {editingLabelId === label.Id ? (
                                <InlineEditInput
                                  name="labelName"
                                  value={editingLabelNameValue}
                                  onChange={setEditingLabelNameValue}
                                  onSave={handleSaveLabelNameEdit}
                                  onCancel={handleCancelLabelNameEdit}
                                  loading={
                                    updateLabelState?.isLoading ||
                                    deleteLabelState?.isLoading
                                  }
                                  placeholder="Label name"
                                  className="font-medium text-neutral-800"
                                  wrapperClassName="form-group !mb-0 min-w-0 flex-1"
                                />
                              ) : (
                                <span className="min-w-0 truncate font-medium text-neutral-800">
                                  {label.Name}
                                </span>
                              )}
                            </div>
                            {editingLabelId !== label.Id &&
                              editingLabelColorId !== label.Id && (
                                <div className="flex items-center gap-2 shrink-0">
                                  <Pencil
                                    role="button"
                                    tabIndex={
                                      updateLabelState?.isLoading ||
                                      deleteLabelState?.isLoading
                                        ? -1
                                        : 0
                                    }
                                    className={`h-4 w-4 shrink-0 transition-colors focus:outline-none ${
                                      updateLabelState?.isLoading ||
                                      deleteLabelState?.isLoading
                                        ? "cursor-not-allowed opacity-50"
                                        : "cursor-pointer text-neutral-500 hover:text-neutral-700"
                                    }`}
                                    onClick={() => {
                                      if (
                                        updateLabelState?.isLoading ||
                                        deleteLabelState?.isLoading
                                      )
                                        return;
                                      handleStartLabelNameEdit(label);
                                    }}
                                    onKeyDown={(e) =>
                                      (e.key === "Enter" || e.key === " ") &&
                                      e.currentTarget.click()
                                    }
                                    aria-label="Edit label name"
                                  />
                                  <Trash2
                                    role="button"
                                    tabIndex={
                                      updateLabelState?.isLoading ||
                                      deleteLabelState?.isLoading
                                        ? -1
                                        : 0
                                    }
                                    className={`h-4 w-4 shrink-0 transition-colors focus:outline-none ${
                                      updateLabelState?.isLoading ||
                                      deleteLabelState?.isLoading
                                        ? "cursor-not-allowed opacity-50"
                                        : "cursor-pointer text-neutral-500 hover:text-danger-600"
                                    }`}
                                    onClick={() => {
                                      if (
                                        updateLabelState?.isLoading ||
                                        deleteLabelState?.isLoading
                                      )
                                        return;
                                      setLabelToDelete(label);
                                      setShowLabelDeleteModal(true);
                                    }}
                                    onKeyDown={(e) =>
                                      (e.key === "Enter" || e.key === " ") &&
                                      e.currentTarget.click()
                                    }
                                    aria-label="Delete label"
                                  />
                                </div>
                              )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </section>

              <section className="rounded-lg border border-neutral-200 bg-white overflow-hidden">
                <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3">
                  <h3 className="flex items-center gap-2 typography-body font-semibold text-indigo-600">
                    <Mail className="h-4 w-4 shrink-0 text-indigo-500" />
                    Pending invitations
                  </h3>
                </div>
                <div className="p-4">
                  {fetchState?.isLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader loading />
                    </div>
                  ) : pendingByOrg?.length === 0 ? (
                    <NoResultFound
                      icon={Mail}
                      title="No pending invitations"
                      description="Invitations you send will appear here."
                      variant="compact"
                    />
                  ) : (
                    <ul className="divide-y divide-neutral-100">
                      {pendingByOrg?.map((inv) => (
                        <li
                          key={inv.Id}
                          className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                        >
                          <div>
                            <p className="font-medium text-neutral-800">
                              {inv.Email}
                            </p>
                            <p className="typography-body text-neutral-500">
                              Invited as{" "}
                              {WORKSPACE_ROLE_LABELS[inv.Role] || inv.Role}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <CustomButton
                              type="button"
                              text="Resend"
                              variant="outline"
                              size="sm"
                              startIcon={<Send className="h-3.5 w-3.5" />}
                              onClick={() => handleResendInvite(inv.Id)}
                              loading={resendingId === inv.Id}
                              disabled={!!resendingId || !!cancellingId}
                            />
                            <CustomButton
                              type="button"
                              text="Cancel"
                              variant="cancel"
                              size="sm"
                              onClick={() => handleCancelInvite(inv.Id)}
                              loading={cancellingId === inv.Id}
                              disabled={!!cancellingId || !!resendingId}
                            />
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </section>
            </div>

            <Modal
              show={showInviteForm}
              onClose={() => {
                setShowInviteForm(false);
                inviteForm.reset();
              }}
              title="Invite member"
              size="md"
            >
              <form
                onSubmit={inviteForm.handleSubmit(onSubmitInvite)}
                className="space-y-4"
              >
                <CustomInput
                  label="Email address"
                  name="Email"
                  type="email"
                  placeholder="colleague@example.com"
                  register={inviteForm.register}
                  errors={inviteForm.formState.errors}
                  isRequired
                />
                <Controller
                  name="Role"
                  control={inviteForm.control}
                  render={({ field }) => (
                    <SimpleSelect
                      label="Role"
                      name="Role"
                      options={WORKSPACE_ROLE_OPTIONS}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Select role…"
                      errors={inviteForm.formState.errors}
                    />
                  )}
                />
                <div className="flex justify-end gap-2 pt-2">
                  <CustomButton
                    type="button"
                    text="Cancel"
                    variant="cancel"
                    onClick={() => {
                      toggleShowInviteForm();
                      inviteForm.reset();
                    }}
                  />
                  <CustomButton
                    type="submit"
                    text="Send invite"
                    variant="primary"
                    loading={createInvitationState?.isLoading}
                  />
                </div>
              </form>
            </Modal>

            <Modal
              show={showLabelForm}
              onClose={() => {
                toggleShowLabelForm();
                labelForm.reset({ Name: "", Color: "#6b7280" });
              }}
              title="Add label"
              size="md"
            >
              <form
                onSubmit={labelForm.handleSubmit(onSubmitLabelCreate)}
                className="space-y-4"
              >
                <CustomInput
                  label="Label name"
                  name="Name"
                  placeholder="e.g. Urgent, Bug, Feature"
                  register={labelForm.register}
                  errors={labelForm.formState.errors}
                  isRequired
                />
                <div>
                  <label className="mb-2 block typography-body font-medium text-neutral-700">
                    Color
                  </label>
                  <div className="inline-flex flex-wrap gap-1 rounded-lg border border-neutral-200 bg-neutral-50/50 p-1.5">
                    {LABEL_COLORS.map((color) => (
                      <Controller
                        key={color}
                        name="Color"
                        control={labelForm.control}
                        render={({ field }) => (
                          <button
                            type="button"
                            onClick={() => field.onChange(color)}
                            className={`h-6 w-6 rounded border-2 shadow-sm transition-all focus:outline-none hover:scale-105 ${
                              field.value === color
                                ? "border-neutral-800 ring-2 ring-neutral-400"
                                : "border-transparent hover:border-neutral-300"
                            }`}
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        )}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <CustomButton
                    type="button"
                    text="Cancel"
                    variant="cancel"
                    onClick={() => {
                      toggleShowLabelForm();
                      labelForm.reset({ Name: "", Color: "#6b7280" });
                    }}
                  />
                  <CustomButton
                    type="submit"
                    text="Create label"
                    variant="primary"
                    loading={createLabelState?.isLoading}
                  />
                </div>
              </form>
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
                  <strong>{orgToDelete?.Name || "this workspace"}</strong>? This
                  will permanently remove all projects, KPIs, and members. This
                  action cannot be undone.
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
              show={showLabelDeleteModal}
              onClose={() => {
                setShowLabelDeleteModal(false);
                setLabelToDelete(null);
              }}
              title="Delete label"
              size="md"
              variant="danger"
            >
              <div className="space-y-4">
                <p className="typography-body text-neutral-700">
                  Are you sure you want to delete the label{" "}
                  <strong>{labelToDelete?.Name}</strong>? It will be removed
                  from all cards.
                </p>
                <div className="flex justify-end gap-2">
                  <CustomButton
                    type="button"
                    text="Cancel"
                    variant="cancel"
                    onClick={() => {
                      setShowLabelDeleteModal(false);
                      setLabelToDelete(null);
                    }}
                  />
                  <CustomButton
                    type="button"
                    text="Delete"
                    variant="danger"
                    onClick={handleDeleteLabel}
                    loading={deleteLabelState?.isLoading}
                  />
                </div>
              </div>
            </Modal>
          </>
        )}
      </div>
    </div>
  );
}
