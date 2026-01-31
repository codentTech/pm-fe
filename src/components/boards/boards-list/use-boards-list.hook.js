"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { fetchBoards, createBoard } from "@/provider/features/boards/boards.slice";

export default function useBoardsList() {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const { boards, fetchBoards: fetchState } = useSelector((state) => state.boards);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { Name: "", Description: "" },
  });

  useEffect(() => {
    dispatch(fetchBoards());
  }, [dispatch]);

  useEffect(() => {
    if (searchParams?.get("openCreate") === "1") setShowCreateModal(true);
  }, [searchParams]);

  const onSubmitCreate = (values) => {
    dispatch(
      createBoard({
        payload: { Name: values.Name, Description: values.Description || "" },
        successCallBack: () => {
          setShowCreateModal(false);
          reset();
        },
      })
    );
  };

  const loading = fetchState?.isLoading;

  return {
    boards,
    loading,
    showCreateModal,
    setShowCreateModal,
    register,
    handleSubmit,
    errors,
    onSubmitCreate,
  };
}
