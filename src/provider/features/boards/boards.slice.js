import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import boardsService from "./boards.service";
import listsService from "@/provider/features/lists/lists.service";
import cardsService from "@/provider/features/cards/cards.service";

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
  boards: [],
  currentBoard: null,
  fetchBoards: generalState,
  fetchBoardById: generalState,
  createBoard: generalState,
  updateBoard: generalState,
  deleteBoard: generalState,
  createList: generalState,
  updateList: generalState,
  deleteList: generalState,
  createCard: generalState,
  updateCard: generalState,
  deleteCard: generalState,
};

export const fetchBoards = createAsyncThunk(
  "boards/fetchBoards",
  async (_, thunkAPI) => {
    const orgId = getValidOrgId(thunkAPI.getState());
    try {
      const response = await boardsService.fetchBoards(orgId);
      if (response?.success && response?.data) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const fetchBoardById = createAsyncThunk(
  "boards/fetchBoardById",
  async (id, thunkAPI) => {
    const orgId = getValidOrgId(thunkAPI.getState());
    try {
      const response = await boardsService.fetchBoardById(id, orgId);
      if (response?.success && response?.data) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const createBoard = createAsyncThunk(
  "boards/createBoard",
  async ({ payload, successCallBack }, thunkAPI) => {
    const orgId = getValidOrgId(thunkAPI.getState());
    try {
      const response = await boardsService.createBoard(payload, orgId);
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

export const updateBoard = createAsyncThunk(
  "boards/updateBoard",
  async ({ id, payload, successCallBack }, thunkAPI) => {
    const orgId = getValidOrgId(thunkAPI.getState());
    try {
      const response = await boardsService.updateBoard(id, payload, orgId);
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

export const deleteBoard = createAsyncThunk(
  "boards/deleteBoard",
  async ({ id, successCallBack }, thunkAPI) => {
    const orgId = getValidOrgId(thunkAPI.getState());
    try {
      const response = await boardsService.deleteBoard(id, orgId);
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

export const createList = createAsyncThunk(
  "boards/createList",
  async ({ payload, successCallBack }, thunkAPI) => {
    try {
      const response = await listsService.createList(payload);
      if (response?.success && response?.data) {
        successCallBack?.(response.data);
        return { list: response.data, boardId: payload.BoardId };
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const updateList = createAsyncThunk(
  "boards/updateList",
  async ({ id, payload, successCallBack }, thunkAPI) => {
    try {
      const response = await listsService.updateList(id, payload);
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

export const deleteList = createAsyncThunk(
  "boards/deleteList",
  async ({ id, successCallBack }, thunkAPI) => {
    try {
      const response = await listsService.deleteList(id);
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

export const createCard = createAsyncThunk(
  "boards/createCard",
  async ({ payload, successCallBack }, thunkAPI) => {
    try {
      const response = await cardsService.createCard(payload);
      if (response?.success && response?.data) {
        successCallBack?.(response.data);
        return { card: response.data, listId: payload.ListId };
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const updateCard = createAsyncThunk(
  "boards/updateCard",
  async ({ id, payload, successCallBack, errorCallBack }, thunkAPI) => {
    try {
      const response = await cardsService.updateCard(id, payload);
      if (response?.success && response?.data) {
        successCallBack?.(response.data);
        return response.data;
      }
      errorCallBack?.();
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      errorCallBack?.();
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const deleteCard = createAsyncThunk(
  "boards/deleteCard",
  async ({ id, successCallBack }, thunkAPI) => {
    try {
      const response = await cardsService.deleteCard(id);
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

export const boardsSlice = createSlice({
  name: "boards",
  initialState,
  reducers: {
    setCurrentBoard: (state, action) => {
      state.currentBoard = action.payload;
    },
    clearCurrentBoard: (state) => {
      state.currentBoard = null;
    },
    moveCardOptimistic: (state, action) => {
      const { cardId, sourceListId, targetListId, targetIndex } = action.payload;
      if (!state.currentBoard?.Lists) return;
      const lists = state.currentBoard.Lists;
      const sourceList = lists.find((l) => l.Id === sourceListId);
      if (!sourceList?.Cards) return;
      const sourceIdx = sourceList.Cards.findIndex((c) => c.Id === cardId);
      if (sourceIdx < 0) return;
      const card = sourceList.Cards[sourceIdx];
      const listWithoutCard = sourceList.Cards.filter((c) => c.Id !== cardId);

      // Assign Position so useListColumn sort displays correct order
      const withPositions = (arr) =>
        arr.map((c, i) => ({ ...c, Position: i }));

      if (sourceListId === targetListId) {
        const insertIndex = Math.min(targetIndex, listWithoutCard.length);
        const newCards = [
          ...listWithoutCard.slice(0, insertIndex),
          { ...card, ListId: targetListId },
          ...listWithoutCard.slice(insertIndex),
        ];
        state.currentBoard.Lists = lists.map((list) =>
          list.Id === targetListId
            ? { ...list, Cards: withPositions(newCards) }
            : list
        );
        return;
      }

      const targetList = lists.find((l) => l.Id === targetListId);
      if (!targetList) return;
      const targetCards = targetList.Cards || [];
      const insertIndex = Math.min(targetIndex, targetCards.length);
      const newTargetCards = [
        ...targetCards.slice(0, insertIndex),
        { ...card, ListId: targetListId },
        ...targetCards.slice(insertIndex),
      ];
      state.currentBoard.Lists = lists.map((list) => {
        if (list.Id === sourceListId)
          return { ...list, Cards: withPositions(listWithoutCard) };
        if (list.Id === targetListId)
          return { ...list, Cards: withPositions(newTargetCards) };
        return list;
      });
    },
    applyRemoteCardMoved: (state, action) => {
      const { cardId, fromListId, toListId, position } = action.payload;
      if (!state.currentBoard?.Lists) return;
      const lists = state.currentBoard.Lists;
      const sourceList = lists.find((l) => l.Id === fromListId);
      const targetList = lists.find((l) => l.Id === toListId);
      if (!sourceList || !targetList) return;
      const card = (sourceList.Cards || []).find((c) => c.Id === cardId);
      if (!card) return;
      state.currentBoard.Lists = lists.map((list) => {
        if (list.Id === fromListId) {
          return { ...list, Cards: (list.Cards || []).filter((c) => c.Id !== cardId) };
        }
        if (list.Id === toListId) {
          const cards = (list.Cards || []).filter((c) => c.Id !== cardId);
          const pos = Math.min(Math.max(0, position ?? cards.length), cards.length);
          return { ...list, Cards: [...cards.slice(0, pos), { ...card, ListId: toListId, Position: position }, ...cards.slice(pos)] };
        }
        return list;
      });
    },
    applyRemoteCardCreated: (state, action) => {
      const { card, listId } = action.payload;
      if (!state.currentBoard?.Lists || !card) return;
      state.currentBoard.Lists = state.currentBoard.Lists.map((l) =>
        l.Id === listId ? { ...l, Cards: [...(l.Cards || []), card].filter(Boolean) } : l
      );
    },
    applyRemoteCardUpdated: (state, action) => {
      const { card } = action.payload;
      if (!state.currentBoard?.Lists || !card) return;
      state.currentBoard.Lists = state.currentBoard.Lists.map((list) => ({
        ...list,
        Cards: (list.Cards || []).map((c) => (c.Id === card.Id ? { ...c, ...card } : c)),
      }));
    },
    applyRemoteCardDeleted: (state, action) => {
      const { cardId } = action.payload;
      if (!state.currentBoard?.Lists) return;
      state.currentBoard.Lists = state.currentBoard.Lists.map((list) => ({
        ...list,
        Cards: (list.Cards || []).filter((c) => c.Id !== cardId),
      }));
    },
    applyRemoteListCreated: (state, action) => {
      const { list } = action.payload;
      if (!state.currentBoard?.Lists || !list) return;
      state.currentBoard.Lists = [...(state.currentBoard.Lists || []), list].filter(Boolean);
    },
    applyRemoteListDeleted: (state, action) => {
      const { listId } = action.payload;
      if (!state.currentBoard?.Lists) return;
      state.currentBoard.Lists = state.currentBoard.Lists.filter((l) => l.Id !== listId);
    },
    revertCardMove: (state, action) => {
      const { cardId, sourceListId, sourceIndex, targetListId } = action.payload;
      if (!state.currentBoard?.Lists) return;
      const lists = state.currentBoard.Lists;
      const targetList = lists.find((l) => l.Id === targetListId);
      const sourceList = lists.find((l) => l.Id === sourceListId);
      if (!targetList || !sourceList) return;
      const card = (targetList.Cards || []).find((c) => c.Id === cardId);
      if (!card) return;
      const newTargetCards = (targetList.Cards || []).filter((c) => c.Id !== cardId);
      const sourceCards = sourceList.Cards || [];
      const insertIdx = Math.min(sourceIndex, sourceCards.length);
      const newSourceCards = [
        ...sourceCards.slice(0, insertIdx),
        { ...card, ListId: sourceListId },
        ...sourceCards.slice(insertIdx),
      ];
      state.currentBoard.Lists = lists.map((list) => {
        if (list.Id === sourceListId) return { ...list, Cards: newSourceCards };
        if (list.Id === targetListId) return { ...list, Cards: newTargetCards };
        return list;
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoards.pending, (state) => setPending(state, "fetchBoards"))
      .addCase(fetchBoards.fulfilled, (state, action) => {
        setFulfilled(state, "fetchBoards", action.payload);
        state.boards = action.payload?.items ?? action.payload ?? [];
      })
      .addCase(fetchBoards.rejected, (state, action) =>
        setRejected(state, "fetchBoards", action.payload?.message)
      )
      .addCase(fetchBoardById.pending, (state) => setPending(state, "fetchBoardById"))
      .addCase(fetchBoardById.fulfilled, (state, action) => {
        setFulfilled(state, "fetchBoardById", action.payload);
        state.currentBoard = action.payload;
      })
      .addCase(fetchBoardById.rejected, (state, action) =>
        setRejected(state, "fetchBoardById", action.payload?.message)
      )
      .addCase(createBoard.pending, (state) => setPending(state, "createBoard"))
      .addCase(createBoard.fulfilled, (state, action) => {
        setFulfilled(state, "createBoard", action.payload);
        state.boards = [action.payload, ...(state.boards || [])];
      })
      .addCase(createBoard.rejected, (state, action) =>
        setRejected(state, "createBoard", action.payload?.message)
      )
      .addCase(updateBoard.pending, (state) => setPending(state, "updateBoard"))
      .addCase(updateBoard.fulfilled, (state, action) => {
        setFulfilled(state, "updateBoard", action.payload);
        if (state.currentBoard?.Id === action.payload?.Id) {
          state.currentBoard = { ...state.currentBoard, ...action.payload };
        }
        state.boards = (state.boards || []).map((b) =>
          b.Id === action.payload?.Id ? { ...b, ...action.payload } : b
        );
      })
      .addCase(updateBoard.rejected, (state, action) =>
        setRejected(state, "updateBoard", action.payload?.message)
      )
      .addCase(deleteBoard.pending, (state) => setPending(state, "deleteBoard"))
      .addCase(deleteBoard.fulfilled, (state, action) => {
        setFulfilled(state, "deleteBoard", null);
        state.boards = (state.boards || []).filter((b) => b.Id !== action.payload);
        if (state.currentBoard?.Id === action.payload) state.currentBoard = null;
      })
      .addCase(deleteBoard.rejected, (state, action) =>
        setRejected(state, "deleteBoard", action.payload?.message)
      )
      .addCase(createList.fulfilled, (state, action) => {
        setFulfilled(state, "createList", action.payload?.list);
        if (state.currentBoard?.Id === action.payload?.boardId) {
          state.currentBoard = {
            ...state.currentBoard,
            Lists: [...(state.currentBoard.Lists || []), action.payload?.list].filter(Boolean),
          };
        }
      })
      .addCase(createList.pending, (state) => setPending(state, "createList"))
      .addCase(createList.rejected, (state, action) =>
        setRejected(state, "createList", action.payload?.message)
      )
      .addCase(updateList.fulfilled, (state, action) => {
        setFulfilled(state, "updateList", action.payload);
        if (state.currentBoard?.Lists) {
          state.currentBoard.Lists = state.currentBoard.Lists.map((l) =>
            l.Id === action.payload?.Id ? { ...l, ...action.payload } : l
          );
        }
      })
      .addCase(updateList.pending, (state) => setPending(state, "updateList"))
      .addCase(updateList.rejected, (state, action) =>
        setRejected(state, "updateList", action.payload?.message)
      )
      .addCase(deleteList.fulfilled, (state, action) => {
        setFulfilled(state, "deleteList", null);
        if (state.currentBoard?.Lists) {
          state.currentBoard.Lists = state.currentBoard.Lists.filter((l) => l.Id !== action.payload);
        }
      })
      .addCase(deleteList.pending, (state) => setPending(state, "deleteList"))
      .addCase(deleteList.rejected, (state, action) =>
        setRejected(state, "deleteList", action.payload?.message)
      )
      .addCase(createCard.fulfilled, (state, action) => {
        setFulfilled(state, "createCard", action.payload?.card);
        const listId = action.payload?.listId;
        if (state.currentBoard?.Lists && listId) {
          state.currentBoard.Lists = state.currentBoard.Lists.map((l) =>
            l.Id === listId
              ? { ...l, Cards: [...(l.Cards || []), action.payload?.card].filter(Boolean) }
              : l
          );
        }
      })
      .addCase(createCard.pending, (state) => setPending(state, "createCard"))
      .addCase(createCard.rejected, (state, action) =>
        setRejected(state, "createCard", action.payload?.message)
      )
      .addCase(updateCard.fulfilled, (state, action) => {
        setFulfilled(state, "updateCard", action.payload);
        if (state.currentBoard?.Lists && action.payload?.ListId) {
          const payload = action.payload;
          state.currentBoard.Lists = state.currentBoard.Lists.map((list) => {
            if (list.Id === payload.ListId) {
              const cards = list.Cards || [];
              const existingIndex = cards.findIndex((c) => c.Id === payload.Id);
              if (existingIndex >= 0) {
                return {
                  ...list,
                  Cards: cards.map((c) =>
                    c.Id === payload.Id ? { ...c, ...payload } : c
                  ),
                };
              }
              // Insert at payload.Position so card doesn't briefly appear at end (Trello-style).
              const pos = Math.min(
                Math.max(0, payload.Position ?? cards.length),
                cards.length
              );
              return {
                ...list,
                Cards: [...cards.slice(0, pos), payload, ...cards.slice(pos)],
              };
            }
            return {
              ...list,
              Cards: (list.Cards || []).filter((c) => c.Id !== payload.Id),
            };
          });
        } else if (state.currentBoard?.Lists) {
          state.currentBoard.Lists = state.currentBoard.Lists.map((list) => ({
            ...list,
            Cards: (list.Cards || []).map((c) =>
              c.Id === action.payload?.Id ? { ...c, ...action.payload } : c
            ),
          }));
        }
      })
      .addCase(updateCard.pending, (state) => setPending(state, "updateCard"))
      .addCase(updateCard.rejected, (state, action) =>
        setRejected(state, "updateCard", action.payload?.message)
      )
      .addCase(deleteCard.fulfilled, (state, action) => {
        setFulfilled(state, "deleteCard", null);
        if (state.currentBoard?.Lists) {
          state.currentBoard.Lists = state.currentBoard.Lists.map((list) => ({
            ...list,
            Cards: (list.Cards || []).filter((c) => c.Id !== action.payload),
          }));
        }
      })
      .addCase(deleteCard.pending, (state) => setPending(state, "deleteCard"))
      .addCase(deleteCard.rejected, (state, action) =>
        setRejected(state, "deleteCard", action.payload?.message)
      );
  },
});

export const {
  setCurrentBoard,
  clearCurrentBoard,
  moveCardOptimistic,
  revertCardMove,
  applyRemoteCardMoved,
  applyRemoteCardCreated,
  applyRemoteCardUpdated,
  applyRemoteCardDeleted,
  applyRemoteListCreated,
  applyRemoteListDeleted,
} = boardsSlice.actions;
export default boardsSlice.reducer;
