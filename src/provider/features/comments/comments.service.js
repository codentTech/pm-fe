import api from "@/common/utils/api";

const getHeaders = (orgId) => (orgId ? { "X-Organization-Id": orgId } : {});

const fetchByCardId = async (cardId, orgId) => {
  const response = await api(getHeaders(orgId)).get(`/cards/${cardId}/comments`);
  return response.data;
};

const create = async (cardId, payload, orgId) => {
  const response = await api(getHeaders(orgId)).post(
    `/cards/${cardId}/comments`,
    payload
  );
  return response.data;
};

const update = async (cardId, commentId, payload, orgId) => {
  const response = await api(getHeaders(orgId)).put(
    `/cards/${cardId}/comments/${commentId}`,
    payload
  );
  return response.data;
};

const remove = async (cardId, commentId, orgId) => {
  const response = await api(getHeaders(orgId)).delete(
    `/cards/${cardId}/comments/${commentId}`
  );
  return response.data;
};

const commentsService = {
  fetchByCardId,
  create,
  update,
  remove,
};

export default commentsService;
