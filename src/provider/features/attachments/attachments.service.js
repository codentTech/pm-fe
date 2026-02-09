import api from "@/common/utils/api";

const getHeaders = (orgId) => (orgId ? { "X-Organization-Id": orgId } : {});

const fetchByCardId = async (cardId, orgId) => {
  const response = await api(getHeaders(orgId)).get(`/cards/${cardId}/attachments`);
  return response.data;
};

const create = async (cardId, payload, orgId) => {
  const response = await api(getHeaders(orgId)).post(
    `/cards/${cardId}/attachments`,
    payload
  );
  return response.data;
};

const upload = async (cardId, file, orgId) => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await api(getHeaders(orgId)).post(
    `/cards/${cardId}/attachments/upload`,
    formData
  );
  return response.data;
};

const remove = async (cardId, attachmentId, orgId) => {
  const response = await api(getHeaders(orgId)).delete(
    `/cards/${cardId}/attachments/${attachmentId}`
  );
  return response.data;
};

const attachmentsService = {
  fetchByCardId,
  create,
  upload,
  remove,
};

export default attachmentsService;
