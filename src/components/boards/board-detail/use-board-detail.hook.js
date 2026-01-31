"use client";

import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import {
  fetchBoardById,
  createList,
  createCard,
  updateCard,
  updateList,
  deleteCard as deleteCardAction,
  deleteList as deleteListAction,
  clearCurrentBoard,
  moveCardOptimistic,
  revertCardMove,
} from "@/provider/features/boards/boards.slice";

export default function useBoardDetail(boardId) {
  const dispatch = useDispatch();
  const {
    currentBoard,
    fetchBoardById: fetchState,
    deleteCard: deleteCardState,
    deleteList: deleteListState,
    createList: createListState,
    createCard: createCardState,
    updateCard: updateCardState,
  } = useSelector((state) => state.boards);
  const [showAddList, setShowAddList] = useState(false);
  const [addingCardListId, setAddingCardListId] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [activeCard, setActiveCard] = useState(null);
  const [activeListId, setActiveListId] = useState(null);
  const [activeDropTarget, setActiveDropTarget] = useState(null);

  const listForm = useForm({ defaultValues: { Title: "" } });
  const cardDetailForm = useForm({ defaultValues: { Title: "", Description: "", DueDate: "" } });

  useEffect(() => {
    if (boardId) dispatch(fetchBoardById(boardId));
    return () => dispatch(clearCurrentBoard());
  }, [boardId, dispatch]);

  useEffect(() => {
    if (selectedCard) {
      cardDetailForm.reset({
        Title: selectedCard.Title || "",
        Description: selectedCard.Description || "",
        DueDate: selectedCard.DueDate ? selectedCard.DueDate.slice(0, 10) : "",
      });
    }
  }, [selectedCard]);

  const handleCreateList = (values) => {
    dispatch(
      createList({
        payload: { Title: values.Title, BoardId: boardId },
        successCallBack: () => {
          setShowAddList(false);
          listForm.reset();
        },
      })
    );
  };

  const handleCreateCard = (listId, payload) => {
    const title = typeof payload === "string" ? payload : payload?.Title;
    if (!title?.trim()) return;
    const body =
      typeof payload === "string"
        ? { Title: title.trim(), ListId: listId }
        : {
            Title: (payload.Title || title).trim(),
            ListId: listId,
            Description: payload.Description || undefined,
            DueDate: payload.DueDate || undefined,
          };
    dispatch(
      createCard({
        payload: body,
        successCallBack: () => setAddingCardListId(null),
      })
    );
  };

  const handleUpdateCard = (values) => {
    if (!selectedCard) return;
    dispatch(
      updateCard({
        id: selectedCard.Id,
        payload: {
          Title: values.Title,
          Description: values.Description || undefined,
          DueDate: values.DueDate || undefined,
        },
        successCallBack: () => setSelectedCard(null),
      })
    );
  };

  const handleMoveCard = (cardId, targetListId) => {
    dispatch(updateCard({ id: cardId, payload: { ListId: targetListId } }));
    if (selectedCard?.Id === cardId) setSelectedCard(null);
  };

  const handleMoveCardAt = useCallback(
    (cardId, targetListId, targetIndex) => {
      const lists = currentBoard?.Lists || [];
      const sourceList = lists.find((l) => (l.Cards || []).some((c) => c.Id === cardId));
      const sourceListId = sourceList?.Id;
      const sourceIndex = sourceList
        ? (sourceList.Cards || []).findIndex((c) => c.Id === cardId)
        : -1;
      if (sourceListId == null || sourceIndex < 0) return;
      if (sourceListId === targetListId && sourceIndex === targetIndex) return;

      dispatch(
        moveCardOptimistic({
          cardId,
          sourceListId,
          targetListId,
          targetIndex,
        })
      );
      if (selectedCard?.Id === cardId) setSelectedCard(null);

      dispatch(
        updateCard({
          id: cardId,
          payload: { ListId: targetListId, Position: targetIndex },
        })
      )
        .unwrap()
        .catch(() => {
          dispatch(
            revertCardMove({
              cardId,
              sourceListId,
              sourceIndex,
              targetListId,
            })
          );
        });
    },
    [dispatch, currentBoard?.Lists, selectedCard?.Id]
  );

  const handleReorderLists = useCallback(
    (orderedListIds) => {
      orderedListIds.forEach((listId, index) => {
        dispatch(updateList({ id: listId, payload: { Position: index } }));
      });
    },
    [dispatch]
  );

  const handleDeleteList = (listId) => {
    dispatch(deleteListAction({ id: listId }));
  };

  const handleDeleteCard = (cardId) => {
    dispatch(deleteCardAction({ id: cardId }));
    if (selectedCard?.Id === cardId) setSelectedCard(null);
  };

  const closeCardDetail = () => {
    setSelectedCard(null);
  };

  return {
    currentBoard,
    fetchState,
    deleteCardState,
    deleteListState,
    createListState,
    createCardState,
    updateCardState,
    showAddList,
    setShowAddList,
    addingCardListId,
    setAddingCardListId,
    selectedCard,
    setSelectedCard,
    activeCard,
    setActiveCard,
    activeListId,
    setActiveListId,
    activeDropTarget,
    setActiveDropTarget,
    listForm,
    cardDetailForm,
    handleCreateList,
    handleCreateCard,
    handleUpdateCard,
    handleMoveCard,
    handleMoveCardAt,
    handleReorderLists,
    handleDeleteList,
    handleDeleteCard,
    closeCardDetail,
  };
}
