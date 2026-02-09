"use client";

import { Controller } from "react-hook-form";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomDataTable from "@/common/components/custom-data-table/custom-data-table.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select.jsx";
import Modal from "@/common/components/modal/modal.component";
import { UserPlus } from "lucide-react";
import useWorkspaceMembersSection from "./use-workspace-members-section.hook";

export default function WorkspaceMembersSection({ orgId }) {
  const {
    MEMBER_COLUMNS,
    MEMBER_ACTIONS,
    SEPARATOR_COLORS,
    tableData,
    membersLoading,
    showInviteForm,
    inviteForm,
    createInvitationState,
    toggleShowInviteForm,
    onSubmitInvite,
    handleCloseInviteModal,
    handleActionClick,
    showChangeRoleModal,
    handleCloseChangeRoleModal,
    handleSaveMemberRole,
    memberToEditRole,
    changeRoleValue,
    setChangeRoleValue,
    WORKSPACE_ROLE_OPTIONS,
    showRemoveMemberModal,
    handleCloseRemoveMemberModal,
    handleRemoveMember,
    memberToRemove,
    removeMemberState,
  } = useWorkspaceMembersSection(orgId);

  if (!orgId) return null;

  return (
    <>
      <div className="min-h-full">
        <div className="page-header-bar mt-4">
          <div className="page-header-divider" />
          <div className="min-w-0 flex-1 overflow-hidden">
            <h1 className="page-header-title">Members</h1>
            <p className="page-header-subtitle">
              Invite teammates to collaborate
            </p>
          </div>
          <CustomButton
            type="button"
            text="Invite"
            variant="primary"
            size="sm"
            startIcon={<UserPlus className="h-4 w-4" />}
            onClick={toggleShowInviteForm}
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
        <div className="w-full px-4">
          <CustomDataTable
            className="w-full"
            columns={MEMBER_COLUMNS}
            data={tableData}
            loading={membersLoading}
            selectable={false}
            searchable={false}
            paginated={tableData.length > 10}
            pageSize={10}
            actions={MEMBER_ACTIONS}
            onActionClick={handleActionClick}
            emptyMessage="No members yet. Invite teammates to collaborate."
            tableClassName="min-w-full divide-y divide-neutral-200"
            headerClassName="border-neutral-200"
          />
        </div>
      </div>

      <Modal
        show={showInviteForm}
        onClose={handleCloseInviteModal}
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
                options={WORKSPACE_ROLE_OPTIONS}
                value={field.value}
                onChange={field.onChange}
                placeholder="Select role…"
              />
            )}
          />
          <div className="flex justify-end gap-2 pt-2">
            <CustomButton
              type="button"
              text="Cancel"
              variant="cancel"
              onClick={handleCloseInviteModal}
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
        show={showChangeRoleModal}
        onClose={handleCloseChangeRoleModal}
        title="Change role"
        size="md"
      >
        <div className="space-y-4">
          {memberToEditRole && (
            <p className="typography-body text-neutral-700">
              Change role for{" "}
              <strong>
                {memberToEditRole.User?.FullName ||
                  memberToEditRole.User?.Email}
              </strong>
            </p>
          )}
          <SimpleSelect
            key={memberToEditRole?.Id}
            label="Role"
            options={WORKSPACE_ROLE_OPTIONS || []}
            value={changeRoleValue}
            onChange={setChangeRoleValue}
            placeholder="Select role…"
          />
          <div className="flex justify-end gap-2 pt-2">
            <CustomButton
              type="button"
              text="Cancel"
              variant="cancel"
              onClick={handleCloseChangeRoleModal}
            />
            <CustomButton
              type="button"
              text="Save"
              variant="primary"
              onClick={handleSaveMemberRole}
            />
          </div>
        </div>
      </Modal>

      <Modal
        show={showRemoveMemberModal}
        onClose={handleCloseRemoveMemberModal}
        title="Remove from workspace"
        size="md"
        variant="danger"
      >
        <div className="space-y-4">
          {memberToRemove && (
            <p className="typography-body text-neutral-700">
              Are you sure you want to remove{" "}
              <strong>
                {memberToRemove.User?.FullName || memberToRemove.User?.Email}
              </strong>{" "}
              from this workspace? They will lose access to all projects and
              boards.
            </p>
          )}
          <div className="flex justify-end gap-2">
            <CustomButton
              type="button"
              text="Cancel"
              variant="cancel"
              onClick={handleCloseRemoveMemberModal}
            />
            <CustomButton
              type="button"
              text="Remove"
              variant="danger"
              onClick={handleRemoveMember}
              loading={removeMemberState?.isLoading}
            />
          </div>
        </div>
      </Modal>
    </>
  );
}
