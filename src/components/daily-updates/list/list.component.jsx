"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomDataTable from "@/common/components/custom-data-table/custom-data-table.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import DailyUpdatesFilterBar from "../filter-bar/filter-bar.component";
import useDailyUpdatesTracker from "../tracker/use-daily-updates-tracker.hook";
import { Filter, Search, Eye } from "lucide-react";
import { KPI_SEPARATOR_COLORS } from "@/common/constants/colors.constant";

export default function DailyUpdatesUpdates() {
  const {
    activeTab,
    setActiveTab,
    updates,
    fetchDailyUpdatesState,
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
    searchTerm,
    setSearchTerm,
    myUpdate,
    handleViewUpdate,
    handleCreateUpdate,
    updateColumns,
    updatesPage,
    updatesLimit,
    updatesTotal,
    handleUpdatePageChange,
    handleUpdatePageSizeChange,
  } = useDailyUpdatesTracker();
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (activeTab !== "updates") setActiveTab("updates");
  }, [activeTab, setActiveTab]);

  const defaultDate = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const hasActiveFilters = Boolean(
    searchTerm ||
    selectedUserId ||
    selectedRole ||
    selectedStatus ||
    selectedFromDate !== defaultDate ||
    selectedToDate !== defaultDate,
  );

  const updateActions = useMemo(
    () => [
      { key: "view", label: "View update", icon: <Eye className="h-4 w-4" /> },
    ],
    [],
  );

  const handleActionClick = useCallback(
    (actionKey, row) => {
      if (actionKey === "view") handleViewUpdate(row.Id);
    },
    [handleViewUpdate],
  );

  const handleClearFilters = useCallback(() => {
    setSelectedFromDate(defaultDate);
    setSelectedToDate(defaultDate);
    setSelectedUserId("");
    setSelectedRole("");
    setSelectedStatus("");
    setSearchTerm("");
  }, [
    defaultDate,
    setSelectedFromDate,
    setSelectedToDate,
    setSelectedUserId,
    setSelectedRole,
    setSelectedStatus,
  ]);

  return (
    <div className="min-h-full">
      <div className="page-header-bar px-4 sm:px-5">
        <div className="page-header-divider" />
        <div className="min-w-0 flex-1 overflow-hidden">
          <h1 className="page-header-title">Daily updates</h1>
          <p className="page-header-subtitle">
            Track daily progress, blockers, and off-plan work.
          </p>
        </div>
        <CustomButton
          text="Submit update"
          variant="primary"
          size="sm"
          className="shrink-0 rounded-lg px-3 py-1.5 typography-caption font-medium sm:px-4 sm:py-2 sm:typography-button"
          onClick={handleCreateUpdate}
        />
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

      <div className="px-4 sm:px-6 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-[320px] flex-1">
            <CustomInput
              placeholder="Search updates"
              name="updatesSearch"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              startIcon={<Search className="h-4 w-4 text-neutral-400" />}
              className="w-full max-w-md h-9"
            />
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
      </div>

      <div className="p-4 sm:p-6">
        <CustomDataTable
          columns={updateColumns}
          data={(updates || []).map((u) => ({ ...u, id: u.Id }))}
          loading={!!fetchDailyUpdatesState?.isLoading}
          searchable={false}
          paginated
          externalPagination
          currentPage={updatesPage}
          pageSize={updatesLimit}
          totalRecords={updatesTotal}
          onPageChange={handleUpdatePageChange}
          onPageSizeChange={handleUpdatePageSizeChange}
          actions={updateActions}
          onActionClick={handleActionClick}
          emptyMessage="No updates yet"
          tableClassName="min-w-full divide-y divide-neutral-200"
          headerClassName="border-neutral-200"
          rowClassName="transition-colors"
        />
      </div>
    </div>
  );
}
