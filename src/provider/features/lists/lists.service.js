import api from "@/common/utils/api";

const fetchListsByProjectId = async (projectId) => {
  const response = await api().get("/lists", { params: { projectId } });
  return response.data;
};

const createList = async (payload) => {
  const response = await api().post("/lists", payload);
  return response.data;
};

const updateList = async (id, payload) => {
  const response = await api().put(`/lists/${id}`, payload);
  return response.data;
};

const deleteList = async (id) => {
  const response = await api().delete(`/lists/${id}`);
  return response.data;
};

const listsService = {
  fetchListsByProjectId,
  createList,
  updateList,
  deleteList,
};

export default listsService;
