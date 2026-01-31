import api from "@/common/utils/api";

const fetchBoards = async () => {
  const response = await api().get("/boards");
  return response.data;
};

const fetchBoardById = async (id) => {
  const response = await api().get(`/boards/${id}`);
  return response.data;
};

const createBoard = async (payload) => {
  const response = await api().post("/boards", payload);
  return response.data;
};

const updateBoard = async (id, payload) => {
  const response = await api().put(`/boards/${id}`, payload);
  return response.data;
};

const deleteBoard = async (id) => {
  const response = await api().delete(`/boards/${id}`);
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
