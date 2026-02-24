"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
  fetchBlockerBacklog,
  fetchDailyUpdates,
  fetchMissingUpdateBacklog,
  fetchOffPlanBacklog,
} from "@/provider/features/daily-updates/daily-updates.slice";
import { fetchMembers } from "@/provider/features/organizations/organizations.slice";
import { getDisplayUser } from "@/common/utils/users.util";
import { formatDate, formatDateTime } from "@/common/utils/date.util";
import {
  DAILY_UPDATE_ROLE_OPTIONS,
  DAILY_UPDATE_STATUS_OPTIONS,
  WORK_ITEM_TYPES_BY_ROLE,
} from "@/common/constants/daily-update.constant";
import { AVATAR_COLORS } from "@/common/constants/colors.constant";
import { User } from "lucide-react";
import dailyUpdatesService from "@/provider/features/daily-updates/daily-updates.service";
import useDebounce from "@/common/hooks/useDebounce";
import CustomButton from "@/common/components/custom-button/custom-button.component";

export default function useDailyUpdatesTracker() {
  // stats
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    updates,
    fetchDailyUpdates: fetchDailyUpdatesState,
    missingUpdateBacklog,
    blockerBacklog,
    offPlanBacklog,
  } = useSelector((state) => state.dailyUpdates || {});
  const currentOrganizationId = useSelector(
    (state) => state.organizations?.currentOrganizationId,
  );
  const [activeTab, setActiveTab] = useState("updates");
  const [activeBacklogTab, setActiveBacklogTab] = useState("missing");
  const [selectedFromDate, setSelectedFromDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [selectedToDate, setSelectedToDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [updatesPage, setUpdatesPage] = useState(1);
  const [updatesLimit, setUpdatesLimit] = useState(20);
  const [backlogPage, setBacklogPage] = useState(1);
  const [backlogLimit, setBacklogLimit] = useState(20);
  const [orgMembers, setOrgMembers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [analyticsState, setAnalyticsState] = useState({
    isLoading: false,
    data: null,
    error: null,
  });
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const statusLabelByValue = useMemo(
    () =>
      DAILY_UPDATE_STATUS_OPTIONS.reduce(
        (acc, option) => ({ ...acc, [option.value]: option.label }),
        {},
      ),
    [],
  );

  const roleLabelByValue = useMemo(
    () =>
      DAILY_UPDATE_ROLE_OPTIONS.reduce(
        (acc, option) => ({ ...acc, [option.value]: option.label }),
        {},
      ),
    [],
  );

  const userMap = useMemo(() => {
    const map = new Map();
    (orgMembers || []).forEach((m) => {
      const id = m.User?.Id || m.UserId;
      const name = m.User?.FullName || m.User?.Email || "Unknown";
      if (id) map.set(id, name);
    });
    return map;
  }, [orgMembers]);

  const myUpdate = useMemo(() => {
    if (!currentUserId) return null;
    return (updates || []).find(
      (u) => u.UserId === currentUserId || u.User?.Id === currentUserId,
    );
  }, [updates, currentUserId]);

  const memberOptions = useMemo(() => {
    const base = [{ value: "", label: "All users" }];
    const mapped = (orgMembers || [])
      .map((m) => ({
        value: m.User?.Id || m.UserId,
        label: m.User?.FullName || m.User?.Email || "Unknown",
      }))
      .filter((option) => option.value);
    return [...base, ...mapped];
  }, [orgMembers]);

  /** Org admin and project managers can filter by user; others see only their own updates (enforced by backend). */
  const showUserFilter = useMemo(() => {
    if (!currentUserId || !orgMembers?.length) return false;
    const myMembership = (orgMembers || []).find(
      (m) => (m.User?.Id || m.UserId) === currentUserId,
    );
    const role = (myMembership?.Role || "").toLowerCase();
    return role === "org_admin" || role === "project_manager";
  }, [currentUserId, orgMembers]);

  const roleOptions = useMemo(
    () => [{ value: "", label: "All roles" }, ...DAILY_UPDATE_ROLE_OPTIONS],
    [],
  );

  const statusOptions = useMemo(
    () => [
      { value: "", label: "All statuses" },
      ...DAILY_UPDATE_STATUS_OPTIONS,
    ],
    [],
  );

  // useEffect
  useEffect(() => {
    const user = getDisplayUser();
    setCurrentUserId(user?.Id || user?.id || null);
  }, []);

  useEffect(() => {
    if (!currentOrganizationId) {
      setOrgMembers([]);
      return;
    }
    dispatch(
      fetchMembers({
        orgId: currentOrganizationId,
        successCallBack: (data) => setOrgMembers(data || []),
        errorCallBack: () => setOrgMembers([]),
      }),
    );
  }, [dispatch, currentOrganizationId]);

  useEffect(() => {
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
    if (activeTab !== "backlogs") return;
    const from = selectedFromDate;
    const to = selectedToDate;
    if (activeBacklogTab === "missing") {
      dispatch(
        fetchMissingUpdateBacklog({
          params: {
            date: selectedFromDate,
            page: backlogPage,
            limit: backlogLimit,
          },
        }),
      );
    }
    if (activeBacklogTab === "blockers") {
      dispatch(
        fetchBlockerBacklog({
          params: { from, to, page: backlogPage, limit: backlogLimit },
        }),
      );
    }
    if (activeBacklogTab === "off_plan") {
      dispatch(
        fetchOffPlanBacklog({
          params: { from, to, page: backlogPage, limit: backlogLimit },
        }),
      );
    }
  }, [
    activeTab,
    activeBacklogTab,
    selectedFromDate,
    selectedToDate,
    backlogPage,
    backlogLimit,
    dispatch,
  ]);

  useEffect(() => {
    if (activeTab !== "analytics") return;
    const params = {
      from: selectedFromDate,
      to: selectedToDate,
      userId: selectedUserId || undefined,
      role: selectedRole || undefined,
      status: selectedStatus || undefined,
      page: 1,
      limit: 100,
    };
    setAnalyticsState({ isLoading: true, data: null, error: null });
    dailyUpdatesService
      .fetchDailyUpdates(currentOrganizationId, params)
      .then((response) => {
        if (response?.success && response?.data) {
          setAnalyticsState({
            isLoading: false,
            data: response.data,
            error: null,
          });
        } else {
          setAnalyticsState({
            isLoading: false,
            data: null,
            error: response?.message || "Failed to load analytics",
          });
        }
      })
      .catch((error) => {
        setAnalyticsState({
          isLoading: false,
          data: null,
          error: error?.message || "Failed to load analytics",
        });
      });
  }, [
    activeTab,
    currentOrganizationId,
    selectedFromDate,
    selectedToDate,
    selectedUserId,
    selectedRole,
    selectedStatus,
  ]);

  // functions
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

  const handleBacklogPageChange = useCallback((page) => {
    setBacklogPage(page);
  }, []);

  const handleBacklogPageSizeChange = useCallback((size) => {
    setBacklogLimit(size);
    setBacklogPage(1);
  }, []);

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

  useEffect(() => {
    setBacklogPage(1);
  }, [activeBacklogTab, selectedFromDate, selectedToDate]);

  useEffect(() => {
    if (activeTab !== "analytics") return;
    const from = selectedFromDate;
    const to = selectedToDate;
    dispatch(
      fetchMissingUpdateBacklog({
        params: { date: selectedFromDate, page: 1, limit: 20 },
      }),
    );
    dispatch(
      fetchBlockerBacklog({
        params: { from, to, page: 1, limit: 20 },
      }),
    );
    dispatch(
      fetchOffPlanBacklog({
        params: { from, to, page: 1, limit: 20 },
      }),
    );
  }, [activeTab, dispatch, selectedFromDate, selectedToDate]);

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

  const backlogColumns = useMemo(() => {
    const base = [
      {
        key: "UserId",
        title: "User",
        sortable: false,
        customRender: (row) => (
          <span className="text-sm text-neutral-700">
            {userMap.get(row.UserId || row.User?.Id) || "—"}
          </span>
        ),
      },
      {
        key: "Date",
        title: "Date",
        sortable: false,
        customRender: (row) => (
          <span className="text-sm text-neutral-600">
            {formatDate(row.Date || row.MissedDate)}
          </span>
        ),
      },
      {
        key: "Details",
        title: "Details",
        sortable: false,
        customRender: (row) => (
          <span className="text-sm text-neutral-600">
            {row.Details || row.Reason || "—"}
          </span>
        ),
      },
    ];
    if (activeBacklogTab === "blockers") {
      base.splice(2, 0, {
        key: "BlockerType",
        title: "Blocker type",
        sortable: false,
        customRender: (row) => (
          <span className="text-sm text-neutral-600">
            {row.BlockerType || "—"}
          </span>
        ),
      });
      base.splice(3, 0, {
        key: "ExpectedResolutionDate",
        title: "Resolution",
        sortable: false,
        customRender: (row) => (
          <span className="text-sm text-neutral-600">
            {row.ExpectedResolutionDate
              ? formatDate(row.ExpectedResolutionDate)
              : "—"}
          </span>
        ),
      });
    }
    base.push({
      key: "Actions",
      title: "",
      sortable: false,
      customRender: (row) =>
        row.DailyUpdateId ? (
          <CustomButton
            text="View"
            variant="ghost"
            size="sm"
            onClick={() => handleViewUpdate(row.DailyUpdateId)}
          />
        ) : null,
    });
    return base;
  }, [activeBacklogTab, handleViewUpdate, userMap]);

  const backlogData =
    activeBacklogTab === "missing"
      ? (missingUpdateBacklog?.data?.items ?? missingUpdateBacklog?.data ?? [])
      : activeBacklogTab === "blockers"
        ? (blockerBacklog?.data?.items ?? blockerBacklog?.data ?? [])
        : (offPlanBacklog?.data?.items ?? offPlanBacklog?.data ?? []);

  const backlogLoading =
    activeBacklogTab === "missing"
      ? missingUpdateBacklog?.isLoading
      : activeBacklogTab === "blockers"
        ? blockerBacklog?.isLoading
        : offPlanBacklog?.isLoading;

  const updatesTotal =
    fetchDailyUpdatesState?.data?.total ?? updates.length ?? 0;
  const backlogTotal =
    activeBacklogTab === "missing"
      ? (missingUpdateBacklog?.data?.total ?? backlogData.length)
      : activeBacklogTab === "blockers"
        ? (blockerBacklog?.data?.total ?? backlogData.length)
        : (offPlanBacklog?.data?.total ?? backlogData.length);

  const analyticsItems = analyticsState?.data?.items || [];
  const analyticsStatusCounts = useMemo(() => {
    return analyticsItems.reduce(
      (acc, item) => {
        const key = item.OverallStatus || "unknown";
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      },
      { on_track: 0, at_risk: 0, blocked: 0, unknown: 0 },
    );
  }, [analyticsItems]);

  const analyticsWorkItemCount = useMemo(() => {
    return analyticsItems.reduce(
      (acc, item) => acc + (item.WorkItems?.length || 0),
      0,
    );
  }, [analyticsItems]);

  const analyticsBlockedWorkItemCount = useMemo(() => {
    return analyticsItems.reduce((acc, item) => {
      const blocked = (item.WorkItems || []).filter(
        (wi) => wi.Status === "blocked",
      ).length;
      return acc + blocked;
    }, 0);
  }, [analyticsItems]);

  const analyticsSummary = useMemo(
    () => ({
      totalUpdates: analyticsState?.data?.total ?? analyticsItems.length,
      onTrack: analyticsStatusCounts.on_track || 0,
      atRisk: analyticsStatusCounts.at_risk || 0,
      blocked: analyticsStatusCounts.blocked || 0,
      workItems: analyticsWorkItemCount,
      blockedWorkItems: analyticsBlockedWorkItemCount,
      missingUpdates: missingUpdateBacklog?.data?.total ?? 0,
      blockerBacklog: blockerBacklog?.data?.total ?? 0,
      offPlan: offPlanBacklog?.data?.total ?? 0,
    }),
    [
      analyticsBlockedWorkItemCount,
      analyticsItems.length,
      analyticsState?.data?.total,
      analyticsStatusCounts.at_risk,
      analyticsStatusCounts.blocked,
      analyticsStatusCounts.on_track,
      analyticsWorkItemCount,
      blockerBacklog?.data?.total,
      missingUpdateBacklog?.data?.total,
      offPlanBacklog?.data?.total,
    ],
  );

  const analyticsWorkItemTypeData = useMemo(() => {
    const labelMap = Object.values(WORK_ITEM_TYPES_BY_ROLE)
      .flat()
      .reduce((acc, option) => ({ ...acc, [option.value]: option.label }), {});
    const counts = new Map();
    analyticsItems.forEach((item) => {
      (item.WorkItems || []).forEach((work) => {
        const key = work.Type || "unknown";
        counts.set(key, (counts.get(key) || 0) + 1);
      });
    });
    return Array.from(counts.entries()).map(([key, value]) => ({
      name: labelMap[key] || key,
      value,
    }));
  }, [analyticsItems]);

  const analyticsUpdatesByDate = useMemo(() => {
    const counts = new Map();
    analyticsItems.forEach((item) => {
      const dateKey = item.Date ? formatDate(item.Date) : "Unknown";
      counts.set(dateKey, (counts.get(dateKey) || 0) + 1);
    });
    return Array.from(counts.entries()).map(([date, count]) => ({
      date,
      count,
    }));
  }, [analyticsItems]);

  return {
    updates,
    fetchDailyUpdatesState,
    activeTab,
    setActiveTab,
    activeBacklogTab,
    setActiveBacklogTab,
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
    userMap,
    roleLabelByValue,
    statusLabelByValue,
    searchTerm,
    setSearchTerm,
    myUpdate,
    handleViewUpdate,
    handleCreateUpdate,
    updateColumns,
    backlogColumns,
    backlogData,
    backlogLoading,
    analyticsState,
    analyticsSummary,
    analyticsItems,
    analyticsWorkItemTypeData,
    analyticsUpdatesByDate,
    updatesPage,
    updatesLimit,
    updatesTotal,
    handleUpdatePageChange,
    handleUpdatePageSizeChange,
    backlogPage,
    backlogLimit,
    backlogTotal,
    handleBacklogPageChange,
    handleBacklogPageSizeChange,
  };
}
