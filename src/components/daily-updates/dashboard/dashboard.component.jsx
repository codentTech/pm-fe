"use client";

import CustomButton from "@/common/components/custom-button/custom-button.component";
import PageHeader from "@/common/components/page-header/page-header.component";
import { Bar, Pie } from "react-chartjs-2";
import {
  AlertTriangle,
  CalendarX,
  ClipboardCheck,
  ListChecks,
} from "lucide-react";
import DailyUpdatesFilterBar from "../filter-bar/filter-bar.component";
import useDailyUpdatesDashboardLogic from "./use-dashboard.hook";

export default function DailyUpdatesDashboard() {
  const {
    selectedFromDate,
    selectedToDate,
    selectedUserId,
    selectedRole,
    selectedStatus,
    memberOptions,
    roleOptions,
    statusOptions,
    setSelectedFromDate,
    setSelectedToDate,
    setSelectedUserId,
    setSelectedRole,
    setSelectedStatus,
    showUserFilter,
    analyticsSummary,
    handleCreateUpdate,
    analyticsState,
    statusPieData,
    updatesByDateData,
    workItemMixData,
    pieOptions,
    barOptions,
  } = useDailyUpdatesDashboardLogic();

  return (
    <div className="min-h-full">
      <PageHeader
        title="Daily Updates Dashboard"
        subtitle="Quick signals for progress, blockers, and off-plan work."
        actions={
          <CustomButton
            text="Submit update"
            variant="primary"
            onClick={handleCreateUpdate}
          />
        }
      />

      <div className="px-4 sm:px-5 space-y-4 pb-10">
        {/* Summary cards */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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

        {/* Filters */}
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

        {/* Charts */}
        <div className="grid gap-4 sm:grid-cols-2">
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

        <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-semibold text-neutral-800">
            Work item mix
          </p>
          <div className="mt-4 h-64">
            <Bar data={workItemMixData} options={barOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}
