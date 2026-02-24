import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import organizationsService from "./organizations.service";

const generalState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
  data: null,
};

const initialState = {
  organizations: [],
  currentOrganizationId: null,
  fetchOrganizations: generalState,
  fetchOrEnsureDefault: generalState,
  createOrganization: generalState,
  createOrganizationWithOwner: generalState,
  updateOrganization: generalState,
  deleteOrganization: generalState,
  fetchMembers: generalState,
  updateMemberRole: generalState,
  removeMember: generalState,
  /** Super Admin: all organizations list */
  listAllOrganizations: generalState,
  /** Single org fetch (e.g. for super admin edit) */
  fetchOrganization: generalState,
};

export const fetchOrganizations = createAsyncThunk(
  "organizations/fetchOrganizations",
  async ({ successCallBack } = {}, thunkAPI) => {
    try {
      const response = await organizationsService.fetchOrganizations();
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

export const fetchOrEnsureDefault = createAsyncThunk(
  "organizations/fetchOrEnsureDefault",
  async (_, thunkAPI) => {
    try {
      const response = await organizationsService.getOrEnsureDefault();
      if (response?.success && response?.data) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const createOrganization = createAsyncThunk(
  "organizations/createOrganization",
  async ({ payload, successCallBack }, thunkAPI) => {
    try {
      const response = await organizationsService.createOrganization(payload);
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

/** Super Admin: create workspace with designated org admin by email */
export const createOrganizationWithOwner = createAsyncThunk(
  "organizations/createOrganizationWithOwner",
  async ({ payload, successCallBack }, thunkAPI) => {
    const response = await organizationsService.createWithOwner(payload);
    if (response?.success && response?.data) {
      successCallBack?.(response.data);
      return response.data;
    }
    return thunkAPI.rejectWithValue(response);
  }
);

export const updateOrganization = createAsyncThunk(
  "organizations/updateOrganization",
  async ({ orgId, payload, successCallBack }, thunkAPI) => {
    try {
      const response = await organizationsService.updateOrganization(orgId, payload);
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

export const deleteOrganization = createAsyncThunk(
  "organizations/deleteOrganization",
  async ({ orgId, successCallBack }, thunkAPI) => {
    try {
      const response = await organizationsService.deleteOrganization(orgId);
      if (response?.success) {
        successCallBack?.();
        return orgId;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const fetchMembers = createAsyncThunk(
  "organizations/fetchMembers",
  async ({ orgId, successCallBack, errorCallBack, completeCallBack }, thunkAPI) => {
    try {
      const response = await organizationsService.getMembers(orgId);
      if (response?.success && response?.data) {
        successCallBack?.(response.data);
        return response.data;
      }
      errorCallBack?.();
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      errorCallBack?.();
      return thunkAPI.rejectWithValue({ payload: error });
    } finally {
      completeCallBack?.();
    }
  }
);

export const updateMemberRole = createAsyncThunk(
  "organizations/updateMemberRole",
  async ({ orgId, memberId, payload, successCallBack }, thunkAPI) => {
    try {
      const response = await organizationsService.updateMemberRole(orgId, memberId, payload);
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

export const removeMember = createAsyncThunk(
  "organizations/removeMember",
  async ({ orgId, memberId, successCallBack }, thunkAPI) => {
    try {
      const response = await organizationsService.removeMember(orgId, memberId);
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

/** Super Admin only: fetch all organizations */
export const fetchListAllOrganizations = createAsyncThunk(
  "organizations/fetchListAllOrganizations",
  async (_, thunkAPI) => {
    try {
      const response = await organizationsService.listAllForSuperAdmin();
      if (response?.success && response?.data) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

/** Fetch single organization by id (Super Admin can fetch any) */
export const fetchOrganization = createAsyncThunk(
  "organizations/fetchOrganization",
  async (orgId, thunkAPI) => {
    const response = await organizationsService.getOrganization(orgId);
    if (response?.success && response?.data) {
      return response.data;
    }
    return thunkAPI.rejectWithValue(response);
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

export const organizationsSlice = createSlice({
  name: "organizations",
  initialState,
  reducers: {
    setCurrentOrganization: (state, action) => {
      state.currentOrganizationId = action.payload;
    },
    clearOrganizations: (state) => {
      state.organizations = [];
      state.currentOrganizationId = null;
    },
    clearFetchOrganization: (state) => {
      state.fetchOrganization = { ...generalState };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrganizations.pending, (state) => setPending(state, "fetchOrganizations"))
      .addCase(fetchOrganizations.fulfilled, (state, action) => {
        setFulfilled(state, "fetchOrganizations", action.payload);
        state.organizations = action.payload || [];
        if (!state.currentOrganizationId && action.payload?.length > 0) {
          state.currentOrganizationId = action.payload[0].Id;
        }
      })
      .addCase(fetchOrganizations.rejected, (state, action) =>
        setRejected(state, "fetchOrganizations", action.payload?.message)
      )
      .addCase(fetchOrEnsureDefault.pending, (state) => setPending(state, "fetchOrEnsureDefault"))
      .addCase(fetchOrEnsureDefault.fulfilled, (state, action) => {
        setFulfilled(state, "fetchOrEnsureDefault", action.payload);
        if (action.payload) {
          state.currentOrganizationId = action.payload.Id;
          const exists = state.organizations?.some((o) => o.Id === action.payload.Id);
          if (!exists) {
            state.organizations = [action.payload, ...(state.organizations || [])];
          }
        }
      })
      .addCase(fetchOrEnsureDefault.rejected, (state, action) =>
        setRejected(state, "fetchOrEnsureDefault", action.payload?.message)
      )
      .addCase(createOrganization.pending, (state) => setPending(state, "createOrganization"))
      .addCase(createOrganization.fulfilled, (state, action) => {
        setFulfilled(state, "createOrganization", action.payload);
        state.organizations = [action.payload, ...(state.organizations || [])];
        state.currentOrganizationId = action.payload?.Id;
      })
      .addCase(createOrganization.rejected, (state, action) =>
        setRejected(state, "createOrganization", action.payload?.message)
      )
      .addCase(createOrganizationWithOwner.pending, (state) =>
        setPending(state, "createOrganizationWithOwner")
      )
      .addCase(createOrganizationWithOwner.fulfilled, (state, action) =>
        setFulfilled(state, "createOrganizationWithOwner", action.payload)
      )
      .addCase(createOrganizationWithOwner.rejected, (state, action) =>
        setRejected(state, "createOrganizationWithOwner", action.payload?.message)
      )
      .addCase(updateOrganization.pending, (state) => setPending(state, "updateOrganization"))
      .addCase(updateOrganization.fulfilled, (state, action) => {
        setFulfilled(state, "updateOrganization", action.payload);
        if (action.payload?.Id) {
          const idx = (state.organizations || []).findIndex((o) => o.Id === action.payload.Id);
          if (idx >= 0) state.organizations[idx] = action.payload;
        }
      })
      .addCase(updateOrganization.rejected, (state, action) =>
        setRejected(state, "updateOrganization", action.payload?.message)
      )
      .addCase(deleteOrganization.pending, (state) => setPending(state, "deleteOrganization"))
      .addCase(deleteOrganization.fulfilled, (state, action) => {
        setFulfilled(state, "deleteOrganization", action.payload);
        state.organizations = (state.organizations || []).filter((o) => o.Id !== action.payload);
        if (state.currentOrganizationId === action.payload) {
          state.currentOrganizationId =
            state.organizations?.length > 0 ? state.organizations[0].Id : null;
        }
      })
      .addCase(deleteOrganization.rejected, (state, action) =>
        setRejected(state, "deleteOrganization", action.payload?.message)
      )
      .addCase(fetchMembers.pending, (state) => setPending(state, "fetchMembers"))
      .addCase(fetchMembers.fulfilled, (state, action) =>
        setFulfilled(state, "fetchMembers", action.payload)
      )
      .addCase(fetchMembers.rejected, (state, action) =>
        setRejected(state, "fetchMembers", action.payload?.message)
      )
      .addCase(updateMemberRole.pending, (state) => setPending(state, "updateMemberRole"))
      .addCase(updateMemberRole.fulfilled, (state, action) =>
        setFulfilled(state, "updateMemberRole", action.payload)
      )
      .addCase(updateMemberRole.rejected, (state, action) =>
        setRejected(state, "updateMemberRole", action.payload?.message)
      )
      .addCase(removeMember.pending, (state) => setPending(state, "removeMember"))
      .addCase(removeMember.fulfilled, (state, action) =>
        setFulfilled(state, "removeMember", action.payload)
      )
      .addCase(removeMember.rejected, (state, action) =>
        setRejected(state, "removeMember", action.payload?.message)
      )
      .addCase(fetchListAllOrganizations.pending, (state) =>
        setPending(state, "listAllOrganizations")
      )
      .addCase(fetchListAllOrganizations.fulfilled, (state, action) =>
        setFulfilled(state, "listAllOrganizations", action.payload)
      )
      .addCase(fetchListAllOrganizations.rejected, (state, action) =>
        setRejected(state, "listAllOrganizations", action.payload?.message)
      )
      .addCase(fetchOrganization.pending, (state) =>
        setPending(state, "fetchOrganization")
      )
      .addCase(fetchOrganization.fulfilled, (state, action) =>
        setFulfilled(state, "fetchOrganization", action.payload)
      )
      .addCase(fetchOrganization.rejected, (state, action) =>
        setRejected(state, "fetchOrganization", action.payload?.message)
      );
  },
});

export const {
  setCurrentOrganization,
  clearOrganizations,
  clearFetchOrganization,
} = organizationsSlice.actions;
export default organizationsSlice.reducer;
