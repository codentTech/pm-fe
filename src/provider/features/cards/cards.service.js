import api from "@/common/utils/api";

const createCard = async (payload) => {
  const response = await api().post("/cards", payload);
  return response.data;
};

const updateCard = async (id, payload) => {
  const response = await api().put(`/cards/${id}`, payload);
  return response.data;
};

const deleteCard = async (id) => {
  const response = await api().delete(`/cards/${id}`);
  return response.data;
};

const cardsService = {
  createCard,
  updateCard,
  deleteCard,
};

export default cardsService;
