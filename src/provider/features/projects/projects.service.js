import api from "@/common/utils/api";

const getHeaders = (orgId) => (orgId ? { "X-Organization-Id": orgId } : {});

const fetchProjects = async (orgId, params = {}) => {
  const searchParams = new URLSearchParams();
  if (params?.page != null) searchParams.set("page", params.page);
  if (params?.limit != null) searchParams.set("limit", params.limit);
  if (params?.sort) searchParams.set("sort", params.sort);
  if (params?.order) searchParams.set("order", params.order);
  const qs = searchParams.toString();
  const response = await api(getHeaders(orgId)).get(`/projects${qs ? `?${qs}` : ""}`);
  return response.data;
};

const fetchProjectById = async (id, orgId) => {
  const response = await api(getHeaders(orgId)).get(`/projects/${id}`);
  return response.data;
};

const createProject = async (payload, orgId) => {
  const response = await api(getHeaders(orgId)).post("/projects", payload);
  return response.data;
};

const createProjectFromBid = async (bidId, orgId) => {
  const response = await api(getHeaders(orgId)).post(`/projects/from-bid/${bidId}`);
  return response.data;
};

const updateProject = async (id, payload, orgId) => {
  const response = await api(getHeaders(orgId)).put(`/projects/${id}`, payload);
  return response.data;
};

const deleteProject = async (id, orgId) => {
  const response = await api(getHeaders(orgId)).delete(`/projects/${id}`);
  return response.data;
};

const projectsService = {
  fetchProjects,
  fetchProjectById,
  createProject,
  createProjectFromBid,
  updateProject,
  deleteProject,
};

export default projectsService;
