import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import sprintsService from "./sprints.service";

const generalState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
  data: null,
};

const initialState = {
  sprints: [],
  currentSprint: null,
  fetchSprints: generalState,
  fetchSprintById: generalState,
  createSprint: generalState,
  updateSprint: generalState,
  deleteSprint: generalState,
};

export const fetchSprints = createAsyncThunk(
  "sprints/fetchSprints",
  async ({ projectId }, thunkAPI) => {
    try {
      const response = await sprintsService.fetchSprints(projectId);
      if (response?.success && response?.data) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const fetchSprintById = createAsyncThunk(
  "sprints/fetchSprintById",
  async ({ id }, thunkAPI) => {
    try {
      const response = await sprintsService.fetchSprintById(id);
      if (response?.success && response?.data) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const createSprint = createAsyncThunk(
  "sprints/createSprint",
  async ({ payload, successCallBack }, thunkAPI) => {
    try {
      const response = await sprintsService.createSprint(payload);
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

export const updateSprint = createAsyncThunk(
  "sprints/updateSprint",
  async ({ id, payload, successCallBack }, thunkAPI) => {
    try {
      const response = await sprintsService.updateSprint(id, payload);
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

export const deleteSprint = createAsyncThunk(
  "sprints/deleteSprint",
  async ({ id, successCallBack }, thunkAPI) => {
    try {
      const response = await sprintsService.deleteSprint(id);
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

export const sprintsSlice = createSlice({
  name: "sprints",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSprints.pending, (state) => setPending(state, "fetchSprints"))
      .addCase(fetchSprints.fulfilled, (state, action) => {
        setFulfilled(state, "fetchSprints", action.payload);
        state.sprints = action.payload || [];
      })
      .addCase(fetchSprints.rejected, (state, action) =>
        setRejected(state, "fetchSprints", action.payload?.message)
      )
      .addCase(fetchSprintById.pending, (state) =>
        setPending(state, "fetchSprintById")
      )
      .addCase(fetchSprintById.fulfilled, (state, action) => {
        setFulfilled(state, "fetchSprintById", action.payload);
        state.currentSprint = action.payload;
      })
      .addCase(fetchSprintById.rejected, (state, action) =>
        setRejected(state, "fetchSprintById", action.payload?.message)
      )
      .addCase(createSprint.pending, (state) => setPending(state, "createSprint"))
      .addCase(createSprint.fulfilled, (state, action) => {
        setFulfilled(state, "createSprint", action.payload);
        state.sprints = [action.payload, ...(state.sprints || [])];
      })
      .addCase(createSprint.rejected, (state, action) =>
        setRejected(state, "createSprint", action.payload?.message)
      )
      .addCase(updateSprint.pending, (state) => setPending(state, "updateSprint"))
      .addCase(updateSprint.fulfilled, (state, action) => {
        setFulfilled(state, "updateSprint", action.payload);
        state.sprints = (state.sprints || []).map((s) =>
          s.Id === action.payload?.Id ? { ...s, ...action.payload } : s
        );
      })
      .addCase(updateSprint.rejected, (state, action) =>
        setRejected(state, "updateSprint", action.payload?.message)
      )
      .addCase(deleteSprint.pending, (state) => setPending(state, "deleteSprint"))
      .addCase(deleteSprint.fulfilled, (state, action) => {
        setFulfilled(state, "deleteSprint", null);
        state.sprints = (state.sprints || []).filter((s) => s.Id !== action.payload);
      })
      .addCase(deleteSprint.rejected, (state, action) =>
        setRejected(state, "deleteSprint", action.payload?.message)
      );
  },
});

export default sprintsSlice.reducer;
