"use client";

import { useMemo } from "react";
import { WORKSPACE_ROLE_LABELS } from "@/common/constants/workspace-role.constant";
import { formatDateTime } from "@/common/utils/date.util";
import { Mail, Pencil, Trash2, User } from "lucide-react";
import useWorkspaceDetail from "@/common/hooks/use-workspace-detail.hook";

const MEMBER_COLUMNS = [
  {
    key: "User.FullName",
    title: "Name",
    sortable: true,
    customRender: (row) => (
      <span className="flex items-center gap-2.5 font-medium text-neutral-800">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
          <User className="h-4 w-4" />
        </span>
        {row.User?.FullName || "Unknown"}
      </span>
    ),
  },
  {
    key: "User.Email",
    title: "Email",
    sortable: true,
    customRender: (row) => (
      <span className="flex items-center gap-2.5 typography-body text-neutral-500">
        <Mail className="h-4 w-4 shrink-0 text-neutral-400" />
        {row.User?.Email || "—"}
      </span>
    ),
  },
  {
    key: "Role",
    title: "Role",
    sortable: true,
    customRender: (row) => (
      <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 typography-caption font-medium text-indigo-700">
        {WORKSPACE_ROLE_LABELS[row.Role] || row.Role}
      </span>
    ),
  },
  {
    key: "CreatedAt",
    title: "Created",
    sortable: true,
    customRender: (row) => (
      <span className="typography-caption text-neutral-500">
        {formatDateTime(row.CreatedAt)}
      </span>
    ),
  },
  {
    key: "UpdatedAt",
    title: "Updated",
    sortable: true,
    customRender: (row) => (
      <span className="typography-caption text-neutral-500">
        {formatDateTime(row.UpdatedAt)}
      </span>
    ),
  },
];

const MEMBER_ACTIONS = [
  {
    key: "changeRole",
    label: "Change role",
    icon: <Pencil className="h-4 w-4" />,
  },
  {
    key: "remove",
    label: "Remove from workspace",
    icon: <Trash2 className="h-4 w-4 text-danger-600" />,
  },
];

const SEPARATOR_COLORS = [
  "from-indigo-500 to-indigo-700",
  "from-emerald-500 to-emerald-700",
  "from-amber-500 to-amber-700",
  "from-rose-500 to-rose-700",
  "from-sky-500 to-sky-700",
  "from-violet-500 to-violet-700",
];

export default function useWorkspaceMembersSection(orgId) {
  const {
    members,
    membersLoading,
    showInviteForm,
    inviteForm,
    createInvitationState,
    toggleShowInviteForm,
    onSubmitInvite,
    handleOpenChangeRole,
    handleOpenRemoveMember,
    handleCloseChangeRoleModal,
    handleSaveMemberRole,
    memberToEditRole,
    changeRoleValue,
    setChangeRoleValue,
    showChangeRoleModal,
    memberToRemove,
    showRemoveMemberModal,
    handleCloseRemoveMemberModal,
    handleRemoveMember,
    WORKSPACE_ROLE_OPTIONS,
    removeMemberState,
  } = useWorkspaceDetail(orgId);

  const tableData = useMemo(
    () => (members ?? []).map((m) => ({ ...m, id: m.Id })),
    [members]
  );

  const handleCloseInviteModal = () => {
    toggleShowInviteForm();
    inviteForm.reset();
  };

  const handleActionClick = (actionKey, row) => {
    if (actionKey === "changeRole") handleOpenChangeRole(row);
    if (actionKey === "remove") handleOpenRemoveMember(row);
  };

  return {
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
  };
}
