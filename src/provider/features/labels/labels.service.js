import api from "@/common/utils/api";

const getHeaders = (orgId) => (orgId ? { "X-Organization-Id": orgId } : {});

const fetchLabels = async (orgId) => {
  const response = await api(getHeaders(orgId)).get("/labels");
  return response.data;
};

const createLabel = async (payload, orgId) => {
  const response = await api(getHeaders(orgId)).post("/labels", payload);
  return response.data;
};

const updateLabel = async (id, payload, orgId) => {
  const response = await api(getHeaders(orgId)).put(`/labels/${id}`, payload);
  return response.data;
};

const deleteLabel = async (id, orgId) => {
  const response = await api(getHeaders(orgId)).delete(`/labels/${id}`);
  return response.data;
};

const labelsService = {
  fetchLabels,
  createLabel,
  updateLabel,
  deleteLabel,
};

export default labelsService;
