import api from "@/common/utils/api";

const getMe = async () => {
  const response = await api().get("/user/me");
  return response.data;
};

const updateProfile = async (payload) => {
  const response = await api().put("/user/me", payload);
  return response.data;
};

const changePassword = async (payload) => {
  const response = await api().put("/user/me/password", payload);
  return response.data;
};

const usersService = {
  getMe,
  updateProfile,
  changePassword,
};

export default usersService;
