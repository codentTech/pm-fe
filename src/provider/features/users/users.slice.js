import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import usersService from "./users.service";

const generalState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
  data: null,
};

const initialState = {
  profile: null,
  fetchMe: generalState,
  updateProfile: generalState,
  changePassword: generalState,
};

export const fetchMe = createAsyncThunk(
  "users/fetchMe",
  async (_, thunkAPI) => {
    try {
      const response = await usersService.getMe();
      if (response?.success && response?.data) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const updateProfile = createAsyncThunk(
  "users/updateProfile",
  async ({ payload, successCallBack, errorCallBack }, thunkAPI) => {
    try {
      const response = await usersService.updateProfile(payload);
      if (response?.success && response?.data) {
        successCallBack?.(response.data);
        return response.data;
      }
      errorCallBack?.(response?.message || "Failed to update profile");
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      errorCallBack?.(error?.response?.data?.message || "Failed to update profile");
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const changePassword = createAsyncThunk(
  "users/changePassword",
  async ({ payload, successCallBack, errorCallBack }, thunkAPI) => {
    try {
      const response = await usersService.changePassword(payload);
      if (response?.success) {
        successCallBack?.();
        return true;
      }
      errorCallBack?.(response?.message || "Failed to change password");
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      errorCallBack?.(error?.response?.data?.message || "Failed to change password");
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

const setPending = (state, key) => {
  if (!state[key]) state[key] = { ...generalState };
  state[key].isLoading = true;
  state[key].message = "";
  state[key].isError = false;
  state[key].isSuccess = false;
  state[key].data = null;
};

const setFulfilled = (state, key, data) => {
  if (!state[key]) state[key] = { ...generalState };
  state[key].isLoading = false;
  state[key].isSuccess = true;
  state[key].data = data;
};

const setRejected = (state, key, message) => {
  if (!state[key]) state[key] = { ...generalState };
  state[key].isLoading = false;
  state[key].isError = true;
  state[key].message = message || "Something went wrong";
  state[key].data = null;
};

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMe.pending, (state) => setPending(state, "fetchMe"))
      .addCase(fetchMe.fulfilled, (state, action) => {
        setFulfilled(state, "fetchMe", action.payload);
        state.profile = action.payload;
      })
      .addCase(fetchMe.rejected, (state, action) =>
        setRejected(state, "fetchMe", action.payload?.message)
      )
      .addCase(updateProfile.pending, (state) => setPending(state, "updateProfile"))
      .addCase(updateProfile.fulfilled, (state, action) => {
        setFulfilled(state, "updateProfile", action.payload);
        state.profile = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) =>
        setRejected(state, "updateProfile", action.payload?.message)
      )
      .addCase(changePassword.pending, (state) => setPending(state, "changePassword"))
      .addCase(changePassword.fulfilled, (state) => {
        setFulfilled(state, "changePassword", true);
      })
      .addCase(changePassword.rejected, (state, action) =>
        setRejected(state, "changePassword", action.payload?.message)
      );
  },
});

export default usersSlice.reducer;
