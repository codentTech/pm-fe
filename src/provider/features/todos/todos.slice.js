import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import todosService from "./todos.service";

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
  todoLists: [],
  togglingItemKey: null,
  fetchTodoLists: generalState,
  createTodoList: generalState,
  updateTodoList: generalState,
  deleteTodoList: generalState,
  createTodoItem: generalState,
  updateTodoItem: generalState,
  deleteTodoItem: generalState,
};

export const fetchTodoLists = createAsyncThunk(
  "todos/fetchTodoLists",
  async (queryParams, thunkAPI) => {
    const orgId = getValidOrgId(thunkAPI.getState());
    try {
      const response = await todosService.fetchTodoLists(orgId, queryParams);
      if (response?.success && response?.data) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const createTodoList = createAsyncThunk(
  "todos/createTodoList",
  async ({ payload, successCallBack }, thunkAPI) => {
    const orgId = getValidOrgId(thunkAPI.getState());
    try {
      const response = await todosService.createTodoList(payload, orgId);
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

export const updateTodoList = createAsyncThunk(
  "todos/updateTodoList",
  async ({ id, payload, successCallBack }, thunkAPI) => {
    const orgId = getValidOrgId(thunkAPI.getState());
    try {
      const response = await todosService.updateTodoList(id, payload, orgId);
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

export const deleteTodoList = createAsyncThunk(
  "todos/deleteTodoList",
  async ({ id, successCallBack }, thunkAPI) => {
    const orgId = getValidOrgId(thunkAPI.getState());
    try {
      const response = await todosService.deleteTodoList(id, orgId);
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

export const createTodoItem = createAsyncThunk(
  "todos/createTodoItem",
  async ({ todoListId, payload, successCallBack }, thunkAPI) => {
    const orgId = getValidOrgId(thunkAPI.getState());
    try {
      const response = await todosService.createTodoItem(todoListId, payload, orgId);
      if (response?.success && response?.data) {
        successCallBack?.(response.data);
        return { todoListId, item: response.data };
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const updateTodoItem = createAsyncThunk(
  "todos/updateTodoItem",
  async ({ todoListId, itemId, payload, successCallBack, errorCallBack }, thunkAPI) => {
    const orgId = getValidOrgId(thunkAPI.getState());
    try {
      const response = await todosService.updateTodoItem(
        todoListId,
        itemId,
        payload,
        orgId
      );
      if (response?.success && response?.data) {
        successCallBack?.(response.data);
        return { todoListId, item: response.data };
      }
      errorCallBack?.();
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      errorCallBack?.();
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const deleteTodoItem = createAsyncThunk(
  "todos/deleteTodoItem",
  async ({ todoListId, itemId, successCallBack }, thunkAPI) => {
    const orgId = getValidOrgId(thunkAPI.getState());
    try {
      const response = await todosService.deleteTodoItem(
        todoListId,
        itemId,
        orgId
      );
      if (response?.success) {
        successCallBack?.();
        return { todoListId, itemId };
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

export const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    updateTodoListInState: (state, action) => {
      const { id, todoItems } = action.payload;
      const list = state.todoLists?.find((l) => l.Id === id);
      if (list) {
        list.TodoItems = todoItems;
      }
    },
    optimisticToggleTodoItem: (state, action) => {
      const { todoListId, itemId, status } = action.payload;
      const list = state.todoLists?.find((l) => l.Id === todoListId);
      if (list?.TodoItems) {
        const idx = list.TodoItems.findIndex(
          (i) => (i.Id || i.id) === itemId
        );
        if (idx !== -1) {
          list.TodoItems[idx] = {
            ...list.TodoItems[idx],
            Status: status,
            status,
          };
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodoLists.pending, (state) => setPending(state, "fetchTodoLists"))
      .addCase(fetchTodoLists.fulfilled, (state, action) => {
        setFulfilled(state, "fetchTodoLists", action.payload);
        state.todoLists = action.payload?.items ?? action.payload ?? [];
      })
      .addCase(fetchTodoLists.rejected, (state, action) =>
        setRejected(state, "fetchTodoLists", action.payload?.message)
      )
      .addCase(createTodoList.pending, (state) => setPending(state, "createTodoList"))
      .addCase(createTodoList.fulfilled, (state, action) => {
        setFulfilled(state, "createTodoList", action.payload);
        state.todoLists = [
          { ...action.payload, TodoItems: action.payload.TodoItems || [] },
          ...(state.todoLists || []),
        ];
      })
      .addCase(createTodoList.rejected, (state, action) =>
        setRejected(state, "createTodoList", action.payload?.message)
      )
      .addCase(updateTodoList.pending, (state) => setPending(state, "updateTodoList"))
      .addCase(updateTodoList.fulfilled, (state, action) => {
        setFulfilled(state, "updateTodoList", action.payload);
        state.todoLists = (state.todoLists || []).map((l) =>
          l.Id === action.payload?.Id ? { ...l, ...action.payload } : l
        );
      })
      .addCase(updateTodoList.rejected, (state, action) =>
        setRejected(state, "updateTodoList", action.payload?.message)
      )
      .addCase(deleteTodoList.pending, (state) => setPending(state, "deleteTodoList"))
      .addCase(deleteTodoList.fulfilled, (state, action) => {
        setFulfilled(state, "deleteTodoList", null);
        state.todoLists = (state.todoLists || []).filter((l) => l.Id !== action.payload);
      })
      .addCase(deleteTodoList.rejected, (state, action) =>
        setRejected(state, "deleteTodoList", action.payload?.message)
      )
      .addCase(createTodoItem.pending, (state) => setPending(state, "createTodoItem"))
      .addCase(createTodoItem.fulfilled, (state, action) => {
        setFulfilled(state, "createTodoItem", action.payload);
        const { todoListId, item } = action.payload;
        const list = state.todoLists?.find((l) => l.Id === todoListId);
        if (list) {
          list.TodoItems = [...(list.TodoItems || []), item];
        }
      })
      .addCase(createTodoItem.rejected, (state, action) =>
        setRejected(state, "createTodoItem", action.payload?.message)
      )
      .addCase(updateTodoItem.pending, (state, action) => {
        const arg = action.meta?.arg;
        if (arg?.todoListId && arg?.itemId) {
          state.togglingItemKey = `${arg.todoListId}-${arg.itemId}`;
        }
        setPending(state, "updateTodoItem");
      })
      .addCase(updateTodoItem.fulfilled, (state, action) => {
        state.togglingItemKey = null;
        setFulfilled(state, "updateTodoItem", action.payload);
        const { todoListId, item } = action.payload;
        const list = state.todoLists?.find((l) => l.Id === todoListId);
        if (list?.TodoItems && item) {
          const itemId = item.Id ?? item.id;
          const status = item.Status ?? item.status;
          const updated = { ...item, Id: itemId, Status: status, status };
          list.TodoItems = list.TodoItems.map((i) =>
            (i.Id || i.id) === itemId ? { ...i, ...updated } : i
          );
        }
      })
      .addCase(updateTodoItem.rejected, (state, action) => {
        state.togglingItemKey = null;
        setRejected(state, "updateTodoItem", action.payload?.message);
      })
      .addCase(deleteTodoItem.pending, (state) => setPending(state, "deleteTodoItem"))
      .addCase(deleteTodoItem.fulfilled, (state, action) => {
        setFulfilled(state, "deleteTodoItem", null);
        const { todoListId, itemId } = action.payload;
        const list = state.todoLists?.find((l) => l.Id === todoListId);
        if (list?.TodoItems) {
          list.TodoItems = list.TodoItems.filter((i) => i.Id !== itemId);
        }
      })
      .addCase(deleteTodoItem.rejected, (state, action) =>
        setRejected(state, "deleteTodoItem", action.payload?.message)
      );
  },
});

export const { updateTodoListInState, optimisticToggleTodoItem } =
  todosSlice.actions;
export default todosSlice.reducer;
