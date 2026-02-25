import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getUser, removeUser } from "@/common/utils/users.util";
import { clearOrganizations } from "@/provider/features/organizations/organizations.slice";
import { clearPendingForMe } from "@/provider/features/invitations/invitations.slice";
import authService from "./auth.service";

const generalState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
  data: null,
};

// Get user from localStorage
const user = getUser();
const initialState = {
  isCreatorMode: null,
  sidebarToggleItem: false,
  logoutLoader: false,
  login: generalState,
  signUp: generalState,
  logout: generalState,
  forgotPassword: generalState,
  resetPassword: generalState,
  loginAndSignUpWithOAuth: generalState,
  loginAndSignUpWithLinkedin: generalState,
};

// Login user
export const login = createAsyncThunk(
  "auth/login",
  async ({ payload, successCallBack, callBackMessage }, thunkAPI) => {
    try {
      const response = await authService.login(payload);
      if (response.success) {
        successCallBack(response.data);
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  },
);
// signUp user
export const signUp = createAsyncThunk(
  "auth/register",
  async ({ payload, successCallBack, callBackMessage }, thunkAPI) => {
    try {
      const response = await authService.signUp(payload);
      if (response.success ?? response.Succeeded) {
        successCallBack(response.data);
        return response.data;
      }

      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  },
);

export const loginAndSignUpWithOAuth = createAsyncThunk(
  "auth/loginAndSignUpWithOAuth",
  async ({ loginType, email, accessToken, successCallBack }, thunkAPI) => {
    try {
      const response = await authService.loginAndSignUpWithOAuth({
        loginType,
        email,
        accessToken,
      });

      if (response.success ?? response.Succeeded) {
        successCallBack(response.data);
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  },
);

export const loginAndSignUpWithLinkedin = createAsyncThunk(
  "auth/loginAndSignUpWithLinkedin",
  async ({ payload, successCallBack }, thunkAPI) => {
    try {
      const response = await authService.loginAndSignUpWithLinkedin(payload);
      if (response.success ?? response.Succeeded) {
        successCallBack(response.data);
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  },
);

export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async ({ token, successCallBack, errorCallBack }, thunkAPI) => {
    try {
      const response = await authService.verifyEmail(token);
      if (response?.success ?? response?.Succeeded) {
        successCallBack?.();
        return response;
      }
      errorCallBack?.();
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      errorCallBack?.();
      return thunkAPI.rejectWithValue({ payload: error });
    }
  },
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async ({ email, successCallBack }, thunkAPI) => {
    try {
      const response = await authService.forgotPassword(email);
      if (response?.success ?? response?.Succeeded) {
        successCallBack?.();
        return response;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  },
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, newPassword, successCallBack }, thunkAPI) => {
    try {
      const response = await authService.resetPassword(token, newPassword);
      if (response?.success ?? response?.Succeeded) {
        successCallBack?.();
        return response;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  },
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (payload, thunkAPI) => {
    try {
      const response = await authService.logout();
      removeUser();
      thunkAPI.dispatch(clearOrganizations());
      thunkAPI.dispatch(clearPendingForMe());
      if (response.success ?? response.Succeeded) {
        return response;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      removeUser();
      thunkAPI.dispatch(clearOrganizations());
      thunkAPI.dispatch(clearPendingForMe());
      return thunkAPI.rejectWithValue({ payload: error });
    }
  },
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIsCreatorModeMode: (state, action) => {
      state.isCreatorMode = action.payload;
    },
    setSidebarToggleItem: (state, action) => {
      state.sidebarToggleItem = action.payload;
    },
    setLogoutLoader: (state, action) => {
      state.logoutLoader = action.payload;
    },
    reset: (state) => {
      state.login = generalState;
      state.logout = generalState;
      state.register = generalState;
      state.loginAndSignUpWithOAuth = generalState;
      state.loginAndSignUpWithLinkedin = generalState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.login.isLoading = true;
        state.login.message = "";
        state.login.isError = false;
        state.login.isSuccess = false;
        state.login.data = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.login.isLoading = false;
        state.login.isSuccess = true;
        state.login.data = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        const err = action.payload?.payload || action.payload;
        state.login.message =
          err?.response?.data?.message || err?.message || "Login failed";
        state.login.isLoading = false;
        state.login.isError = true;
        state.login.data = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.signUp.isLoading = false;
        state.signUp.isSuccess = true;
        state.signUp.data = action.payload;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.signUp.message = action.payload.message;
        state.signUp.isLoading = false;
        state.signUp.isError = true;
        state.signUp.data = null;
      })
      .addCase(signUp.pending, (state) => {
        state.signUp.isLoading = true;
        state.signUp.message = "";
        state.signUp.isError = false;
        state.signUp.isSuccess = false;
        state.signUp.data = null;
      })
      .addCase(logout.pending, (state) => {
        state.logout.isLoading = true;
        state.logout.message = "";
        state.logout.isError = false;
        state.logout.isSuccess = false;
        state.logout.data = null;
      })
      .addCase(logout.fulfilled, (state, action) => {
        state.logout.isLoading = false;
        state.logout.isSuccess = true;
        state.logout.data = action.payload;
      })
      .addCase(logout.rejected, (state, action) => {
        state.logout.message = action.payload.message;
        state.logout.isLoading = false;
        state.logout.isError = true;
        state.logout.data = null;
      })
      .addCase(loginAndSignUpWithOAuth.pending, (state) => {
        state.loginAndSignUpWithOAuth.isLoading = true;
        state.loginAndSignUpWithOAuth.message = "";
        state.loginAndSignUpWithOAuth.isError = false;
        state.loginAndSignUpWithOAuth.isSuccess = false;
        state.loginAndSignUpWithOAuth.data = null;
      })
      .addCase(loginAndSignUpWithOAuth.fulfilled, (state, action) => {
        state.loginAndSignUpWithOAuth.isLoading = false;
        state.loginAndSignUpWithOAuth.isSuccess = true;
        state.loginAndSignUpWithOAuth.data = action.payload;
      })
      .addCase(loginAndSignUpWithOAuth.rejected, (state, action) => {
        state.loginAndSignUpWithOAuth.message = action.payload.message;
        state.loginAndSignUpWithOAuth.isLoading = false;
        state.loginAndSignUpWithOAuth.isError = true;
        state.loginAndSignUpWithOAuth.data = null;
      })
      .addCase(loginAndSignUpWithLinkedin.pending, (state) => {
        state.loginAndSignUpWithLinkedin.isLoading = true;
        state.loginAndSignUpWithLinkedin.message = "";
        state.loginAndSignUpWithLinkedin.isError = false;
        state.loginAndSignUpWithLinkedin.isSuccess = false;
        state.loginAndSignUpWithLinkedin.data = null;
      })
      .addCase(loginAndSignUpWithLinkedin.fulfilled, (state, action) => {
        state.loginAndSignUpWithLinkedin.isLoading = false;
        state.loginAndSignUpWithLinkedin.isSuccess = true;
        state.loginAndSignUpWithLinkedin.data = action.payload;
      })
      .addCase(loginAndSignUpWithLinkedin.rejected, (state, action) => {
        state.loginAndSignUpWithLinkedin.message = action.payload.message;
        state.loginAndSignUpWithLinkedin.isLoading = false;
        state.loginAndSignUpWithLinkedin.isError = true;
        state.loginAndSignUpWithLinkedin.data = null;
      })
      .addCase(forgotPassword.pending, (state) => {
        state.forgotPassword = { ...generalState, isLoading: true };
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.forgotPassword.isLoading = false;
        state.forgotPassword.isSuccess = true;
        state.forgotPassword.data = action.payload;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        const err = action.payload?.payload || action.payload;
        state.forgotPassword.message =
          err?.response?.data?.message || err?.message || "Request failed";
        state.forgotPassword.isLoading = false;
        state.forgotPassword.isError = true;
      })
      .addCase(resetPassword.pending, (state) => {
        state.resetPassword = { ...generalState, isLoading: true };
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.resetPassword.isLoading = false;
        state.resetPassword.isSuccess = true;
        state.resetPassword.data = action.payload;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        const err = action.payload?.payload || action.payload;
        state.resetPassword.message =
          err?.response?.data?.message || err?.message || "Reset failed";
        state.resetPassword.isLoading = false;
        state.resetPassword.isError = true;
      });
  },
});

export const {
  reset,
  setIsCreatorModeMode,
  setSidebarToggleItem,
  setLogoutLoader,
} = authSlice.actions;

export default authSlice.reducer;
