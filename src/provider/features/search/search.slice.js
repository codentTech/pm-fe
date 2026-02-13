import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import searchService from "./search.service";

const generalState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
  data: null,
};

const emptyResults = {
  cards: [],
  todos: [],
  projects: [],
  kpis: [],
  workspaces: [],
};

const initialState = {
  results: emptyResults,
  search: generalState,
};

export const search = createAsyncThunk(
  "search/search",
  async ({ params, orgId }, thunkAPI) => {
    try {
      const response = await searchService.search(params, orgId);
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

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setResults: (state, action) => {
      state.results = action.payload;
    },
    clearResults: (state) => {
      state.results = { cards: [], todos: [], projects: [], kpis: [], workspaces: [] };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(search.pending, (state) => setPending(state, "search"))
      .addCase(search.fulfilled, (state, action) => {
        setFulfilled(state, "search", action.payload);
        state.results = action.payload || emptyResults;
      })
      .addCase(search.rejected, (state, action) => {
        setRejected(state, "search", action.payload?.message);
        state.results = emptyResults;
      });
  },
});

export const { setResults, clearResults } = searchSlice.actions;
export default searchSlice.reducer;
