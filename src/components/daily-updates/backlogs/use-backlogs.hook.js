"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
  fetchBlockerBacklog,
  fetchMissingUpdateBacklog,
  fetchOffPlanBacklog,
} from "@/provider/features/daily-updates/daily-updates.slice";
import { formatDate } from "@/common/utils/date.util";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import useDailyUpdatesOrg from "../../../common/hooks/use-daily-updates-org.hook";

const defaultDate = () => new Date().toISOString().slice(0, 10);

export default function useDailyUpdatesBacklogs() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { userMap, memberOptions, roleOptions, statusOptions, showUserFilter } =
    useDailyUpdatesOrg();

  const { missingUpdateBacklog, blockerBacklog, offPlanBacklog } = useSelector(
    (state) => state.dailyUpdates || {},
  );
  const currentOrganizationId = useSelector(
    (state) => state.organizations?.currentOrganizationId,
  );

  const [activeBacklogTab, setActiveBacklogTab] = useState("missing");
  const [selectedFromDate, setSelectedFromDate] = useState(defaultDate);
  const [selectedToDate, setSelectedToDate] = useState(defaultDate);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [backlogPage, setBacklogPage] = useState(1);
  const [backlogLimit, setBacklogLimit] = useState(20);

  const handleViewUpdate = useCallback(
    (updateId) => {
      if (!updateId) return;
      router.push(`/daily-updates/${updateId}`);
    },
    [router],
  );

  useEffect(() => {
    if (currentOrganizationId === undefined) return;
    const from = selectedFromDate;
    const to = selectedToDate;
    if (activeBacklogTab === "missing") {
      dispatch(
        fetchMissingUpdateBacklog({
          params: {
            date: selectedFromDate,
            page: backlogPage,
            limit: backlogLimit,
          },
        }),
      );
    }
    if (activeBacklogTab === "blockers") {
      dispatch(
        fetchBlockerBacklog({
          params: { from, to, page: backlogPage, limit: backlogLimit },
        }),
      );
    }
    if (activeBacklogTab === "off_plan") {
      dispatch(
        fetchOffPlanBacklog({
          params: { from, to, page: backlogPage, limit: backlogLimit },
        }),
      );
    }
  }, [
    currentOrganizationId,
    activeBacklogTab,
    selectedFromDate,
    selectedToDate,
    backlogPage,
    backlogLimit,
    dispatch,
  ]);

  useEffect(() => {
    setBacklogPage(1);
  }, [activeBacklogTab, selectedFromDate, selectedToDate]);

  const backlogData =
    activeBacklogTab === "missing"
      ? (missingUpdateBacklog?.data?.items ?? missingUpdateBacklog?.data ?? [])
      : activeBacklogTab === "blockers"
        ? (blockerBacklog?.data?.items ?? blockerBacklog?.data ?? [])
        : (offPlanBacklog?.data?.items ?? offPlanBacklog?.data ?? []);

  const backlogLoading =
    activeBacklogTab === "missing"
      ? missingUpdateBacklog?.isLoading
      : activeBacklogTab === "blockers"
        ? blockerBacklog?.isLoading
        : offPlanBacklog?.isLoading;

  const backlogTotal =
    activeBacklogTab === "missing"
      ? (missingUpdateBacklog?.data?.total ?? backlogData.length)
      : activeBacklogTab === "blockers"
        ? (blockerBacklog?.data?.total ?? backlogData.length)
        : (offPlanBacklog?.data?.total ?? backlogData.length);

  const backlogColumns = useMemo(() => {
    const base = [
      {
        key: "UserId",
        title: "User",
        sortable: false,
        customRender: (row) => (
          <span className="text-sm text-neutral-700">
            {userMap.get(row.UserId || row.User?.Id) || "—"}
          </span>
        ),
      },
      {
        key: "Date",
        title: "Date",
        sortable: false,
        customRender: (row) => (
          <span className="text-sm text-neutral-600">
            {formatDate(row.Date || row.MissedDate)}
          </span>
        ),
      },
      {
        key: "Details",
        title: "Details",
        sortable: false,
        customRender: (row) => (
          <span className="text-sm text-neutral-600">
            {row.Details || row.Reason || "—"}
          </span>
        ),
      },
    ];
    if (activeBacklogTab === "blockers") {
      base.splice(2, 0, {
        key: "BlockerType",
        title: "Blocker type",
        sortable: false,
        customRender: (row) => (
          <span className="text-sm text-neutral-600">
            {row.BlockerType || "—"}
          </span>
        ),
      });
      base.splice(3, 0, {
        key: "ExpectedResolutionDate",
        title: "Resolution",
        sortable: false,
        customRender: (row) => (
          <span className="text-sm text-neutral-600">
            {row.ExpectedResolutionDate
              ? formatDate(row.ExpectedResolutionDate)
              : "—"}
          </span>
        ),
      });
    }
    base.push({
      key: "Actions",
      title: "",
      sortable: false,
      customRender: (row) =>
        row.DailyUpdateId ? (
          <CustomButton
            text="View"
            variant="ghost"
            size="sm"
            onClick={() => handleViewUpdate(row.DailyUpdateId)}
          />
        ) : null,
    });
    return base;
  }, [activeBacklogTab, handleViewUpdate, userMap]);

  const handleBacklogPageChange = useCallback((page) => {
    setBacklogPage(page);
  }, []);

  const handleBacklogPageSizeChange = useCallback((size) => {
    setBacklogLimit(size);
    setBacklogPage(1);
  }, []);

  const defaultDateStr = useMemo(() => defaultDate(), []);
  const hasActiveFilters = Boolean(
    selectedUserId ||
    selectedRole ||
    selectedStatus ||
    selectedFromDate !== defaultDateStr ||
    selectedToDate !== defaultDateStr,
  );

  const handleClearFilters = useCallback(() => {
    setSelectedFromDate(defaultDateStr);
    setSelectedToDate(defaultDateStr);
    setSelectedUserId("");
    setSelectedRole("");
    setSelectedStatus("");
  }, [
    defaultDateStr,
    setSelectedFromDate,
    setSelectedToDate,
    setSelectedUserId,
    setSelectedRole,
    setSelectedStatus,
  ]);

  const [showFilters, setShowFilters] = useState(false);

  return {
    activeBacklogTab,
    setActiveBacklogTab,
    backlogColumns,
    backlogData,
    backlogLoading,
    backlogPage,
    backlogLimit,
    backlogTotal,
    handleBacklogPageChange,
    handleBacklogPageSizeChange,
    selectedFromDate,
    setSelectedFromDate,
    selectedToDate,
    setSelectedToDate,
    selectedUserId,
    setSelectedUserId,
    selectedRole,
    setSelectedRole,
    selectedStatus,
    setSelectedStatus,
    showUserFilter,
    memberOptions,
    roleOptions,
    statusOptions,
    showFilters,
    setShowFilters,
    hasActiveFilters,
    handleClearFilters,
  };
}
