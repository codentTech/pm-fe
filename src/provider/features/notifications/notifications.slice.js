import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import notificationsService from "./notifications.service";

const generalState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
  data: null,
};

const initialState = {
  notifications: [],
  unreadCount: 0,
  fetchNotifications: generalState,
  fetchUnreadCount: generalState,
  markAsRead: generalState,
  markAllAsRead: generalState,
};

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (limit, thunkAPI) => {
    try {
      const response = await notificationsService.findAll(limit ?? 50);
      if (response?.success && response?.data) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ message: error?.message });
    }
  }
);

export const fetchUnreadCount = createAsyncThunk(
  "notifications/fetchUnreadCount",
  async (_, thunkAPI) => {
    try {
      const response = await notificationsService.getUnreadCount();
      if (response?.success && response?.data?.count !== undefined) {
        return response.data.count;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ message: error?.message });
    }
  }
);

export const markNotificationAsRead = createAsyncThunk(
  "notifications/markAsRead",
  async (id, thunkAPI) => {
    try {
      const response = await notificationsService.markAsRead(id);
      if (response?.success) {
        return id;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ message: error?.message });
    }
  }
);

export const markAllNotificationsAsRead = createAsyncThunk(
  "notifications/markAllAsRead",
  async (_, thunkAPI) => {
    try {
      const response = await notificationsService.markAllAsRead();
      if (response?.success) {
        return true;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ message: error?.message });
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

export const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      state.unreadCount = (state.unreadCount || 0) + 1;
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) =>
        setPending(state, "fetchNotifications")
      )
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        setFulfilled(state, "fetchNotifications", action.payload);
        state.notifications = action.payload || [];
      })
      .addCase(fetchNotifications.rejected, (state, action) =>
        setRejected(state, "fetchNotifications", action.payload?.message)
      )
      .addCase(fetchUnreadCount.pending, (state) =>
        setPending(state, "fetchUnreadCount")
      )
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        setFulfilled(state, "fetchUnreadCount", action.payload);
        state.unreadCount = action.payload ?? 0;
      })
      .addCase(fetchUnreadCount.rejected, (state, action) =>
        setRejected(state, "fetchUnreadCount", action.payload?.message)
      )
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const n = state.notifications.find((x) => x.Id === action.payload);
        if (n) n.IsRead = true;
        state.unreadCount = Math.max(0, (state.unreadCount || 0) - 1);
      })
      .addCase(markAllNotificationsAsRead.fulfilled, (state) => {
        state.notifications.forEach((n) => (n.IsRead = true));
        state.unreadCount = 0;
      });
  },
});

export const { addNotification, clearNotifications } = notificationsSlice.actions;
export default notificationsSlice.reducer;
