"use client";

import useListColumn from "@/components/projects/list-column/use-list-column.hook";

export default function useSortableListColumn(list, onSaveCard, onCancelCard) {
  return useListColumn(list, onSaveCard, onCancelCard);
}
