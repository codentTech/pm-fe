"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import {
  fetchBids,
  fetchDraftBacklog,
  fetchFollowUpBacklog,
  fetchInterviewBacklog,
  fetchReviewBacklog,
  fetchGhostedSuggestions,
  fetchBidMetrics,
  createBid,
  updateBid,
  deleteBid,
  transitionBidStatus,
  bulkDeleteBids,
} from "@/provider/features/bids/bids.slice";
import {
  BID_PLATFORM_OPTIONS,
  BID_STATUS_LABELS,
  BID_VALID_TRANSITIONS,
} from "@/common/constants/bid.constant";

const defaultBidValues = {
  Platform: "upwork",
  JobUrlOrReference: "",
  ClientDisplayName: "",
  BidTitle: "",
  ClientBudget: "",
  ProposedPrice: "",
  Currency: "USD",
  EstimatedEffort: "",
  SkillsTags: "",
  SubmissionDate: new Date().toISOString().slice(0, 10),
  Probability: "",
  CompetitorNotes: "",
  RiskFlags: "",
  InternalComments: "",
  InterviewDate: "",
  InterviewOutcome: "",
};

export default function useBidTracker() {
  // stats
  const dispatch = useDispatch();
  const {
    bids,
    fetchBids: fetchState,
    fetchDraftBacklog: draftBacklogState,
    fetchFollowUpBacklog: followUpBacklogState,
    fetchInterviewBacklog: interviewBacklogState,
    fetchReviewBacklog: reviewBacklogState,
    fetchGhostedSuggestions: ghostedSuggestionsState,
    fetchBidMetrics: bidMetricsState,
    createBid: createBidState,
    updateBid: updateBidState,
    deleteBid: deleteBidState,
    transitionBidStatus: transitionBidStatusState,
    bulkDeleteBids: bulkDeleteBidsState,
  } = useSelector((state) => state?.bids ?? {});
  const currentOrganizationId = useSelector(
    (state) => state.organizations?.currentOrganizationId,
  );
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingBid, setEditingBid] = useState(null);
  const [bidToDeleteId, setBidToDeleteId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [activeView, setActiveView] = useState("all");
  const [statusModalBid, setStatusModalBid] = useState(null);
  const [statusForm, setStatusForm] = useState({
    Status: "",
    LossReason: "",
    LossReasonOther: "",
    WithdrawalReason: "",
    FinalAgreedPrice: "",
    ExpectedStartDate: "",
    FinalScopeNotes: "",
    InterviewDate: "",
    InterviewOutcome: "",
  });
  const [statusError, setStatusError] = useState("");

  const createForm = useForm({ defaultValues: defaultBidValues });
  const editForm = useForm({ defaultValues: defaultBidValues });
  const router = useRouter();

  const loadingByView = {
    all: fetchState?.isLoading,
    draft: draftBacklogState?.isLoading,
    "follow-up": followUpBacklogState?.isLoading,
    interview: interviewBacklogState?.isLoading,
    review: reviewBacklogState?.isLoading,
    ghosted: ghostedSuggestionsState?.isLoading,
  };
  const loading = loadingByView[activeView] ?? fetchState?.isLoading;

  // useEffect
  useEffect(() => {
    if (currentOrganizationId !== undefined) {
      dispatch(fetchBids({}));
      dispatch(fetchBidMetrics());
    }
  }, [dispatch, currentOrganizationId]);

  useEffect(() => {
    if (currentOrganizationId === undefined) return;
    if (activeView === "all") {
      dispatch(fetchBids({}));
      return;
    }
    if (activeView === "draft") dispatch(fetchDraftBacklog());
    if (activeView === "follow-up") dispatch(fetchFollowUpBacklog());
    if (activeView === "interview") dispatch(fetchInterviewBacklog());
    if (activeView === "review") dispatch(fetchReviewBacklog());
    if (activeView === "ghosted") dispatch(fetchGhostedSuggestions());
  }, [dispatch, currentOrganizationId, activeView]);

  // Clear selection when bids data changes (e.g., pagination, filter, sort)
  useEffect(() => {
    setSelectedIds([]);
  }, [bids, activeView]);

  useEffect(() => {
    if (transitionBidStatusState?.isError) {
      setStatusError(
        transitionBidStatusState?.message || "Failed to update bid status",
      );
    }
  }, [transitionBidStatusState?.isError, transitionBidStatusState?.message]);

  const backlogItemsByView = {
    draft: draftBacklogState?.data?.items ?? [],
    "follow-up": followUpBacklogState?.data?.items ?? [],
    interview: interviewBacklogState?.data?.items ?? [],
    review: reviewBacklogState?.data?.items ?? [],
    ghosted: ghostedSuggestionsState?.data?.items ?? [],
  };

  const visibleBids =
    activeView === "all"
      ? bids
      : backlogItemsByView[activeView] || [];
  const tableData = (visibleBids ?? []).map((bid) => ({ ...bid, id: bid.Id }));
  const bidToDelete = visibleBids?.find((b) => b.Id === bidToDeleteId);

  const views = [
    { key: "all", label: "All bids" },
    { key: "draft", label: "Draft backlog" },
    { key: "follow-up", label: "Follow-up backlog" },
    { key: "interview", label: "Interview backlog" },
    { key: "review", label: "Review backlog" },
    { key: "ghosted", label: "Ghosted suggestions" },
  ];

  const metrics = bidMetricsState?.data || {};
  const winRatePct =
    typeof metrics.winRate === "number"
      ? `${Math.round(metrics.winRate * 100)}%`
      : "—";
  const avgDraftAgeDaysDisplay =
    typeof metrics.avgDraftAgeDays === "number"
      ? metrics.avgDraftAgeDays.toFixed(2)
      : "—";

  // functions
  function handleCreate(values, options = {}) {
    const payload = {
      Platform: values.Platform,
      JobUrlOrReference: values.JobUrlOrReference?.trim(),
      ClientDisplayName: values.ClientDisplayName?.trim(),
      BidTitle: values.BidTitle?.trim(),
      ClientBudget: values.ClientBudget?.trim() || undefined,
      ProposedPrice: Number(values.ProposedPrice) || 0,
      Currency: values.Currency || "USD",
      EstimatedEffort: Number(values.EstimatedEffort) || 0,
      SkillsTags: values.SkillsTags?.trim()
        ? values.SkillsTags.split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
      SubmissionDate: values.SubmissionDate,
      Probability: values.Probability ? Number(values.Probability) : undefined,
      CompetitorNotes: values.CompetitorNotes?.trim() || undefined,
      RiskFlags: values.RiskFlags?.trim() || undefined,
      InternalComments: values.InternalComments?.trim() || undefined,
      InterviewDate: values.InterviewDate || undefined,
      InterviewOutcome: values.InterviewOutcome?.trim() || undefined,
    };
    dispatch(
      createBid({
        payload,
        successCallBack: () => {
          setShowCreateModal(false);
          createForm.reset(defaultBidValues);
          options?.onSuccess?.();
        },
      }),
    );
  }

  function handleUpdate(values) {
    if (!editingBid) return;
    const payload = {
      Platform: values.Platform,
      JobUrlOrReference: values.JobUrlOrReference?.trim(),
      ClientDisplayName: values.ClientDisplayName?.trim(),
      BidTitle: values.BidTitle?.trim(),
      ClientBudget: values.ClientBudget?.trim() || undefined,
      ProposedPrice: Number(values.ProposedPrice) || 0,
      Currency: values.Currency || "USD",
      EstimatedEffort: Number(values.EstimatedEffort) || 0,
      SkillsTags: values.SkillsTags?.trim()
        ? values.SkillsTags.split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
      SubmissionDate: values.SubmissionDate,
      Probability: values.Probability ? Number(values.Probability) : undefined,
      CompetitorNotes: values.CompetitorNotes?.trim() || undefined,
      RiskFlags: values.RiskFlags?.trim() || undefined,
      InternalComments: values.InternalComments?.trim() || undefined,
      InterviewDate: values.InterviewDate || undefined,
      InterviewOutcome: values.InterviewOutcome?.trim() || undefined,
    };
    dispatch(
      updateBid({
        id: editingBid.Id,
        payload,
        successCallBack: () => setEditingBid(null),
      }),
    );
  }

  function requestDeleteBid(id) {
    setBidToDeleteId(id);
  }

  function confirmDeleteBid() {
    if (!bidToDeleteId) return;
    dispatch(
      deleteBid({
        id: bidToDeleteId,
        successCallBack: () => setBidToDeleteId(null),
      }),
    );
  }

  function requestBulkDelete() {
    if (selectedIds.length === 0) return;
    setShowBulkDeleteModal(true);
  }

  function confirmBulkDelete() {
    if (selectedIds.length === 0) return;
    dispatch(
      bulkDeleteBids({
        ids: selectedIds,
        successCallBack: () => {
          setSelectedIds([]);
          setShowBulkDeleteModal(false);
          dispatch(fetchBids({}));
        },
      }),
    );
  }

  function confirmStatusTransition(id, payload, successCallBack) {
    if (!id) return;
    dispatch(
      transitionBidStatus({
        id,
        payload,
        successCallBack,
      }),
    );
    dispatch(fetchBids({}));
    dispatch(fetchBidMetrics());
  }

  const handleActionClick = (actionKey, row) => {
    if (actionKey === "view") {
      router.push(`/bids/${row.Id}`);
      return;
    }
    if (actionKey === "edit") openEdit(row);
    if (actionKey === "delete") requestDeleteBid(row.Id);
  };

  const handleStatusChange = (key, value) => {
    setStatusForm((prev) => ({ ...prev, [key]: value }));
  };

  const submitStatusTransition = () => {
    if (!statusModalBid) return;
    const payload = {
      Status: statusForm.Status,
      LossReason: statusForm.LossReason || undefined,
      LossReasonOther: statusForm.LossReasonOther?.trim() || undefined,
      WithdrawalReason: statusForm.WithdrawalReason || undefined,
      FinalAgreedPrice:
        statusForm.FinalAgreedPrice !== ""
          ? Number(statusForm.FinalAgreedPrice)
          : undefined,
      ExpectedStartDate: statusForm.ExpectedStartDate || undefined,
      FinalScopeNotes: statusForm.FinalScopeNotes?.trim() || undefined,
      InterviewDate: statusForm.InterviewDate || undefined,
      InterviewOutcome: statusForm.InterviewOutcome?.trim() || undefined,
    };
    setStatusError("");
    confirmStatusTransition(statusModalBid.Id, payload, () => {
      setStatusModalBid(null);
      setStatusError("");
    });
  };

  const getStatusOptions = (row) => {
    const allowed = BID_VALID_TRANSITIONS[row.CurrentStatus] || [];
    const values = [
      row.CurrentStatus,
      ...allowed.filter((v) => v !== row.CurrentStatus),
    ];
    return values.map((value) => ({
      value,
      label: BID_STATUS_LABELS[value] || value,
    }));
  };

  const handleStatusSelect = (row, newStatus) => {
    if (!newStatus || newStatus === row.CurrentStatus) return;
    const requiresDetails =
      newStatus === "interview" ||
      newStatus === "lost" ||
      newStatus === "withdrawn" ||
      newStatus === "won" ||
      (row.CurrentStatus === "interview" &&
        ["won", "lost", "ghosted", "withdrawn"].includes(newStatus));
    if (requiresDetails) {
      setStatusForm({
        Status: newStatus,
        LossReason: "",
        LossReasonOther: "",
        WithdrawalReason: "",
        FinalAgreedPrice: "",
        ExpectedStartDate: "",
        FinalScopeNotes: "",
        InterviewDate: "",
        InterviewOutcome: row.InterviewOutcome || "",
      });
      setStatusError("");
      setStatusModalBid(row);
      return;
    }
    confirmStatusTransition(row.Id, { Status: newStatus }, () => {});
  };

  function handleSelectionChange(newSelectedIds) {
    setSelectedIds(newSelectedIds);
  }

  function openEdit(bid) {
    setEditingBid(bid);
    editForm.reset({
      Platform: bid.Platform || "upwork",
      JobUrlOrReference: bid.JobUrlOrReference || "",
      ClientDisplayName: bid.ClientDisplayName || "",
      BidTitle: bid.BidTitle || "",
      ClientBudget: bid.ClientBudget || "",
      ProposedPrice: bid.ProposedPrice ?? "",
      Currency: bid.Currency || "USD",
      EstimatedEffort: bid.EstimatedEffort ?? "",
      SkillsTags: Array.isArray(bid.SkillsTags)
        ? bid.SkillsTags.join(", ")
        : "",
      SubmissionDate: bid.SubmissionDate ? bid.SubmissionDate.slice(0, 10) : "",
      Probability: bid.Probability ?? "",
      CompetitorNotes: bid.CompetitorNotes || "",
      RiskFlags: bid.RiskFlags || "",
      InternalComments: bid.InternalComments || "",
      InterviewDate: bid.InterviewDate ? bid.InterviewDate.slice(0, 10) : "",
      InterviewOutcome: bid.InterviewOutcome || "",
    });
  }

  return {
    bids: visibleBids,
    loading,
    activeView,
    setActiveView,
    bidMetricsState,
    showCreateModal,
    setShowCreateModal,
    editingBid,
    setEditingBid,
    createForm,
    editForm,
    handleCreate,
    handleUpdate,
    requestDeleteBid,
    confirmDeleteBid,
    bidToDeleteId,
    setBidToDeleteId,
    deleteBidState,
    transitionBidStatusState,
    createBidState,
    updateBidState,
    openEdit,
    BID_PLATFORM_OPTIONS,
    selectedIds,
    handleSelectionChange,
    requestBulkDelete,
    confirmBulkDelete,
    showBulkDeleteModal,
    setShowBulkDeleteModal,
    bulkDeleteBidsState,
    confirmStatusTransition,
    tableData,
    bidToDelete,
    statusModalBid,
    setStatusModalBid,
    statusForm,
    statusError,
    views,
    metrics,
    winRatePct,
    avgDraftAgeDaysDisplay,
    handleActionClick,
    handleStatusChange,
    submitStatusTransition,
    getStatusOptions,
    handleStatusSelect,
  };
}
