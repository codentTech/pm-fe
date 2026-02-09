import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import invitationsService from "./invitations.service";

const generalState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
  data: null,
};

const initialState = {
  pendingForMe: [],
  pendingByOrg: [],
  fetchPendingForMe: generalState,
  fetchPendingByOrg: generalState,
  create: generalState,
  accept: generalState,
  decline: generalState,
  cancel: generalState,
  resend: generalState,
};

export const fetchPendingForMe = createAsyncThunk(
  "invitations/fetchPendingForMe",
  async (_, thunkAPI) => {
    try {
      const response = await invitationsService.findPendingForMe();
      if (response?.success && response?.data) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const fetchPendingByOrg = createAsyncThunk(
  "invitations/fetchPendingByOrg",
  async (orgId, thunkAPI) => {
    try {
      const response = await invitationsService.findPendingByOrg(orgId);
      if (response?.success && response?.data) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const acceptInvitation = createAsyncThunk(
  "invitations/acceptInvitation",
  async ({ token, successCallBack }, thunkAPI) => {
    try {
      const response = await invitationsService.acceptInvitation(token);
      if (response?.success) {
        successCallBack?.();
        return token;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const declineInvitation = createAsyncThunk(
  "invitations/declineInvitation",
  async ({ token, successCallBack }, thunkAPI) => {
    try {
      const response = await invitationsService.declineInvitation(token);
      if (response?.success) {
        successCallBack?.();
        return token;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const cancelInvitation = createAsyncThunk(
  "invitations/cancelInvitation",
  async ({ orgId, invitationId, successCallBack }, thunkAPI) => {
    try {
      const response = await invitationsService.cancelInvitation(orgId, invitationId);
      if (response?.success) {
        successCallBack?.();
        return invitationId;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const resendInvitation = createAsyncThunk(
  "invitations/resendInvitation",
  async ({ orgId, invitationId, successCallBack }, thunkAPI) => {
    try {
      const response = await invitationsService.resendInvitation(orgId, invitationId);
      if (response?.success) {
        successCallBack?.();
        return { orgId, invitation: response?.data };
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const createInvitation = createAsyncThunk(
  "invitations/createInvitation",
  async ({ orgId, payload, successCallBack }, thunkAPI) => {
    try {
      const response = await invitationsService.createInvitation(orgId, payload);
      if (response?.success && response?.data) {
        successCallBack?.(response.data);
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
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

export const invitationsSlice = createSlice({
  name: "invitations",
  initialState,
  reducers: {
    clearPendingForMe: (state) => {
      state.pendingForMe = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPendingForMe.pending, (state) => setPending(state, "fetchPendingForMe"))
      .addCase(fetchPendingForMe.fulfilled, (state, action) => {
        setFulfilled(state, "fetchPendingForMe", action.payload);
        state.pendingForMe = action.payload || [];
      })
      .addCase(fetchPendingForMe.rejected, (state, action) =>
        setRejected(state, "fetchPendingForMe", action.payload?.message)
      )
      .addCase(fetchPendingByOrg.pending, (state) => setPending(state, "fetchPendingByOrg"))
      .addCase(fetchPendingByOrg.fulfilled, (state, action) => {
        setFulfilled(state, "fetchPendingByOrg", action.payload);
        state.pendingByOrg = action.payload || [];
      })
      .addCase(fetchPendingByOrg.rejected, (state, action) =>
        setRejected(state, "fetchPendingByOrg", action.payload?.message)
      )
      .addCase(createInvitation.pending, (state) => setPending(state, "create"))
      .addCase(createInvitation.fulfilled, (state, action) => {
        setFulfilled(state, "create", action.payload);
        if (action.payload) {
          state.pendingByOrg = [...(state.pendingByOrg || []), action.payload];
        }
      })
      .addCase(createInvitation.rejected, (state, action) =>
        setRejected(state, "create", action.payload?.message)
      )
      .addCase(acceptInvitation.fulfilled, (state, action) => {
        setFulfilled(state, "accept", action.payload);
        state.pendingForMe = (state.pendingForMe || []).filter(
          (i) => i.Token !== action.payload
        );
      })
      .addCase(acceptInvitation.pending, (state) => setPending(state, "accept"))
      .addCase(acceptInvitation.rejected, (state, action) =>
        setRejected(state, "accept", action.payload?.message)
      )
      .addCase(declineInvitation.fulfilled, (state, action) => {
        setFulfilled(state, "decline", action.payload);
        state.pendingForMe = (state.pendingForMe || []).filter(
          (i) => i.Token !== action.payload
        );
      })
      .addCase(declineInvitation.pending, (state) => setPending(state, "decline"))
      .addCase(declineInvitation.rejected, (state, action) =>
        setRejected(state, "decline", action.payload?.message)
      )
      .addCase(cancelInvitation.fulfilled, (state, action) => {
        setFulfilled(state, "cancel", action.payload);
        state.pendingByOrg = (state.pendingByOrg || []).filter(
          (i) => i.Id !== action.payload
        );
      })
      .addCase(cancelInvitation.pending, (state) => setPending(state, "cancel"))
      .addCase(cancelInvitation.rejected, (state, action) =>
        setRejected(state, "cancel", action.payload?.message)
      )
      .addCase(resendInvitation.pending, (state) => setPending(state, "resend"))
      .addCase(resendInvitation.fulfilled, (state, action) => {
        setFulfilled(state, "resend", action.payload);
      })
      .addCase(resendInvitation.rejected, (state, action) =>
        setRejected(state, "resend", action.payload?.message)
      );
  },
});

export const { clearPendingForMe } = invitationsSlice.actions;
export default invitationsSlice.reducer;
