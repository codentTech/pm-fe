import { useCallback, useEffect, useMemo, useState } from "react";
import useDailyUpdatesTracker from "../tracker/use-daily-updates-tracker.hook";

export default function useDailyUpdatesBacklogs() {
  const {
    activeTab,
    setActiveTab,
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
    showUserFilter,
    memberOptions,
    roleOptions,
    statusOptions,
  } = useDailyUpdatesTracker();

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (activeTab !== "backlogs") setActiveTab("backlogs");
  }, [activeTab, setActiveTab]);

  const defaultDate = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const hasActiveFilters = Boolean(
    selectedUserId ||
    selectedRole ||
    selectedStatus ||
    selectedFromDate !== defaultDate ||
    selectedToDate !== defaultDate,
  );

  const handleClearFilters = useCallback(() => {
    setSelectedFromDate(defaultDate);
    setSelectedToDate(defaultDate);
    setSelectedUserId("");
    setSelectedRole("");
    setSelectedStatus("");
  }, [
    defaultDate,
    setSelectedFromDate,
    setSelectedToDate,
    setSelectedUserId,
    setSelectedRole,
    setSelectedStatus,
  ]);

  return {
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
    showUserFilter,
    memberOptions,
    roleOptions,
    statusOptions,
    showFilters,
    setShowFilters,
    hasActiveFilters,
    handleClearFilters,
  };
}
