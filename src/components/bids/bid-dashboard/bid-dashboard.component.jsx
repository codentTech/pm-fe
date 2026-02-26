"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import PageHeader from "@/common/components/page-header/page-header.component";
import { KPI_SEPARATOR_COLORS } from "@/common/constants/colors.constant";
import useBidTracker from "../bid-tracker/use-bid-tracker.hook";

export default function BidDashboard() {
  const router = useRouter();
  const {
    activeView,
    setActiveView,
    metrics,
    winRatePct,
    avgDraftAgeDaysDisplay,
  } = useBidTracker();

  useEffect(() => {
    if (activeView !== "all") setActiveView("all");
  }, [activeView, setActiveView]);

  return (
    <div className="min-h-full">
      <PageHeader
        title="Bid Management"
        subtitle="Track bids, pipeline, and sales execution"
        actions={
          <CustomButton
            text="Log bid"
            onClick={() => router.push("/bids/new")}
            variant="primary"
            size="sm"
            className="shrink-0 rounded-lg px-3 py-1.5 typography-caption font-medium sm:px-4 sm:py-2 sm:typography-button"
          />
        }
        className="px-4 sm:px-5"
      />
      <div className="my-5 px-4 sm:px-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {[
            { label: "Total bids", value: metrics.total ?? "—" },
            { label: "Win rate", value: winRatePct },
            { label: "Avg deal size", value: metrics.avgDealSize ?? "—" },
            {
              label: "Avg draft age (days)",
              value: avgDraftAgeDaysDisplay,
            },
            {
              label: "Follow-up overdue",
              value: metrics.followUpOverdueCount ?? "—",
            },
            {
              label: "Ghosted suggested",
              value: metrics.ghostedSuggestedCount ?? "—",
            },
          ].map((card, idx) => (
            <div
              key={card.label}
              className="group relative overflow-hidden rounded-lg border border-neutral-200 bg-white px-4 py-2 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <div
                className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${
                  KPI_SEPARATOR_COLORS[idx % KPI_SEPARATOR_COLORS.length]
                }`}
              />
              <div className="flex items-center flex-col">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
                  {card.label}
                </p>
                <p className="text-lg font-semibold text-neutral-900">
                  {card.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
