"use client";

import { useEffect, useMemo, useState } from "react";
import { Building2, Pencil, RefreshCw, Settings, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { formatDateTime } from "@/common/utils/date.util";
import { fetchProjects } from "@/provider/features/projects/projects.slice";
import { fetchBids } from "@/provider/features/bids/bids.slice";
import { fetchKpis } from "@/provider/features/kpis/kpis.slice";
import {
  WORKSPACE_ROLE_LABELS,
} from "@/common/constants/workspace-role.constant";
import { getDisplayUser } from "@/common/utils/users.util";
import {
  createOrganization,
  deleteOrganization,
  fetchMembers,
  fetchOrEnsureDefault,
  fetchOrganizations,
  setCurrentOrganization,
  updateOrganization,
} from "@/provider/features/organizations/organizations.slice";

const LIST_ACTIONS = [
  {
    key: "switch",
    label: "Switch to this workspace",
    icon: <RefreshCw className="h-4 w-4" />,
  },
  { key: "view", label: "View", icon: <Settings className="h-4 w-4" /> },
  { key: "edit", label: "Edit", icon: <Pencil className="h-4 w-4" /> },
  {
    key: "delete",
    label: "Delete",
    icon: <Trash2 className="h-4 w-4 text-danger-600" />,
  },
];

export default function useWorkspaceSettings() {
  const dispatch = useDispatch();
  const router = useRouter();
  const {
    organizations,
    currentOrganizationId,
    createOrganization: createState,
    updateOrganization: updateState,
    deleteOrganization: deleteState,
  } = useSelector((state) => state.organizations);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orgToDeleteId, setOrgToDeleteId] = useState(null);
  const [orgToEditId, setOrgToEditId] = useState(null);
  const [editWorkspaceNameValue, setEditWorkspaceNameValue] = useState("");
  const [roleByOrgId, setRoleByOrgId] = useState({});

  const displayUser = getDisplayUser();
  const currentUserId = displayUser?.Id ?? displayUser?.id;

  const createForm = useForm({ defaultValues: { Name: "" } });

  useEffect(() => {
    dispatch(
      fetchOrganizations({
        successCallBack: (data) => {
          if (!data?.length) dispatch(fetchOrEnsureDefault());
        },
      }),
    );
  }, [dispatch]);

  const orgIds = useMemo(
    () =>
      (organizations ?? [])
        .map((o) => o.Id)
        .sort()
        .join(","),
    [organizations],
  );

  useEffect(() => {
    const orgs = organizations ?? [];
    if (orgs.length === 0 || !currentUserId) return;
    let cancelled = false;
    (async () => {
      const next = {};
      for (const org of orgs) {
        if (cancelled) break;
        try {
          const raw = await dispatch(
            fetchMembers({ orgId: org.Id }),
          ).unwrap();
          const members = Array.isArray(raw) ? raw : raw?.data ?? [];
          const me = members?.find(
            (m) =>
              m.UserId === currentUserId ||
              m.User?.Id === currentUserId ||
              m.User?.id === currentUserId,
          );
          next[org.Id] = me?.Role ?? null;
        } catch {
          next[org.Id] = null;
        }
      }
      if (!cancelled) setRoleByOrgId(next);
    })();
    return () => {
      cancelled = true;
    };
  }, [orgIds, currentUserId, dispatch, organizations]);

  function handleSwitchWorkspace(orgId) {
    dispatch(setCurrentOrganization(orgId));
    dispatch(fetchProjects());
    dispatch(fetchBids());
    dispatch(fetchKpis());
  }

  function openCreateModal() {
    createForm.reset({ Name: "" });
    setShowCreateModal(true);
  }

  function openEditOrgModal(org) {
    setOrgToEditId(org?.Id);
    setEditWorkspaceNameValue(org?.Name || "");
  }

  function closeEditOrgModal() {
    setOrgToEditId(null);
    setEditWorkspaceNameValue("");
  }

  function handleSaveEditOrg() {
    const name = editWorkspaceNameValue?.trim();
    if (!orgToEditId || !name) {
      closeEditOrgModal();
      return;
    }
    dispatch(
      updateOrganization({
        orgId: orgToEditId,
        payload: { Name: name },
        successCallBack: () => {
          closeEditOrgModal();
          dispatch(fetchOrganizations());
        },
      }),
    );
  }

  function openDeleteOrgModal(orgId) {
    setOrgToDeleteId(orgId);
    setShowDeleteModal(true);
  }

  function closeDeleteOrgModal() {
    setShowDeleteModal(false);
    setOrgToDeleteId(null);
  }

  async function handleDeleteOrg() {
    if (!orgToDeleteId) return;
    const wasCurrentOrg = orgToDeleteId === currentOrganizationId;
    const result = await dispatch(
      deleteOrganization({
        orgId: orgToDeleteId,
        successCallBack: () => {
          closeDeleteOrgModal();
          dispatch(fetchOrganizations());
        },
      }),
    );
    if (result.meta?.requestStatus === "fulfilled" && wasCurrentOrg) {
      await dispatch(fetchOrEnsureDefault());
      dispatch(fetchOrganizations());
      dispatch(fetchProjects());
      dispatch(fetchBids());
      dispatch(fetchKpis());
    }
  }

  function onSubmitCreate(values) {
    dispatch(
      createOrganization({
        payload: { Name: values.Name },
        successCallBack: () => {
          setShowCreateModal(false);
          createForm.reset();
        },
      }),
    );
  }

  function getActions(row) {
    const isCurrent = row.Id === currentOrganizationId;
    return LIST_ACTIONS.filter((a) => a.key !== "switch" || !isCurrent);
  }

  function handleWorkspaceActionClick(actionKey, row) {
    if (actionKey === "switch") handleSwitchWorkspace(row.Id);
    if (actionKey === "view") router.push(`/settings/workspace/${row.Id}`);
    if (actionKey === "edit") openEditOrgModal(row);
    if (actionKey === "delete") openDeleteOrgModal(row.Id);
  }

  const workspaceTableColumns = useMemo(
    () => [
      {
        key: "Name",
        title: "Workspace",
        sortable: true,
        customRender: (row) => (
          <span className="flex items-center gap-2.5 font-medium text-neutral-800">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <Building2 className="h-4 w-4" />
            </span>
            {row.Name}
          </span>
        ),
      },
      {
        key: "Status",
        title: "Status",
        sortable: false,
        customRender: (row) =>
          row.Id === currentOrganizationId ? (
            <span className="inline-flex items-center rounded-lg bg-indigo-100 px-2.5 py-0.5 typography-caption font-medium text-indigo-800">
              Current workspace
            </span>
          ) : (
            <span className="typography-caption text-neutral-400">—</span>
          ),
      },
      {
        key: "Role",
        title: "Role in this organization",
        sortable: false,
        customRender: (row) => {
          const role = roleByOrgId[row.Id];
          const label = role
            ? WORKSPACE_ROLE_LABELS[role] || role
            : "—";
          return (
            <span className="typography-caption text-neutral-600">{label}</span>
          );
        },
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
    ],
    [currentOrganizationId, roleByOrgId],
  );

  const workspaceTableData = useMemo(
    () => (organizations ?? []).map((org) => ({ ...org, id: org.Id })),
    [organizations],
  );

  const orgToDelete = organizations?.find((o) => o.Id === orgToDeleteId);

  return {
    organizations,
    showCreateModal,
    showDeleteModal,
    orgToEditId,
    orgToDeleteId,
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
    openEditOrgModal,
    closeEditOrgModal,
    handleSaveEditOrg,
    openDeleteOrgModal,
    closeDeleteOrgModal,
    handleDeleteOrg,
    onSubmitCreate,
    setShowCreateModal,
    handleWorkspaceActionClick,
  };
}
