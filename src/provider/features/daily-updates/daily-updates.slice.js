import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import dailyUpdatesService from "./daily-updates.service";

const getValidOrgId = (state) => {
  const { organizations, currentOrganizationId } = state?.organizations || {};
  if (
    currentOrganizationId &&
    organizations?.some((o) => o.Id === currentOrganizationId)
  ) {
    return currentOrganizationId;
  }
  return undefined;
};

const generalState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
  data: null,
};

const initialState = {
  updates: [],
  currentUpdate: null,
  fetchDailyUpdates: generalState,
  fetchDailyUpdateById: generalState,
  createDailyUpdate: generalState,
  updateDailyUpdate: generalState,
  missingUpdateBacklog: generalState,
  blockerBacklog: generalState,
  offPlanBacklog: generalState,
};

export const fetchDailyUpdates = createAsyncThunk(
  "dailyUpdates/fetchDailyUpdates",
  async ({ params } = {}, thunkAPI) => {
    const orgId = getValidOrgId(thunkAPI.getState());
    try {
      const response = await dailyUpdatesService.fetchDailyUpdates(orgId, params);
      if (response?.success && response?.data) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const fetchDailyUpdateById = createAsyncThunk(
  "dailyUpdates/fetchDailyUpdateById",
  async ({ id }, thunkAPI) => {
    const orgId = getValidOrgId(thunkAPI.getState());
    try {
      const response = await dailyUpdatesService.fetchDailyUpdateById(id, orgId);
      if (response?.success && response?.data) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const createDailyUpdate = createAsyncThunk(
  "dailyUpdates/createDailyUpdate",
  async ({ payload, successCallBack }, thunkAPI) => {
    const orgId = getValidOrgId(thunkAPI.getState());
    try {
      const response = await dailyUpdatesService.createDailyUpdate(payload, orgId);
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

export const updateDailyUpdate = createAsyncThunk(
  "dailyUpdates/updateDailyUpdate",
  async ({ id, payload, successCallBack }, thunkAPI) => {
    const orgId = getValidOrgId(thunkAPI.getState());
    try {
      const response = await dailyUpdatesService.updateDailyUpdate(
        id,
        payload,
        orgId
      );
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

export const fetchMissingUpdateBacklog = createAsyncThunk(
  "dailyUpdates/fetchMissingUpdateBacklog",
  async ({ params } = {}, thunkAPI) => {
    const orgId = getValidOrgId(thunkAPI.getState());
    try {
      const response = await dailyUpdatesService.fetchMissingUpdateBacklog(
        orgId,
        params
      );
      if (response?.success && response?.data) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const fetchBlockerBacklog = createAsyncThunk(
  "dailyUpdates/fetchBlockerBacklog",
  async ({ params } = {}, thunkAPI) => {
    const orgId = getValidOrgId(thunkAPI.getState());
    try {
      const response = await dailyUpdatesService.fetchBlockerBacklog(orgId, params);
      if (response?.success && response?.data) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const fetchOffPlanBacklog = createAsyncThunk(
  "dailyUpdates/fetchOffPlanBacklog",
  async ({ params } = {}, thunkAPI) => {
    const orgId = getValidOrgId(thunkAPI.getState());
    try {
      const response = await dailyUpdatesService.fetchOffPlanBacklog(orgId, params);
      if (response?.success && response?.data) {
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

export const dailyUpdatesSlice = createSlice({
  name: "dailyUpdates",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDailyUpdates.pending, (state) =>
        setPending(state, "fetchDailyUpdates")
      )
      .addCase(fetchDailyUpdates.fulfilled, (state, action) => {
        setFulfilled(state, "fetchDailyUpdates", action.payload);
        state.updates = action.payload?.items || action.payload || [];
      })
      .addCase(fetchDailyUpdates.rejected, (state, action) =>
        setRejected(state, "fetchDailyUpdates", action.payload?.message)
      )
      .addCase(fetchDailyUpdateById.pending, (state) =>
        setPending(state, "fetchDailyUpdateById")
      )
      .addCase(fetchDailyUpdateById.fulfilled, (state, action) => {
        setFulfilled(state, "fetchDailyUpdateById", action.payload);
        state.currentUpdate = action.payload;
      })
      .addCase(fetchDailyUpdateById.rejected, (state, action) =>
        setRejected(state, "fetchDailyUpdateById", action.payload?.message)
      )
      .addCase(createDailyUpdate.pending, (state) =>
        setPending(state, "createDailyUpdate")
      )
      .addCase(createDailyUpdate.fulfilled, (state, action) => {
        setFulfilled(state, "createDailyUpdate", action.payload);
        state.updates = [action.payload, ...(state.updates || [])];
      })
      .addCase(createDailyUpdate.rejected, (state, action) =>
        setRejected(state, "createDailyUpdate", action.payload?.message)
      )
      .addCase(updateDailyUpdate.pending, (state) =>
        setPending(state, "updateDailyUpdate")
      )
      .addCase(updateDailyUpdate.fulfilled, (state, action) => {
        setFulfilled(state, "updateDailyUpdate", action.payload);
        state.updates = (state.updates || []).map((u) =>
          u.Id === action.payload?.Id ? { ...u, ...action.payload } : u
        );
        if (state.currentUpdate?.Id === action.payload?.Id) {
          state.currentUpdate = { ...state.currentUpdate, ...action.payload };
        }
      })
      .addCase(updateDailyUpdate.rejected, (state, action) =>
        setRejected(state, "updateDailyUpdate", action.payload?.message)
      )
      .addCase(fetchMissingUpdateBacklog.pending, (state) =>
        setPending(state, "missingUpdateBacklog")
      )
      .addCase(fetchMissingUpdateBacklog.fulfilled, (state, action) =>
        setFulfilled(state, "missingUpdateBacklog", action.payload)
      )
      .addCase(fetchMissingUpdateBacklog.rejected, (state, action) =>
        setRejected(state, "missingUpdateBacklog", action.payload?.message)
      )
      .addCase(fetchBlockerBacklog.pending, (state) =>
        setPending(state, "blockerBacklog")
      )
      .addCase(fetchBlockerBacklog.fulfilled, (state, action) =>
        setFulfilled(state, "blockerBacklog", action.payload)
      )
      .addCase(fetchBlockerBacklog.rejected, (state, action) =>
        setRejected(state, "blockerBacklog", action.payload?.message)
      )
      .addCase(fetchOffPlanBacklog.pending, (state) =>
        setPending(state, "offPlanBacklog")
      )
      .addCase(fetchOffPlanBacklog.fulfilled, (state, action) =>
        setFulfilled(state, "offPlanBacklog", action.payload)
      )
      .addCase(fetchOffPlanBacklog.rejected, (state, action) =>
        setRejected(state, "offPlanBacklog", action.payload?.message)
      );
  },
});

export default dailyUpdatesSlice.reducer;
