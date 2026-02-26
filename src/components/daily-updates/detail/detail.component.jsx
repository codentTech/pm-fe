"use client";

import CustomButton from "@/common/components/custom-button/custom-button.component";
import NoResultFound from "@/common/components/no-result-found/no-result-found.jsx";
import PageHeader from "@/common/components/page-header/page-header.component";
import { formatDate, formatDateTime } from "@/common/utils/date.util";
import { ArrowLeft, ClipboardCheck, Pencil } from "lucide-react";
import Link from "next/link";
import useDailyUpdateDetail from "./use-detail.hook";
import { WORK_ITEM_TYPES_BID } from "@/common/constants/daily-update.constant";

export default function DailyUpdateDetail({ updateId }) {
  const {
    currentUpdate,
    canEdit,
    handleEdit,
    workItems,
    blockedItems,
    statusLabelMap,
    roleLabelMap,
    workItemTypeLabelMap,
    workItemStatusLabelMap,
  } = useDailyUpdateDetail(updateId);

  if (!currentUpdate) {
    return (
      <div className="p-4 sm:p-6">
        <NoResultFound
          icon={ClipboardCheck}
          title="Daily update not found"
          description="This update doesn't exist or you don't have access."
          variant="compact"
        />
        <Link
          href="/daily-updates/updates"
          className="mt-4 inline-flex items-center gap-2 typography-body font-medium text-primary-600 hover:text-primary-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to daily updates
        </Link>
      </div>
    );
  }

  const statusPillClasses = {
    on_track: "bg-emerald-600",
    at_risk: "bg-amber-500",
    blocked: "bg-rose-600",
  };

  return (
    <div className="flex min-w-0 flex-col bg-white">
      <PageHeader
        backLink={{ href: "/daily-updates/updates", label: "Daily updates" }}
        title={`Update · ${formatDate(currentUpdate.Date)}`}
        subtitle={roleLabelMap[currentUpdate.Role] || currentUpdate.Role || "—"}
        actions={
          <div className="hidden sm:flex items-center gap-2">
            <span
              className={`rounded-lg px-3 py-1 text-xs font-medium text-white ${
                statusPillClasses[currentUpdate.OverallStatus] || "bg-neutral-500"
              }`}
            >
              {statusLabelMap[currentUpdate.OverallStatus] ||
                currentUpdate.OverallStatus ||
                "—"}
            </span>
            {canEdit && (
              <CustomButton
                text="Edit"
                variant="ghost"
                startIcon={<Pencil className="h-4 w-4" />}
                onClick={handleEdit}
              />
            )}
          </div>
        }
        className="sticky top-0 z-10"
      />
      <div className="px-4 sm:px-6 space-y-5">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="rounded-lg border border-neutral-200 bg-white p-4 space-y-3">
            <h3 className="text-sm font-bold text-indigo-600">Overview</h3>
            <div className="grid grid-cols-1 gap-3 text-sm">
              <div>
                <div className="text-neutral-500">Role</div>
                <div className="font-medium">
                  {roleLabelMap[currentUpdate.Role] ||
                    currentUpdate.Role ||
                    "—"}
                </div>
              </div>
              <div>
                <div className="text-neutral-500">Overall status</div>
                <div className="font-medium">
                  {statusLabelMap[currentUpdate.OverallStatus] ||
                    currentUpdate.OverallStatus ||
                    "—"}
                </div>
              </div>
              <div>
                <div className="text-neutral-500">Total time</div>
                <div className="font-medium">
                  {currentUpdate.TotalTimeSpent != null
                    ? `${Number(currentUpdate.TotalTimeSpent).toFixed(2)}h`
                    : "—"}
                </div>
              </div>
              <div>
                <div className="text-neutral-500">Submitted</div>
                <div className="font-medium">
                  {currentUpdate.SubmittedAt
                    ? formatDateTime(currentUpdate.SubmittedAt)
                    : "—"}
                </div>
              </div>
            </div>
          </div>

          {currentUpdate.Notes && (
            <div className="rounded-lg border border-neutral-200 bg-white p-4 space-y-3">
              <h3 className="text-sm font-bold text-indigo-600">Notes</h3>
              <p className="text-sm text-neutral-600">{currentUpdate.Notes}</p>
            </div>
          )}

          {currentUpdate.NextDayPlan && (
            <div className="rounded-lg border border-neutral-200 bg-white p-4 space-y-3">
              <h3 className="text-sm font-bold text-indigo-600">
                Next day plan
              </h3>
              <p className="text-sm text-neutral-600">
                {currentUpdate.NextDayPlan}
              </p>
            </div>
          )}
        </div>

        <div className="rounded-lg border border-neutral-200 bg-white p-4 space-y-4">
          <h3 className="text-sm font-bold text-indigo-600">Work items</h3>
          {workItems.length === 0 ? (
            <p className="text-sm text-neutral-500">No work items logged.</p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {workItems.map((item, index) => (
                <div
                  key={item.Id || `${item.Type}-${index}`}
                  className="rounded-lg border border-neutral-100 bg-neutral-50 p-4 space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-neutral-800">
                        {workItemTypeLabelMap[item.Type] ||
                          item.Type?.replace("_", " ") ||
                          "Work item"}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {workItemStatusLabelMap[item.Status] ||
                          item.Status?.replace("_", " ") ||
                          "—"}
                      </p>
                    </div>
                    <div className="text-xs font-medium text-neutral-600">
                      {item.TimeSpent != null
                        ? `${Number(item.TimeSpent).toFixed(2)}h`
                        : "—"}
                    </div>
                  </div>

                  <div className="text-sm text-neutral-600">
                    {item.Description || "—"}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-neutral-500">
                    <div>
                      <span className="text-neutral-500">Reference</span>
                      <div className="font-medium text-neutral-700">
                        {item.ReferenceId ? (
                          WORK_ITEM_TYPES_BID.has(item.Type) ? (
                            <Link
                              href={`/bids/${item.ReferenceId}`}
                              className="text-primary-600 hover:text-primary-700"
                            >
                              Open bid
                            </Link>
                          ) : (
                            "Ticket linked"
                          )
                        ) : (
                          "—"
                        )}
                      </div>
                    </div>
                    <div>
                      <span className="text-neutral-500">Comments</span>
                      <div className="font-medium text-neutral-700">
                        {item.Comments || "—"}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {blockedItems.length > 0 && (
          <div className="rounded-lg border border-neutral-200 bg-white p-4 space-y-4">
            <h3 className="text-sm font-bold text-indigo-600">Blockers</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {blockedItems.map((item, index) => (
                <div
                  key={item.Id || `blocker-${index}`}
                  className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 space-y-2"
                >
                  <div className="font-semibold">
                    {item.BlockerType || "Blocker"}
                  </div>
                  <div>{item.BlockerReason || "—"}</div>
                  {item.ExpectedResolutionDate && (
                    <div className="text-xs text-amber-800">
                      Expected: {formatDate(item.ExpectedResolutionDate)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
