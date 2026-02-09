import api from "@/common/utils/api";

const getHeaders = (orgId) => (orgId ? { "X-Organization-Id": orgId } : {});

const buildQuery = (params) => {
  const searchParams = new URLSearchParams();
  if (params?.status) searchParams.set("status", params.status);
  if (params?.due) searchParams.set("due", params.due);
  if (params?.priority) searchParams.set("priority", params.priority);
  if (params?.listId) searchParams.set("listId", params.listId);
  if (params?.search) searchParams.set("search", params.search);
  if (params?.sort) searchParams.set("sort", params.sort);
  if (params?.order) searchParams.set("order", params.order);
  if (params?.page != null) searchParams.set("page", params.page);
  if (params?.limit != null) searchParams.set("limit", params.limit);
  const q = searchParams.toString();
  return q ? `?${q}` : "";
};

const fetchTodoLists = async (orgId, queryParams) => {
  const qs = buildQuery(queryParams);
  const response = await api(getHeaders(orgId)).get(`/todo-lists${qs}`);
  return response.data;
};

const fetchTodoListById = async (id, orgId) => {
  const response = await api(getHeaders(orgId)).get(`/todo-lists/${id}`);
  return response.data;
};

const createTodoList = async (payload, orgId) => {
  const response = await api(getHeaders(orgId)).post("/todo-lists", payload);
  return response.data;
};

const updateTodoList = async (id, payload, orgId) => {
  const response = await api(getHeaders(orgId)).put(`/todo-lists/${id}`, payload);
  return response.data;
};

const deleteTodoList = async (id, orgId) => {
  const response = await api(getHeaders(orgId)).delete(`/todo-lists/${id}`);
  return response.data;
};

const fetchTodoItems = async (todoListId, orgId, params = {}) => {
  const qs = buildQuery(params);
  const response = await api(getHeaders(orgId)).get(
    `/todo-lists/${todoListId}/todo-items${qs}`
  );
  return response.data;
};

const createTodoItem = async (todoListId, payload, orgId) => {
  const response = await api(getHeaders(orgId)).post(
    `/todo-lists/${todoListId}/todo-items`,
    payload
  );
  return response.data;
};

const updateTodoItem = async (todoListId, itemId, payload, orgId) => {
  const response = await api(getHeaders(orgId)).put(
    `/todo-lists/${todoListId}/todo-items/${itemId}`,
    payload
  );
  return response.data;
};

const deleteTodoItem = async (todoListId, itemId, orgId) => {
  const response = await api(getHeaders(orgId)).delete(
    `/todo-lists/${todoListId}/todo-items/${itemId}`
  );
  return response.data;
};

const todosService = {
  fetchTodoLists,
  fetchTodoListById,
  createTodoList,
  updateTodoList,
  deleteTodoList,
  fetchTodoItems,
  createTodoItem,
  updateTodoItem,
  deleteTodoItem,
};

export default todosService;
