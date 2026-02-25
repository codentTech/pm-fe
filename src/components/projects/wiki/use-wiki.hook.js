"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { ORG_ROLE } from "@/common/constants/workspace-role.constant";
import { getDisplayUser } from "@/common/utils/users.util";
import {
  fetchMembers,
  setCurrentOrganization,
} from "@/provider/features/organizations/organizations.slice";
import { fetchProjectById } from "@/provider/features/projects/projects.slice";
import useDebounce from "@/common/hooks/useDebounce";
import {
  fetchWikiPages,
  searchWikiPages,
  fetchWikiPage,
  fetchWikiAttachments,
  createWikiPage,
  updateWikiPage,
  deleteWikiPage,
  uploadWikiAttachment,
  deleteWikiAttachment,
  clearCurrentPage,
} from "@/provider/features/wiki/wiki.slice";

export default function useProjectWiki({ projectId, slug } = {}) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { currentProject } = useSelector((state) => state.projects || {});
  const currentOrganizationId = useSelector(
    (state) => state.organizations?.currentOrganizationId,
  );
  const fetchMembersState = useSelector(
    (state) => state.organizations?.fetchMembers,
  );
  const {
    pages,
    currentPage,
    requestedSlug,
    attachments,
    fetchPage,
    fetchPages,
    searchPages,
    createPage,
    updatePage,
    deletePage,
  } = useSelector((state) => state.wiki || {});

  const [orgMembers, setOrgMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const fetchingOrgIdRef = useRef(null);

  const orgId = currentProject?.OrganizationId;

  const membersForRole = useMemo(() => {
    const useRedux =
      orgId &&
      orgId === currentOrganizationId &&
      fetchMembersState?.orgId === orgId &&
      Array.isArray(fetchMembersState?.data);
    return useRedux ? fetchMembersState.data : orgMembers;
  }, [
    orgId,
    currentOrganizationId,
    fetchMembersState?.orgId,
    fetchMembersState?.data,
    orgMembers,
  ]);

  useEffect(() => {
    if (projectId) dispatch(fetchProjectById(projectId));
  }, [projectId, dispatch]);

  useEffect(() => {
    if (
      currentProject?.Id === projectId &&
      currentProject?.OrganizationId &&
      currentProject.OrganizationId !== currentOrganizationId
    ) {
      dispatch(setCurrentOrganization(currentProject.OrganizationId));
    }
  }, [
    projectId,
    currentProject?.Id,
    currentProject?.OrganizationId,
    currentOrganizationId,
    dispatch,
  ]);

  useEffect(() => {
    if (
      !projectId ||
      currentProject?.Id !== projectId ||
      !currentProject?.OrganizationId
    ) {
      fetchingOrgIdRef.current = null;
      setOrgMembers([]);
      return;
    }
    const oid = currentProject.OrganizationId;
    fetchingOrgIdRef.current = oid;
    dispatch(
      fetchMembers({
        orgId: oid,
        successCallBack: (data) => {
          if (fetchingOrgIdRef.current === oid) {
            setOrgMembers(Array.isArray(data) ? data : []);
          }
        },
        errorCallBack: () => {
          if (fetchingOrgIdRef.current === oid) setOrgMembers([]);
        },
      }),
    );
  }, [projectId, currentProject?.Id, currentProject?.OrganizationId, dispatch]);

  useEffect(() => {
    if (projectId) dispatch(fetchWikiPages({ projectId }));

    if (projectId && slug) dispatch(fetchWikiPage({ projectId, slug }));
    return () => dispatch(clearCurrentPage());
  }, [projectId, slug, dispatch]);

  useEffect(() => {
    if (!projectId) return;
    const q = (debouncedSearchQuery || "").trim();
    if (q.length === 0) return;
    dispatch(searchWikiPages({ projectId, q }));
  }, [projectId, debouncedSearchQuery, dispatch]);

  useEffect(() => {
    const pageId = currentPage?.Id;
    if (projectId && pageId) {
      dispatch(fetchWikiAttachments({ projectId, pageId }));
    }
  }, [projectId, currentPage?.Id, dispatch]);

  const currentUserRole = useMemo(() => {
    const user = getDisplayUser();
    const id = user?.Id ?? user?.id;
    if (!id || membersForRole.length === 0) return null;
    const member = membersForRole.find(
      (m) => m.UserId === id || m.User?.Id === id || m.User?.id === id,
    );
    const role = (member?.Role ?? member?.role ?? "").toString().trim();
    if (!role) return null;
    return role.replace(/\s+/g, "_").toLowerCase();
  }, [membersForRole]);

  const isAdmin = useMemo(() => {
    if (!currentProject) return false;
    const user = getDisplayUser();
    const userId = user?.Id ?? user?.id;
    if (!orgId) {
      return (
        currentProject?.CreatedBy?.Id === userId ||
        currentProject?.CreatedBy?.id === userId
      );
    }
    if (currentUserRole == null) return false;
    return currentUserRole === ORG_ROLE.ORG_ADMIN;
  }, [currentProject, currentUserRole, orgId]);

  const handleCreatePage = useCallback(
    (payload) =>
      dispatch(
        createWikiPage({
          projectId,
          payload,
          successCallBack: (page) =>
            router.push(`/projects/${projectId}/wiki/${page.Slug}`),
        }),
      ),
    [dispatch, projectId, router],
  );

  const handleUpdatePage = useCallback(
    (pageId, payload) =>
      dispatch(
        updateWikiPage({
          projectId,
          pageId,
          payload,
          successCallBack: (page) =>
            router.push(`/projects/${projectId}/wiki/${page.Slug}`),
        }),
      ),
    [dispatch, projectId, router],
  );

  const handleDeletePage = useCallback(
    (pageId, onSuccess) =>
      dispatch(
        deleteWikiPage({
          projectId,
          pageId,
          successCallBack: () => {
            onSuccess?.();
            router.push(`/projects/${projectId}/wiki`);
          },
        }),
      ),
    [dispatch, projectId, router],
  );

  const handleUploadAttachment = useCallback(
    (pageId, file) =>
      dispatch(
        uploadWikiAttachment({
          projectId,
          pageId,
          file,
          successCallBack: () =>
            dispatch(fetchWikiAttachments({ projectId, pageId })),
        }),
      ),
    [dispatch, projectId],
  );

  const handleDeleteAttachment = useCallback(
    (pageId, attachmentId) =>
      dispatch(
        deleteWikiAttachment({
          projectId,
          pageId,
          attachmentId,
          successCallBack: () =>
            dispatch(fetchWikiAttachments({ projectId, pageId })),
        }),
      ),
    [dispatch, projectId],
  );

  const hasSearchQuery = (searchQuery || "").trim().length > 0;
  const displayPages = hasSearchQuery
    ? (searchPages?.data ?? [])
    : (pages || []);

  return {
    currentProject,
    pages: pages || [],
    displayPages,
    searchQuery,
    setSearchQuery,
    searchPagesLoading: searchPages?.isLoading ?? false,
    fetchPagesLoading: fetchPages?.isLoading ?? false,
    currentPage,
    requestedSlug: requestedSlug ?? null,
    attachments: attachments || [],
    fetchPage,
    isAdmin,
    projectReady: Boolean(currentProject?.Id === projectId),
    createPage,
    updatePage,
    deletePage,
    handleCreatePage,
    handleUpdatePage,
    handleDeletePage,
    handleUploadAttachment,
    handleDeleteAttachment,
  };
}
