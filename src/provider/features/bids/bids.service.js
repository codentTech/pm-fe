import api from "@/common/utils/api";

const getHeaders = (orgId) => (orgId ? { "X-Organization-Id": orgId } : {});

const fetchBids = async (orgId, params = {}) => {
  const searchParams = new URLSearchParams();
  if (params?.page != null) searchParams.set("page", params.page);
  if (params?.limit != null) searchParams.set("limit", params.limit);
  if (params?.sort) searchParams.set("sort", params.sort);
  if (params?.order) searchParams.set("order", params.order);
  if (params?.status) searchParams.set("status", params.status);
  const qs = searchParams.toString();
  const response = await api(getHeaders(orgId)).get(`/bids${qs ? `?${qs}` : ""}`);
  return response.data;
};

const fetchBidById = async (id, orgId) => {
  const response = await api(getHeaders(orgId)).get(`/bids/${id}`);
  return response.data;
};

const createBid = async (payload, orgId) => {
  const response = await api(getHeaders(orgId)).post("/bids", payload);
  return response.data;
};

const updateBid = async (id, payload, orgId) => {
  const response = await api(getHeaders(orgId)).put(`/bids/${id}`, payload);
  return response.data;
};

const transitionBidStatus = async (id, payload, orgId) => {
  const response = await api(getHeaders(orgId)).post(`/bids/${id}/transition`, payload);
  return response.data;
};

const deleteBid = async (id, orgId) => {
  const response = await api(getHeaders(orgId)).delete(`/bids/${id}`);
  return response.data;
};

const bulkDeleteBids = async (ids, orgId) => {
  const response = await api(getHeaders(orgId)).post("/bids/bulk-delete", { ids });
  return response.data;
};

const fetchDraftBacklog = async (orgId, params = {}) => {
  const searchParams = new URLSearchParams();
  if (params?.page != null) searchParams.set("page", params.page);
  if (params?.limit != null) searchParams.set("limit", params.limit);
  const qs = searchParams.toString();
  const response = await api(getHeaders(orgId)).get(
    `/bids/backlogs/drafts${qs ? `?${qs}` : ""}`
  );
  return response.data;
};

const fetchFollowUpBacklog = async (orgId, params = {}) => {
  const searchParams = new URLSearchParams();
  if (params?.page != null) searchParams.set("page", params.page);
  if (params?.limit != null) searchParams.set("limit", params.limit);
  const qs = searchParams.toString();
  const response = await api(getHeaders(orgId)).get(
    `/bids/backlogs/follow-ups${qs ? `?${qs}` : ""}`
  );
  return response.data;
};

const fetchInterviewBacklog = async (orgId, params = {}) => {
  const searchParams = new URLSearchParams();
  if (params?.page != null) searchParams.set("page", params.page);
  if (params?.limit != null) searchParams.set("limit", params.limit);
  const qs = searchParams.toString();
  const response = await api(getHeaders(orgId)).get(
    `/bids/backlogs/interviews${qs ? `?${qs}` : ""}`
  );
  return response.data;
};

const fetchReviewBacklog = async (orgId, params = {}) => {
  const searchParams = new URLSearchParams();
  if (params?.page != null) searchParams.set("page", params.page);
  if (params?.limit != null) searchParams.set("limit", params.limit);
  const qs = searchParams.toString();
  const response = await api(getHeaders(orgId)).get(
    `/bids/backlogs/review${qs ? `?${qs}` : ""}`
  );
  return response.data;
};

const fetchGhostedSuggestions = async (orgId, params = {}) => {
  const searchParams = new URLSearchParams();
  if (params?.page != null) searchParams.set("page", params.page);
  if (params?.limit != null) searchParams.set("limit", params.limit);
  const qs = searchParams.toString();
  const response = await api(getHeaders(orgId)).get(
    `/bids/ghosted-suggestions${qs ? `?${qs}` : ""}`
  );
  return response.data;
};

const fetchBidMetrics = async (orgId) => {
  const response = await api(getHeaders(orgId)).get("/bids/metrics");
  return response.data;
};

const bidsService = {
  fetchBids,
  fetchBidById,
  createBid,
  updateBid,
  transitionBidStatus,
  deleteBid,
  bulkDeleteBids,
  fetchDraftBacklog,
  fetchFollowUpBacklog,
  fetchInterviewBacklog,
  fetchReviewBacklog,
  fetchGhostedSuggestions,
  fetchBidMetrics,
};

export default bidsService;
