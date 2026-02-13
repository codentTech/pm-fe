import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import projectsService from "./projects.service";
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
  projects: [],
  currentProject: null,
  fetchProjects: generalState,
  fetchProjectById: generalState,
  createProject: generalState,
  createProjectFromBid: generalState,
  updateProject: generalState,
  deleteProject: generalState,
  createList: generalState,
  updateList: generalState,
  deleteList: generalState,
  createCard: generalState,
  updateCard: generalState,
  deleteCard: generalState,
  productBacklog: generalState,
  sprintBacklog: generalState,
  bugBacklog: generalState,
  blockedBacklog: generalState,
};

export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async (_, thunkAPI) => {
    const orgId = getValidOrgId(thunkAPI.getState());
    try {
      const response = await projectsService.fetchProjects(orgId);
      if (response?.success && response?.data) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const fetchProjectById = createAsyncThunk(
  "projects/fetchProjectById",
  async (id, thunkAPI) => {
    const orgId = getValidOrgId(thunkAPI.getState());
    try {
      const response = await projectsService.fetchProjectById(id, orgId);
      if (response?.success && response?.data) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const createProject = createAsyncThunk(
  "projects/createProject",
  async ({ payload, successCallBack }, thunkAPI) => {
    const orgId = getValidOrgId(thunkAPI.getState());
    try {
      const response = await projectsService.createProject(payload, orgId);
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

export const createProjectFromBid = createAsyncThunk(
  "projects/createProjectFromBid",
  async ({ bidId, successCallBack }, thunkAPI) => {
    const orgId = getValidOrgId(thunkAPI.getState());
    try {
      const response = await projectsService.createProjectFromBid(bidId, orgId);
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

export const updateProject = createAsyncThunk(
  "projects/updateProject",
  async ({ id, payload, successCallBack }, thunkAPI) => {
    const orgId = getValidOrgId(thunkAPI.getState());
    try {
      const response = await projectsService.updateProject(id, payload, orgId);
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

export const deleteProject = createAsyncThunk(
  "projects/deleteProject",
  async ({ id, successCallBack }, thunkAPI) => {
    const orgId = getValidOrgId(thunkAPI.getState());
    try {
      const response = await projectsService.deleteProject(id, orgId);
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
  "projects/createList",
  async ({ payload, successCallBack }, thunkAPI) => {
    try {
      const response = await listsService.createList(payload);
      if (response?.success && response?.data) {
        successCallBack?.(response.data);
        return { list: response.data, projectId: payload.ProjectId };
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const updateList = createAsyncThunk(
  "projects/updateList",
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
  "projects/deleteList",
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
  "projects/createCard",
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
  "projects/updateCard",
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
  "projects/deleteCard",
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

export const fetchProductBacklog = createAsyncThunk(
  "projects/fetchProductBacklog",
  async ({ projectId, params } = {}, thunkAPI) => {
    try {
      const response = await cardsService.fetchProductBacklog(projectId, params);
      if (response?.success && response?.data) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const fetchSprintBacklog = createAsyncThunk(
  "projects/fetchSprintBacklog",
  async ({ projectId, sprintId, params } = {}, thunkAPI) => {
    try {
      const response = await cardsService.fetchSprintBacklog(
        projectId,
        sprintId,
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

export const fetchBugBacklog = createAsyncThunk(
  "projects/fetchBugBacklog",
  async ({ projectId, params } = {}, thunkAPI) => {
    try {
      const response = await cardsService.fetchBugBacklog(projectId, params);
      if (response?.success && response?.data) {
        return response.data;
      }
      return thunkAPI.rejectWithValue(response);
    } catch (error) {
      return thunkAPI.rejectWithValue({ payload: error });
    }
  }
);

export const fetchBlockedBacklog = createAsyncThunk(
  "projects/fetchBlockedBacklog",
  async ({ projectId, params } = {}, thunkAPI) => {
    try {
      const response = await cardsService.fetchBlockedBacklog(projectId, params);
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

export const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    setCurrentProject: (state, action) => {
      state.currentProject = action.payload;
    },
    clearCurrentProject: (state) => {
      state.currentProject = null;
    },
    moveCardOptimistic: (state, action) => {
      const { cardId, sourceListId, targetListId, targetIndex } = action.payload;
      if (!state.currentProject?.Lists) return;
      const lists = state.currentProject.Lists;
      const sourceList = lists.find((l) => l.Id === sourceListId);
      if (!sourceList?.Cards) return;
      const sourceIdx = sourceList.Cards.findIndex((c) => c.Id === cardId);
      if (sourceIdx < 0) return;
      const card = sourceList.Cards[sourceIdx];
      const listWithoutCard = sourceList.Cards.filter((c) => c.Id !== cardId);

      const withPositions = (arr) =>
        arr.map((c, i) => ({ ...c, Position: i }));

      if (sourceListId === targetListId) {
        const insertIndex = Math.min(targetIndex, listWithoutCard.length);
        const newCards = [
          ...listWithoutCard.slice(0, insertIndex),
          { ...card, ListId: targetListId },
          ...listWithoutCard.slice(insertIndex),
        ];
        state.currentProject.Lists = lists.map((list) =>
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
      state.currentProject.Lists = lists.map((list) => {
        if (list.Id === sourceListId)
          return { ...list, Cards: withPositions(listWithoutCard) };
        if (list.Id === targetListId)
          return { ...list, Cards: withPositions(newTargetCards) };
        return list;
      });
    },
    applyRemoteCardMoved: (state, action) => {
      const { cardId, fromListId, toListId, position } = action.payload;
      if (!state.currentProject?.Lists) return;
      const lists = state.currentProject.Lists;
      const sourceList = lists.find((l) => l.Id === fromListId);
      const targetList = lists.find((l) => l.Id === toListId);
      if (!sourceList || !targetList) return;
      const card = (sourceList.Cards || []).find((c) => c.Id === cardId);
      if (!card) return;
      state.currentProject.Lists = lists.map((list) => {
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
      if (!state.currentProject?.Lists || !card) return;
      state.currentProject.Lists = state.currentProject.Lists.map((l) =>
        l.Id === listId ? { ...l, Cards: [...(l.Cards || []), card].filter(Boolean) } : l
      );
    },
    applyRemoteCardUpdated: (state, action) => {
      const { card } = action.payload;
      if (!state.currentProject?.Lists || !card) return;
      state.currentProject.Lists = state.currentProject.Lists.map((list) => ({
        ...list,
        Cards: (list.Cards || []).map((c) => (c.Id === card.Id ? { ...c, ...card } : c)),
      }));
    },
    applyRemoteCardDeleted: (state, action) => {
      const { cardId } = action.payload;
      if (!state.currentProject?.Lists) return;
      state.currentProject.Lists = state.currentProject.Lists.map((list) => ({
        ...list,
        Cards: (list.Cards || []).filter((c) => c.Id !== cardId),
      }));
    },
    applyRemoteListCreated: (state, action) => {
      const { list } = action.payload;
      if (!state.currentProject?.Lists || !list) return;
      state.currentProject.Lists = [...(state.currentProject.Lists || []), list].filter(Boolean);
    },
    applyRemoteListDeleted: (state, action) => {
      const { listId } = action.payload;
      if (!state.currentProject?.Lists) return;
      state.currentProject.Lists = state.currentProject.Lists.filter((l) => l.Id !== listId);
    },
    revertCardMove: (state, action) => {
      const { cardId, sourceListId, sourceIndex, targetListId } = action.payload;
      if (!state.currentProject?.Lists) return;
      const lists = state.currentProject.Lists;
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
      state.currentProject.Lists = lists.map((list) => {
        if (list.Id === sourceListId) return { ...list, Cards: newSourceCards };
        if (list.Id === targetListId) return { ...list, Cards: newTargetCards };
        return list;
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => setPending(state, "fetchProjects"))
      .addCase(fetchProjects.fulfilled, (state, action) => {
        setFulfilled(state, "fetchProjects", action.payload);
        state.projects = action.payload?.items ?? action.payload ?? [];
      })
      .addCase(fetchProjects.rejected, (state, action) =>
        setRejected(state, "fetchProjects", action.payload?.message)
      )
      .addCase(fetchProjectById.pending, (state) => setPending(state, "fetchProjectById"))
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        setFulfilled(state, "fetchProjectById", action.payload);
        state.currentProject = action.payload;
      })
      .addCase(fetchProjectById.rejected, (state, action) =>
        setRejected(state, "fetchProjectById", action.payload?.message)
      )
      .addCase(createProject.pending, (state) => setPending(state, "createProject"))
      .addCase(createProject.fulfilled, (state, action) => {
        setFulfilled(state, "createProject", action.payload);
        state.projects = [action.payload, ...(state.projects || [])];
      })
      .addCase(createProject.rejected, (state, action) =>
        setRejected(state, "createProject", action.payload?.message)
      )
      .addCase(createProjectFromBid.pending, (state) =>
        setPending(state, "createProjectFromBid")
      )
      .addCase(createProjectFromBid.fulfilled, (state, action) => {
        setFulfilled(state, "createProjectFromBid", action.payload);
        state.projects = [action.payload, ...(state.projects || [])];
      })
      .addCase(createProjectFromBid.rejected, (state, action) =>
        setRejected(state, "createProjectFromBid", action.payload?.message)
      )
      .addCase(updateProject.pending, (state) => setPending(state, "updateProject"))
      .addCase(updateProject.fulfilled, (state, action) => {
        setFulfilled(state, "updateProject", action.payload);
        if (state.currentProject?.Id === action.payload?.Id) {
          state.currentProject = { ...state.currentProject, ...action.payload };
        }
        state.projects = (state.projects || []).map((p) =>
          p.Id === action.payload?.Id ? { ...p, ...action.payload } : p
        );
      })
      .addCase(updateProject.rejected, (state, action) =>
        setRejected(state, "updateProject", action.payload?.message)
      )
      .addCase(deleteProject.pending, (state) => setPending(state, "deleteProject"))
      .addCase(deleteProject.fulfilled, (state, action) => {
        setFulfilled(state, "deleteProject", null);
        state.projects = (state.projects || []).filter((p) => p.Id !== action.payload);
        if (state.currentProject?.Id === action.payload) state.currentProject = null;
      })
      .addCase(deleteProject.rejected, (state, action) =>
        setRejected(state, "deleteProject", action.payload?.message)
      )
      .addCase(createList.fulfilled, (state, action) => {
        setFulfilled(state, "createList", action.payload?.list);
        if (state.currentProject?.Id === action.payload?.projectId) {
          state.currentProject = {
            ...state.currentProject,
            Lists: [...(state.currentProject.Lists || []), action.payload?.list].filter(Boolean),
          };
        }
      })
      .addCase(createList.pending, (state) => setPending(state, "createList"))
      .addCase(createList.rejected, (state, action) =>
        setRejected(state, "createList", action.payload?.message)
      )
      .addCase(updateList.fulfilled, (state, action) => {
        setFulfilled(state, "updateList", action.payload);
        if (state.currentProject?.Lists) {
          state.currentProject.Lists = state.currentProject.Lists.map((l) =>
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
        if (state.currentProject?.Lists) {
          state.currentProject.Lists = state.currentProject.Lists.filter((l) => l.Id !== action.payload);
        }
      })
      .addCase(deleteList.pending, (state) => setPending(state, "deleteList"))
      .addCase(deleteList.rejected, (state, action) =>
        setRejected(state, "deleteList", action.payload?.message)
      )
      .addCase(createCard.fulfilled, (state, action) => {
        setFulfilled(state, "createCard", action.payload?.card);
        const listId = action.payload?.listId;
        if (state.currentProject?.Lists && listId) {
          state.currentProject.Lists = state.currentProject.Lists.map((l) =>
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
        if (state.currentProject?.Lists && action.payload?.ListId) {
          const payload = action.payload;
          state.currentProject.Lists = state.currentProject.Lists.map((list) => {
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
        } else if (state.currentProject?.Lists) {
          state.currentProject.Lists = state.currentProject.Lists.map((list) => ({
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
        if (state.currentProject?.Lists) {
          state.currentProject.Lists = state.currentProject.Lists.map((list) => ({
            ...list,
            Cards: (list.Cards || []).filter((c) => c.Id !== action.payload),
          }));
        }
      })
      .addCase(deleteCard.pending, (state) => setPending(state, "deleteCard"))
      .addCase(deleteCard.rejected, (state, action) =>
        setRejected(state, "deleteCard", action.payload?.message)
      )
      .addCase(fetchProductBacklog.pending, (state) =>
        setPending(state, "productBacklog")
      )
      .addCase(fetchProductBacklog.fulfilled, (state, action) =>
        setFulfilled(state, "productBacklog", action.payload)
      )
      .addCase(fetchProductBacklog.rejected, (state, action) =>
        setRejected(state, "productBacklog", action.payload?.message)
      )
      .addCase(fetchSprintBacklog.pending, (state) =>
        setPending(state, "sprintBacklog")
      )
      .addCase(fetchSprintBacklog.fulfilled, (state, action) =>
        setFulfilled(state, "sprintBacklog", action.payload)
      )
      .addCase(fetchSprintBacklog.rejected, (state, action) =>
        setRejected(state, "sprintBacklog", action.payload?.message)
      )
      .addCase(fetchBugBacklog.pending, (state) =>
        setPending(state, "bugBacklog")
      )
      .addCase(fetchBugBacklog.fulfilled, (state, action) =>
        setFulfilled(state, "bugBacklog", action.payload)
      )
      .addCase(fetchBugBacklog.rejected, (state, action) =>
        setRejected(state, "bugBacklog", action.payload?.message)
      )
      .addCase(fetchBlockedBacklog.pending, (state) =>
        setPending(state, "blockedBacklog")
      )
      .addCase(fetchBlockedBacklog.fulfilled, (state, action) =>
        setFulfilled(state, "blockedBacklog", action.payload)
      )
      .addCase(fetchBlockedBacklog.rejected, (state, action) =>
        setRejected(state, "blockedBacklog", action.payload?.message)
      );
  },
});

export const {
  setCurrentProject,
  clearCurrentProject,
  moveCardOptimistic,
  revertCardMove,
  applyRemoteCardMoved,
  applyRemoteCardCreated,
  applyRemoteCardUpdated,
  applyRemoteCardDeleted,
  applyRemoteListCreated,
  applyRemoteListDeleted,
} = projectsSlice.actions;
export default projectsSlice.reducer;
