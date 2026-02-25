"use client";

import CustomButton from "@/common/components/custom-button/custom-button.component";
import Modal from "@/common/components/modal/modal.component";
import {
  ArrowLeft,
  Mail,
  RefreshCw,
  Tag,
  Trash2,
  Users,
  User,
} from "lucide-react";
import Link from "next/link";
import useWorkspaceDetail from "./use-workspace-detail.hook";

const SEPARATOR_COLORS = [
  "from-indigo-500 to-indigo-700",
  "from-emerald-500 to-emerald-700",
  "from-amber-500 to-amber-700",
  "from-rose-500 to-rose-700",
  "from-sky-500 to-sky-700",
  "from-violet-500 to-violet-700",
];

const LINKS = [
  {
    href: "members",
    label: "Members",
    icon: Users,
    description: "View and manage workspace members",
  },
  {
    href: "invites",
    label: "Pending invites",
    icon: Mail,
    description: "View and manage pending invitations",
  },
  {
    href: "labels",
    label: "Labels",
    icon: Tag,
    description: "View and manage labels",
  },
];

export default function WorkspaceDetail() {
  const {
    orgId,
    org,
    owner,
    myRoleLabel,
    isCurrentWorkspace,
    showDeleteModal,
    deleteState,
    handleSwitchWorkspace,
    openDeleteModal,
    closeDeleteModal,
    handleDeleteOrg,
  } = useWorkspaceDetail();

  if (!orgId) return null;

  return (
    <div className="min-h-full">
      <div className="page-header-bar">
        <Link href="/settings/workspace">
          <CustomButton
            type="button"
            text="Back to workspaces"
            variant="outline"
            size="sm"
            startIcon={<ArrowLeft className="h-4 w-4" />}
            className="shrink-0"
          />
        </Link>
        <div className="page-header-divider" />
        <div className="min-w-0 flex-1 overflow-hidden">
          <h1 className="page-header-title">{org?.Name ?? "Workspace"}</h1>
          <p className="page-header-subtitle">
            View members, invites, and labels
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {!isCurrentWorkspace && (
            <CustomButton
              type="button"
              text="Switch to this workspace"
              variant="primary"
              size="sm"
              startIcon={<RefreshCw className="h-4 w-4" />}
              onClick={handleSwitchWorkspace}
            />
          )}
          <CustomButton
            type="button"
            text="Delete workspace"
            variant="danger"
            size="sm"
            startIcon={<Trash2 className="h-4 w-4" />}
            onClick={openDeleteModal}
          />
        </div>
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

      <div className="space-y-4 px-4 sm:px-5">
        <div className="rounded-xl border-2 border-neutral-200 bg-neutral-50/50 p-4">
          <div className="flex flex-wrap justify-between items-center gap-x-6 gap-y-2">
            {isCurrentWorkspace && (
              <span className="inline-flex items-center rounded-lg bg-indigo-100 px-2.5 py-0.5 typography-caption font-medium text-indigo-800">
                Current workspace
              </span>
            )}
            {owner && (
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                  <User className="h-4 w-4" />
                </span>
                <span className="typography-caption text-neutral-600">
                  Owner: {owner}
                </span>
              </div>
            )}
            {myRoleLabel && (
              <div className="flex items-center gap-2">
                <span className="typography-caption font-medium text-neutral-500">
                  Your role:
                </span>
                <span className="typography-caption text-neutral-700">
                  {myRoleLabel}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {LINKS.map(({ href, label, icon: Icon, description }) => (
            <Link
              key={href}
              href={`/settings/workspace/${orgId}/${href}`}
              className="flex items-start gap-4 rounded-xl border-2 border-neutral-200 bg-white p-4 transition-colors hover:border-indigo-300 hover:bg-indigo-50/40"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <Icon className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-neutral-800">{label}</p>
                <p className="typography-caption text-neutral-500">
                  {description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <Modal
        show={showDeleteModal}
        onClose={closeDeleteModal}
        title="Delete workspace"
        size="md"
        variant="danger"
      >
        <div className="space-y-4">
          <p className="typography-body text-neutral-700">
            Are you sure you want to delete{" "}
            <strong>{org?.Name ?? "this workspace"}</strong>? This will
            permanently remove all projects, KPIs, and members. This action
            cannot be undone.
          </p>
          <div className="flex justify-end gap-2">
            <CustomButton
              type="button"
              text="Cancel"
              variant="cancel"
              onClick={closeDeleteModal}
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
    </div>
  );
}
