"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import useDebounce from "@/common/hooks/useDebounce";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import {
  fetchTodoLists,
  createTodoList,
  updateTodoList,
  deleteTodoList,
  createTodoItem,
  updateTodoItem,
  deleteTodoItem,
  optimisticToggleTodoItem,
} from "@/provider/features/todos/todos.slice";

const defaultTodoListValues = { Name: "" };
const defaultTodoItemValues = {
  Title: "",
  Description: "",
  DueDate: "",
  Priority: "medium",
  Status: "todo",
};

export const PRIORITY_OPTIONS = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export const STATUS_OPTIONS = [
  { value: "todo", label: "To Do" },
  { value: "in_progress", label: "In Progress" },
  { value: "done", label: "Done" },
];

export const DUE_FILTER_OPTIONS = [
  { value: "", label: "All dates" },
  { value: "overdue", label: "Overdue" },
  { value: "today", label: "Today" },
  { value: "week", label: "This week" },
  { value: "none", label: "No date" },
];

export const SORT_OPTIONS = [
  { value: "createdAt", label: "Created" },
  { value: "dueDate", label: "Due date" },
  { value: "priority", label: "Priority" },
  { value: "title", label: "Title" },
];

export const SORT_ORDER_OPTIONS = [
  { value: "asc", label: "Ascending" },
  { value: "desc", label: "Descending" },
];

export default function useTodoTracker() {
  // stats
  const dispatch = useDispatch();
  const {
    todoLists,
    togglingItemKey,
    fetchTodoLists: fetchState,
    createTodoList: createListState,
    updateTodoList: updateListState,
    deleteTodoList: deleteListState,
    createTodoItem: createItemState,
    updateTodoItem: updateItemState,
    deleteTodoItem: deleteItemState,
  } = useSelector((state) => state?.todos ?? {});
  const currentOrganizationId = useSelector(
    (state) => state.organizations?.currentOrganizationId
  );
  const [showCreateListModal, setShowCreateListModal] = useState(false);
  const [editingList, setEditingList] = useState(null);
  const [listToDeleteId, setListToDeleteId] = useState(null);
  const [addingItemListId, setAddingItemListId] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [filters, setFilters] = useState({
    status: "",
    due: "",
    priority: "",
    listId: "",
    search: "",
    sort: "createdAt",
    order: "asc",
  });

  const listForm = useForm({ defaultValues: defaultTodoListValues });
  const editListForm = useForm({ defaultValues: defaultTodoListValues });
  const itemForm = useForm({ defaultValues: defaultTodoItemValues });
  const editItemForm = useForm({ defaultValues: defaultTodoItemValues });

  const debouncedSearch = useDebounce(filters.search, 350);

  const hasActiveFilters =
    !!(filters.search?.trim() || filters.status || filters.due || filters.priority || filters.listId);

  const clearFilters = useCallback(() => {
    setFilters({
      status: "",
      due: "",
      priority: "",
      listId: "",
      search: "",
      sort: "createdAt",
      order: "asc",
    });
  }, []);

  const queryParams = useMemo(() => {
    const p = {};
    if (filters.status) p.status = filters.status;
    if (filters.due) p.due = filters.due;
    if (filters.priority) p.priority = filters.priority;
    if (filters.listId) p.listId = filters.listId;
    if (debouncedSearch?.trim()) p.search = debouncedSearch.trim();
    if (filters.sort) p.sort = filters.sort;
    if (filters.order) p.order = filters.order;
    return p;
  }, [
    filters.status,
    filters.due,
    filters.priority,
    filters.listId,
    debouncedSearch,
    filters.sort,
    filters.order,
  ]);

  // useEffect
  useEffect(() => {
    if (currentOrganizationId !== undefined) {
      dispatch(fetchTodoLists(queryParams));
    }
  }, [dispatch, currentOrganizationId, queryParams]);

  // functions
  function handleCreateList(values) {
    dispatch(
      createTodoList({
        payload: { Name: values.Name },
        successCallBack: () => {
          setShowCreateListModal(false);
          listForm.reset();
        },
      })
    );
  }

  function handleUpdateList(values) {
    if (!editingList) return;
    dispatch(
      updateTodoList({
        id: editingList.Id,
        payload: { Name: values.Name },
        successCallBack: () => setEditingList(null),
      })
    );
  }

  function handleDeleteList() {
    if (!listToDeleteId) return;
    dispatch(
      deleteTodoList({
        id: listToDeleteId,
        successCallBack: () => setListToDeleteId(null),
      })
    );
  }

  function handleCreateItem(todoListId, values) {
    dispatch(
      createTodoItem({
        todoListId,
        payload: {
          Title: values.Title,
          Description: values.Description || undefined,
          DueDate: values.DueDate || undefined,
          Priority: values.Priority || "medium",
          Status: values.Status || "todo",
        },
        successCallBack: () => {
          setAddingItemListId(null);
          itemForm.reset();
        },
      })
    );
  }

  function handleUpdateItem(todoListId, itemId, values) {
    dispatch(
      updateTodoItem({
        todoListId,
        itemId,
        payload: {
          Title: values.Title,
          Description: values.Description || undefined,
          DueDate: values.DueDate || undefined,
          Priority: values.Priority,
          Status: values.Status,
        },
        successCallBack: () => setEditingItem(null),
      })
    );
  }

  function handleDeleteItem() {
    if (!itemToDelete) return;
    dispatch(
      deleteTodoItem({
        todoListId: itemToDelete.todoListId,
        itemId: itemToDelete.itemId,
        successCallBack: () => setItemToDelete(null),
      })
    );
  }

  function handleToggleItemStatus(todoListId, item) {
    const itemId = item.Id ?? item.id;
    const isDone = (item.Status || item.status) === "done";
    const nextStatus = isDone ? "todo" : "done";
    const prevStatus = isDone ? "done" : "todo";

    dispatch(optimisticToggleTodoItem({ todoListId, itemId, status: nextStatus }));
    dispatch(
      updateTodoItem({
        todoListId,
        itemId,
        payload: { Status: nextStatus },
        errorCallBack: () => {
          dispatch(
            optimisticToggleTodoItem({ todoListId, itemId, status: prevStatus })
          );
        },
      })
    );
  }

  function openEditList(list) {
    setEditingList(list);
    editListForm.reset({ Name: list.Name });
  }

  function openEditItem(item, todoListId) {
    setEditingItem({ ...item, _todoListId: todoListId });
    editItemForm.reset({
      Title: item.Title,
      Description: item.Description || "",
      DueDate: item.DueDate ? item.DueDate.slice(0, 10) : "",
      Priority: item.Priority || "medium",
      Status: item.Status || "todo",
    });
  }

  return {
    todoLists: todoLists || [],
    togglingItemKey,
    filters,
    setFilters,
    hasActiveFilters,
    clearFilters,
    loading: fetchState?.isLoading,
    showCreateListModal,
    setShowCreateListModal,
    editingList,
    setEditingList,
    listToDeleteId,
    setListToDeleteId,
    addingItemListId,
    setAddingItemListId,
    editingItem,
    setEditingItem,
    itemToDelete,
    setItemToDelete,
    listForm,
    editListForm,
    itemForm,
    editItemForm,
    handleCreateList,
    handleUpdateList,
    handleDeleteList,
    handleCreateItem,
    handleUpdateItem,
    handleDeleteItem,
    handleToggleItemStatus,
    openEditList,
    openEditItem,
    createListState,
    updateListState,
    deleteListState,
    createItemState,
    updateItemState,
    deleteItemState,
  };
}
