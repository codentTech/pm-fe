import api from "@/common/utils/api";

const getHeaders = (orgId) => (orgId ? { "X-Organization-Id": orgId } : {});

const fetchDailyUpdates = async (orgId, params = {}) => {
  const searchParams = new URLSearchParams();
  if (params?.date) searchParams.set("date", params.date);
  if (params?.from) searchParams.set("from", params.from);
  if (params?.to) searchParams.set("to", params.to);
  if (params?.userId) searchParams.set("userId", params.userId);
  if (params?.role) searchParams.set("role", params.role);
  if (params?.status) searchParams.set("status", params.status);
  if (params?.search) searchParams.set("search", params.search);
  if (params?.page != null) searchParams.set("page", params.page);
  if (params?.limit != null) searchParams.set("limit", params.limit);
  const qs = searchParams.toString();
  const response = await api(getHeaders(orgId)).get(
    `/daily-updates${qs ? `?${qs}` : ""}`
  );
  return response.data;
};

const fetchDailyUpdateById = async (id, orgId) => {
  const response = await api(getHeaders(orgId)).get(`/daily-updates/${id}`);
  return response.data;
};

const createDailyUpdate = async (payload, orgId) => {
  const response = await api(getHeaders(orgId)).post("/daily-updates", payload);
  return response.data;
};

const updateDailyUpdate = async (id, payload, orgId) => {
  const response = await api(getHeaders(orgId)).put(`/daily-updates/${id}`, payload);
  return response.data;
};

const fetchMissingUpdateBacklog = async (orgId, params = {}) => {
  const searchParams = new URLSearchParams();
  if (params?.date) searchParams.set("date", params.date);
  if (params?.page != null) searchParams.set("page", params.page);
  if (params?.limit != null) searchParams.set("limit", params.limit);
  const qs = searchParams.toString();
  const response = await api(getHeaders(orgId)).get(
    `/daily-updates/backlogs/missing${qs ? `?${qs}` : ""}`
  );
  return response.data;
};

const fetchBlockerBacklog = async (orgId, params = {}) => {
  const searchParams = new URLSearchParams();
  if (params?.from) searchParams.set("from", params.from);
  if (params?.to) searchParams.set("to", params.to);
  if (params?.page != null) searchParams.set("page", params.page);
  if (params?.limit != null) searchParams.set("limit", params.limit);
  const qs = searchParams.toString();
  const response = await api(getHeaders(orgId)).get(
    `/daily-updates/backlogs/blockers${qs ? `?${qs}` : ""}`
  );
  return response.data;
};

const fetchOffPlanBacklog = async (orgId, params = {}) => {
  const searchParams = new URLSearchParams();
  if (params?.from) searchParams.set("from", params.from);
  if (params?.to) searchParams.set("to", params.to);
  if (params?.page != null) searchParams.set("page", params.page);
  if (params?.limit != null) searchParams.set("limit", params.limit);
  const qs = searchParams.toString();
  const response = await api(getHeaders(orgId)).get(
    `/daily-updates/backlogs/off-plan${qs ? `?${qs}` : ""}`
  );
  return response.data;
};

const dailyUpdatesService = {
  fetchDailyUpdates,
  fetchDailyUpdateById,
  createDailyUpdate,
  updateDailyUpdate,
  fetchMissingUpdateBacklog,
  fetchBlockerBacklog,
  fetchOffPlanBacklog,
};

export default dailyUpdatesService;
