import api from "@/common/utils/api";

const getHeaders = (orgId) => (orgId ? { "X-Organization-Id": orgId } : {});

const fetchBoards = async (orgId, params = {}) => {
  const searchParams = new URLSearchParams();
  if (params?.page != null) searchParams.set("page", params.page);
  if (params?.limit != null) searchParams.set("limit", params.limit);
  if (params?.sort) searchParams.set("sort", params.sort);
  if (params?.order) searchParams.set("order", params.order);
  const qs = searchParams.toString();
  const response = await api(getHeaders(orgId)).get(`/boards${qs ? `?${qs}` : ""}`);
  return response.data;
};

const fetchBoardById = async (id, orgId) => {
  const response = await api(getHeaders(orgId)).get(`/boards/${id}`);
  return response.data;
};

const createBoard = async (payload, orgId) => {
  const response = await api(getHeaders(orgId)).post("/boards", payload);
  return response.data;
};

const updateBoard = async (id, payload, orgId) => {
  const response = await api(getHeaders(orgId)).put(`/boards/${id}`, payload);
  return response.data;
};

const deleteBoard = async (id, orgId) => {
  const response = await api(getHeaders(orgId)).delete(`/boards/${id}`);
  return response.data;
};

const boardsService = {
  fetchBoards,
  fetchBoardById,
  createBoard,
  updateBoard,
  deleteBoard,
};

export default boardsService;
