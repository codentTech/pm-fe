"use client";

import {
  BID_PLATFORM_OPTIONS,
  BID_STATUS_OPTIONS,
} from "@/common/constants/bid.constant";
import { DASHBOARD_LIMIT } from "@/common/constants/query-limit.constant";
import { getCurrentDate } from "@/common/utils/date.util";
import {
  fetchBidMetrics,
  fetchBids,
} from "@/provider/features/bids/bids.slice";
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
  draft: "#94a3b8",
  submitted: "#3b82f6",
  viewed: "#8b5cf6",
  interview: "#f59e0b",
  won: "#22c55e",
  lost: "#ef4444",
  ghosted: "#78716c",
  withdrawn: "#64748b",
};

const defaultFrom = () => {
  const d = new Date();
  d.setMonth(d.getMonth() - 3);
  return d.toISOString().slice(0, 10);
};

export default function useBidDashboardLogic() {
  const dispatch = useDispatch();
  const router = useRouter();
  const currentOrganizationId = useSelector(
    (state) => state.organizations?.currentOrganizationId,
  );
  const {
    bids,
    fetchBids: fetchBidsState,
    fetchBidMetrics: metricsState,
  } = useSelector((state) => state?.bids ?? {});

  const [selectedFromDate, setSelectedFromDate] = useState(defaultFrom);
  const [selectedToDate, setSelectedToDate] = useState(getCurrentDate);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("");

  useEffect(() => {
    if (currentOrganizationId === undefined) return;
    dispatch(fetchBidMetrics());
    dispatch(
      fetchBids({
        params: {
          limit: DASHBOARD_LIMIT,
          status: selectedStatus || undefined,
        },
      }),
    );
  }, [dispatch, currentOrganizationId, selectedStatus]);

  const filteredBids = useMemo(() => {
    const list = bids ?? [];
    let out = list;
    if (selectedFromDate) {
      const from = new Date(selectedFromDate);
      from.setHours(0, 0, 0, 0);
      out = out.filter((b) => {
        const d = b.SubmissionDate
          ? new Date(b.SubmissionDate)
          : b.CreatedAt
            ? new Date(b.CreatedAt)
            : null;
        return d && d >= from;
      });
    }
    if (selectedToDate) {
      const to = new Date(selectedToDate);
      to.setHours(23, 59, 59, 999);
      out = out.filter((b) => {
        const d = b.SubmissionDate
          ? new Date(b.SubmissionDate)
          : b.CreatedAt
            ? new Date(b.CreatedAt)
            : null;
        return d && d <= to;
      });
    }
    if (selectedPlatform) {
      out = out.filter(
        (b) =>
          String(b.Platform || "").toLowerCase() ===
          selectedPlatform.toLowerCase(),
      );
    }
    return out;
  }, [bids, selectedFromDate, selectedToDate, selectedPlatform]);

  const metrics = metricsState?.data || {};
  const winRatePct =
    typeof metrics.winRate === "number"
      ? `${Math.round(metrics.winRate * 100)}%`
      : "—";
  const avgDraftAgeDaysDisplay =
    typeof metrics.avgDraftAgeDays === "number"
      ? metrics.avgDraftAgeDays.toFixed(2)
      : "—";

  const analyticsSummary = useMemo(
    () => ({
      totalBids: metrics.total ?? 0,
      winRate: winRatePct,
      avgDealSize:
        metrics.avgDealSize != null
          ? Number(metrics.avgDealSize).toLocaleString(undefined, {
              maximumFractionDigits: 0,
            })
          : "—",
      avgDraftAgeDays: avgDraftAgeDaysDisplay,
      followUpOverdue: metrics.followUpOverdueCount ?? 0,
      ghostedSuggested: metrics.ghostedSuggestedCount ?? 0,
    }),
    [
      metrics.total,
      metrics.avgDealSize,
      metrics.followUpOverdueCount,
      metrics.ghostedSuggestedCount,
      winRatePct,
      avgDraftAgeDaysDisplay,
    ],
  );

  /* ---------- Status Pie ---------- */
  const statusCounts = useMemo(() => {
    const acc = {};
    filteredBids.forEach((b) => {
      const s = b.CurrentStatus || "draft";
      acc[s] = (acc[s] ?? 0) + 1;
    });
    return acc;
  }, [filteredBids]);

  const statusChartData = useMemo(() => {
    return BID_STATUS_OPTIONS.map((opt) => ({
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

  /* ---------- Bids by date (submission) ---------- */
  const bidsByDateMap = useMemo(() => {
    const map = {};
    filteredBids.forEach((b) => {
      const raw = b.SubmissionDate || b.CreatedAt;
      const dateStr = raw ? new Date(raw).toISOString().slice(0, 10) : null;
      if (dateStr) {
        map[dateStr] = (map[dateStr] ?? 0) + 1;
      }
    });
    return map;
  }, [filteredBids]);

  const bidsByDateSorted = useMemo(() => {
    return Object.entries(bidsByDateMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({ date, count }));
  }, [bidsByDateMap]);

  const bidsByDateData =
    bidsByDateSorted.length > 0
      ? {
          labels: bidsByDateSorted.map((item) => item.date),
          datasets: [
            {
              label: "Bids",
              data: bidsByDateSorted.map((item) => item.count),
              backgroundColor: "#6366f1",
              borderRadius: 6,
            },
          ],
        }
      : {
          labels: ["No data"],
          datasets: [
            {
              label: "Bids",
              data: [0],
              backgroundColor: "#cbd5f5",
              borderRadius: 6,
            },
          ],
        };

  /* ---------- Value by platform ---------- */
  const valueByPlatform = useMemo(() => {
    const map = {};
    filteredBids.forEach((b) => {
      const platform = (b.Platform || "other").toLowerCase();
      const value = Number(b.ProposedPrice) || 0;
      map[platform] = (map[platform] ?? 0) + value;
    });
    return BID_PLATFORM_OPTIONS.map((opt) => ({
      name: opt.label,
      value: Math.round(map[opt.value] ?? 0),
    }));
  }, [filteredBids]);

  const valueByPlatformData = valueByPlatform.some((item) => item.value > 0)
    ? {
        labels: valueByPlatform.map((item) => item.name),
        datasets: [
          {
            label: "Total proposed value",
            data: valueByPlatform.map((item) => item.value),
            backgroundColor: "#0ea5e9",
            borderRadius: 6,
          },
        ],
      }
    : {
        labels: ["No data"],
        datasets: [
          {
            label: "Total proposed value",
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
    ...BID_STATUS_OPTIONS,
  ];
  const platformOptions = [
    { value: "", label: "All platforms" },
    ...BID_PLATFORM_OPTIONS,
  ];

  const handleLogBid = () => router.push("/bids/new");

  return {
    analyticsSummary,
    metricsState,
    fetchBidsState,
    statusPieData,
    bidsByDateData,
    valueByPlatformData,
    pieOptions,
    barOptions,
    selectedFromDate,
    selectedToDate,
    selectedStatus,
    selectedPlatform,
    setSelectedFromDate,
    setSelectedToDate,
    setSelectedStatus,
    setSelectedPlatform,
    statusOptions,
    platformOptions,
    handleLogBid,
  };
}
