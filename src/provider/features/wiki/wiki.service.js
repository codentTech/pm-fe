import api from "@/common/utils/api";

const fetchWikiPages = async (projectId) => {
  const response = await api().get(`/projects/${projectId}/wiki`);
  return response.data;
};

const fetchWikiPage = async (projectId, slug) => {
  const response = await api().get(`/projects/${projectId}/wiki/${slug}`);
  return response.data;
};

const createWikiPage = async (projectId, payload) => {
  const response = await api().post(`/projects/${projectId}/wiki`, payload);
  return response.data;
};

const updateWikiPage = async (projectId, pageId, payload) => {
  const response = await api().put(`/projects/${projectId}/wiki/${pageId}`, payload);
  return response.data;
};

const deleteWikiPage = async (projectId, pageId) => {
  const response = await api().delete(`/projects/${projectId}/wiki/${pageId}`);
  return response.data;
};

const uploadWikiAttachment = async (projectId, pageId, file) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await api().post(
    `/projects/${projectId}/wiki/${pageId}/attachments/upload`,
    formData,
  );
  return response.data;
};

const fetchWikiAttachments = async (projectId, pageId, params = {}) => {
  const searchParams = new URLSearchParams();
  if (params?.page != null) searchParams.set("page", params.page);
  if (params?.limit != null) searchParams.set("limit", params.limit);
  const qs = searchParams.toString();
  const response = await api().get(
    `/projects/${projectId}/wiki/${pageId}/attachments${qs ? `?${qs}` : ""}`,
  );
  return response.data;
};

const deleteWikiAttachment = async (projectId, pageId, attachmentId) => {
  const response = await api().delete(
    `/projects/${projectId}/wiki/${pageId}/attachments/${attachmentId}`,
  );
  return response.data;
};

const wikiService = {
  fetchWikiPages,
  fetchWikiPage,
  createWikiPage,
  updateWikiPage,
  deleteWikiPage,
  uploadWikiAttachment,
  fetchWikiAttachments,
  deleteWikiAttachment,
};

export default wikiService;
