import api from "@/common/utils/api";

const fetchListsByBoardId = async (boardId) => {
  const response = await api().get("/lists", { params: { boardId } });
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
  fetchListsByBoardId,
  createList,
  updateList,
  deleteList,
};

export default listsService;
