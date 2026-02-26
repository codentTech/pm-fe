"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMembers } from "@/provider/features/organizations/organizations.slice";
import { getDisplayUser } from "@/common/utils/users.util";
import {
  DAILY_UPDATE_ROLE_OPTIONS,
  DAILY_UPDATE_STATUS_OPTIONS,
} from "@/common/constants/daily-update.constant";

/**
 * Shared hook for daily-updates: org members, current user, and filter dropdown options.
 * Use in list, backlogs, analytics, and dashboard to avoid duplicating member fetch and options.
 */
export default function useDailyUpdatesOrg() {
  const dispatch = useDispatch();
  const currentOrganizationId = useSelector(
    (state) => state.organizations?.currentOrganizationId,
  );
  const [orgMembers, setOrgMembers] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

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

  const userMap = useMemo(() => {
    const map = new Map();
    (orgMembers || []).forEach((m) => {
      const id = m.User?.Id || m.UserId;
      const name = m.User?.FullName || m.User?.Email || "Unknown";
      if (id) map.set(id, name);
    });
    return map;
  }, [orgMembers]);

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

  const roleLabelByValue = useMemo(
    () =>
      DAILY_UPDATE_ROLE_OPTIONS.reduce(
        (acc, option) => ({ ...acc, [option.value]: option.label }),
        {},
      ),
    [],
  );

  const statusLabelByValue = useMemo(
    () =>
      DAILY_UPDATE_STATUS_OPTIONS.reduce(
        (acc, option) => ({ ...acc, [option.value]: option.label }),
        {},
      ),
    [],
  );

  return {
    orgMembers,
    currentUserId,
    userMap,
    memberOptions,
    roleOptions,
    statusOptions,
    showUserFilter,
    roleLabelByValue,
    statusLabelByValue,
  };
}
