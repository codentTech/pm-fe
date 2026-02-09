import api from "@/common/utils/api";

const getHeaders = (orgId) => (orgId ? { "X-Organization-Id": orgId } : {});

const fetchKpis = async (orgId, params = {}) => {
  const searchParams = new URLSearchParams();
  if (params?.page != null) searchParams.set("page", params.page);
  if (params?.limit != null) searchParams.set("limit", params.limit);
  if (params?.sort) searchParams.set("sort", params.sort);
  if (params?.order) searchParams.set("order", params.order);
  const qs = searchParams.toString();
  const response = await api(getHeaders(orgId)).get(`/kpis${qs ? `?${qs}` : ""}`);
  return response.data;
};

const fetchKpiById = async (id, orgId) => {
  const response = await api(getHeaders(orgId)).get(`/kpis/${id}`);
  return response.data;
};

const createKpi = async (payload, orgId) => {
  const response = await api(getHeaders(orgId)).post("/kpis", payload);
  return response.data;
};

const updateKpi = async (id, payload, orgId) => {
  const response = await api(getHeaders(orgId)).put(`/kpis/${id}`, payload);
  return response.data;
};

const deleteKpi = async (id, orgId) => {
  const response = await api(getHeaders(orgId)).delete(`/kpis/${id}`);
  return response.data;
};

const kpisService = {
  fetchKpis,
  fetchKpiById,
  createKpi,
  updateKpi,
  deleteKpi,
};

export default kpisService;
