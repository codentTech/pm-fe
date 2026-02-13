"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  fetchProjectById,
  createList,
  createCard,
  updateCard,
  updateList,
  deleteCard as deleteCardAction,
  deleteList as deleteListAction,
  clearCurrentProject,
  moveCardOptimistic,
  revertCardMove,
  fetchProductBacklog,
  fetchSprintBacklog,
  fetchBugBacklog,
  fetchBlockedBacklog,
} from "@/provider/features/projects/projects.slice";
import {
  fetchSprints,
  createSprint,
  updateSprint,
  deleteSprint,
} from "@/provider/features/sprints/sprints.slice";
import { fetchLabels } from "@/provider/features/labels/labels.slice";
import { fetchMembers } from "@/provider/features/organizations/organizations.slice";
import { getDisplayUser } from "@/common/utils/users.util";
import useProjectSocket from "@/common/hooks/use-project-socket.hook";

export default function useBoardDetail(projectId) {
  useProjectSocket(projectId);
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    currentProject,
    fetchProjectById: fetchState,
    deleteCard: deleteCardState,
    deleteList: deleteListState,
    createList: createListState,
    createCard: createCardState,
    updateCard: updateCardState,
    productBacklog,
    sprintBacklog,
    bugBacklog,
    blockedBacklog,
  } = useSelector((state) => state.projects);
  const {
    sprints,
    fetchSprints: fetchSprintsState,
    createSprint: createSprintState,
    updateSprint: updateSprintState,
    deleteSprintState,
  } = useSelector((state) => state.sprints ?? {});
  const labels = useSelector((state) => state.labels?.labels || []);
  const [showAddList, setShowAddList] = useState(false);
  const [addingCardListId, setAddingCardListId] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [activeCard, setActiveCard] = useState(null);
  const [activeListId, setActiveListId] = useState(null);
  const [activeDropTarget, setActiveDropTarget] = useState(null);
  const [orgMembers, setOrgMembers] = useState([]);
  const [listToDeleteId, setListToDeleteId] = useState(null);
  const [cardToDeleteId, setCardToDeleteId] = useState(null);
  const [activeView, setActiveView] = useState("kanban");
  const [activeBacklogTab, setActiveBacklogTab] = useState("product");
  const [showCreateSprint, setShowCreateSprint] = useState(false);
  const [showEditSprint, setShowEditSprint] = useState(false);
  const [editSprintId, setEditSprintId] = useState("");
  const [showPlanSprint, setShowPlanSprint] = useState(false);
  const [planSprintId, setPlanSprintId] = useState("");
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [selectedSprintIds, setSelectedSprintIds] = useState([]);
  const [bulkAssignLoading, setBulkAssignLoading] = useState(false);
  const [sprintError, setSprintError] = useState("");
  const [selectedSprintId, setSelectedSprintId] = useState("");
  const [currentUserRole, setCurrentUserRole] = useState(null);
  const [sprintToDeleteId, setSprintToDeleteId] = useState(null);

  const listForm = useForm({ defaultValues: { Title: "" } });
  const sprintForm = useForm({
    defaultValues: {
      Name: "",
      StartDate: "",
      EndDate: "",
      Goal: "",
      CapacitySnapshot: {},
    },
  });
  const editSprintForm = useForm({
    defaultValues: {
      Name: "",
      StartDate: "",
      EndDate: "",
      Goal: "",
      CapacitySnapshot: {},
      Status: "planned",
    },
  });
  const cardDetailForm = useForm({
    defaultValues: {
      Title: "",
      Description: "",
      DueDate: "",
      LabelIds: [],
      AssigneeIds: [],
    },
  });

  const orgId = currentProject?.OrganizationId;
  const isReadOnly = currentUserRole === "guest";

  useEffect(() => {
    if (projectId) dispatch(fetchProjectById(projectId));
    return () => dispatch(clearCurrentProject());
  }, [projectId, dispatch]);

  useEffect(() => {
    if (projectId) dispatch(fetchSprints({ projectId }));
  }, [projectId, dispatch]);

  useEffect(() => {
    if (orgId) dispatch(fetchLabels(orgId));
  }, [orgId, dispatch]);

  useEffect(() => {
    if (!orgId) return;
    dispatch(
      fetchMembers({
        orgId,
        successCallBack: (data) => setOrgMembers(data || []),
        errorCallBack: () => setOrgMembers([]),
      })
    );
  }, [orgId, dispatch]);

  useEffect(() => {
    const user = getDisplayUser();
    if (!user?.Id || orgMembers.length === 0) {
      setCurrentUserRole(null);
      return;
    }
    const member = orgMembers.find(
      (m) => m.User?.Id === user.Id || m.UserId === user.Id
    );
    setCurrentUserRole((member?.Role || "").toLowerCase() || null);
  }, [orgMembers]);

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
    if (activeView !== "backlogs" || !projectId) return;
    if (activeBacklogTab === "product") {
      dispatch(fetchProductBacklog({ projectId }));
    }
    if (activeBacklogTab === "sprint" && selectedSprintId) {
      dispatch(fetchSprintBacklog({ projectId, sprintId: selectedSprintId }));
    }
    if (activeBacklogTab === "bugs") {
      dispatch(fetchBugBacklog({ projectId }));
    }
    if (activeBacklogTab === "blocked") {
      dispatch(fetchBlockedBacklog({ projectId }));
    }
  }, [
    activeView,
    activeBacklogTab,
    projectId,
    selectedSprintId,
    dispatch,
  ]);

  useEffect(() => {
    if (selectedCard?.Id && currentProject?.Lists) {
      const card = currentProject.Lists.flatMap((l) => l.Cards || []).find(
        (c) => c.Id === selectedCard.Id
      );
      if (card) setSelectedCard(card);
    }
  }, [currentProject?.Lists, selectedCard?.Id]);

  // functions
  function handleCreateList(values) {
    dispatch(
      createList({
        payload: { Title: values.Title, ProjectId: projectId },
        successCallBack: () => {
          setShowAddList(false);
          listForm.reset();
        },
      })
    );
  }

  function handleCreateSprint(values) {
    if (!projectId) return;
    setSprintError("");
    const capacity =
      values.CapacitySnapshot && Object.keys(values.CapacitySnapshot).length > 0
        ? values.CapacitySnapshot
        : undefined;
    dispatch(
      createSprint({
        payload: {
          ProjectId: projectId,
          Name: values.Name,
          StartDate: values.StartDate,
          EndDate: values.EndDate,
          Goal: values.Goal || undefined,
          CapacitySnapshot: capacity,
        },
        successCallBack: () => {
          setShowCreateSprint(false);
          sprintForm.reset();
          dispatch(fetchSprints({ projectId }));
        },
      })
    );
  }

  function handleUpdateSprint(id, values, onSuccess) {
    if (!id) return;
    setSprintError("");
    const payload = {};
    if (values?.Name !== undefined) payload.Name = values.Name;
    if (values?.StartDate !== undefined) payload.StartDate = values.StartDate;
    if (values?.EndDate !== undefined) payload.EndDate = values.EndDate;
    if (values?.Goal !== undefined) payload.Goal = values.Goal || undefined;
    if (values && Object.prototype.hasOwnProperty.call(values, "CapacitySnapshot")) {
      const hasCapacity =
        values.CapacitySnapshot && Object.keys(values.CapacitySnapshot).length > 0;
      payload.CapacitySnapshot = hasCapacity ? values.CapacitySnapshot : null;
    }
    if (values?.Status !== undefined) payload.Status = values.Status;
    dispatch(
      updateSprint({
        id,
        payload,
        successCallBack: (data) => {
          onSuccess?.(data);
          if (projectId) dispatch(fetchSprints({ projectId }));
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

  function handleAssignSprint(cardId, sprintId) {
    if (!cardId) return;
    dispatch(
      updateCard({
        id: cardId,
        payload: { SprintId: sprintId || null },
        successCallBack: () => {
          if (!projectId) return;
          if (activeBacklogTab === "product") dispatch(fetchProductBacklog({ projectId }));
          if (activeBacklogTab === "sprint" && selectedSprintId) {
            dispatch(fetchSprintBacklog({ projectId, sprintId: selectedSprintId }));
          }
          if (activeBacklogTab === "bugs") dispatch(fetchBugBacklog({ projectId }));
          if (activeBacklogTab === "blocked") dispatch(fetchBlockedBacklog({ projectId }));
        },
      })
    );
  }

  function handleUpdateCardFields(cardId, payload, refetchBacklog = true) {
    if (!cardId) return;
    dispatch(
      updateCard({
        id: cardId,
        payload,
        successCallBack: () => {
          if (!refetchBacklog || !projectId) return;
          if (activeBacklogTab === "product") dispatch(fetchProductBacklog({ projectId }));
          if (activeBacklogTab === "sprint" && selectedSprintId) {
            dispatch(fetchSprintBacklog({ projectId, sprintId: selectedSprintId }));
          }
          if (activeBacklogTab === "bugs") dispatch(fetchBugBacklog({ projectId }));
          if (activeBacklogTab === "blocked") dispatch(fetchBlockedBacklog({ projectId }));
        },
      })
    );
  }

  async function handleBulkAssignToSprint(cardIds, sprintId) {
    if (!cardIds?.length || !sprintId) return;
    setBulkAssignLoading(true);
    await Promise.all(
      cardIds.map((id) =>
        dispatch(updateCard({ id, payload: { SprintId: sprintId } }))
      )
    );
    if (projectId) dispatch(fetchProductBacklog({ projectId }));
    if (projectId) dispatch(fetchSprintBacklog({ projectId, sprintId }));
    setSelectedProductIds([]);
    setBulkAssignLoading(false);
  }

  async function handleBulkRemoveFromSprint(cardIds, sprintId) {
    if (!cardIds?.length || !sprintId) return;
    setBulkAssignLoading(true);
    await Promise.all(
      cardIds.map((id) =>
        dispatch(updateCard({ id, payload: { SprintId: null } }))
      )
    );
    if (projectId) dispatch(fetchSprintBacklog({ projectId, sprintId }));
    if (projectId) dispatch(fetchProductBacklog({ projectId }));
    setSelectedSprintIds([]);
    setBulkAssignLoading(false);
  }

  function openPlanSprint(sprintId) {
    if (!projectId || !sprintId) return;
    setPlanSprintId(sprintId);
    setSelectedProductIds([]);
    setSelectedSprintIds([]);
    setShowPlanSprint(true);
    dispatch(fetchProductBacklog({ projectId }));
    dispatch(fetchSprintBacklog({ projectId, sprintId }));
  }

  function closePlanSprint() {
    setShowPlanSprint(false);
    setPlanSprintId("");
    setSelectedProductIds([]);
    setSelectedSprintIds([]);
  }

  function openEditSprint(sprint) {
    if (!sprint) return;
    setEditSprintId(sprint.Id);
    editSprintForm.reset({
      Name: sprint.Name || "",
      StartDate: sprint.StartDate ? sprint.StartDate.slice(0, 10) : "",
      EndDate: sprint.EndDate ? sprint.EndDate.slice(0, 10) : "",
      Goal: sprint.Goal || "",
      CapacitySnapshot: sprint.CapacitySnapshot || {},
      Status: sprint.Status || "planned",
    });
    setShowEditSprint(true);
  }

  function closeEditSprint() {
    setShowEditSprint(false);
    setEditSprintId("");
    editSprintForm.reset();
  }

  function requestDeleteSprint(sprintId) {
    setSprintToDeleteId(sprintId);
  }

  function confirmDeleteSprint() {
    if (!sprintToDeleteId) return;
    dispatch(
      deleteSprint({
        id: sprintToDeleteId,
        successCallBack: () => {
          if (projectId) dispatch(fetchSprints({ projectId }));
          setSprintToDeleteId(null);
        },
      })
    );
  }

  const handleMoveCardAt = useCallback(
    (cardId, targetListId, targetIndex) => {
      const lists = currentProject?.Lists || [];
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
    [dispatch, currentProject?.Lists]
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
      [...(currentProject?.Lists || [])].sort(
        (a, b) => (a.Position ?? 0) - (b.Position ?? 0),
      ),
    [currentProject?.Lists],
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
    router.push(`/projects/${projectId}/cards/${card.Id}`);
  }

  function closeCardDetail() {
    setSelectedCard(null);
  }

  const refetchProject = useCallback(() => {
    if (projectId) dispatch(fetchProjectById(projectId));
  }, [projectId, dispatch]);

  async function handleAddAttachment(url, fileName) {
    if (!selectedCard?.Id || !orgId) return;
    const res = await attachmentsService.create(
      selectedCard.Id,
      { Type: "link", Url: url, FileName: fileName || null },
      orgId
    );
    if (res?.success) refetchProject();
  }

  async function handleRemoveAttachment(attachmentId) {
    if (!selectedCard?.Id || !orgId) return;
    const res = await attachmentsService.remove(
      selectedCard.Id,
      attachmentId,
      orgId
    );
    if (res?.success) refetchProject();
  }

  async function handleAddComment(content) {
    if (!selectedCard?.Id || !orgId) return;
    const res = await commentsService.create(
      selectedCard.Id,
      { Content: content },
      orgId
    );
    if (res?.success) refetchProject();
  }

  async function handleAddChecklist(title) {
    if (!selectedCard?.Id || !orgId) return;
    const res = await checklistsService.createChecklist(
      selectedCard.Id,
      { Title: title },
      orgId
    );
    if (res?.success) refetchProject();
  }

  async function handleAddChecklistItem(checklistId, title) {
    if (!selectedCard?.Id || !orgId) return;
    const res = await checklistsService.createItem(
      selectedCard.Id,
      checklistId,
      { Title: title },
      orgId
    );
    if (res?.success) refetchProject();
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
    if (res?.success) refetchProject();
  }

  async function handleDeleteChecklist(checklistId) {
    if (!selectedCard?.Id || !orgId) return;
    const res = await checklistsService.deleteChecklist(
      selectedCard.Id,
      checklistId,
      orgId
    );
    if (res?.success) refetchProject();
  }

  async function handleDeleteChecklistItem(checklistId, itemId) {
    if (!selectedCard?.Id || !orgId) return;
    const res = await checklistsService.deleteItem(
      selectedCard.Id,
      checklistId,
      itemId,
      orgId
    );
    if (res?.success) refetchProject();
  }

  return {
    currentProject,
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
    orgMembers,
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
    handleAssignSprint,
    handleUpdateCardFields,
    handleBulkAssignToSprint,
    handleBulkRemoveFromSprint,
    requestDeleteList,
    requestDeleteCard,
    confirmDeleteCard,
    confirmDeleteList,
    handleCardClick,
    activeView,
    setActiveView,
    activeBacklogTab,
    setActiveBacklogTab,
    productBacklog,
    sprintBacklog,
    bugBacklog,
    blockedBacklog,
    sprints,
    fetchSprintsState,
    createSprintState,
    updateSprintState,
    deleteSprintState,
    showCreateSprint,
    setShowCreateSprint,
    showEditSprint,
    setShowEditSprint,
    showPlanSprint,
    sprintForm,
    editSprintForm,
    handleCreateSprint,
    handleUpdateSprint,
    openPlanSprint,
    closePlanSprint,
    openEditSprint,
    closeEditSprint,
    editSprintId,
    requestDeleteSprint,
    confirmDeleteSprint,
    sprintError,
    selectedSprintId,
    setSelectedSprintId,
    planSprintId,
    selectedProductIds,
    setSelectedProductIds,
    selectedSprintIds,
    setSelectedSprintIds,
    bulkAssignLoading,
    currentUserRole,
    isReadOnly,
    sprintToDeleteId,
    setSprintToDeleteId,
    setSprintToDeleteId,
  };
}
