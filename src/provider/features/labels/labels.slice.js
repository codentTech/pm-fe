import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import labelsService from "./labels.service";

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
  labels: [],
  fetchLabels: generalState,
  createLabel: generalState,
  updateLabel: generalState,
  deleteLabel: generalState,
};

export const fetchLabels = createAsyncThunk(
  "labels/fetchLabels",
  async (_, thunkAPI) => {
    const orgId = getValidOrgId(thunkAPI.getState());
    try {
      const response = await labelsService.fetchLabels(orgId);
      if (response?.success && response?.data) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const createLabel = createAsyncThunk(
  "labels/createLabel",
  async ({ orgId: orgIdOverride, payload, successCallBack }, thunkAPI) => {
    const orgId = orgIdOverride ?? getValidOrgId(thunkAPI.getState());
    try {
      const response = await labelsService.createLabel(payload, orgId);
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

export const updateLabel = createAsyncThunk(
  "labels/updateLabel",
  async ({ id, payload, successCallBack }, thunkAPI) => {
    const orgId = getValidOrgId(thunkAPI.getState());
    try {
      const response = await labelsService.updateLabel(id, payload, orgId);
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

export const deleteLabel = createAsyncThunk(
  "labels/deleteLabel",
  async ({ orgId: orgIdOverride, id, successCallBack }, thunkAPI) => {
    const orgId = orgIdOverride ?? getValidOrgId(thunkAPI.getState());
    try {
      const response = await labelsService.deleteLabel(id, orgId);
      if (response?.success) {
        successCallBack?.();
        return id;
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

export const labelsSlice = createSlice({
  name: "labels",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLabels.pending, (state) => setPending(state, "fetchLabels"))
      .addCase(fetchLabels.fulfilled, (state, action) => {
        setFulfilled(state, "fetchLabels", action.payload);
        state.labels = action.payload || [];
      })
      .addCase(fetchLabels.rejected, (state, action) =>
        setRejected(state, "fetchLabels", action.payload?.message)
      )
      .addCase(createLabel.pending, (state) => setPending(state, "createLabel"))
      .addCase(createLabel.fulfilled, (state, action) => {
        setFulfilled(state, "createLabel", action.payload);
        state.labels = [...(state.labels || []), action.payload].filter(Boolean);
      })
      .addCase(createLabel.rejected, (state, action) =>
        setRejected(state, "createLabel", action.payload?.message)
      )
      .addCase(updateLabel.pending, (state) => setPending(state, "updateLabel"))
      .addCase(updateLabel.fulfilled, (state, action) => {
        setFulfilled(state, "updateLabel", action.payload);
        state.labels = (state.labels || []).map((l) =>
          l.Id === action.payload?.Id ? { ...l, ...action.payload } : l
        );
      })
      .addCase(updateLabel.rejected, (state, action) =>
        setRejected(state, "updateLabel", action.payload?.message)
      )
      .addCase(deleteLabel.pending, (state) => setPending(state, "deleteLabel"))
      .addCase(deleteLabel.fulfilled, (state, action) => {
        setFulfilled(state, "deleteLabel", null);
        state.labels = (state.labels || []).filter((l) => l.Id !== action.payload);
      })
      .addCase(deleteLabel.rejected, (state, action) =>
        setRejected(state, "deleteLabel", action.payload?.message)
      );
  },
});

export default labelsSlice.reducer;
