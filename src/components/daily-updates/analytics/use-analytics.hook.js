"use client";

import { useCallback, useMemo, useState } from "react";
import {
  DAILY_UPDATE_ROLE_OPTIONS,
  WORK_ITEM_STATUS_OPTIONS,
} from "@/common/constants/daily-update.constant";
import useDailyUpdatesOrg from "../../../common/hooks/use-daily-updates-org.hook";
import useDailyUpdatesAnalytics from "../../../common/hooks/use-daily-updates-analytics.hook";

const STATUS_COLORS = {
  on_track: "#22c55e",
  at_risk: "#f59e0b",
  blocked: "#ef4444",
  unknown: "#94a3b8",
};

const defaultDateStr = () => new Date().toISOString().slice(0, 10);

export default function useDailyUpdatesAnalyticsPage() {
  const org = useDailyUpdatesOrg();
  const analytics = useDailyUpdatesAnalytics();
  const [showFilters, setShowFilters] = useState(false);

  const statusChartData = [
    {
      name: "On track",
      value: analytics.analyticsSummary.onTrack,
      key: "on_track",
    },
    {
      name: "At risk",
      value: analytics.analyticsSummary.atRisk,
      key: "at_risk",
    },
    {
      name: "Blocked",
      value: analytics.analyticsSummary.blocked,
      key: "blocked",
    },
  ];
  const hasStatusData = statusChartData.some((item) => item.value > 0);

  const statusPieData = hasStatusData
    ? {
        labels: statusChartData.map((item) => item.name),
        datasets: [
          {
            data: statusChartData.map((item) => item.value),
            backgroundColor: statusChartData.map(
              (item) => STATUS_COLORS[item.key] || STATUS_COLORS.unknown,
            ),
            borderWidth: 0,
          },
        ],
      }
    : {
        labels: ["No data"],
        datasets: [
          {
            data: [1],
            backgroundColor: [STATUS_COLORS.unknown],
            borderWidth: 0,
          },
        ],
      };

  const updatesByDateData =
    analytics.analyticsUpdatesByDate.length > 0
      ? {
          labels: analytics.analyticsUpdatesByDate.map((item) => item.date),
          datasets: [
            {
              label: "Updates",
              data: analytics.analyticsUpdatesByDate.map((item) => item.count),
              backgroundColor: "#6366f1",
              borderRadius: 6,
            },
          ],
        }
      : {
          labels: ["No data"],
          datasets: [
            {
              label: "Updates",
              data: [0],
              backgroundColor: "#cbd5f5",
              borderRadius: 6,
            },
          ],
        };

  const workItemMixData =
    analytics.analyticsWorkItemTypeData.length > 0
      ? {
          labels: analytics.analyticsWorkItemTypeData.map((item) => item.name),
          datasets: [
            {
              label: "Work items",
              data: analytics.analyticsWorkItemTypeData.map(
                (item) => item.value,
              ),
              backgroundColor: "#0ea5e9",
              borderRadius: 6,
            },
          ],
        }
      : {
          labels: ["No data"],
          datasets: [
            {
              label: "Work items",
              data: [0],
              backgroundColor: "#bae6fd",
              borderRadius: 6,
            },
          ],
        };

  const roleLabelMap = useMemo(
    () =>
      DAILY_UPDATE_ROLE_OPTIONS.reduce(
        (acc, option) => ({ ...acc, [option.value]: option.label }),
        {},
      ),
    [],
  );

  const workItemStatusLabelMap = useMemo(
    () =>
      WORK_ITEM_STATUS_OPTIONS.reduce(
        (acc, option) => ({ ...acc, [option.value]: option.label }),
        {},
      ),
    [],
  );

  const roleMixData = useMemo(() => {
    const counts = new Map();
    (analytics.analyticsItems || []).forEach((item) => {
      const key = item.Role || "unknown";
      counts.set(key, (counts.get(key) || 0) + 1);
    });
    const labels = Array.from(counts.keys()).map(
      (key) => roleLabelMap[key] || key,
    );
    const data = Array.from(counts.values());
    if (labels.length === 0) {
      return {
        labels: ["No data"],
        datasets: [
          {
            label: "Updates",
            data: [0],
            backgroundColor: "#e2e8f0",
            borderRadius: 6,
          },
        ],
      };
    }
    return {
      labels,
      datasets: [
        {
          label: "Updates",
          data,
          backgroundColor: "#34d399",
          borderRadius: 6,
        },
      ],
    };
  }, [analytics.analyticsItems, roleLabelMap]);

  const topContributors = useMemo(() => {
    const counts = new Map();
    (analytics.analyticsItems || []).forEach((item) => {
      const name = item.User?.FullName || item.User?.Email || "Unknown";
      counts.set(name, (counts.get(name) || 0) + 1);
    });
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [analytics.analyticsItems]);

  const uniqueUsersCount = useMemo(() => {
    const ids = new Set(
      (analytics.analyticsItems || []).map(
        (item) => item.UserId || item.User?.Id,
      ),
    );
    return ids.size;
  }, [analytics.analyticsItems]);

  const workItemStatusData = useMemo(() => {
    const counts = new Map();
    (analytics.analyticsItems || []).forEach((item) => {
      (item.WorkItems || []).forEach((work) => {
        const key = work.Status || "unknown";
        counts.set(key, (counts.get(key) || 0) + 1);
      });
    });
    const labels = Array.from(counts.keys()).map(
      (key) => workItemStatusLabelMap[key] || key,
    );
    const data = Array.from(counts.values());
    if (labels.length === 0) {
      return {
        labels: ["No data"],
        datasets: [
          {
            label: "Work items",
            data: [0],
            backgroundColor: "#e2e8f0",
            borderRadius: 6,
          },
        ],
      };
    }
    return {
      labels,
      datasets: [
        {
          label: "Work items",
          data,
          backgroundColor: ["#60a5fa", "#34d399", "#f59e0b", "#f97316"],
          borderRadius: 6,
        },
      ],
    };
  }, [analytics.analyticsItems, workItemStatusLabelMap]);

  const rangeDays = useMemo(() => {
    if (!analytics.selectedFromDate || !analytics.selectedToDate) return 1;
    const start = new Date(analytics.selectedFromDate);
    const end = new Date(analytics.selectedToDate);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 1;
    const diff = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
    );
    return Math.max(1, diff + 1);
  }, [analytics.selectedFromDate, analytics.selectedToDate]);

  const avgUpdatesPerDay = useMemo(() => {
    const total = analytics.analyticsSummary.totalUpdates || 0;
    return (total / rangeDays).toFixed(1);
  }, [analytics.analyticsSummary.totalUpdates, rangeDays]);

  const avgWorkItemsPerUpdate = useMemo(() => {
    const totalUpdates = analytics.analyticsSummary.totalUpdates || 0;
    const totalWorkItems = analytics.analyticsSummary.workItems || 0;
    if (!totalUpdates) return "0.0";
    return (totalWorkItems / totalUpdates).toFixed(1);
  }, [
    analytics.analyticsSummary.totalUpdates,
    analytics.analyticsSummary.workItems,
  ]);

  const defaultDate = useMemo(() => defaultDateStr(), []);
  const hasActiveFilters = Boolean(
    analytics.selectedUserId ||
    analytics.selectedRole ||
    analytics.selectedStatus ||
    analytics.selectedFromDate !== defaultDate ||
    analytics.selectedToDate !== defaultDate,
  );

  const handleClearFilters = useCallback(() => {
    analytics.setSelectedFromDate(defaultDate);
    analytics.setSelectedToDate(defaultDate);
    analytics.setSelectedUserId("");
    analytics.setSelectedRole("");
    analytics.setSelectedStatus("");
  }, [
    defaultDate,
    analytics.setSelectedFromDate,
    analytics.setSelectedToDate,
    analytics.setSelectedUserId,
    analytics.setSelectedRole,
    analytics.setSelectedStatus,
  ]);

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "bottom" } },
    layout: { padding: 8 },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: {
        grid: { display: false },
        border: { display: true, color: "#e2e8f0" },
        ticks: { padding: 8 },
      },
      y: {
        beginAtZero: true,
        ticks: { precision: 0, padding: 8 },
        grid: { display: false },
        border: { display: true, color: "#e2e8f0" },
      },
    },
    datasets: {
      bar: {
        barThickness: 24,
        maxBarThickness: 32,
        categoryPercentage: 0.6,
        barPercentage: 0.8,
      },
    },
    layout: { padding: 12 },
  };

  const roleBarOptions = useMemo(
    () => ({
      ...barOptions,
      indexAxis: "y",
      scales: {
        ...barOptions.scales,
        y: {
          ...barOptions.scales.y,
          ticks: {
            ...(barOptions.scales?.y?.ticks || {}),
            padding: 4,
            font: { size: 11 },
            callback: (value) => {
              const label =
                roleMixData?.labels?.[value] != null
                  ? String(roleMixData.labels[value])
                  : String(value);
              if (label.length <= 12) return label;
              const words = label.split(/\s+/);
              const lines = [];
              let current = "";
              words.forEach((word) => {
                const next = current ? `${current} ${word}` : word;
                if (next.length > 12 && current) {
                  lines.push(current);
                  current = word;
                } else {
                  current = next;
                }
              });
              if (current) lines.push(current);
              return lines;
            },
          },
        },
      },
    }),
    [barOptions, roleMixData],
  );

  return {
    ...org,
    ...analytics,
    showFilters,
    setShowFilters,
    analyticsState: analytics.analyticsState,
    statusPieData,
    updatesByDateData,
    workItemMixData,
    roleMixData,
    workItemStatusData,
    topContributors,
    uniqueUsersCount,
    rangeDays,
    avgUpdatesPerDay,
    avgWorkItemsPerUpdate,
    hasActiveFilters,
    handleClearFilters,
    pieOptions,
    barOptions,
    roleBarOptions,
  };
}
