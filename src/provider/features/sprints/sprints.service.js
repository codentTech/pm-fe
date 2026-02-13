import api from "@/common/utils/api";

const fetchSprints = async (projectId) => {
  const qs = projectId ? `?projectId=${projectId}` : "";
  const response = await api().get(`/sprints${qs}`);
  return response.data;
};

const fetchSprintById = async (id) => {
  const response = await api().get(`/sprints/${id}`);
  return response.data;
};

const createSprint = async (payload) => {
  const response = await api().post("/sprints", payload);
  return response.data;
};

const updateSprint = async (id, payload) => {
  const response = await api().put(`/sprints/${id}`, payload);
  return response.data;
};

const deleteSprint = async (id) => {
  const response = await api().delete(`/sprints/${id}`);
  return response.data;
};

const sprintsService = {
  fetchSprints,
  fetchSprintById,
  createSprint,
  updateSprint,
  deleteSprint,
};

export default sprintsService;
