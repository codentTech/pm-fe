"use client";

import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { fetchDailyUpdateById } from "@/provider/features/daily-updates/daily-updates.slice";
import { getDisplayUser } from "@/common/utils/users.util";
import { DAILY_UPDATE_CUTOFF_HOURS } from "@/common/constants/daily-update.constant";

export default function useDailyUpdateDetail(updateId) {
  // stats
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

  // useEffect
  useEffect(() => {
    if (updateId) dispatch(fetchDailyUpdateById({ id: updateId }));
  }, [dispatch, updateId]);

  // functions
  function handleEdit() {
    if (!updateId) return;
    router.push(`/daily-updates/${updateId}/edit`);
  }

  return {
    currentUpdate,
    fetchState,
    canEdit,
    handleEdit,
  };
}
