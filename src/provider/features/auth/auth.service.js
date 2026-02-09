import api from '@/common/utils/api';
import { removeUser } from '@/common/utils/users.util';

// Login user
const login = async (userData) => {
  const response = await api().post('/auth/login', userData);
  const ok = response.data?.success ?? response.data?.Succeeded;
  if (ok && response.data?.data) {
    localStorage.setItem('user', JSON.stringify(response.data.data));
    localStorage.setItem('isOtpVerify', false);
  }
  return response.data;
};

// Logout user (JWT: clear local state only; no backend call required)
const logout = async () => {
  removeUser();
  return { success: true };
};

const signUp = async (userData) => {
  const response = await api().post('/auth/register', userData);
  return response.data;
};

const verifyEmail = async (token) => {
  const response = await api().post('/auth/verify-email', { Token: token });
  return response.data;
};

const forgotPassword = async (email) => {
  const response = await api().post('/auth/forgot-password', { Email: email });
  return response.data;
};

const resetPassword = async (token, newPassword) => {
  const response = await api().post('/auth/reset-password', {
    Token: token,
    NewPassword: newPassword,
  });
  return response.data;
};

const loginAndSignUpWithOAuth = async ({ loginType, email, accessToken }) => {
  const response = await api().post('/auth/login-and-sign-up-with-oauth', {
    loginType,
    email,
    accessToken
  });
  if ((response.data?.success ?? response.data?.Succeeded) && response.data?.data) {
    localStorage.setItem('user', JSON.stringify(response.data.data));
    localStorage.setItem('isOtpVerify', false);
  }
  return response.data;
};

const loginAndSignUpWithLinkedin = async (payload) => {
  const response = await api().post('/auth/login-and-sign-up-with-linkedin', payload);
  if ((response.data?.success ?? response.data?.Succeeded) && response.data?.data) {
    localStorage.setItem('user', JSON.stringify(response.data.data));
    localStorage.setItem('isOtpVerify', false);
  }
  return response.data;
};

const authService = {
  logout,
  login,
  signUp,
  verifyEmail,
  forgotPassword,
  resetPassword,
  loginAndSignUpWithOAuth,
  loginAndSignUpWithLinkedin,
};

export default authService;
