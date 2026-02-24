"use client";

import { useEffect } from "react";
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
import CustomButton from "@/common/components/custom-button/custom-button.component";
import DailyUpdatesFilterBar from "../filter-bar/filter-bar.component";
import useDailyUpdatesTracker from "../tracker/use-daily-updates-tracker.hook";
import {
  AlertTriangle,
  CalendarX,
  ClipboardCheck,
  ListChecks,
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

export default function DailyUpdatesDashboard() {
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
    analyticsWorkItemTypeData,
    analyticsUpdatesByDate,
    handleCreateUpdate,
  } = useDailyUpdatesTracker();

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

  return (
    <div className="min-h-full">
      <div className="page-header-bar px-4 py-2">
        <div className="min-w-0 flex-1 overflow-hidden">
          <h1 className="page-header-title">Daily Updates Dashboard</h1>
          <p className="page-header-subtitle">
            Quick signals for progress, blockers, and off-plan work.
          </p>
        </div>
        <CustomButton
          text="Submit update"
          variant="primary"
          startIcon={<ClipboardCheck className="h-4 w-4" />}
          onClick={handleCreateUpdate}
        />
      </div>

      <div className="grid gap-3 p-4 sm:p-6 sm:grid-cols-2 lg:grid-cols-4">
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
            icon: AlertTriangle,
            bg: "bg-amber-100 border-amber-200",
          },
          {
            label: "Missing updates",
            value: analyticsSummary.missingUpdates,
            icon: CalendarX,
            bg: "bg-rose-100 border-rose-200",
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

      <div className="px-4 sm:px-6">
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

      <div className="grid gap-4 px-4 pb-4 sm:px-6 sm:pb-6 lg:grid-cols-2 mt-4">
        <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-neutral-800">
              Status distribution
            </p>
            {analyticsState?.isLoading && (
              <span className="text-xs text-neutral-500">Loading…</span>
            )}
          </div>
          <div className="mt-4 h-56">
            <Pie data={statusPieData} options={pieOptions} />
          </div>
        </div>

        <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-semibold text-neutral-800">
            Updates by date
          </p>
          <div className="mt-4 h-56">
            <Bar data={updatesByDateData} options={barOptions} />
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm mx-4 sm:mx-6 mb-6">
        <p className="text-sm font-semibold text-neutral-800">Work item mix</p>
        <div className="mt-4 h-64">
          <Bar data={workItemMixData} options={barOptions} />
        </div>
      </div>
    </div>
  );
}
