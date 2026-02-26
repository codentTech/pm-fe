"use client";

import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { fetchDailyUpdateById } from "@/provider/features/daily-updates/daily-updates.slice";
import { getDisplayUser } from "@/common/utils/users.util";
import {
  DAILY_UPDATE_CUTOFF_HOURS,
  DAILY_UPDATE_ROLE_OPTIONS,
  DAILY_UPDATE_STATUS_OPTIONS,
  WORK_ITEM_STATUS_OPTIONS,
  WORK_ITEM_TYPES_BY_ROLE,
} from "@/common/constants/daily-update.constant";

export default function useDailyUpdateDetail(updateId) {
  const dispatch = useDispatch();
  const router = useRouter();
  const {
    currentUpdate,
    fetchDailyUpdateById: fetchState,
  } = useSelector((state) => state.dailyUpdates || {});

  const displayUser = useMemo(() => getDisplayUser(), []);

  const canEdit = useMemo(() => {
    if (!currentUpdate || !displayUser?.Id) return false;
    const ownerId = currentUpdate.UserId || currentUpdate.User?.Id;
    if (ownerId !== displayUser.Id) return false;
    if (!currentUpdate.Date) return true;
    const date = new Date(currentUpdate.Date);
    const cutoff = new Date(date);
    cutoff.setDate(date.getDate() + 1);
    cutoff.setHours(0, 0, 0, 0);
    cutoff.setHours(cutoff.getHours() + DAILY_UPDATE_CUTOFF_HOURS);
    return new Date() <= cutoff;
  }, [currentUpdate, displayUser?.Id]);

  useEffect(() => {
    if (updateId) dispatch(fetchDailyUpdateById({ id: updateId }));
  }, [dispatch, updateId]);

  const workItems = useMemo(
    () => currentUpdate?.WorkItems || [],
    [currentUpdate],
  );
  const roleValue = currentUpdate?.Role;
  const allowedTypes = WORK_ITEM_TYPES_BY_ROLE?.[roleValue] || [];
  const allowedTypeSet = useMemo(
    () => new Set(allowedTypes.map((option) => option.value)),
    [allowedTypes],
  );

  const filteredWorkItems = useMemo(() => {
    if (!roleValue || allowedTypes.length === 0) return workItems;
    return workItems.filter((item) => allowedTypeSet.has(item.Type));
  }, [workItems, roleValue, allowedTypes, allowedTypeSet]);

  const blockedItems = useMemo(
    () => filteredWorkItems.filter((item) => item.Status === "blocked"),
    [filteredWorkItems],
  );

  const statusLabelMap = useMemo(
    () =>
      DAILY_UPDATE_STATUS_OPTIONS.reduce(
        (acc, option) => ({ ...acc, [option.value]: option.label }),
        {},
      ),
    [],
  );

  const roleLabelMap = useMemo(
    () =>
      DAILY_UPDATE_ROLE_OPTIONS.reduce(
        (acc, option) => ({ ...acc, [option.value]: option.label }),
        {},
      ),
    [],
  );

  const workItemTypeLabelMap = useMemo(
    () =>
      Object.values(WORK_ITEM_TYPES_BY_ROLE)
        .flat()
        .reduce((acc, option) => ({ ...acc, [option.value]: option.label }), {}),
    [],
  );

  const workItemStatusLabelMap = useMemo(
    () =>
      WORK_ITEM_STATUS_OPTIONS.reduce(
        (acc, option) => ({ ...acc, [option.value]: option.label }),
        {},
      ),
    [],
  );

  function handleEdit() {
    if (!updateId) return;
    router.push(`/daily-updates/${updateId}/edit`);
  }

  return {
    currentUpdate,
    fetchState,
    canEdit,
    handleEdit,
    workItems: filteredWorkItems,
    blockedItems,
    statusLabelMap,
    roleLabelMap,
    workItemTypeLabelMap,
    workItemStatusLabelMap,
  };
}
