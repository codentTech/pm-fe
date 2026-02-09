import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import kpisService from "./kpis.service";

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
  kpis: [],
  fetchKpis: generalState,
  createKpi: generalState,
  updateKpi: generalState,
  deleteKpi: generalState,
};

export const fetchKpis = createAsyncThunk(
  "kpis/fetchKpis",
  async (_, thunkAPI) => {
    const orgId = getValidOrgId(thunkAPI.getState());
    try {
      const response = await kpisService.fetchKpis(orgId);
      if (response?.success && response?.data) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const createKpi = createAsyncThunk(
  "kpis/createKpi",
  async ({ payload, successCallBack }, thunkAPI) => {
    const orgId = getValidOrgId(thunkAPI.getState());
    try {
      const response = await kpisService.createKpi(payload, orgId);
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

export const updateKpi = createAsyncThunk(
  "kpis/updateKpi",
  async ({ id, payload, successCallBack }, thunkAPI) => {
    const orgId = getValidOrgId(thunkAPI.getState());
    try {
      const response = await kpisService.updateKpi(id, payload, orgId);
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

export const deleteKpi = createAsyncThunk(
  "kpis/deleteKpi",
  async ({ id, successCallBack }, thunkAPI) => {
    const orgId = getValidOrgId(thunkAPI.getState());
    try {
      const response = await kpisService.deleteKpi(id, orgId);
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

export const kpisSlice = createSlice({
  name: "kpis",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchKpis.pending, (state) => setPending(state, "fetchKpis"))
      .addCase(fetchKpis.fulfilled, (state, action) => {
        setFulfilled(state, "fetchKpis", action.payload);
        state.kpis = action.payload?.items ?? action.payload ?? [];
      })
      .addCase(fetchKpis.rejected, (state, action) =>
        setRejected(state, "fetchKpis", action.payload?.message)
      )
      .addCase(createKpi.pending, (state) => setPending(state, "createKpi"))
      .addCase(createKpi.fulfilled, (state, action) => {
        setFulfilled(state, "createKpi", action.payload);
        state.kpis = [action.payload, ...(state.kpis || [])];
      })
      .addCase(createKpi.rejected, (state, action) =>
        setRejected(state, "createKpi", action.payload?.message)
      )
      .addCase(updateKpi.pending, (state) => setPending(state, "updateKpi"))
      .addCase(updateKpi.fulfilled, (state, action) => {
        setFulfilled(state, "updateKpi", action.payload);
        state.kpis = (state.kpis || []).map((k) =>
          k.Id === action.payload?.Id ? { ...k, ...action.payload } : k
        );
      })
      .addCase(updateKpi.rejected, (state, action) =>
        setRejected(state, "updateKpi", action.payload?.message)
      )
      .addCase(deleteKpi.pending, (state) => setPending(state, "deleteKpi"))
      .addCase(deleteKpi.fulfilled, (state, action) => {
        setFulfilled(state, "deleteKpi", null);
        state.kpis = (state.kpis || []).filter((k) => k.Id !== action.payload);
      })
      .addCase(deleteKpi.rejected, (state, action) =>
        setRejected(state, "deleteKpi", action.payload?.message)
      );
  },
});

export default kpisSlice.reducer;
