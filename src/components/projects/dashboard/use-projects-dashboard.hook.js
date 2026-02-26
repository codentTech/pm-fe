"use client";

import {
  PROJECT_DELIVERY_TYPE_OPTIONS,
  PROJECT_RISK_LEVEL_OPTIONS,
  PROJECT_STATUS_OPTIONS,
} from "@/common/constants/project.constant";
import { DASHBOARD_LIMIT } from "@/common/constants/query-limit.constant";
import { getCurrentDate } from "@/common/utils/date.util";
import { fetchProjects } from "@/provider/features/projects/projects.slice";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
);

const STATUS_CHART_COLORS = {
  created: "#94a3b8",
  onboarding: "#3b82f6",
  active: "#22c55e",
  paused: "#f59e0b",
  completed: "#8b5cf6",
  closed: "#64748b",
};

const defaultFrom = () => "1970-01-01";

export default function useProjectsDashboardLogic() {
  const dispatch = useDispatch();
  const router = useRouter();
  const currentOrganizationId = useSelector(
    (state) => state.organizations?.currentOrganizationId,
  );
  const { projects, fetchProjects: fetchState } = useSelector(
    (state) => state?.projects ?? {},
  );

  const [selectedFromDate, setSelectedFromDate] = useState(defaultFrom);
  const [selectedToDate, setSelectedToDate] = useState(getCurrentDate);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedDeliveryType, setSelectedDeliveryType] = useState("");
  const [selectedRiskLevel, setSelectedRiskLevel] = useState("");

  useEffect(() => {
    if (currentOrganizationId === undefined) return;
    dispatch(
      fetchProjects({
        params: { limit: DASHBOARD_LIMIT, page: 1 },
      }),
    );
  }, [dispatch, currentOrganizationId]);

  const filteredProjects = useMemo(() => {
    const list = projects ?? [];
    let out = list;
    if (selectedFromDate) {
      const from = new Date(selectedFromDate);
      from.setHours(0, 0, 0, 0);
      out = out.filter((p) => {
        const d = p.StartDate
          ? new Date(p.StartDate)
          : p.CreatedAt
            ? new Date(p.CreatedAt)
            : null;
        return d && d >= from;
      });
    }
    if (selectedToDate) {
      const to = new Date(selectedToDate);
      to.setHours(23, 59, 59, 999);
      out = out.filter((p) => {
        const d = p.StartDate
          ? new Date(p.StartDate)
          : p.CreatedAt
            ? new Date(p.CreatedAt)
            : null;
        return d && d <= to;
      });
    }
    if (selectedStatus) {
      out = out.filter(
        (p) =>
          String(p.Status || "").toLowerCase() === selectedStatus.toLowerCase(),
      );
    }
    if (selectedDeliveryType) {
      out = out.filter(
        (p) =>
          String(p.DeliveryType || "").toLowerCase() ===
          selectedDeliveryType.toLowerCase(),
      );
    }
    if (selectedRiskLevel) {
      out = out.filter(
        (p) =>
          String(p.RiskLevel || "").toLowerCase() ===
          selectedRiskLevel.toLowerCase(),
      );
    }
    return out;
  }, [
    projects,
    selectedFromDate,
    selectedToDate,
    selectedStatus,
    selectedDeliveryType,
    selectedRiskLevel,
  ]);

  const statusCounts = useMemo(() => {
    const acc = {};
    filteredProjects.forEach((p) => {
      const s = (p.Status || "created").toLowerCase();
      acc[s] = (acc[s] ?? 0) + 1;
    });
    return acc;
  }, [filteredProjects]);

  const deliveryTypeCounts = useMemo(() => {
    const acc = {};
    filteredProjects.forEach((p) => {
      const s = (p.DeliveryType || "time_and_material").toLowerCase();
      acc[s] = (acc[s] ?? 0) + 1;
    });
    return acc;
  }, [filteredProjects]);

  const riskLevelCounts = useMemo(() => {
    const acc = { low: 0, medium: 0, high: 0 };
    filteredProjects.forEach((p) => {
      const s = (p.RiskLevel || "").toLowerCase();
      if (s) acc[s] = (acc[s] ?? 0) + 1;
    });
    return acc;
  }, [filteredProjects]);

  const analyticsSummary = useMemo(
    () => ({
      totalProjects: filteredProjects.length,
      activeCount: statusCounts.active ?? 0,
      completedCount: statusCounts.completed ?? 0,
      highRiskCount: riskLevelCounts.high ?? 0,
    }),
    [
      filteredProjects.length,
      statusCounts.active,
      statusCounts.completed,
      riskLevelCounts.high,
    ],
  );

  /* ---------- Status Pie ---------- */
  const statusChartData = useMemo(() => {
    return PROJECT_STATUS_OPTIONS.map((opt) => ({
      name: opt.label,
      value: statusCounts[opt.value] ?? 0,
      key: opt.value,
    }));
  }, [statusCounts]);

  const hasStatusData = statusChartData.some((item) => item.value > 0);
  const statusPieData = hasStatusData
    ? {
        labels: statusChartData.map((item) => item.name),
        datasets: [
          {
            data: statusChartData.map((item) => item.value),
            backgroundColor: statusChartData.map(
              (item) => STATUS_CHART_COLORS[item.key] ?? "#94a3b8",
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
            backgroundColor: ["#e2e8f0"],
            borderWidth: 0,
          },
        ],
      };

  /* ---------- Projects by start date ---------- */
  const projectsByDateMap = useMemo(() => {
    const map = {};
    filteredProjects.forEach((p) => {
      const raw = p.StartDate || p.CreatedAt;
      const dateStr = raw ? new Date(raw).toISOString().slice(0, 10) : null;
      if (dateStr) {
        map[dateStr] = (map[dateStr] ?? 0) + 1;
      }
    });
    return map;
  }, [filteredProjects]);

  const projectsByDateSorted = useMemo(() => {
    return Object.entries(projectsByDateMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({ date, count }));
  }, [projectsByDateMap]);

  const projectsByDateData =
    projectsByDateSorted.length > 0
      ? {
          labels: projectsByDateSorted.map((item) => item.date),
          datasets: [
            {
              label: "Projects",
              data: projectsByDateSorted.map((item) => item.count),
              backgroundColor: "#6366f1",
              borderRadius: 6,
            },
          ],
        }
      : {
          labels: ["No data"],
          datasets: [
            {
              label: "Projects",
              data: [0],
              backgroundColor: "#cbd5f5",
              borderRadius: 6,
            },
          ],
        };

  /* ---------- Delivery type bar ---------- */
  const deliveryTypeChartData = useMemo(() => {
    return PROJECT_DELIVERY_TYPE_OPTIONS.map((opt) => ({
      name: opt.label,
      value: deliveryTypeCounts[opt.value] ?? 0,
    }));
  }, [deliveryTypeCounts]);

  const deliveryTypeBarData = deliveryTypeChartData.some(
    (item) => item.value > 0,
  )
    ? {
        labels: deliveryTypeChartData.map((item) => item.name),
        datasets: [
          {
            label: "Projects",
            data: deliveryTypeChartData.map((item) => item.value),
            backgroundColor: "#0ea5e9",
            borderRadius: 6,
          },
        ],
      }
    : {
        labels: ["No data"],
        datasets: [
          {
            label: "Projects",
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

  const statusOptions = [
    { value: "", label: "All statuses" },
    ...PROJECT_STATUS_OPTIONS,
  ];
  const deliveryTypeOptions = [
    { value: "", label: "All types" },
    ...PROJECT_DELIVERY_TYPE_OPTIONS,
  ];
  const riskLevelOptions = [
    { value: "", label: "All risk levels" },
    ...PROJECT_RISK_LEVEL_OPTIONS,
  ];

  const handleCreateProject = () => router.push("/projects?openCreate=1");
  const handleViewProjects = () => router.push("/projects");

  return {
    analyticsSummary,
    fetchState,
    statusPieData,
    projectsByDateData,
    deliveryTypeBarData,
    pieOptions,
    barOptions,
    selectedFromDate,
    selectedToDate,
    selectedStatus,
    selectedDeliveryType,
    selectedRiskLevel,
    setSelectedFromDate,
    setSelectedToDate,
    setSelectedStatus,
    setSelectedDeliveryType,
    setSelectedRiskLevel,
    statusOptions,
    deliveryTypeOptions,
    riskLevelOptions,
    handleCreateProject,
    handleViewProjects,
  };
}
