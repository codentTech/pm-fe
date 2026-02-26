"use client";

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
import PageHeader from "@/common/components/page-header/page-header.component";
import useDailyUpdatesAnalyticsPage from "./use-analytics.hook";
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

export default function DailyUpdatesAnalytics() {
  const {
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
    statusPieData,
    updatesByDateData,
    workItemMixData,
    roleMixData,
    workItemStatusData,
    topContributors,
    uniqueUsersCount,
    avgUpdatesPerDay,
    avgWorkItemsPerUpdate,
    showFilters,
    setShowFilters,
    hasActiveFilters,
    handleClearFilters,
    pieOptions,
    barOptions,
    roleBarOptions,
  } = useDailyUpdatesAnalyticsPage();

  return (
    <div className="min-h-full">
      <PageHeader
        title="Analytics"
        subtitle="Drill into daily updates with structured signals."
      />
      <div className="px-4 sm:px-5 space-y-4 pb-10">
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

        <div className="grid gap-4 lg:grid-cols-2">
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

        <div className="grid gap-4 lg:grid-cols-3">
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

        <div className="grid gap-4 lg:grid-cols-3">
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

        <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
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
    </div>
  );
}
