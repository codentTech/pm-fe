"use client";

import { useMemo } from "react";
import { WORKSPACE_ROLE_LABELS } from "@/common/constants/workspace-role.constant";
import { formatDateTime } from "@/common/utils/date.util";
import { Mail, Send, User, X } from "lucide-react";
import useWorkspaceDetail from "@/common/hooks/use-workspace-detail.hook";

const INVITE_ACTIONS = [
  { key: "resend", label: "Resend", icon: <Send className="h-4 w-4" /> },
  {
    key: "cancel",
    label: "Cancel invite",
    icon: <X className="h-4 w-4 text-danger-600" />,
  },
];

const INVITE_COLUMNS = [
  {
    key: "Email",
    title: "Email",
    sortable: true,
    customRender: (row) => (
      <span className="flex items-center gap-2.5 font-medium text-neutral-800">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
          <Mail className="h-4 w-4" />
        </span>
        {row.Email}
      </span>
    ),
  },
  {
    key: "Role",
    title: "Role",
    sortable: true,
    customRender: (row) => (
      <span className="flex items-center gap-2.5 typography-body text-neutral-500">
        <User className="h-4 w-4 shrink-0 text-neutral-400" />
        Invited as {WORKSPACE_ROLE_LABELS[row.Role] || row.Role}
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

const SEPARATOR_COLORS = [
  "from-indigo-500 to-indigo-700",
  "from-emerald-500 to-emerald-700",
  "from-amber-500 to-amber-700",
  "from-rose-500 to-rose-700",
  "from-sky-500 to-sky-700",
  "from-violet-500 to-violet-700",
];

export default function useWorkspaceInvitesSection(orgId) {
  const {
    pendingByOrg,
    fetchState,
    handleCancelInvite,
    handleResendInvite,
    showInviteForm,
    inviteForm,
    createInvitationState,
    toggleShowInviteForm,
    onSubmitInvite,
    WORKSPACE_ROLE_OPTIONS,
  } = useWorkspaceDetail(orgId);

  const tableData = useMemo(
    () => (pendingByOrg ?? []).map((inv) => ({ ...inv, id: inv.Id })),
    [pendingByOrg]
  );

  const handleActionClick = (actionKey, row) => {
    if (actionKey === "resend") handleResendInvite(row.Id);
    if (actionKey === "cancel") handleCancelInvite(row.Id);
  };

  const handleCloseInviteModal = () => {
    toggleShowInviteForm();
    inviteForm.reset();
  };

  return {
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
  };
}
