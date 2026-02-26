"use client";

import CustomDataTable from "@/common/components/custom-data-table/custom-data-table.component";
import DailyUpdatesFilterBar from "../filter-bar/filter-bar.component";
import PageHeader from "@/common/components/page-header/page-header.component";
import { Filter } from "lucide-react";
import useDailyUpdatesBacklogs from "./use-backlogs.hook";

export default function DailyUpdatesBacklogs() {
  const {
    activeBacklogTab,
    setActiveBacklogTab,
    backlogColumns,
    backlogData,
    backlogLoading,
    backlogPage,
    backlogLimit,
    backlogTotal,
    handleBacklogPageChange,
    handleBacklogPageSizeChange,
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
    memberOptions,
    roleOptions,
    statusOptions,
    showFilters,
    setShowFilters,
    hasActiveFilters,
    handleClearFilters,
  } = useDailyUpdatesBacklogs();

  return (
    <div className="min-h-full">
      <PageHeader
        title="Backlogs"
        subtitle="Monitor missing updates, blockers, and off-plan work."
      />
      <div className="px-4 sm:px-5 space-y-4 pb-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2 rounded-lg border border-neutral-200 bg-white/70 p-2 shadow-sm">
            {[
              { key: "missing", label: "Missing updates" },
              { key: "blockers", label: "Blocker backlog" },
              { key: "off_plan", label: "Off-plan work" },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveBacklogTab(tab.key)}
                className={`rounded-lg px-3.5 py-1 text-xs font-semibold transition-all ${
                  activeBacklogTab === tab.key
                    ? "bg-indigo-600 text-white shadow-md ring-1 ring-indigo-500/40"
                    : "bg-neutral-200 text-neutral-600 hover:bg-indigo-50 hover:text-indigo-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowFilters((prev) => !prev)}
              className={`inline-flex h-9 w-9 items-center justify-center rounded-full shadow-sm transition-all duration-200
                ${
                  showFilters
                    ? "bg-indigo-600 text-white hover:bg-indigo-700"
                    : "bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
                }
              `}
            >
              <Filter className="h-4 w-4" />
            </button>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>
        {showFilters && (
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
        )}

        <CustomDataTable
          columns={backlogColumns}
          data={backlogData.map((item) => ({
            ...item,
            id: item.Id || item.id,
          }))}
          loading={!!backlogLoading}
          searchable={false}
          paginated
          externalPagination
          currentPage={backlogPage}
          pageSize={backlogLimit}
          totalRecords={backlogTotal}
          onPageChange={handleBacklogPageChange}
          onPageSizeChange={handleBacklogPageSizeChange}
          emptyMessage="No backlog items"
        />
      </div>
    </div>
  );
}
