// "use client";

// import { useCallback, useEffect, useMemo, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useRouter } from "next/navigation";
// import {
//   fetchWikiPages,
//   fetchWikiPage,
//   createWikiPage,
//   updateWikiPage,
//   deleteWikiPage,
//   fetchWikiAttachments,
//   uploadWikiAttachment,
//   deleteWikiAttachment,
//   clearCurrentPage,
// } from "@/provider/features/wiki/wiki.slice";
// import { fetchProjectById, clearCurrentProject } from "@/provider/features/projects/projects.slice";
// import { fetchMembers } from "@/provider/features/organizations/organizations.slice";
// import { getDisplayUser } from "@/common/utils/users.util";

// export default function useProjectWiki({ projectId, slug }) {
//   const dispatch = useDispatch();
//   const router = useRouter();
//   const {
//     pages,
//     currentPage,
//     attachments,
//     fetchPages,
//     fetchPage,
//     createPage,
//     updatePage,
//     deletePage,
//     fetchAttachments,
//     uploadAttachment,
//     deleteAttachment,
//   } = useSelector((state) => state.wiki || {});
//   const { currentProject, fetchProjectById: projectState } = useSelector(
//     (state) => state.projects || {},
//   );
//   const [orgMembers, setOrgMembers] = useState([]);
//   const [currentUserRole, setCurrentUserRole] = useState(null);

//   const orgId = currentProject?.OrganizationId;

//   useEffect(() => {
//     if (projectId) dispatch(fetchProjectById(projectId));
//     return () => dispatch(clearCurrentProject());
//   }, [projectId, dispatch]);

//   useEffect(() => {
//     if (!orgId) {
//       setOrgMembers([]);
//       return;
//     }
//     dispatch(
//       fetchMembers({
//         orgId,
//         successCallBack: (data) => setOrgMembers(data || []),
//         errorCallBack: () => setOrgMembers([]),
//       }),
//     );
//   }, [orgId, dispatch]);

//   useEffect(() => {
//     const user = getDisplayUser();
//     if (!user?.Id || orgMembers.length === 0) {
//       setCurrentUserRole(null);
//       return;
//     }
//     const member = orgMembers.find(
//       (m) => m.User?.Id === user.Id || m.UserId === user.Id,
//     );
//     setCurrentUserRole((member?.Role || "").toLowerCase() || null);
//   }, [orgMembers]);

//   const canEdit = useMemo(() => {
//     const user = getDisplayUser();
//     if (!currentProject) return false;
//     if (!currentProject.OrganizationId) {
//       return currentProject?.CreatedBy?.Id === user?.Id;
//     }
//     return currentUserRole === "admin" || currentUserRole === "owner";
//   }, [currentProject, currentUserRole]);

//   useEffect(() => {
//     if (projectId) dispatch(fetchWikiPages({ projectId }));
//   }, [projectId, dispatch]);

//   useEffect(() => {
//     if (!projectId || !slug) return;
//     dispatch(fetchWikiPage({ projectId, slug }));
//     return () => dispatch(clearCurrentPage());
//   }, [projectId, slug, dispatch]);

//   useEffect(() => {
//     if (!projectId || !currentPage?.Id) return;
//     dispatch(fetchWikiAttachments({ projectId, pageId: currentPage.Id }));
//   }, [projectId, currentPage?.Id, dispatch]);

//   const handleCreatePage = useCallback(
//     (payload) =>
//       dispatch(
//         createWikiPage({
//           projectId,
//           payload,
//           successCallBack: (page) => router.push(`/projects/${projectId}/wiki/${page.Slug}`),
//         }),
//       ),
//     [dispatch, projectId, router],
//   );

//   const handleUpdatePage = useCallback(
//     (pageId, payload) =>
//       dispatch(
//         updateWikiPage({
//           projectId,
//           pageId,
//           payload,
//           successCallBack: (page) => router.push(`/projects/${projectId}/wiki/${page.Slug}`),
//         }),
//       ),
//     [dispatch, projectId, router],
//   );

//   const handleDeletePage = useCallback(
//     (pageId) =>
//       dispatch(
//         deleteWikiPage({
//           projectId,
//           pageId,
//           successCallBack: () => router.push(`/projects/${projectId}/wiki`),
//         }),
//       ),
//     [dispatch, projectId, router],
//   );

//   const handleUploadAttachment = useCallback(
//     (pageId, file) =>
//       dispatch(
//         uploadWikiAttachment({
//           projectId,
//           pageId,
//           file,
//           successCallBack: () =>
//             dispatch(fetchWikiAttachments({ projectId, pageId })),
//         }),
//       ),
//     [dispatch, projectId],
//   );

//   const handleDeleteAttachment = useCallback(
//     (pageId, attachmentId) =>
//       dispatch(
//         deleteWikiAttachment({
//           projectId,
//           pageId,
//           attachmentId,
//           successCallBack: () =>
//             dispatch(fetchWikiAttachments({ projectId, pageId })),
//         }),
//       ),
//     [dispatch, projectId],
//   );

//   return {
//     pages,
//     currentPage,
//     attachments,
//     project: currentProject,
//     canEdit,
//     fetchPages,
//     fetchPage,
//     createPage,
//     updatePage,
//     deletePage,
//     fetchAttachments,
//     uploadAttachment,
//     deleteAttachment,
//     projectState,
//     handleCreatePage,
//     handleUpdatePage,
//     handleDeletePage,
//     handleUploadAttachment,
//     handleDeleteAttachment,
//   };
// }
// "use client";

// import { useCallback, useEffect, useMemo, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { getDisplayUser } from "@/common/utils/users.util";
// import {
//   fetchWikiPages,
//   fetchWikiPage,
//   createWikiPage,
//   updateWikiPage,
//   deleteWikiPage,
//   fetchWikiAttachments,
//   uploadWikiAttachment,
//   deleteWikiAttachment,
//   clearCurrentPage,
// } from "@/provider/features/wiki/wiki.slice";
// import { fetchProjectById } from "@/provider/features/projects/projects.slice";
// import { fetchMembers } from "@/provider/features/organizations/organizations.slice";

// export default function useProjectWiki({ projectId, slug } = {}) {
//   const dispatch = useDispatch();
//   const [orgMembers, setOrgMembers] = useState([]);
//   const { currentProject, fetchProjectById: fetchProjectState } = useSelector(
//     (state) => state.projects || {},
//   );
//   const wikiState = useSelector((state) => state.wiki || {});
//   const user = getDisplayUser();
//   const orgId = currentProject?.OrganizationId;

//   useEffect(() => {
//     if (projectId) dispatch(fetchProjectById(projectId));
//     return () => dispatch(clearCurrentPage());
//   }, [dispatch, projectId]);

//   useEffect(() => {
//     if (!orgId) return;
//     dispatch(
//       fetchMembers({
//         orgId,
//         successCallBack: (data) => setOrgMembers(data || []),
//         errorCallBack: () => setOrgMembers([]),
//       }),
//     );
//   }, [dispatch, orgId]);

//   useEffect(() => {
//     if (projectId && !slug) dispatch(fetchWikiPages({ projectId }));
//   }, [dispatch, projectId, slug]);

//   useEffect(() => {
//     if (projectId && slug) dispatch(fetchWikiPage({ projectId, slug }));
//   }, [dispatch, projectId, slug]);

//   const currentUserRole = useMemo(() => {
//     if (!user?.Id || orgMembers.length === 0) return null;
//     const member = orgMembers.find(
//       (m) => m.User?.Id === user.Id || m.UserId === user.Id,
//     );
//     return (member?.Role || "").toLowerCase() || null;
//   }, [orgMembers, user?.Id]);

//   const isAdmin = useMemo(() => {
//     if (!currentProject) return false;
//     if (!orgId) return currentProject?.CreatedBy?.Id === user?.Id;
//     return currentUserRole === "admin" || currentUserRole === "owner";
//   }, [currentProject, currentUserRole, orgId, user?.Id]);

//   const createPage = useCallback(
//     (payload, successCallBack) =>
//       dispatch(createWikiPage({ projectId, payload, successCallBack })),
//     [dispatch, projectId],
//   );

//   const updatePage = useCallback(
//     (pageId, payload, successCallBack) =>
//       dispatch(updateWikiPage({ projectId, pageId, payload, successCallBack })),
//     [dispatch, projectId],
//   );

//   const removePage = useCallback(
//     (pageId, successCallBack) =>
//       dispatch(deleteWikiPage({ projectId, pageId, successCallBack })),
//     [dispatch, projectId],
//   );

//   const fetchAttachments = useCallback(
//     (pageId, params) =>
//       dispatch(fetchWikiAttachments({ projectId, pageId, params })),
//     [dispatch, projectId],
//   );

//   const uploadAttachment = useCallback(
//     (pageId, file, successCallBack) =>
//       dispatch(uploadWikiAttachment({ projectId, pageId, file, successCallBack })),
//     [dispatch, projectId],
//   );

//   const removeAttachment = useCallback(
//     (pageId, attachmentId, successCallBack) =>
//       dispatch(
//         deleteWikiAttachment({ projectId, pageId, attachmentId, successCallBack }),
//       ),
//     [dispatch, projectId],
//   );

//   return {
//     currentProject,
//     fetchProjectState,
//     pages: wikiState.pages || [],
//     currentPage: wikiState.currentPage,
//     attachments: wikiState.attachments || [],
//     wikiState,
//     isAdmin,
//     createPage,
//     updatePage,
//     removePage,
//     fetchAttachments,
//     uploadAttachment,
//     removeAttachment,
//   };
// }
"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjectById } from "@/provider/features/projects/projects.slice";
import { fetchMembers } from "@/provider/features/organizations/organizations.slice";
import {
  fetchWikiPages,
  fetchWikiPage,
  fetchWikiAttachments,
} from "@/provider/features/wiki/wiki.slice";
import { getDisplayUser } from "@/common/utils/users.util";

export default function useProjectWiki({ projectId, slug, pageId }) {
  const dispatch = useDispatch();
  const { currentProject, fetchProjectById: fetchProjectState } = useSelector(
    (state) => state.projects || {},
  );
  const {
    pages,
    currentPage,
    attachments,
    fetchPages,
    fetchPage,
    fetchAttachments,
  } = useSelector((state) => state.wiki || {});
  const [orgMembers, setOrgMembers] = useState([]);

  const orgId = currentProject?.OrganizationId;

  useEffect(() => {
    if (projectId) dispatch(fetchProjectById(projectId));
  }, [projectId, dispatch]);

  useEffect(() => {
    if (!orgId) return;
    dispatch(
      fetchMembers({
        orgId,
        successCallBack: (data) => setOrgMembers(data || []),
        errorCallBack: () => setOrgMembers([]),
      }),
    );
  }, [orgId, dispatch]);

  useEffect(() => {
    if (projectId) dispatch(fetchWikiPages({ projectId }));
  }, [projectId, dispatch]);

  useEffect(() => {
    if (projectId && slug) dispatch(fetchWikiPage({ projectId, slug }));
  }, [projectId, slug, dispatch]);

  const effectivePageId = pageId || currentPage?.Id;
  useEffect(() => {
    if (projectId && effectivePageId) {
      dispatch(fetchWikiAttachments({ projectId, pageId: effectivePageId }));
    }
  }, [projectId, effectivePageId, dispatch]);

  const currentUserRole = useMemo(() => {
    const user = getDisplayUser();
    if (!user?.Id || orgMembers.length === 0) return null;
    const member = orgMembers.find(
      (m) => m.User?.Id === user.Id || m.UserId === user.Id,
    );
    return (member?.Role || "").toLowerCase() || null;
  }, [orgMembers]);

  const isAdmin = currentUserRole === "project_manager";

  return {
    currentProject,
    pages: pages || [],
    currentPage,
    attachments: attachments || [],
    isAdmin,
    fetchProjectState,
    fetchPages,
    fetchPage,
    fetchAttachments,
  };
}
