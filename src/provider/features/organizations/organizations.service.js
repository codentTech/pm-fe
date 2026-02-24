import api from "@/common/utils/api";

const getHeaders = (orgId) => (orgId ? { "X-Organization-Id": orgId } : {});

const fetchOrganizations = async () => {
  const response = await api().get("/organizations");
  return response.data;
};

const getOrEnsureDefault = async () => {
  const response = await api().get("/organizations/default");
  return response.data;
};

const createOrganization = async (payload) => {
  const response = await api().post("/organizations", payload);
  return response.data;
};

/** Super Admin only: create workspace and set owner by email */
const createWithOwner = async (payload) => {
  const response = await api().post("/organizations/create-with-owner", payload);
  return response.data;
};

/** Super Admin only: list all organizations */
const listAllForSuperAdmin = async () => {
  const response = await api().get("/organizations/list-all");
  return response.data;
};

/** Get one organization by id (Super Admin can get any org; others require membership) */
const getOrganization = async (orgId) => {
  const response = await api().get(`/organizations/${orgId}`);
  return response.data;
};

const getMembers = async (orgId) => {
  const response = await api(getHeaders(orgId)).get(`/organizations/${orgId}/members`);
  return response.data;
};

const updateMemberRole = async (orgId, memberId, payload) => {
  const response = await api(getHeaders(orgId)).patch(
    `/organizations/${orgId}/members/${memberId}`,
    payload
  );
  return response.data;
};

const removeMember = async (orgId, memberId) => {
  const response = await api(getHeaders(orgId)).delete(
    `/organizations/${orgId}/members/${memberId}`
  );
  return response.data;
};

const updateOrganization = async (orgId, payload) => {
  const response = await api(getHeaders(orgId)).put(`/organizations/${orgId}`, payload);
  return response.data;
};

const deleteOrganization = async (orgId) => {
  const response = await api(getHeaders(orgId)).delete(`/organizations/${orgId}`);
  return response.data;
};

const organizationsService = {
  fetchOrganizations,
  getOrEnsureDefault,
  createOrganization,
  createWithOwner,
  listAllForSuperAdmin,
  getOrganization,
  getMembers,
  updateMemberRole,
  removeMember,
  updateOrganization,
  deleteOrganization,
  getHeaders,
};

export default organizationsService;
