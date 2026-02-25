"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import {
  ORG_ROLE,
  WORKSPACE_ROLE_LABELS,
} from "@/common/constants/workspace-role.constant";
import { getDisplayUser } from "@/common/utils/users.util";
import { fetchProjects } from "@/provider/features/projects/projects.slice";
import { fetchBids } from "@/provider/features/bids/bids.slice";
import { fetchKpis } from "@/provider/features/kpis/kpis.slice";
import {
  deleteOrganization,
  fetchMembers,
  fetchOrganizations,
  fetchOrEnsureDefault,
  setCurrentOrganization,
} from "@/provider/features/organizations/organizations.slice";

export default function useWorkspaceDetail() {
  const dispatch = useDispatch();
  const router = useRouter();
  const params = useParams();
  const orgId = params?.id;

  const {
    organizations,
    currentOrganizationId,
    deleteOrganization: deleteState,
    fetchMembers: fetchMembersState,
  } = useSelector((state) => state.organizations || {});

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const members = fetchMembersState?.data ?? [];

  useEffect(() => {
    dispatch(fetchOrganizations());
  }, [dispatch]);

  useEffect(() => {
    if (!orgId) return;
    if (organizations?.length > 0 && !organizations.find((o) => o.Id === orgId)) {
      router.replace("/settings/workspace");
    }
  }, [orgId, organizations, router]);

  useEffect(() => {
    if (orgId) {
      dispatch(
        fetchMembers({
          orgId,
          errorCallBack: () => {},
          completeCallBack: () => {},
        })
      );
    }
  }, [orgId, dispatch]);

  const org = organizations?.find((o) => o.Id === orgId) ?? null;

  const displayUser = getDisplayUser();
  const currentUserId = displayUser?.Id ?? displayUser?.id;

  const owner = useMemo(() => {
    const admin = members.find(
      (m) => (m.Role || "").toLowerCase() === ORG_ROLE.ORG_ADMIN
    );
    const user = admin?.User;
    if (!user) return null;
    return user.FullName || user.Email || "Org Admin";
  }, [members]);

  const myRoleLabel = useMemo(() => {
    const me = members.find(
      (m) =>
        m.UserId === currentUserId ||
        m.User?.Id === currentUserId ||
        m.User?.id === currentUserId
    );
    const role = me?.Role;
    return role ? WORKSPACE_ROLE_LABELS[role] || role : null;
  }, [members, currentUserId]);

  const isCurrentWorkspace = orgId === currentOrganizationId;

  function handleSwitchWorkspace() {
    if (!orgId) return;
    dispatch(setCurrentOrganization(orgId));
    dispatch(fetchProjects());
    dispatch(fetchBids());
    dispatch(fetchKpis());
  }

  function openDeleteModal() {
    setShowDeleteModal(true);
  }

  function closeDeleteModal() {
    setShowDeleteModal(false);
  }

  async function handleDeleteOrg() {
    if (!orgId) return;
    const wasCurrentOrg = orgId === currentOrganizationId;
    const result = await dispatch(
      deleteOrganization({
        orgId,
        successCallBack: () => {
          closeDeleteModal();
          router.push("/settings/workspace");
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

  return {
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
  };
}
