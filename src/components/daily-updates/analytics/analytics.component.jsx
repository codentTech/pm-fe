"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import DailyUpdatesFilterBar from "../filter-bar/filter-bar.component";
import useDailyUpdatesTracker from "../tracker/use-daily-updates-tracker.hook";
import { KPI_SEPARATOR_COLORS } from "@/common/constants/colors.constant";
import {
  DAILY_UPDATE_ROLE_OPTIONS,
  WORK_ITEM_STATUS_OPTIONS,
} from "@/common/constants/daily-update.constant";
import {
  Activity,
  BarChart3,
  ClipboardCheck,
  Filter,
  Layers,
  ListChecks,
  PieChart,
  ShieldAlert,
  TrendingUp,
  Users,
} from "lucide-react";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
);

const STATUS_COLORS = {
  on_track: "#22c55e",
  at_risk: "#f59e0b",
  blocked: "#ef4444",
  unknown: "#94a3b8",
};

export default function DailyUpdatesAnalytics() {
  const {
    activeTab,
    setActiveTab,
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
    analyticsState,
    analyticsSummary,
    analyticsItems,
    analyticsWorkItemTypeData,
    analyticsUpdatesByDate,
  } = useDailyUpdatesTracker();
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (activeTab !== "analytics") setActiveTab("analytics");
  }, [activeTab, setActiveTab]);

  const statusChartData = [
    { name: "On track", value: analyticsSummary.onTrack, key: "on_track" },
    { name: "At risk", value: analyticsSummary.atRisk, key: "at_risk" },
    { name: "Blocked", value: analyticsSummary.blocked, key: "blocked" },
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
    analyticsUpdatesByDate.length > 0
      ? {
          labels: analyticsUpdatesByDate.map((item) => item.date),
          datasets: [
            {
              label: "Updates",
              data: analyticsUpdatesByDate.map((item) => item.count),
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
    analyticsWorkItemTypeData.length > 0
      ? {
          labels: analyticsWorkItemTypeData.map((item) => item.name),
          datasets: [
            {
              label: "Work items",
              data: analyticsWorkItemTypeData.map((item) => item.value),
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
    (analyticsItems || []).forEach((item) => {
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
  }, [analyticsItems, roleLabelMap]);

  const topContributors = useMemo(() => {
    const counts = new Map();
    (analyticsItems || []).forEach((item) => {
      const name = item.User?.FullName || item.User?.Email || "Unknown";
      counts.set(name, (counts.get(name) || 0) + 1);
    });
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [analyticsItems]);

  const uniqueUsersCount = useMemo(() => {
    const ids = new Set(
      (analyticsItems || []).map((item) => item.UserId || item.User?.Id),
    );
    return ids.size;
  }, [analyticsItems]);

  const workItemStatusData = useMemo(() => {
    const counts = new Map();
    (analyticsItems || []).forEach((item) => {
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
  }, [analyticsItems, workItemStatusLabelMap]);

  const rangeDays = useMemo(() => {
    if (!selectedFromDate || !selectedToDate) return 1;
    const start = new Date(selectedFromDate);
    const end = new Date(selectedToDate);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 1;
    const diff = Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
    );
    return Math.max(1, diff + 1);
  }, [selectedFromDate, selectedToDate]);

  const avgUpdatesPerDay = useMemo(() => {
    const total = analyticsSummary.totalUpdates || 0;
    return (total / rangeDays).toFixed(1);
  }, [analyticsSummary.totalUpdates, rangeDays]);

  const avgWorkItemsPerUpdate = useMemo(() => {
    const totalUpdates = analyticsSummary.totalUpdates || 0;
    const totalWorkItems = analyticsSummary.workItems || 0;
    if (!totalUpdates) return "0.0";
    return (totalWorkItems / totalUpdates).toFixed(1);
  }, [analyticsSummary.totalUpdates, analyticsSummary.workItems]);

  const defaultDate = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const hasActiveFilters = Boolean(
    selectedUserId ||
    selectedRole ||
    selectedStatus ||
    selectedFromDate !== defaultDate ||
    selectedToDate !== defaultDate,
  );

  const handleClearFilters = useCallback(() => {
    setSelectedFromDate(defaultDate);
    setSelectedToDate(defaultDate);
    setSelectedUserId("");
    setSelectedRole("");
    setSelectedStatus("");
  }, [
    defaultDate,
    setSelectedFromDate,
    setSelectedToDate,
    setSelectedUserId,
    setSelectedRole,
    setSelectedStatus,
  ]);

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom" },
    },
    layout: {
      padding: 8,
    },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
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
    layout: {
      padding: 12,
    },
  };

  const roleBarOptions = {
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
  };

  return (
    <div className="min-h-full">
      <div className="page-header-bar p-4 sm:p-5">
        <div className="min-w-0 flex-1 overflow-hidden">
          <h1 className="page-header-title">Analytics</h1>
          <p className="page-header-subtitle">
            Drill into daily updates with structured signals.
          </p>
        </div>
      </div>

      <div
        className="mb-4 flex items-center gap-1 px-4 sm:mb-6 sm:px-5"
        aria-hidden
      >
        <span className="h-px flex-1 bg-gradient-to-r from-transparent via-neutral-300 to-transparent" />
        <span className="flex gap-1">
          {KPI_SEPARATOR_COLORS.map((color, i) => (
            <span
              key={i}
              className={`h-1.5 w-1.5 rounded-full bg-gradient-to-br ${color}`}
            />
          ))}
        </span>
        <span className="h-px flex-1 bg-gradient-to-r from-transparent via-neutral-300 to-transparent" />
      </div>

      <div className="grid gap-3 px-4 sm:px-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total updates",
            value: analyticsSummary.totalUpdates,
            icon: ClipboardCheck,
            bg: "bg-indigo-100 border-indigo-200",
          },
          {
            label: "Work items",
            value: analyticsSummary.workItems,
            icon: ListChecks,
            bg: "bg-sky-100 border-sky-200",
          },
          {
            label: "Blocked items",
            value: analyticsSummary.blockedWorkItems,
            icon: ShieldAlert,
            bg: "bg-amber-100 border-amber-200",
          },
          {
            label: "Active members",
            value: uniqueUsersCount,
            icon: Users,
            bg: "bg-emerald-100 border-emerald-200",
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className={`rounded-lg border px-4 py-3 shadow-sm ${item.bg}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-neutral-600">
                  <Icon className="h-4 w-4 text-indigo-600" />
                  {item.label}
                </div>
                <div className="text-2xl font-semibold text-neutral-800">
                  {item.value}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 sm:p-6 space-y-3">
        <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
          <DailyUpdatesFilterBar
            selectedFromDate={selectedFromDate}
            selectedToDate={selectedToDate}
            selectedUserId={selectedUserId}
            selectedRole={selectedRole}
            selectedStatus={selectedStatus}
            memberOptions={memberOptions}
            roleOptions={roleOptions}
            statusOptions={statusOptions}
            setSelectedFromDate={setSelectedFromDate}
            setSelectedToDate={setSelectedToDate}
            setSelectedUserId={setSelectedUserId}
            setSelectedRole={setSelectedRole}
            setSelectedStatus={setSelectedStatus}
            showUserFilter={showUserFilter}
          />
        </div>
      </div>

      <div className="grid gap-4 px-4 pb-4 sm:px-6 sm:pb-6 lg:grid-cols-2">
        <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-indigo-600">
              <PieChart className="h-4 w-4" />
              Status distribution
            </div>
            {analyticsState?.isLoading && (
              <span className="text-xs text-neutral-500">Loading…</span>
            )}
          </div>
          <div className="mt-4 h-56">
            <Pie data={statusPieData} options={pieOptions} />
          </div>
        </div>

        <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-indigo-600">
            <BarChart3 className="h-4 w-4" />
            Updates by date
          </div>
          <div className="mt-4 h-56">
            <Bar data={updatesByDateData} options={barOptions} />
          </div>
        </div>
      </div>

      <div className="grid gap-4 px-4 pb-6 sm:px-6 lg:grid-cols-3">
        <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm lg:col-span-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-indigo-600">
            <Layers className="h-4 w-4" />
            Work item mix
          </div>
          <div className="mt-4 h-64">
            <Bar data={workItemMixData} options={barOptions} />
          </div>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-indigo-600">
            <Users className="h-4 w-4" />
            Updates by role
          </div>
          <div className="mt-4 h-64">
            <Bar data={roleMixData} options={roleBarOptions} />
          </div>
        </div>
      </div>

      <div className="grid gap-4 px-4 pb-6 sm:px-6 lg:grid-cols-3">
        <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-indigo-600">
            <Activity className="h-4 w-4" />
            Work item status
          </div>
          <div className="mt-4 h-56">
            <Bar data={workItemStatusData} options={barOptions} />
          </div>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-indigo-600">
            <TrendingUp className="h-4 w-4" />
            Update cadence
          </div>
          <div className="mt-4 grid gap-3">
            <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2">
              <div className="text-xs font-semibold text-neutral-500">
                Avg updates / day
              </div>
              <div className="text-lg font-semibold text-neutral-800">
                {avgUpdatesPerDay}
              </div>
            </div>
            <div className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2">
              <div className="text-xs font-semibold text-neutral-500">
                Avg work items / update
              </div>
              <div className="text-lg font-semibold text-neutral-800">
                {avgWorkItemsPerUpdate}
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-indigo-600">
            <Users className="h-4 w-4" />
            Contributor focus
          </div>
          <div className="mt-4 grid gap-3">
            {[
              {
                label: "Active members",
                value: uniqueUsersCount,
                bg: "bg-indigo-50 border-indigo-100 text-indigo-700",
              },
              {
                label: "Total updates",
                value: analyticsSummary.totalUpdates || 0,
                bg: "bg-emerald-50 border-emerald-100 text-emerald-700",
              },
              {
                label: "Blocked items",
                value: analyticsSummary.blockedWorkItems || 0,
                bg: "bg-amber-50 border-amber-100 text-amber-700",
              },
            ].map((item) => (
              <div
                key={item.label}
                className={`flex items-center justify-between rounded-lg border px-3 py-2 ${item.bg}`}
              >
                <span className="text-xs font-semibold">{item.label}</span>
                <span className="text-lg font-semibold text-neutral-900">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm mx-4 sm:mx-6 mb-6">
        <div className="flex items-center gap-2 text-sm font-semibold text-indigo-600">
          <Users className="h-4 w-4" />
          Top contributors
        </div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {topContributors.length === 0 ? (
            <p className="text-xs text-neutral-500">No contributions yet.</p>
          ) : (
            topContributors.map(([name, count]) => (
              <div
                key={name}
                className="rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 text-xs font-semibold">
                    {name
                      .split(/\s+/)
                      .map((part) => part[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2) || "U"}
                  </span>
                  <div>
                    <div className="text-xs font-semibold text-neutral-600">
                      {name}
                    </div>
                    <div className="text-sm font-semibold text-neutral-800">
                      {count} update{count > 1 ? "s" : ""}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
