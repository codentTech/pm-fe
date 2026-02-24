"use client";

import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  fetchProjectById,
  updateCard,
  deleteCard as deleteCardAction,
} from "@/provider/features/projects/projects.slice";
import { fetchLabels } from "@/provider/features/labels/labels.slice";
import { fetchMembers } from "@/provider/features/organizations/organizations.slice";
import { getDisplayUser } from "@/common/utils/users.util";
import attachmentsService from "@/provider/features/attachments/attachments.service";
import commentsService from "@/provider/features/comments/comments.service";
import checklistsService from "@/provider/features/checklists/checklists.service";

export default function useCardDetail(projectId, cardId) {
  const dispatch = useDispatch();
  const router = useRouter();
  const {
    currentProject,
    fetchProjectById: fetchState,
    deleteCard: deleteCardState,
    updateCard: updateCardState,
  } = useSelector((state) => state.projects);
  const labels = useSelector((state) => state.labels?.labels || []);
  const [orgMembers, setOrgMembers] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState(null);

  const handleCopyLink = useCallback(async () => {
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/projects/${projectId}/cards/${cardId}`
        : "";
    try {
      await navigator.clipboard.writeText(url);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    }
  }, [projectId, cardId]);

  const cardDetailForm = useForm({
    defaultValues: {
      Title: "",
      Description: "",
      DueDate: "",
      LabelIds: [],
      AssigneeIds: [],
      TicketType: "task",
      Priority: "p2",
      Status: "backlog",
      ReporterId: "",
      EstimateHours: "",
      AcceptanceCriteria: "",
      BlockedReason: "",
      Severity: "",
      ValidationNotes: "",
      StatusReason: "",
    },
  });

  const lists = [...(currentProject?.Lists || [])].sort(
    (a, b) => (a.Position ?? 0) - (b.Position ?? 0),
  );
  const card = cardId
    ? lists.flatMap((l) => l.Cards || []).find((c) => c.Id === cardId)
    : null;
  const orgId = currentProject?.OrganizationId;

  useEffect(() => {
    if (projectId) dispatch(fetchProjectById(projectId));
  }, [projectId, dispatch]);

  useEffect(() => {
    if (orgId) dispatch(fetchLabels(orgId));
  }, [orgId, dispatch]);

  useEffect(() => {
    if (card?.Id && orgId) {
      dispatch(
        fetchMembers({
          orgId,
          successCallBack: (data) => setOrgMembers(data || []),
          errorCallBack: () => setOrgMembers([]),
        }),
      );
    } else {
      setOrgMembers([]);
    }
  }, [card?.Id, orgId, dispatch]);

  useEffect(() => {
    const user = getDisplayUser();
    if (!user?.Id || orgMembers.length === 0) {
      setCurrentUserRole(null);
      return;
    }
    const member = orgMembers.find(
      (m) => m.User?.Id === user.Id || m.UserId === user.Id
    );
    setCurrentUserRole((member?.Role ?? "").toString().toLowerCase() || null);
  }, [orgMembers]);

  useEffect(() => {
    if (card) {
      cardDetailForm.reset({
        Title: card.Title || "",
        Description: card.Description || "",
        DueDate: card.DueDate ? card.DueDate.slice(0, 10) : "",
        LabelIds: (card.CardLabels || []).map((cl) => cl.LabelId),
        AssigneeIds: (card.CardAssignees || []).map((ca) => ca.UserId),
        TicketType: card.TicketType || "task",
        Priority: card.Priority || "p2",
        Status: card.Status || "backlog",
        ReporterId: card.ReporterId || "",
        EstimateHours:
          card.EstimateHours != null ? String(card.EstimateHours) : "",
        AcceptanceCriteria: card.AcceptanceCriteria || "",
        BlockedReason: card.BlockedReason || "",
        Severity: card.Severity || "",
        ValidationNotes: card.ValidationNotes || "",
        StatusReason: "",
      });
    }
  }, [card?.Id]);

  function refetchProject() {
    if (projectId) dispatch(fetchProjectById(projectId));
  }

  const projectStatusKey = (currentProject?.Status || "").toLowerCase();
  const isProjectReadOnly =
    projectStatusKey === "paused" || projectStatusKey === "closed";
  const isReadOnly = currentUserRole === "guest" || isProjectReadOnly;

  function handleUpdateCard(values) {
    if (!card) return;
    dispatch(
      updateCard({
        id: card.Id,
        payload: {
          Title: values.Title,
          Description: values.Description || undefined,
          DueDate: values.DueDate || undefined,
          LabelIds: values.LabelIds,
          AssigneeIds: values.AssigneeIds,
          TicketType: values.TicketType || undefined,
          Priority: values.Priority || undefined,
          Status: values.Status || undefined,
          ReporterId: values.ReporterId || undefined,
          EstimateHours:
            values.EstimateHours !== "" ? Number(values.EstimateHours) : undefined,
          AcceptanceCriteria: values.AcceptanceCriteria || undefined,
          BlockedReason: values.BlockedReason || undefined,
          Severity: values.Severity || undefined,
          ValidationNotes: values.ValidationNotes || undefined,
          StatusReason: values.StatusReason?.trim() || undefined,
        },
        successCallBack: refetchProject,
      }),
    );
  }

  function handleMoveCard(targetListId) {
    if (!card || card.ListId === targetListId) return;
    dispatch(
      updateCard({
        id: card.Id,
        payload: { ListId: targetListId },
        successCallBack: refetchProject,
      }),
    );
  }

  function handleDeleteCard() {
    if (!card) return;
    dispatch(
      deleteCardAction({
        id: card.Id,
        successCallBack: () => router.push(`/projects/${projectId}`),
      }),
    );
  }

  async function handleAddAttachment(file) {
    if (!card?.Id || !orgId || !file) return;
    const res = await attachmentsService.upload(card.Id, file, orgId);
    if (res?.success) refetchProject();
  }

  async function handleRemoveAttachment(attachmentId) {
    if (!card?.Id || !orgId) return;
    const res = await attachmentsService.remove(card.Id, attachmentId, orgId);
    if (res?.success) refetchProject();
  }

  async function handleAddComment(content, parentId = null) {
    if (!card?.Id || !orgId) return;
    const payload = { Content: content };
    if (parentId) payload.ParentId = parentId;
    const res = await commentsService.create(card.Id, payload, orgId);
    if (res?.success) refetchProject();
  }

  async function handleAddChecklist(title) {
    if (!card?.Id || !orgId) return;
    const res = await checklistsService.createChecklist(
      card.Id,
      { Title: title },
      orgId,
    );
    if (res?.success) refetchProject();
  }

  async function handleAddChecklistItem(checklistId, title) {
    if (!card?.Id || !orgId) return;
    const res = await checklistsService.createItem(
      card.Id,
      checklistId,
      { Title: title },
      orgId,
    );
    if (res?.success) refetchProject();
  }

  async function handleToggleChecklistItem(checklistId, itemId, isCompleted) {
    if (!card?.Id || !orgId) return;
    const res = await checklistsService.updateItem(
      card.Id,
      checklistId,
      itemId,
      { IsCompleted: isCompleted },
      orgId,
    );
    if (res?.success) refetchProject();
  }

  async function handleDeleteChecklist(checklistId) {
    if (!card?.Id || !orgId) return;
    const res = await checklistsService.deleteChecklist(
      card.Id,
      checklistId,
      orgId,
    );
    if (res?.success) refetchProject();
  }

  async function handleDeleteChecklistItem(checklistId, itemId) {
    if (!card?.Id || !orgId) return;
    const res = await checklistsService.deleteItem(
      card.Id,
      checklistId,
      itemId,
      orgId,
    );
    if (res?.success) refetchProject();
  }

  return {
    card,
    currentProject,
    lists,
    labels,
    orgMembers,
    loading: fetchState?.isLoading,
    deleteCardState,
    updateCardState,
    cardDetailForm,
    showDeleteConfirm,
    setShowDeleteConfirm,
    linkCopied,
    handleCopyLink,
    currentUserRole,
    isReadOnly,
    isProjectReadOnly,
    handleUpdateCard,
    handleMoveCard,
    handleDeleteCard,
    handleAddAttachment,
    handleRemoveAttachment,
    handleAddComment,
    handleAddChecklist,
    handleAddChecklistItem,
    handleToggleChecklistItem,
    handleDeleteChecklist,
    handleDeleteChecklistItem,
  };
}
