"use client";

import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import useDailyUpdatesOrg from "../../../common/hooks/use-daily-updates-org.hook";
import useDailyUpdatesAnalytics from "../../../common/hooks/use-daily-updates-analytics.hook";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
);

export const STATUS_COLORS = {
  on_track: "#22c55e",
  at_risk: "#f59e0b",
  blocked: "#ef4444",
  unknown: "#94a3b8",
};

export default function useDailyUpdatesDashboardLogic() {
  const router = useRouter();
  const org = useDailyUpdatesOrg();
  const analytics = useDailyUpdatesAnalytics();

  const handleCreateUpdate = useCallback(() => {
    router.push(`/daily-updates/new?date=${analytics.selectedFromDate}`);
  }, [router, analytics.selectedFromDate]);

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

  return {
    ...org,
    ...analytics,
    handleCreateUpdate,
    analyticsState: analytics.analyticsState,
    statusPieData,
    updatesByDateData,
    workItemMixData,
    pieOptions,
    barOptions,
  };
}
