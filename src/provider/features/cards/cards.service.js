import api from "@/common/utils/api";

const createCard = async (payload) => {
  const response = await api().post("/cards", payload);
  return response.data;
};

const updateCard = async (id, payload) => {
  const response = await api().put(`/cards/${id}`, payload);
  return response.data;
};

const deleteCard = async (id) => {
  const response = await api().delete(`/cards/${id}`);
  return response.data;
};

const fetchProductBacklog = async (projectId, params = {}) => {
  const searchParams = new URLSearchParams();
  if (projectId) searchParams.set("projectId", projectId);
  if (params?.page != null) searchParams.set("page", params.page);
  if (params?.limit != null) searchParams.set("limit", params.limit);
  const qs = searchParams.toString();
  const response = await api().get(`/cards/backlogs/product${qs ? `?${qs}` : ""}`);
  return response.data;
};

const fetchSprintBacklog = async (projectId, sprintId, params = {}) => {
  const searchParams = new URLSearchParams();
  if (projectId) searchParams.set("projectId", projectId);
  if (sprintId) searchParams.set("sprintId", sprintId);
  if (params?.page != null) searchParams.set("page", params.page);
  if (params?.limit != null) searchParams.set("limit", params.limit);
  const qs = searchParams.toString();
  const response = await api().get(`/cards/backlogs/sprint${qs ? `?${qs}` : ""}`);
  return response.data;
};

const fetchBugBacklog = async (projectId, params = {}) => {
  const searchParams = new URLSearchParams();
  if (projectId) searchParams.set("projectId", projectId);
  if (params?.page != null) searchParams.set("page", params.page);
  if (params?.limit != null) searchParams.set("limit", params.limit);
  const qs = searchParams.toString();
  const response = await api().get(`/cards/backlogs/bugs${qs ? `?${qs}` : ""}`);
  return response.data;
};

const fetchBlockedBacklog = async (projectId, params = {}) => {
  const searchParams = new URLSearchParams();
  if (projectId) searchParams.set("projectId", projectId);
  if (params?.page != null) searchParams.set("page", params.page);
  if (params?.limit != null) searchParams.set("limit", params.limit);
  const qs = searchParams.toString();
  const response = await api().get(`/cards/backlogs/blocked${qs ? `?${qs}` : ""}`);
  return response.data;
};

const cardsService = {
  createCard,
  updateCard,
  deleteCard,
  fetchProductBacklog,
  fetchSprintBacklog,
  fetchBugBacklog,
  fetchBlockedBacklog,
};

export default cardsService;
