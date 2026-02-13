"use client";

import { useEffect, useMemo, useState } from "react";
import { Building2, Pencil, Trash2 } from "lucide-react";
import { formatDateTime } from "@/common/utils/date.util";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects } from "@/provider/features/projects/projects.slice";
import { fetchBids } from "@/provider/features/bids/bids.slice";
import { fetchKpis } from "@/provider/features/kpis/kpis.slice";
import {
  cancelInvitation,
  createInvitation,
  fetchPendingByOrg,
  resendInvitation,
} from "@/provider/features/invitations/invitations.slice";
import {
  createLabel,
  deleteLabel,
  fetchLabels,
  updateLabel,
} from "@/provider/features/labels/labels.slice";
import {
  createOrganization,
  deleteOrganization,
  fetchMembers,
  fetchOrEnsureDefault,
  fetchOrganizations,
  setCurrentOrganization,
  updateOrganization,
} from "@/provider/features/organizations/organizations.slice";

export default function useWorkspaceSettings() {
  // stats
  const dispatch = useDispatch();
  const {
    organizations,
    currentOrganizationId,
    createOrganization: createState,
    updateOrganization: updateState,
    deleteOrganization: deleteState,
  } = useSelector((state) => state.organizations);
  const {
    pendingByOrg,
    fetchPendingByOrg: fetchState,
    create: createInvitationState,
  } = useSelector((state) => state.invitations);
  const {
    labels,
    fetchLabels: fetchLabelsState,
    createLabel: createLabelState,
    updateLabel: updateLabelState,
    deleteLabel: deleteLabelState,
  } = useSelector((state) => state.labels);

  const [view, setView] = useState("list");
  const [selectedOrgId, setSelectedOrgId] = useState(null);
  const [members, setMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);
  const [resendingId, setResendingId] = useState(null);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingWorkspaceName, setEditingWorkspaceName] = useState(false);
  const [workspaceNameValue, setWorkspaceNameValue] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [orgToDeleteId, setOrgToDeleteId] = useState(null);
  const [orgToEditId, setOrgToEditId] = useState(null);
  const [editWorkspaceNameValue, setEditWorkspaceNameValue] = useState("");
  const [showLabelForm, setShowLabelForm] = useState(false);
  const [editingLabelId, setEditingLabelId] = useState(null);
  const [editingLabelNameValue, setEditingLabelNameValue] = useState("");
  const [editingLabelColorId, setEditingLabelColorId] = useState(null);
  const [showLabelDeleteModal, setShowLabelDeleteModal] = useState(false);
  const [labelToDelete, setLabelToDelete] = useState(null);

  const inviteForm = useForm({ defaultValues: { Email: "", Role: "member" } });
  const createForm = useForm({ defaultValues: { Name: "" } });
  const labelForm = useForm({ defaultValues: { Name: "", Color: "#6b7280" } });

  const selectedOrg = organizations?.find((o) => o.Id === selectedOrgId);

  useEffect(() => {
    dispatch(
      fetchOrganizations({
        successCallBack: (data) => {
          if (!data?.length) dispatch(fetchOrEnsureDefault());
        },
      })
    );
  }, [dispatch]);

  useEffect(() => {
    if (selectedOrgId) {
      dispatch(fetchPendingByOrg(selectedOrgId));
      dispatch(fetchLabels(selectedOrgId));
      setMembersLoading(true);
      dispatch(
        fetchMembers({
          orgId: selectedOrgId,
          successCallBack: (data) => setMembers(data || []),
          errorCallBack: () => setMembers([]),
          completeCallBack: () => setMembersLoading(false),
        })
      );
    }
  }, [selectedOrgId, dispatch]);

  useEffect(() => {
    if (!editingLabelColorId) return;
    function handleKeyDown(e) {
      if (e.key === "Escape") handleCancelLabelColorEdit();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [editingLabelColorId, handleCancelLabelColorEdit]);

  // functions
  function handleSelectOrg(orgId) {
    setSelectedOrgId(orgId);
    setView("detail");
    setShowInviteForm(false);
    inviteForm.reset();
  }

  function handleBack() {
    setView("list");
    setSelectedOrgId(null);
    setShowInviteForm(false);
    setShowCreateModal(false);
    setEditingWorkspaceName(false);
    setShowDeleteModal(false);
    setOrgToDeleteId(null);
    setOrgToEditId(null);
    setEditWorkspaceNameValue("");
    setShowLabelForm(false);
    setEditingLabelId(null);
    setEditingLabelColorId(null);
    setShowLabelDeleteModal(false);
    setLabelToDelete(null);
    inviteForm.reset();
    createForm.reset();
    labelForm.reset();
  }

  function handleStartWorkspaceRename() {
    setWorkspaceNameValue(selectedOrg?.Name || "");
    setEditingWorkspaceName(true);
  }

  function handleSaveWorkspaceRename() {
    const name = workspaceNameValue?.trim();
    if (!selectedOrgId || !name) {
      setEditingWorkspaceName(false);
      return;
    }
    dispatch(
      updateOrganization({
        orgId: selectedOrgId,
        payload: { Name: name },
        successCallBack: () => setEditingWorkspaceName(false),
      })
    );
  }

  function handleCancelWorkspaceRename() {
    setEditingWorkspaceName(false);
    setWorkspaceNameValue("");
  }

  function handleStartLabelNameEdit(label) {
    setEditingLabelId(label.Id);
    setEditingLabelNameValue(label.Name || "");
  }

  function handleSaveLabelNameEdit() {
    const name = editingLabelNameValue?.trim();
    if (!selectedOrgId || !editingLabelId || !name) {
      setEditingLabelId(null);
      return;
    }
    const label = labels?.find((l) => l.Id === editingLabelId);
    dispatch(
      updateLabel({
        orgId: selectedOrgId,
        id: editingLabelId,
        payload: { Name: name, Color: label?.Color || "#6b7280" },
        successCallBack: () => {
          setEditingLabelId(null);
          setEditingLabelNameValue("");
        },
      })
    );
  }

  function handleCancelLabelNameEdit() {
    setEditingLabelId(null);
    setEditingLabelNameValue("");
  }

  function handleStartLabelColorEdit(label) {
    setEditingLabelColorId(label.Id);
  }

  function handleSaveLabelColorEdit(labelId, color) {
    if (!selectedOrgId || !labelId) return;
    const label = labels?.find((l) => l.Id === labelId);
    dispatch(
      updateLabel({
        orgId: selectedOrgId,
        id: labelId,
        payload: { Name: label?.Name || "", Color: color },
        successCallBack: () => setEditingLabelColorId(null),
      })
    );
  }

  function handleCancelLabelColorEdit() {
    setEditingLabelColorId(null);
  }

  function onSubmitLabelCreate(values) {
    if (!selectedOrgId) return;
    dispatch(
      createLabel({
        orgId: selectedOrgId,
        payload: { Name: values.Name, Color: values.Color },
        successCallBack: () => {
          setShowLabelForm(false);
          labelForm.reset({ Name: "", Color: "#6b7280" });
        },
      })
    );
  }

  async function handleDeleteLabel() {
    if (!labelToDelete) return;
    await dispatch(
      deleteLabel({
        orgId: selectedOrgId,
        id: labelToDelete.Id,
        successCallBack: () => {
          setShowLabelDeleteModal(false);
          setLabelToDelete(null);
        },
      })
    );
  }

  function handleSwitchWorkspace(orgId) {
    dispatch(setCurrentOrganization(orgId));
    dispatch(fetchProjects());
    dispatch(fetchBids());
    dispatch(fetchKpis());
    setSelectedOrgId(orgId);
  }

  async function handleCancelInvite(invitationId) {
    if (!selectedOrgId) return;
    setCancellingId(invitationId);
    await dispatch(
      cancelInvitation({
        orgId: selectedOrgId,
        invitationId,
        successCallBack: () => {},
      })
    );
    setCancellingId(null);
  }

  async function handleResendInvite(invitationId) {
    if (!selectedOrgId) return;
    setResendingId(invitationId);
    await dispatch(
      resendInvitation({
        orgId: selectedOrgId,
        invitationId,
        successCallBack: () => dispatch(fetchPendingByOrg(selectedOrgId)),
      })
    );
    setResendingId(null);
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
      })
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
    const orgId = orgToDeleteId || selectedOrgId;
    if (!orgId) return;
    const wasCurrentOrg = orgId === currentOrganizationId;
    const result = await dispatch(
      deleteOrganization({
        orgId,
        successCallBack: () => {
          closeDeleteOrgModal();
          if (view === "detail" && selectedOrgId === orgId) {
            handleBack();
          } else {
            dispatch(fetchOrganizations());
          }
        },
      })
    );
    if (result.meta?.requestStatus === "fulfilled" && wasCurrentOrg) {
      await dispatch(fetchOrEnsureDefault());
      dispatch(fetchOrganizations());
      dispatch(fetchProjects());
      dispatch(fetchBids());
      dispatch(fetchKpis());
    }
  }

  function onSubmitInvite(values) {
    if (!selectedOrgId) return;
    dispatch(
      createInvitation({
        orgId: selectedOrgId,
        payload: { Email: values.Email, Role: values.Role || "member" },
        successCallBack: () => {
          setShowInviteForm(false);
          inviteForm.reset();
          dispatch(fetchPendingByOrg(selectedOrgId));
        },
      })
    );
  }

  function onSubmitCreate(values) {
    dispatch(
      createOrganization({
        payload: { Name: values.Name },
        successCallBack: () => {
    setShowCreateModal(false);
    createForm.reset();
        },
      })
    );
  }

  function toggleShowInviteForm() {
    setShowInviteForm((prev) => !prev);
  }

  function toggleShowLabelForm() {
    setShowLabelForm((prev) => !prev);
    if (!showLabelForm) labelForm.reset({ Name: "", Color: "#6b7280" });
  }

  function openCreateModal() {
    createForm.reset({ Name: "" });
    setShowCreateModal(true);
  }

  const orgToDelete = organizations?.find(
    (o) => o.Id === (orgToDeleteId || selectedOrgId)
  );

  const workspaceTableActions = [
    { key: "edit", label: "Edit", icon: <Pencil className="h-4 w-4" /> },
    {
      key: "delete",
      label: "Delete",
      icon: <Trash2 className="h-4 w-4 text-danger-600" />,
    },
  ];

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
        customRender: (row) => (
          <span className="typography-caption text-neutral-500">
            {row.Id === currentOrganizationId
              ? "Current workspace"
              : "Click to manage"}
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
    ],
    [currentOrganizationId]
  );

  const workspaceTableData = useMemo(
    () => (organizations ?? []).map((org) => ({ ...org, id: org.Id })),
    [organizations]
  );

  const handleWorkspaceActionClick = (actionKey, row) => {
    if (actionKey === "edit") openEditOrgModal(row);
    if (actionKey === "delete") openDeleteOrgModal(row.Id);
  };

  return {
    view,
    organizations,
    currentOrganizationId,
    selectedOrgId,
    selectedOrg,
    orgToEditId,
    orgToDeleteId,
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
    pendingByOrg,
    labels,
    workspaceTableColumns,
    workspaceTableData,
    workspaceTableActions,
    handleWorkspaceActionClick,
  };
}
