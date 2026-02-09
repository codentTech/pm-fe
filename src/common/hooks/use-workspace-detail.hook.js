"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
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
  fetchMembers,
  fetchOrganizations,
  removeMember,
  updateMemberRole,
} from "@/provider/features/organizations/organizations.slice";
import {
  LABEL_COLORS,
  WORKSPACE_ROLE_LABELS,
  WORKSPACE_ROLE_OPTIONS,
} from "@/common/constants/workspace-role.constant";

export default function useWorkspaceDetail(orgId) {
  const dispatch = useDispatch();
  const {
    organizations,
    updateMemberRole: updateMemberRoleState,
    removeMember: removeMemberState,
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

  const [members, setMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);
  const [resendingId, setResendingId] = useState(null);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [showLabelForm, setShowLabelForm] = useState(false);
  const [editingLabelId, setEditingLabelId] = useState(null);
  const [editingLabelNameValue, setEditingLabelNameValue] = useState("");
  const [editingLabelColorId, setEditingLabelColorId] = useState(null);
  const [showLabelDeleteModal, setShowLabelDeleteModal] = useState(false);
  const [labelToDelete, setLabelToDelete] = useState(null);
  const [memberToRemove, setMemberToRemove] = useState(null);
  const [showRemoveMemberModal, setShowRemoveMemberModal] = useState(false);
  const [memberToEditRole, setMemberToEditRole] = useState(null);
  const [changeRoleValue, setChangeRoleValue] = useState("");
  const [showChangeRoleModal, setShowChangeRoleModal] = useState(false);

  const inviteForm = useForm({ defaultValues: { Email: "", Role: "member" } });
  const labelForm = useForm({ defaultValues: { Name: "", Color: "#6b7280" } });

  const selectedOrg = organizations?.find((o) => o.Id === orgId);

  useEffect(() => {
    dispatch(fetchOrganizations());
  }, [dispatch]);

  useEffect(() => {
    if (orgId) {
      dispatch(fetchPendingByOrg(orgId));
      dispatch(fetchLabels(orgId));
      setMembersLoading(true);
      dispatch(
        fetchMembers({
          orgId,
          successCallBack: (data) => setMembers(data || []),
          errorCallBack: () => setMembers([]),
          completeCallBack: () => setMembersLoading(false),
        })
      );
    }
  }, [orgId, dispatch]);

  const toggleShowInviteForm = () => setShowInviteForm((v) => !v);
  const toggleShowLabelForm = () => setShowLabelForm((v) => !v);

  function handleStartLabelNameEdit(label) {
    setEditingLabelId(label.Id);
    setEditingLabelNameValue(label.Name || "");
  }

  function handleSaveLabelNameEdit() {
    const name = editingLabelNameValue?.trim();
    if (!orgId || !editingLabelId || !name) {
      setEditingLabelId(null);
      return;
    }
    const label = labels?.find((l) => l.Id === editingLabelId);
    dispatch(
      updateLabel({
        orgId,
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
    if (!orgId || !labelId) return;
    const label = labels?.find((l) => l.Id === labelId);
    dispatch(
      updateLabel({
        orgId,
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
    if (!orgId) return;
    dispatch(
      createLabel({
        orgId,
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
        orgId,
        id: labelToDelete.Id,
        successCallBack: () => {
          setShowLabelDeleteModal(false);
          setLabelToDelete(null);
        },
      })
    );
  }

  async function handleCancelInvite(invitationId) {
    if (!orgId) return;
    setCancellingId(invitationId);
    await dispatch(
      cancelInvitation({
        orgId,
        invitationId: invitationId,
        successCallBack: () => {},
      })
    );
    setCancellingId(null);
  }

  async function handleResendInvite(invitationId) {
    if (!orgId) return;
    setResendingId(invitationId);
    await dispatch(
      resendInvitation({
        orgId,
        invitationId: invitationId,
        successCallBack: () => dispatch(fetchPendingByOrg(orgId)),
      })
    );
    setResendingId(null);
  }

  function handleOpenChangeRole(member) {
    const role = (member?.Role || "member").toLowerCase();
    setMemberToEditRole(member);
    setChangeRoleValue(role);
    setShowChangeRoleModal(true);
  }

  function handleCloseChangeRoleModal() {
    setMemberToEditRole(null);
    setChangeRoleValue("");
    setShowChangeRoleModal(false);
  }

  function handleSaveMemberRole() {
    if (!orgId || !memberToEditRole || !changeRoleValue) return;
    handleUpdateMemberRole(changeRoleValue);
  }

  function handleUpdateMemberRole(newRole) {
    if (!orgId || !memberToEditRole) return;
    dispatch(
      updateMemberRole({
        orgId,
        memberId: memberToEditRole.Id,
        payload: { Role: newRole },
        successCallBack: (data) => {
          setMembers(data || []);
          handleCloseChangeRoleModal();
        },
      })
    );
  }

  function handleOpenRemoveMember(member) {
    setMemberToRemove(member);
    setShowRemoveMemberModal(true);
  }

  function handleCloseRemoveMemberModal() {
    setShowRemoveMemberModal(false);
    setMemberToRemove(null);
  }

  async function handleRemoveMember() {
    if (!orgId || !memberToRemove) return;
    await dispatch(
      removeMember({
        orgId,
        memberId: memberToRemove.Id,
        successCallBack: (data) => {
          setMembers(data || []);
          handleCloseRemoveMemberModal();
        },
      })
    );
  }

  function onSubmitInvite(values) {
    if (!orgId) return;
    dispatch(
      createInvitation({
        orgId,
        payload: { Email: values.Email, Role: values.Role || "member" },
        successCallBack: () => {
          setShowInviteForm(false);
          inviteForm.reset();
          dispatch(fetchPendingByOrg(orgId));
        },
      })
    );
  }

  return {
    orgId,
    selectedOrg,
    members,
    membersLoading,
    cancellingId,
    resendingId,
    showInviteForm,
    showLabelForm,
    editingLabelId,
    editingLabelNameValue,
    setEditingLabelNameValue,
    editingLabelColorId,
    showLabelDeleteModal,
    labelToDelete,
    createInvitationState,
    fetchLabelsState,
    createLabelState,
    updateLabelState,
    deleteLabelState,
    inviteForm,
    labelForm,
    handleStartLabelNameEdit,
    handleSaveLabelNameEdit,
    handleCancelLabelNameEdit,
    handleStartLabelColorEdit,
    handleSaveLabelColorEdit,
    handleCancelLabelColorEdit,
    handleDeleteLabel,
    toggleShowInviteForm,
    toggleShowLabelForm,
    onSubmitLabelCreate,
    onSubmitInvite,
    handleCancelInvite,
    handleResendInvite,
    setShowLabelDeleteModal,
    setLabelToDelete,
    memberToRemove,
    showRemoveMemberModal,
    handleOpenRemoveMember,
    handleCloseRemoveMemberModal,
    handleRemoveMember,
    memberToEditRole,
    changeRoleValue,
    setChangeRoleValue,
    showChangeRoleModal,
    handleOpenChangeRole,
    handleCloseChangeRoleModal,
    handleSaveMemberRole,
    pendingByOrg,
    labels,
    fetchState,
    LABEL_COLORS,
    WORKSPACE_ROLE_LABELS,
    WORKSPACE_ROLE_OPTIONS,
    updateMemberRoleState,
    removeMemberState,
  };
}
