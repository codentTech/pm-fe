import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import bidsService from "./bids.service";

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
  bids: [],
  fetchBids: generalState,
  fetchBidById: generalState,
  fetchDraftBacklog: generalState,
  fetchFollowUpBacklog: generalState,
  fetchInterviewBacklog: generalState,
  fetchReviewBacklog: generalState,
  fetchGhostedSuggestions: generalState,
  fetchBidMetrics: generalState,
  createBid: generalState,
  updateBid: generalState,
  transitionBidStatus: generalState,
  deleteBid: generalState,
  bulkDeleteBids: generalState,
};

export const fetchBids = createAsyncThunk(
  "bids/fetchBids",
  async ({ params } = {}, thunkAPI) => {
    const orgId = getValidOrgId(thunkAPI.getState());
    try {
      const response = await bidsService.fetchBids(orgId, params);
      if (response?.success && response?.data) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const fetchBidById = createAsyncThunk(
  "bids/fetchBidById",
  async ({ id }, thunkAPI) => {
    const orgId = getValidOrgId(thunkAPI.getState());
    try {
      const response = await bidsService.fetchBidById(id, orgId);
      if (response?.success && response?.data) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const fetchDraftBacklog = createAsyncThunk(
  "bids/fetchDraftBacklog",
  async (_, thunkAPI) => {
    const orgId = getValidOrgId(thunkAPI.getState());
    try {
      const response = await bidsService.fetchDraftBacklog(orgId);
      if (response?.success && response?.data) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const fetchFollowUpBacklog = createAsyncThunk(
  "bids/fetchFollowUpBacklog",
  async (_, thunkAPI) => {
    const orgId = getValidOrgId(thunkAPI.getState());
    try {
      const response = await bidsService.fetchFollowUpBacklog(orgId);
      if (response?.success && response?.data) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const fetchInterviewBacklog = createAsyncThunk(
  "bids/fetchInterviewBacklog",
  async (_, thunkAPI) => {
    const orgId = getValidOrgId(thunkAPI.getState());
    try {
      const response = await bidsService.fetchInterviewBacklog(orgId);
      if (response?.success && response?.data) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const fetchReviewBacklog = createAsyncThunk(
  "bids/fetchReviewBacklog",
  async (_, thunkAPI) => {
    const orgId = getValidOrgId(thunkAPI.getState());
    try {
      const response = await bidsService.fetchReviewBacklog(orgId);
      if (response?.success && response?.data) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const fetchGhostedSuggestions = createAsyncThunk(
  "bids/fetchGhostedSuggestions",
  async (_, thunkAPI) => {
    const orgId = getValidOrgId(thunkAPI.getState());
    try {
      const response = await bidsService.fetchGhostedSuggestions(orgId);
      if (response?.success && response?.data) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const fetchBidMetrics = createAsyncThunk(
  "bids/fetchBidMetrics",
  async (_, thunkAPI) => {
    const orgId = getValidOrgId(thunkAPI.getState());
    try {
      const response = await bidsService.fetchBidMetrics(orgId);
      if (response?.success && response?.data) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const createBid = createAsyncThunk(
  "bids/createBid",
  async ({ payload, successCallBack }, thunkAPI) => {
    const orgId = getValidOrgId(thunkAPI.getState());
    try {
      const response = await bidsService.createBid(payload, orgId);
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

export const updateBid = createAsyncThunk(
  "bids/updateBid",
  async ({ id, payload, successCallBack }, thunkAPI) => {
    const orgId = getValidOrgId(thunkAPI.getState());
    try {
      const response = await bidsService.updateBid(id, payload, orgId);
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

export const transitionBidStatus = createAsyncThunk(
  "bids/transitionBidStatus",
  async ({ id, payload, successCallBack }, thunkAPI) => {
    const orgId = getValidOrgId(thunkAPI.getState());
    try {
      const response = await bidsService.transitionBidStatus(id, payload, orgId);
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

export const deleteBid = createAsyncThunk(
  "bids/deleteBid",
  async ({ id, successCallBack }, thunkAPI) => {
    const orgId = getValidOrgId(thunkAPI.getState());
    try {
      const response = await bidsService.deleteBid(id, orgId);
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

export const bulkDeleteBids = createAsyncThunk(
  "bids/bulkDeleteBids",
  async ({ ids, successCallBack }, thunkAPI) => {
    const orgId = getValidOrgId(thunkAPI.getState());
    try {
      const response = await bidsService.bulkDeleteBids(ids, orgId);
      if (response?.success) {
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

export const bidsSlice = createSlice({
  name: "bids",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBids.pending, (state) => setPending(state, "fetchBids"))
      .addCase(fetchBids.fulfilled, (state, action) => {
        setFulfilled(state, "fetchBids", action.payload);
        state.bids = action.payload?.items ?? action.payload ?? [];
      })
      .addCase(fetchBids.rejected, (state, action) =>
        setRejected(state, "fetchBids", action.payload?.message)
      )
      .addCase(fetchBidById.pending, (state) => setPending(state, "fetchBidById"))
      .addCase(fetchBidById.fulfilled, (state, action) => {
        setFulfilled(state, "fetchBidById", action.payload);
        state.bids = (state.bids || []).some((b) => b.Id === action.payload?.Id)
          ? (state.bids || []).map((b) =>
              b.Id === action.payload?.Id ? { ...b, ...action.payload } : b
            )
          : [action.payload, ...(state.bids || [])];
      })
      .addCase(fetchBidById.rejected, (state, action) =>
        setRejected(state, "fetchBidById", action.payload?.message)
      )
      .addCase(fetchDraftBacklog.pending, (state) => setPending(state, "fetchDraftBacklog"))
      .addCase(fetchDraftBacklog.fulfilled, (state, action) =>
        setFulfilled(state, "fetchDraftBacklog", action.payload)
      )
      .addCase(fetchDraftBacklog.rejected, (state, action) =>
        setRejected(state, "fetchDraftBacklog", action.payload?.message)
      )
      .addCase(fetchFollowUpBacklog.pending, (state) => setPending(state, "fetchFollowUpBacklog"))
      .addCase(fetchFollowUpBacklog.fulfilled, (state, action) =>
        setFulfilled(state, "fetchFollowUpBacklog", action.payload)
      )
      .addCase(fetchFollowUpBacklog.rejected, (state, action) =>
        setRejected(state, "fetchFollowUpBacklog", action.payload?.message)
      )
      .addCase(fetchInterviewBacklog.pending, (state) =>
        setPending(state, "fetchInterviewBacklog")
      )
      .addCase(fetchInterviewBacklog.fulfilled, (state, action) =>
        setFulfilled(state, "fetchInterviewBacklog", action.payload)
      )
      .addCase(fetchInterviewBacklog.rejected, (state, action) =>
        setRejected(state, "fetchInterviewBacklog", action.payload?.message)
      )
      .addCase(fetchReviewBacklog.pending, (state) => setPending(state, "fetchReviewBacklog"))
      .addCase(fetchReviewBacklog.fulfilled, (state, action) =>
        setFulfilled(state, "fetchReviewBacklog", action.payload)
      )
      .addCase(fetchReviewBacklog.rejected, (state, action) =>
        setRejected(state, "fetchReviewBacklog", action.payload?.message)
      )
      .addCase(fetchGhostedSuggestions.pending, (state) =>
        setPending(state, "fetchGhostedSuggestions")
      )
      .addCase(fetchGhostedSuggestions.fulfilled, (state, action) =>
        setFulfilled(state, "fetchGhostedSuggestions", action.payload)
      )
      .addCase(fetchGhostedSuggestions.rejected, (state, action) =>
        setRejected(state, "fetchGhostedSuggestions", action.payload?.message)
      )
      .addCase(fetchBidMetrics.pending, (state) => setPending(state, "fetchBidMetrics"))
      .addCase(fetchBidMetrics.fulfilled, (state, action) =>
        setFulfilled(state, "fetchBidMetrics", action.payload)
      )
      .addCase(fetchBidMetrics.rejected, (state, action) =>
        setRejected(state, "fetchBidMetrics", action.payload?.message)
      )
      .addCase(createBid.pending, (state) => setPending(state, "createBid"))
      .addCase(createBid.fulfilled, (state, action) => {
        setFulfilled(state, "createBid", action.payload);
        state.bids = [action.payload, ...(state.bids || [])];
      })
      .addCase(createBid.rejected, (state, action) =>
        setRejected(state, "createBid", action.payload?.message)
      )
      .addCase(updateBid.pending, (state) => setPending(state, "updateBid"))
      .addCase(updateBid.fulfilled, (state, action) => {
        setFulfilled(state, "updateBid", action.payload);
        state.bids = (state.bids || []).map((b) =>
          b.Id === action.payload?.Id ? { ...b, ...action.payload } : b
        );
      })
      .addCase(updateBid.rejected, (state, action) =>
        setRejected(state, "updateBid", action.payload?.message)
      )
      .addCase(transitionBidStatus.pending, (state) =>
        setPending(state, "transitionBidStatus")
      )
      .addCase(transitionBidStatus.fulfilled, (state, action) => {
        setFulfilled(state, "transitionBidStatus", action.payload);
        state.bids = (state.bids || []).map((b) =>
          b.Id === action.payload?.Id ? { ...b, ...action.payload } : b
        );
      })
      .addCase(transitionBidStatus.rejected, (state, action) =>
        setRejected(state, "transitionBidStatus", action.payload?.message)
      )
      .addCase(deleteBid.pending, (state) => setPending(state, "deleteBid"))
      .addCase(deleteBid.fulfilled, (state, action) => {
        setFulfilled(state, "deleteBid", null);
        state.bids = (state.bids || []).filter((b) => b.Id !== action.payload);
      })
      .addCase(deleteBid.rejected, (state, action) =>
        setRejected(state, "deleteBid", action.payload?.message)
      )
      .addCase(bulkDeleteBids.pending, (state) =>
        setPending(state, "bulkDeleteBids")
      )
      .addCase(bulkDeleteBids.fulfilled, (state, action) => {
        setFulfilled(state, "bulkDeleteBids", action.payload);
      })
      .addCase(bulkDeleteBids.rejected, (state, action) =>
        setRejected(state, "bulkDeleteBids", action.payload?.message)
      );
  },
});

export default bidsSlice.reducer;
