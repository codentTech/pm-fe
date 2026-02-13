import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import wikiService from "./wiki.service";

const generalState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
  data: null,
};

const initialState = {
  pages: [],
  currentPage: null,
  attachments: [],
  fetchPages: generalState,
  fetchPage: generalState,
  createPage: generalState,
  updatePage: generalState,
  deletePage: generalState,
  fetchAttachments: generalState,
  uploadAttachment: generalState,
  deleteAttachment: generalState,
};

export const fetchWikiPages = createAsyncThunk(
  "wiki/fetchWikiPages",
  async ({ projectId }, thunkAPI) => {
    try {
      const response = await wikiService.fetchWikiPages(projectId);
      if (response?.success && response?.data) return response.data;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  },
);

export const fetchWikiPage = createAsyncThunk(
  "wiki/fetchWikiPage",
  async ({ projectId, slug }, thunkAPI) => {
    try {
      const response = await wikiService.fetchWikiPage(projectId, slug);
      if (response?.success && response?.data) return response.data;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  },
);

export const createWikiPage = createAsyncThunk(
  "wiki/createWikiPage",
  async ({ projectId, payload, successCallBack }, thunkAPI) => {
    try {
      const response = await wikiService.createWikiPage(projectId, payload);
      if (response?.success && response?.data) {
        successCallBack?.(response.data);
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  },
);

export const updateWikiPage = createAsyncThunk(
  "wiki/updateWikiPage",
  async ({ projectId, pageId, payload, successCallBack }, thunkAPI) => {
    try {
      const response = await wikiService.updateWikiPage(projectId, pageId, payload);
      if (response?.success && response?.data) {
        successCallBack?.(response.data);
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  },
);

export const deleteWikiPage = createAsyncThunk(
  "wiki/deleteWikiPage",
  async ({ projectId, pageId, successCallBack }, thunkAPI) => {
    try {
      const response = await wikiService.deleteWikiPage(projectId, pageId);
      if (response?.success) {
        successCallBack?.();
        return pageId;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  },
);

export const fetchWikiAttachments = createAsyncThunk(
  "wiki/fetchWikiAttachments",
  async ({ projectId, pageId, params }, thunkAPI) => {
    try {
      const response = await wikiService.fetchWikiAttachments(projectId, pageId, params);
      if (response?.success && response?.data) return response.data;
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  },
);

export const uploadWikiAttachment = createAsyncThunk(
  "wiki/uploadWikiAttachment",
  async ({ projectId, pageId, file, successCallBack }, thunkAPI) => {
    try {
      const response = await wikiService.uploadWikiAttachment(projectId, pageId, file);
      if (response?.success && response?.data) {
        successCallBack?.(response.data);
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  },
);

export const deleteWikiAttachment = createAsyncThunk(
  "wiki/deleteWikiAttachment",
  async ({ projectId, pageId, attachmentId, successCallBack }, thunkAPI) => {
    try {
      const response = await wikiService.deleteWikiAttachment(
        projectId,
        pageId,
        attachmentId,
      );
      if (response?.success) {
        successCallBack?.();
        return attachmentId;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  },
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

export const wikiSlice = createSlice({
  name: "wiki",
  initialState,
  reducers: {
    clearCurrentPage: (state) => {
      state.currentPage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWikiPages.pending, (state) => setPending(state, "fetchPages"))
      .addCase(fetchWikiPages.fulfilled, (state, action) => {
        setFulfilled(state, "fetchPages", action.payload);
        state.pages = action.payload || [];
      })
      .addCase(fetchWikiPages.rejected, (state, action) =>
        setRejected(state, "fetchPages", action.payload?.message),
      )
      .addCase(fetchWikiPage.pending, (state) => setPending(state, "fetchPage"))
      .addCase(fetchWikiPage.fulfilled, (state, action) => {
        setFulfilled(state, "fetchPage", action.payload);
        state.currentPage = action.payload;
      })
      .addCase(fetchWikiPage.rejected, (state, action) =>
        setRejected(state, "fetchPage", action.payload?.message),
      )
      .addCase(createWikiPage.pending, (state) => setPending(state, "createPage"))
      .addCase(createWikiPage.fulfilled, (state, action) => {
        setFulfilled(state, "createPage", action.payload);
        state.pages = [action.payload, ...(state.pages || [])];
      })
      .addCase(createWikiPage.rejected, (state, action) =>
        setRejected(state, "createPage", action.payload?.message),
      )
      .addCase(updateWikiPage.pending, (state) => setPending(state, "updatePage"))
      .addCase(updateWikiPage.fulfilled, (state, action) => {
        setFulfilled(state, "updatePage", action.payload);
        state.currentPage = action.payload;
        state.pages = (state.pages || []).map((page) =>
          page.Id === action.payload?.Id ? action.payload : page,
        );
      })
      .addCase(updateWikiPage.rejected, (state, action) =>
        setRejected(state, "updatePage", action.payload?.message),
      )
      .addCase(deleteWikiPage.pending, (state) => setPending(state, "deletePage"))
      .addCase(deleteWikiPage.fulfilled, (state, action) => {
        setFulfilled(state, "deletePage", null);
        state.pages = (state.pages || []).filter((page) => page.Id !== action.payload);
      })
      .addCase(deleteWikiPage.rejected, (state, action) =>
        setRejected(state, "deletePage", action.payload?.message),
      )
      .addCase(fetchWikiAttachments.pending, (state) =>
        setPending(state, "fetchAttachments"),
      )
      .addCase(fetchWikiAttachments.fulfilled, (state, action) => {
        setFulfilled(state, "fetchAttachments", action.payload);
        state.attachments = action.payload?.items || [];
      })
      .addCase(fetchWikiAttachments.rejected, (state, action) =>
        setRejected(state, "fetchAttachments", action.payload?.message),
      )
      .addCase(uploadWikiAttachment.pending, (state) =>
        setPending(state, "uploadAttachment"),
      )
      .addCase(uploadWikiAttachment.fulfilled, (state, action) => {
        setFulfilled(state, "uploadAttachment", action.payload);
        state.attachments = [action.payload, ...(state.attachments || [])];
      })
      .addCase(uploadWikiAttachment.rejected, (state, action) =>
        setRejected(state, "uploadAttachment", action.payload?.message),
      )
      .addCase(deleteWikiAttachment.pending, (state) =>
        setPending(state, "deleteAttachment"),
      )
      .addCase(deleteWikiAttachment.fulfilled, (state, action) => {
        setFulfilled(state, "deleteAttachment", null);
        state.attachments = (state.attachments || []).filter(
          (item) => item.Id !== action.payload,
        );
      })
      .addCase(deleteWikiAttachment.rejected, (state, action) =>
        setRejected(state, "deleteAttachment", action.payload?.message),
      );
  },
});

export const { clearCurrentPage } = wikiSlice.actions;
export default wikiSlice.reducer;
