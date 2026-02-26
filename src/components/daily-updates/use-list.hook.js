"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { fetchDailyUpdates } from "@/provider/features/daily-updates/daily-updates.slice";
import { formatDateTime } from "@/common/utils/date.util";
import { AVATAR_COLORS } from "@/common/constants/colors.constant";
import { User } from "lucide-react";
import useDebounce from "@/common/hooks/useDebounce";
import useDailyUpdatesOrg from "../../common/hooks/use-daily-updates-org.hook";

const defaultDate = () => new Date().toISOString().slice(0, 10);

export default function useDailyUpdatesList() {
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    userMap,
    memberOptions,
    roleOptions,
    statusOptions,
    showUserFilter,
    roleLabelByValue,
    statusLabelByValue,
  } = useDailyUpdatesOrg();

  const { updates, fetchDailyUpdates: fetchDailyUpdatesState } = useSelector(
    (state) => state.dailyUpdates || {},
  );
  const currentOrganizationId = useSelector(
    (state) => state.organizations?.currentOrganizationId,
  );

  const [selectedFromDate, setSelectedFromDate] = useState(defaultDate);
  const [selectedToDate, setSelectedToDate] = useState(defaultDate);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [updatesPage, setUpdatesPage] = useState(1);
  const [updatesLimit, setUpdatesLimit] = useState(20);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (currentOrganizationId === undefined) return;
    dispatch(
      fetchDailyUpdates({
        params: {
          from: selectedFromDate,
          to: selectedToDate,
          userId: selectedUserId || undefined,
          role: selectedRole || undefined,
          status: selectedStatus || undefined,
          search: debouncedSearchTerm?.trim() || undefined,
          page: updatesPage,
          limit: updatesLimit,
        },
      }),
    );
  }, [
    currentOrganizationId,
    dispatch,
    selectedFromDate,
    selectedToDate,
    selectedUserId,
    selectedRole,
    selectedStatus,
    debouncedSearchTerm,
    updatesPage,
    updatesLimit,
  ]);

  useEffect(() => {
    setUpdatesPage(1);
  }, [
    selectedFromDate,
    selectedToDate,
    selectedUserId,
    selectedRole,
    selectedStatus,
    searchTerm,
  ]);

  const handleViewUpdate = useCallback(
    (updateId) => {
      if (!updateId) return;
      router.push(`/daily-updates/${updateId}`);
    },
    [router],
  );

  const handleCreateUpdate = useCallback(() => {
    router.push(`/daily-updates/new?date=${selectedFromDate}`);
  }, [router, selectedFromDate]);

  const handleUpdatePageChange = useCallback((page) => {
    setUpdatesPage(page);
  }, []);

  const handleUpdatePageSizeChange = useCallback((size) => {
    setUpdatesLimit(size);
    setUpdatesPage(1);
  }, []);

  const getAvatarColor = useCallback((idOrName) => {
    const str = String(idOrName || "");
    let hash = 0;
    for (let i = 0; i < str.length; i += 1)
      hash = (hash << 5) - hash + str.charCodeAt(i);
    const idx = Math.abs(hash) % AVATAR_COLORS.length;
    return AVATAR_COLORS[idx];
  }, []);

  const getInitials = useCallback((name) => {
    const safeName = String(name || "").trim();
    if (!safeName) return "";
    return safeName
      .split(/\s+/)
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, []);

  const updateColumns = useMemo(
    () => [
      {
        key: "UserId",
        title: "User",
        sortable: false,
        customRender: (row) => (
          <div className="flex items-center gap-2">
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-semibold text-white ${getAvatarColor(
                row.UserId ||
                  row.User?.Id ||
                  userMap.get(row.UserId || row.User?.Id),
              )}`}
            >
              {getInitials(userMap.get(row.UserId || row.User?.Id)) || (
                <User className="h-3.5 w-3.5" />
              )}
            </span>
            <span className="text-sm font-medium text-neutral-700">
              {userMap.get(row.UserId || row.User?.Id) || "—"}
            </span>
          </div>
        ),
      },
      {
        key: "Role",
        title: "Role",
        sortable: false,
        customRender: (row) => (
          <span className="text-sm text-neutral-600">
            {roleLabelByValue[row.Role] || row.Role || "—"}
          </span>
        ),
      },
      {
        key: "OverallStatus",
        title: "Status",
        sortable: false,
        customRender: (row) => (
          <span
            className={`inline-flex rounded-lg px-2.5 py-1 text-xs font-semibold ${
              row.OverallStatus === "on_track"
                ? "bg-emerald-100 text-emerald-700"
                : row.OverallStatus === "at_risk"
                  ? "bg-amber-100 text-amber-700"
                  : row.OverallStatus === "blocked"
                    ? "bg-rose-100 text-rose-700"
                    : "bg-neutral-100 text-neutral-600"
            }`}
          >
            {statusLabelByValue[row.OverallStatus] || row.OverallStatus || "—"}
          </span>
        ),
      },
      {
        key: "WorkItems",
        title: "Work items",
        sortable: false,
        customRender: (row) => (
          <span className="text-sm text-neutral-600">
            {(row.WorkItems || []).length}
          </span>
        ),
      },
      {
        key: "SubmittedAt",
        title: "Submitted",
        sortable: false,
        customRender: (row) => (
          <span className="text-sm text-neutral-600">
            {row.SubmittedAt ? formatDateTime(row.SubmittedAt) : "—"}
          </span>
        ),
      },
    ],
    [
      getAvatarColor,
      getInitials,
      roleLabelByValue,
      statusLabelByValue,
      userMap,
    ],
  );

  const updatesTotal =
    fetchDailyUpdatesState?.data?.total ?? updates?.length ?? 0;

  return {
    updates: updates ?? [],
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
    handleViewUpdate,
    handleCreateUpdate,
    updateColumns,
    updatesPage,
    updatesLimit,
    updatesTotal,
    handleUpdatePageChange,
    handleUpdatePageSizeChange,
  };
}
