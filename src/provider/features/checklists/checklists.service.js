import api from "@/common/utils/api";

const getHeaders = (orgId) => (orgId ? { "X-Organization-Id": orgId } : {});

const fetchByCardId = async (cardId, orgId) => {
  const response = await api(getHeaders(orgId)).get(
    `/cards/${cardId}/checklists`
  );
  return response.data;
};

const createChecklist = async (cardId, payload, orgId) => {
  const response = await api(getHeaders(orgId)).post(
    `/cards/${cardId}/checklists`,
    payload
  );
  return response.data;
};

const updateChecklist = async (cardId, checklistId, payload, orgId) => {
  const response = await api(getHeaders(orgId)).put(
    `/cards/${cardId}/checklists/${checklistId}`,
    payload
  );
  return response.data;
};

const deleteChecklist = async (cardId, checklistId, orgId) => {
  const response = await api(getHeaders(orgId)).delete(
    `/cards/${cardId}/checklists/${checklistId}`
  );
  return response.data;
};

const createItem = async (cardId, checklistId, payload, orgId) => {
  const response = await api(getHeaders(orgId)).post(
    `/cards/${cardId}/checklists/${checklistId}/items`,
    payload
  );
  return response.data;
};

const updateItem = async (cardId, checklistId, itemId, payload, orgId) => {
  const response = await api(getHeaders(orgId)).put(
    `/cards/${cardId}/checklists/${checklistId}/items/${itemId}`,
    payload
  );
  return response.data;
};

const deleteItem = async (cardId, checklistId, itemId, orgId) => {
  const response = await api(getHeaders(orgId)).delete(
    `/cards/${cardId}/checklists/${checklistId}/items/${itemId}`
  );
  return response.data;
};

const checklistsService = {
  fetchByCardId,
  createChecklist,
  updateChecklist,
  deleteChecklist,
  createItem,
  updateItem,
  deleteItem,
};

export default checklistsService;
