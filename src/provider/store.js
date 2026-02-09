import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore, createTransform } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./features/auth/auth.slice";
import boardsReducer from "./features/boards/boards.slice";
import kpisReducer from "./features/kpis/kpis.slice";
import organizationsReducer from "./features/organizations/organizations.slice";
import invitationsReducer from "./features/invitations/invitations.slice";
import todosReducer from "./features/todos/todos.slice";
import labelsReducer from "./features/labels/labels.slice";
import notificationsReducer from "./features/notifications/notifications.slice";
import usersReducer from "./features/users/users.slice";
import searchReducer from "./features/search/search.slice";

const orgGeneralState = {
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
  data: null,
};

const orgRehydratedState = {
  organizations: [],
  currentOrganizationId: null,
  fetchOrganizations: orgGeneralState,
  fetchOrEnsureDefault: orgGeneralState,
  createOrganization: orgGeneralState,
  updateOrganization: orgGeneralState,
  deleteOrganization: orgGeneralState,
};

const organizationsTransform = createTransform(
  (inboundState) => ({
    ...orgRehydratedState,
    currentOrganizationId: inboundState?.currentOrganizationId ?? null,
  }),
  (outboundState) => ({
    ...orgRehydratedState,
    currentOrganizationId: outboundState?.currentOrganizationId ?? null,
  }),
  { whitelist: ["organizations"] }
);

const persistConfig = {
  key: "trello-clone",
  storage,
  whitelist: ["auth", "organizations"],
  transforms: [organizationsTransform],
};

const rootReducer = combineReducers({
  auth: authReducer,
  boards: boardsReducer,
  kpis: kpisReducer,
  organizations: organizationsReducer,
  invitations: invitationsReducer,
  todos: todosReducer,
  labels: labelsReducer,
  notifications: notificationsReducer,
  users: usersReducer,
  search: searchReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // required for redux-persist
    }),
});

export const persistor = persistStore(store);
