"use client";

import { Controller } from "react-hook-form";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomDataTable from "@/common/components/custom-data-table/custom-data-table.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import SimpleSelect from "@/common/components/dropdowns/simple-select/simple-select.jsx";
import Modal from "@/common/components/modal/modal.component";
import { UserPlus } from "lucide-react";
import useWorkspaceInvitesSection from "./use-workspace-invites-section.hook";

export default function WorkspaceInvitesSection({ orgId }) {
  const {
    INVITE_COLUMNS,
    INVITE_ACTIONS,
    SEPARATOR_COLORS,
    tableData,
    fetchState,
    showInviteForm,
    inviteForm,
    createInvitationState,
    toggleShowInviteForm,
    onSubmitInvite,
    handleCloseInviteModal,
    handleActionClick,
    WORKSPACE_ROLE_OPTIONS,
  } = useWorkspaceInvitesSection(orgId);

  if (!orgId) return null;

  return (
    <>
      <div className="min-h-full">
        <div className="page-header-bar mt-4">
          <div className="page-header-divider" />
          <div className="min-w-0 flex-1 overflow-hidden">
            <h1 className="page-header-title">Pending invitations</h1>
            <p className="page-header-subtitle">
              Invitations you send will appear here
            </p>
          </div>
          <CustomButton
            type="button"
            text="Invite members"
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
            columns={INVITE_COLUMNS}
            data={tableData}
            loading={fetchState?.isLoading}
            selectable={false}
            searchable={false}
            paginated={tableData.length > 10}
            pageSize={10}
            actions={INVITE_ACTIONS}
            onActionClick={handleActionClick}
            emptyMessage="No pending invitations. Invitations you send will appear here."
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
    </>
  );
}
