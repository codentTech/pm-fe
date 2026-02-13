import { useMemo } from "react";
import {
  DAILY_UPDATE_ROLE_OPTIONS,
  DAILY_UPDATE_STATUS_OPTIONS,
  WORK_ITEM_STATUS_OPTIONS,
  WORK_ITEM_TYPES_BY_ROLE,
} from "@/common/constants/daily-update.constant";

export default function useDailyUpdateDetailView(currentUpdate) {
  const workItems = useMemo(() => currentUpdate?.WorkItems || [], [currentUpdate]);
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

  return {
    workItems: filteredWorkItems,
    blockedItems,
    statusLabelMap,
    roleLabelMap,
    workItemTypeLabelMap,
    workItemStatusLabelMap,
  };
}
