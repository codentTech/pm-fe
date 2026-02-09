import api from "@/common/utils/api";

const getHeaders = (orgId) => (orgId ? { "X-Organization-Id": orgId } : {});

const createInvitation = async (orgId, payload) => {
  const response = await api(getHeaders(orgId)).post(
    `/invitations/organizations/${orgId}`,
    payload
  );
  return response.data;
};

const findPendingByOrg = async (orgId) => {
  const response = await api(getHeaders(orgId)).get(
    `/invitations/organizations/${orgId}`
  );
  return response.data;
};

const findPendingForMe = async () => {
  const response = await api().get("/invitations/me");
  return response.data;
};

const getInvitationPreview = async (token) => {
  const response = await api().get(`/invitations/preview/${token}`);
  return response.data;
};

const acceptInvitation = async (token) => {
  const response = await api().post(`/invitations/accept/${token}`);
  return response.data;
};

const declineInvitation = async (token) => {
  const response = await api().post(`/invitations/decline/${token}`);
  return response.data;
};

const cancelInvitation = async (orgId, invitationId) => {
  const response = await api(getHeaders(orgId)).delete(
    `/invitations/organizations/${orgId}/${invitationId}`
  );
  return response.data;
};

const resendInvitation = async (orgId, invitationId) => {
  const response = await api(getHeaders(orgId)).post(
    `/invitations/organizations/${orgId}/${invitationId}/resend`
  );
  return response.data;
};

const invitationsService = {
  createInvitation,
  findPendingByOrg,
  findPendingForMe,
  getInvitationPreview,
  acceptInvitation,
  declineInvitation,
  cancelInvitation,
  resendInvitation,
};

export default invitationsService;
