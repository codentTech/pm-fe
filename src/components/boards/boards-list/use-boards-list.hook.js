"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import {
  fetchBoards,
  createBoard,
  updateBoard,
  deleteBoard,
} from "@/provider/features/boards/boards.slice";

export default function useBoardsList() {
  // stats
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const {
    boards,
    fetchBoards: fetchState,
    createBoard: createState,
    updateBoard: updateState,
    deleteBoard: deleteState,
  } = useSelector((state) => state?.boards ?? {});
  const currentOrganizationId = useSelector(
    (state) => state.organizations?.currentOrganizationId
  );
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingBoard, setEditingBoard] = useState(null);
  const [boardToDeleteId, setBoardToDeleteId] = useState(null);

  const createForm = useForm({ defaultValues: { Name: "", Description: "" } });
  const editForm = useForm({ defaultValues: { Name: "", Description: "" } });

  const loading = fetchState?.isLoading;
  const createLoading = createState?.isLoading;
  const updateLoading = updateState?.isLoading;
  const deleteLoading = deleteState?.isLoading;

  useEffect(() => {
    if (currentOrganizationId !== undefined) {
      dispatch(fetchBoards());
    }
  }, [dispatch, currentOrganizationId]);

  useEffect(() => {
    if (searchParams?.get("openCreate") === "1") setShowCreateModal(true);
  }, [searchParams]);

  useEffect(() => {
    if (editingBoard) {
      editForm.reset({
        Name: editingBoard.Name || "",
        Description: editingBoard.Description || "",
      });
    }
  }, [editingBoard]);

  // functions
  function onSubmitCreate(values) {
    dispatch(
      createBoard({
        payload: { Name: values.Name, Description: values.Description || "" },
        successCallBack: () => {
          setShowCreateModal(false);
          createForm.reset();
        },
      })
    );
  }

  function onSubmitEdit(values) {
    if (!editingBoard?.Id) return;
    dispatch(
      updateBoard({
        id: editingBoard.Id,
        payload: { Name: values.Name, Description: values.Description || "" },
        successCallBack: () => {
          setEditingBoard(null);
          editForm.reset();
        },
      })
    );
  }

  async function handleDeleteBoard() {
    if (!boardToDeleteId) return;
    await dispatch(
      deleteBoard({
        id: boardToDeleteId,
        successCallBack: () => setBoardToDeleteId(null),
      })
    );
  }

  return {
    boards,
    loading,
    showCreateModal,
    setShowCreateModal,
    editingBoard,
    setEditingBoard,
    boardToDeleteId,
    setBoardToDeleteId,
    createForm,
    editForm,
    handleSubmit: createForm.handleSubmit,
    handleEditSubmit: editForm.handleSubmit,
    errors: createForm.formState.errors,
    editErrors: editForm.formState.errors,
    register: createForm.register,
    editRegister: editForm.register,
    onSubmitCreate,
    onSubmitEdit,
    handleDeleteBoard,
    createLoading,
    updateLoading,
    deleteLoading,
  };
}
