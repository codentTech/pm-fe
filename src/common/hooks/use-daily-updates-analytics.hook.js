"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDailyUpdates } from "@/provider/features/daily-updates/daily-updates.slice";
import {
  fetchBlockerBacklog,
  fetchMissingUpdateBacklog,
  fetchOffPlanBacklog,
} from "@/provider/features/daily-updates/daily-updates.slice";
import { formatDate } from "@/common/utils/date.util";
import { WORK_ITEM_TYPES_BY_ROLE } from "@/common/constants/daily-update.constant";

const defaultDate = () => new Date().toISOString().slice(0, 10);

/**
 * Shared analytics data hook for dashboard and analytics page.
 * Owns filter state, fetches analytics (daily updates list with limit 100), and derives chart data.
 */
export default function useDailyUpdatesAnalytics() {
  const dispatch = useDispatch();
  const {
    updates,
    fetchDailyUpdates: fetchDailyUpdatesState,
    missingUpdateBacklog,
    blockerBacklog,
    offPlanBacklog,
  } = useSelector((state) => state.dailyUpdates || {});
  const currentOrganizationId = useSelector(
    (state) => state.organizations?.currentOrganizationId,
  );

  const [selectedFromDate, setSelectedFromDate] = useState(defaultDate);
  const [selectedToDate, setSelectedToDate] = useState(defaultDate);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    if (currentOrganizationId === undefined) return;
    dispatch(
      fetchDailyUpdates({
        params: {
          from: selectedFromDate,
          to: selectedToDate,
          userId: selectedUserId || undefined,
          role: selectedRole || undefined,
          status: selectedStatus || undefined,
          page: 1,
          limit: 100,
        },
      }),
    );
  }, [
    currentOrganizationId,
    dispatch,
    selectedFromDate,
    selectedToDate,
    selectedUserId,
    selectedRole,
    selectedStatus,
  ]);

  useEffect(() => {
    if (currentOrganizationId === undefined) return;
    dispatch(
      fetchMissingUpdateBacklog({
        params: { date: selectedFromDate, page: 1, limit: 20 },
      }),
    );
    dispatch(
      fetchBlockerBacklog({
        params: {
          from: selectedFromDate,
          to: selectedToDate,
          page: 1,
          limit: 20,
        },
      }),
    );
    dispatch(
      fetchOffPlanBacklog({
        params: {
          from: selectedFromDate,
          to: selectedToDate,
          page: 1,
          limit: 20,
        },
      }),
    );
  }, [
    currentOrganizationId,
    dispatch,
    selectedFromDate,
    selectedToDate,
  ]);

  const analyticsState = useMemo(
    () => ({
      isLoading: fetchDailyUpdatesState?.isLoading ?? false,
      data: fetchDailyUpdatesState?.data ?? null,
      error: fetchDailyUpdatesState?.isError
        ? fetchDailyUpdatesState?.message ?? "Failed to load analytics"
        : null,
    }),
    [
      fetchDailyUpdatesState?.isLoading,
      fetchDailyUpdatesState?.data,
      fetchDailyUpdatesState?.isError,
      fetchDailyUpdatesState?.message,
    ],
  );

  const analyticsItems = useMemo(
    () => fetchDailyUpdatesState?.data?.items ?? updates ?? [],
    [fetchDailyUpdatesState?.data?.items, updates],
  );

  const analyticsStatusCounts = useMemo(() => {
    return analyticsItems.reduce(
      (acc, item) => {
        const key = item.OverallStatus || "unknown";
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      },
      { on_track: 0, at_risk: 0, blocked: 0, unknown: 0 },
    );
  }, [analyticsItems]);

  const analyticsWorkItemCount = useMemo(() => {
    return analyticsItems.reduce(
      (acc, item) => acc + (item.WorkItems?.length || 0),
      0,
    );
  }, [analyticsItems]);

  const analyticsBlockedWorkItemCount = useMemo(() => {
    return analyticsItems.reduce((acc, item) => {
      const blocked = (item.WorkItems || []).filter(
        (wi) => wi.Status === "blocked",
      ).length;
      return acc + blocked;
    }, 0);
  }, [analyticsItems]);

  const analyticsSummary = useMemo(
    () => ({
      totalUpdates: fetchDailyUpdatesState?.data?.total ?? analyticsItems.length,
      onTrack: analyticsStatusCounts.on_track || 0,
      atRisk: analyticsStatusCounts.at_risk || 0,
      blocked: analyticsStatusCounts.blocked || 0,
      workItems: analyticsWorkItemCount,
      blockedWorkItems: analyticsBlockedWorkItemCount,
      missingUpdates: missingUpdateBacklog?.data?.total ?? 0,
      blockerBacklog: blockerBacklog?.data?.total ?? 0,
      offPlan: offPlanBacklog?.data?.total ?? 0,
    }),
    [
      analyticsBlockedWorkItemCount,
      analyticsItems.length,
      analyticsStatusCounts.at_risk,
      analyticsStatusCounts.blocked,
      analyticsStatusCounts.on_track,
      analyticsWorkItemCount,
      blockerBacklog?.data?.total,
      fetchDailyUpdatesState?.data?.total,
      missingUpdateBacklog?.data?.total,
      offPlanBacklog?.data?.total,
    ],
  );

  const analyticsWorkItemTypeData = useMemo(() => {
    const labelMap = Object.values(WORK_ITEM_TYPES_BY_ROLE)
      .flat()
      .reduce((acc, option) => ({ ...acc, [option.value]: option.label }), {});
    const counts = new Map();
    analyticsItems.forEach((item) => {
      (item.WorkItems || []).forEach((work) => {
        const key = work.Type || "unknown";
        counts.set(key, (counts.get(key) || 0) + 1);
      });
    });
    return Array.from(counts.entries()).map(([key, value]) => ({
      name: labelMap[key] || key,
      value,
    }));
  }, [analyticsItems]);

  const analyticsUpdatesByDate = useMemo(() => {
    const counts = new Map();
    analyticsItems.forEach((item) => {
      const dateKey = item.Date ? formatDate(item.Date) : "Unknown";
      counts.set(dateKey, (counts.get(dateKey) || 0) + 1);
    });
    return Array.from(counts.entries()).map(([date, count]) => ({
      date,
      count,
    }));
  }, [analyticsItems]);

  return {
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
    analyticsState,
    analyticsSummary,
    analyticsItems,
    analyticsWorkItemTypeData,
    analyticsUpdatesByDate,
  };
}
