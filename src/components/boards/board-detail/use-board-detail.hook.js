"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
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
import { fetchLabels } from "@/provider/features/labels/labels.slice";
import { fetchMembers } from "@/provider/features/organizations/organizations.slice";
import useBoardSocket from "@/common/hooks/use-board-socket.hook";

export default function useBoardDetail(boardId) {
  useBoardSocket(boardId);
  const router = useRouter();
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
  const labels = useSelector((state) => state.labels?.labels || []);
  const [showAddList, setShowAddList] = useState(false);
  const [addingCardListId, setAddingCardListId] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [activeCard, setActiveCard] = useState(null);
  const [activeListId, setActiveListId] = useState(null);
  const [activeDropTarget, setActiveDropTarget] = useState(null);
  const [orgMembers, setOrgMembers] = useState([]);

  const listForm = useForm({ defaultValues: { Title: "" } });
  const cardDetailForm = useForm({
    defaultValues: {
      Title: "",
      Description: "",
      DueDate: "",
      LabelIds: [],
      AssigneeIds: [],
    },
  });

  const orgId = currentBoard?.OrganizationId;

  useEffect(() => {
    if (boardId) dispatch(fetchBoardById(boardId));
    return () => dispatch(clearCurrentBoard());
  }, [boardId, dispatch]);

  useEffect(() => {
    if (orgId) dispatch(fetchLabels(orgId));
  }, [orgId, dispatch]);

  useEffect(() => {
    if (selectedCard) {
      cardDetailForm.reset({
        Title: selectedCard.Title || "",
        Description: selectedCard.Description || "",
        DueDate: selectedCard.DueDate ? selectedCard.DueDate.slice(0, 10) : "",
        LabelIds: (selectedCard.CardLabels || []).map((cl) => cl.LabelId),
        AssigneeIds: (selectedCard.CardAssignees || []).map((ca) => ca.UserId),
      });
    }
  }, [selectedCard]);

  useEffect(() => {
    if (selectedCard?.Id && orgId) {
      dispatch(
        fetchMembers({
          orgId,
          successCallBack: (data) => setOrgMembers(data || []),
          errorCallBack: () => setOrgMembers([]),
        })
      );
    } else {
      setOrgMembers([]);
    }
  }, [selectedCard?.Id, orgId, dispatch]);

  useEffect(() => {
    if (selectedCard?.Id && currentBoard?.Lists) {
      const card = currentBoard.Lists.flatMap((l) => l.Cards || []).find(
        (c) => c.Id === selectedCard.Id
      );
      if (card) setSelectedCard(card);
    }
  }, [currentBoard?.Lists, selectedCard?.Id]);

  // functions
  function handleCreateList(values) {
    dispatch(
      createList({
        payload: { Title: values.Title, BoardId: boardId },
        successCallBack: () => {
          setShowAddList(false);
          listForm.reset();
        },
      })
    );
  }

  function handleCreateCard(listId, payload) {
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
  }

  function handleMoveCard(cardId, targetListId) {
    dispatch(updateCard({ id: cardId, payload: { ListId: targetListId } }));
  }

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

      dispatch(
        updateCard({
          id: cardId,
          payload: { ListId: targetListId, Position: targetIndex },
          errorCallBack: () => {
            dispatch(
              revertCardMove({
                cardId,
                sourceListId,
                sourceIndex,
                targetListId,
              })
            );
          },
        })
      );
    },
    [dispatch, currentBoard?.Lists]
  );

  const handleReorderLists = useCallback(
    (orderedListIds) => {
      orderedListIds.forEach((listId, index) => {
        dispatch(updateList({ id: listId, payload: { Position: index } }));
      });
    },
    [dispatch]
  );

  function handleDeleteList(listId) {
    dispatch(deleteListAction({ id: listId }));
  }

  function handleDeleteCard(cardId) {
    dispatch(deleteCardAction({ id: cardId }));
    if (selectedCard?.Id === cardId) setSelectedCard(null);
  }

  const lists = useMemo(
    () =>
      [...(currentBoard?.Lists || [])].sort(
        (a, b) => (a.Position ?? 0) - (b.Position ?? 0),
      ),
    [currentBoard?.Lists],
  );
  const listIds = useMemo(() => lists.map((l) => l.Id), [lists]);

  function requestDeleteList(listId) {
    setListToDeleteId(listId);
  }

  function requestDeleteCard(cardId) {
    setCardToDeleteId(cardId);
  }

  function confirmDeleteCard() {
    if (cardToDeleteId) {
      handleDeleteCard(cardToDeleteId);
      setCardToDeleteId(null);
    }
  }

  function confirmDeleteList() {
    if (listToDeleteId) {
      handleDeleteList(listToDeleteId);
      setListToDeleteId(null);
    }
  }

  function handleCardClick(card) {
    router.push(`/projects/${boardId}/cards/${card.Id}`);
  }

  function closeCardDetail() {
    setSelectedCard(null);
  }

  const refetchBoard = useCallback(() => {
    if (boardId) dispatch(fetchBoardById(boardId));
  }, [boardId, dispatch]);

  async function handleAddAttachment(url, fileName) {
    if (!selectedCard?.Id || !orgId) return;
    const res = await attachmentsService.create(
      selectedCard.Id,
      { Type: "link", Url: url, FileName: fileName || null },
      orgId
    );
    if (res?.success) refetchBoard();
  }

  async function handleRemoveAttachment(attachmentId) {
    if (!selectedCard?.Id || !orgId) return;
    const res = await attachmentsService.remove(
      selectedCard.Id,
      attachmentId,
      orgId
    );
    if (res?.success) refetchBoard();
  }

  async function handleAddComment(content) {
    if (!selectedCard?.Id || !orgId) return;
    const res = await commentsService.create(
      selectedCard.Id,
      { Content: content },
      orgId
    );
    if (res?.success) refetchBoard();
  }

  async function handleAddChecklist(title) {
    if (!selectedCard?.Id || !orgId) return;
    const res = await checklistsService.createChecklist(
      selectedCard.Id,
      { Title: title },
      orgId
    );
    if (res?.success) refetchBoard();
  }

  async function handleAddChecklistItem(checklistId, title) {
    if (!selectedCard?.Id || !orgId) return;
    const res = await checklistsService.createItem(
      selectedCard.Id,
      checklistId,
      { Title: title },
      orgId
    );
    if (res?.success) refetchBoard();
  }

  async function handleToggleChecklistItem(checklistId, itemId, isCompleted) {
    if (!selectedCard?.Id || !orgId) return;
    const res = await checklistsService.updateItem(
      selectedCard.Id,
      checklistId,
      itemId,
      { IsCompleted: isCompleted },
      orgId
    );
    if (res?.success) refetchBoard();
  }

  async function handleDeleteChecklist(checklistId) {
    if (!selectedCard?.Id || !orgId) return;
    const res = await checklistsService.deleteChecklist(
      selectedCard.Id,
      checklistId,
      orgId
    );
    if (res?.success) refetchBoard();
  }

  async function handleDeleteChecklistItem(checklistId, itemId) {
    if (!selectedCard?.Id || !orgId) return;
    const res = await checklistsService.deleteItem(
      selectedCard.Id,
      checklistId,
      itemId,
      orgId
    );
    if (res?.success) refetchBoard();
  }

  return {
    currentBoard,
    fetchState,
    deleteCardState,
    deleteListState,
    createListState,
    createCardState,
    showAddList,
    setShowAddList,
    addingCardListId,
    setAddingCardListId,
    activeCard,
    setActiveCard,
    activeListId,
    setActiveListId,
    activeDropTarget,
    setActiveDropTarget,
    listForm,
    lists,
    listIds,
    listToDeleteId,
    setListToDeleteId,
    cardToDeleteId,
    setCardToDeleteId,
    handleCreateList,
    handleCreateCard,
    handleMoveCard,
    handleMoveCardAt,
    handleReorderLists,
    handleDeleteList,
    handleDeleteCard,
    requestDeleteList,
    requestDeleteCard,
    confirmDeleteCard,
    confirmDeleteList,
    handleCardClick,
  };
}
