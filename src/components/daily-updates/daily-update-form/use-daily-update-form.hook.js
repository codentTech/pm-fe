"use client";

import { useAppNavbarLogic } from "@/common/components/app-navbar/use-app-navbar.component";
import {
  BLOCKER_TYPE_OPTIONS,
  DAILY_UPDATE_CUTOFF_HOURS,
  DAILY_UPDATE_ROLE_OPTIONS,
  DAILY_UPDATE_STATUS_OPTIONS,
  WORK_ITEM_STATUS_OPTIONS,
  WORK_ITEM_TYPES_BY_ROLE,
} from "@/common/constants/daily-update.constant";
import { DAILY_UPDATE_FORM_SCHEMA } from "@/common/constants/schema.constant";
import { getDisplayUser } from "@/common/utils/users.util";
import {
  createDailyUpdate,
  fetchDailyUpdateById,
  updateDailyUpdate,
} from "@/provider/features/daily-updates/daily-updates.slice";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

function createEmptyWorkItem() {
  return {
    id: `${Date.now()}-${Math.random()}`,
    Type: "",
    ReferenceId: "",
    Description: "",
    Status: "in_progress",
    TimeSpent: "",
    BlockerType: "",
    BlockerReason: "",
    ExpectedResolutionDate: "",
    Comments: "",
  };
}

export default function useDailyUpdateForm(updateId) {
  // stats
  const dispatch = useDispatch();
  const { roleLabel } = useAppNavbarLogic();

  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    currentUpdate,
    fetchDailyUpdateById: fetchState,
    createDailyUpdate: createState,
    updateDailyUpdate: updateState,
  } = useSelector((state) => state.dailyUpdates || {});
  const [isEditMode, setIsEditMode] = useState(false);

  const formSchema = useMemo(() => DAILY_UPDATE_FORM_SCHEMA, []);

  const form = useForm({
    defaultValues: {
      Date: "",
      Role: roleLabel,
      OverallStatus: "",
      TotalTimeSpent: "",
      Notes: "",
      NextDayPlan: "",
      WorkItems: [createEmptyWorkItem()],
    },
    resolver: yupResolver(formSchema),
    mode: "onBlur",
  });

  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "WorkItems",
  });

  const statusValue = form.watch("OverallStatus");
  const dateValue = form.watch("Date");
  const totalTimeValue = form.watch("TotalTimeSpent");
  const notesValue = form.watch("Notes");
  const nextDayPlanValue = form.watch("NextDayPlan");

  const workItemTypeOptions = useMemo(() => {
    return WORK_ITEM_TYPES_BY_ROLE[roleLabel] || [];
  }, [roleLabel]);

  const hasBlockedItems = useMemo(() => {
    const watched = form.watch("WorkItems") || [];
    return watched.some((item) => item?.Status === "blocked");
  }, [form]);

  const canEdit = useMemo(() => {
    if (!currentUpdate || !updateId) return true;
    const user = getDisplayUser();
    const ownerId = currentUpdate.UserId || currentUpdate.User?.Id;
    if (!user?.Id || ownerId !== user.Id) return false;
    if (!currentUpdate.Date) return true;
    const date = new Date(currentUpdate.Date);
    const cutoff = new Date(date);
    cutoff.setDate(date.getDate() + 1);
    cutoff.setHours(0, 0, 0, 0);
    cutoff.setHours(cutoff.getHours() + DAILY_UPDATE_CUTOFF_HOURS);
    return new Date() <= cutoff;
  }, [currentUpdate, updateId]);

  // useEffect
  useEffect(() => {
    const dateParam = searchParams?.get("date");
    if (dateParam) form.setValue("Date", dateParam);
  }, [searchParams, form]);

  useEffect(() => {
    if (updateId) {
      setIsEditMode(true);
      dispatch(fetchDailyUpdateById({ id: updateId }));
    }
  }, [dispatch, updateId]);

  useEffect(() => {
    if (!currentUpdate || !updateId) return;
    form.reset({
      Date: currentUpdate.Date || new Date().toISOString().slice(0, 10),
      Role: roleLabel,
      OverallStatus: currentUpdate.OverallStatus || "on_track",
      TotalTimeSpent:
        currentUpdate.TotalTimeSpent != null
          ? String(currentUpdate.TotalTimeSpent)
          : "",
      Notes: currentUpdate.Notes || "",
      NextDayPlan: currentUpdate.NextDayPlan || "",
    });
    const items = (currentUpdate.WorkItems || []).map((item) => ({
      Type: item.Type || "",
      ReferenceId: item.ReferenceId || "",
      Description: item.Description || "",
      Status: item.Status || "in_progress",
      TimeSpent: item.TimeSpent != null ? String(item.TimeSpent) : "",
      BlockerType: item.BlockerType || "",
      BlockerReason: item.BlockerReason || "",
      ExpectedResolutionDate: item.ExpectedResolutionDate
        ? item.ExpectedResolutionDate.slice(0, 10)
        : "",
      Comments: item.Comments || "",
    }));
    replace(items.length ? items : [createEmptyWorkItem()]);
  }, [currentUpdate, updateId, form, replace]);

  useEffect(() => {
    if (hasBlockedItems && form.getValues("OverallStatus") === "on_track") {
      form.setValue("OverallStatus", "blocked");
    }
  }, [hasBlockedItems, form]);

  // functions
  function handleAddWorkItem() {
    append(createEmptyWorkItem());
  }

  function handleRemoveWorkItem(index) {
    remove(index);
  }

  function handleSubmit(values) {
    const payload = {
      Date: values.Date,
      Role: roleLabel,
      OverallStatus: hasBlockedItems ? "blocked" : values.OverallStatus,
      TotalTimeSpent:
        values.TotalTimeSpent !== ""
          ? Number(values.TotalTimeSpent)
          : undefined,
      Notes: values.Notes || undefined,
      NextDayPlan: values.NextDayPlan || undefined,
      WorkItems: (values.WorkItems || []).map((item) => ({
        Type: item.Type,
        ReferenceId: item.ReferenceId || undefined,
        Description: item.Description,
        Status: item.Status,
        TimeSpent: item.TimeSpent !== "" ? Number(item.TimeSpent) : undefined,
        BlockerType: item.BlockerType || undefined,
        BlockerReason: item.BlockerReason || undefined,
        ExpectedResolutionDate: item.ExpectedResolutionDate || undefined,
        Comments: item.Comments || undefined,
      })),
    };

    if (isEditMode && updateId) {
      dispatch(
        updateDailyUpdate({
          id: updateId,
          payload,
          successCallBack: (data) => router.push(`/daily-updates/${data.Id}`),
        }),
      );
      return;
    }

    dispatch(
      createDailyUpdate({
        payload,
        successCallBack: () => router.push("/daily-updates/updates"),
      }),
    );
  }

  return {
    form,
    workItems: fields,
    isEditMode,
    canEdit,
    fetchState,
    createState,
    updateState,
    workItemTypeOptions,
    dailyUpdateRoleOptions: DAILY_UPDATE_ROLE_OPTIONS,
    dailyUpdateStatusOptions: DAILY_UPDATE_STATUS_OPTIONS,
    workItemStatusOptions: WORK_ITEM_STATUS_OPTIONS,
    blockerTypeOptions: BLOCKER_TYPE_OPTIONS,
    roleLabel,
    statusValue,
    dateValue,
    totalTimeValue,
    notesValue,
    nextDayPlanValue,
    hasBlockedItems,
    handleAddWorkItem,
    handleRemoveWorkItem,
    handleSubmit,
  };
}
