"use client";

import { useCallback } from "react";
import {
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

const CARD_PREFIX = "card-";
const SLOT_PREFIX = "slot-";
const LIST_APPEND_PREFIX = "list-append-";

export function parseCardId(id) {
  if (typeof id !== "string" || !id.startsWith(CARD_PREFIX)) return null;
  return id.slice(CARD_PREFIX.length);
}

export function parseSlotId(id) {
  if (typeof id !== "string" || !id.startsWith(SLOT_PREFIX)) return null;
  const rest = id.slice(SLOT_PREFIX.length);
  const sep = rest.indexOf("--");
  if (sep < 0) return null;
  const listId = rest.slice(0, sep);
  const index = parseInt(rest.slice(sep + 2), 10);
  if (Number.isNaN(index)) return null;
  return { listId, index };
}

export function parseListAppendId(id) {
  if (typeof id !== "string" || !id.startsWith(LIST_APPEND_PREFIX)) return null;
  return id.slice(LIST_APPEND_PREFIX.length);
}

export default function useBoardDnd({
  listIds,
  lists,
  onMoveCardAt,
  onReorderLists,
  setActiveCard,
  setActiveListId,
  setActiveDropTarget,
}) {
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 8 },
  });
  const keyboardSensor = useSensor(KeyboardSensor);
  const sensors = useSensors(pointerSensor, keyboardSensor);

  const onDragStart = useCallback(
    (event) => {
      const { active } = event;
      const id = active.id;
      if (typeof id === "string" && id.startsWith(CARD_PREFIX)) {
        const cardId = id.slice(CARD_PREFIX.length);
        const list = lists.find((l) => (l.Cards || []).some((c) => c.Id === cardId));
        const card = list?.Cards?.find((c) => c.Id === cardId);
        if (card) {
          setActiveCard({ ...card, ListId: list.Id });
          setActiveListId(list.Id);
        }
      }
      if (typeof id === "string" && listIds.includes(id)) {
        setActiveListId(id);
      }
    },
    [lists, setActiveCard, setActiveListId]
  );

  const onDragOver = useCallback(
    (event) => {
      const { over } = event;
      if (!over) {
        setActiveDropTarget?.(null);
        return;
      }
      const overId = String(over.id);
      const slotData = parseSlotId(overId);
      if (slotData) {
        setActiveDropTarget?.({ listId: slotData.listId, index: slotData.index });
        return;
      }
      const appendListId = parseListAppendId(overId);
      if (appendListId) {
        const list = lists.find((l) => l.Id === appendListId);
        setActiveDropTarget?.({
          listId: appendListId,
          index: (list?.Cards?.length ?? 0),
        });
        return;
      }
      setActiveDropTarget?.(null);
    },
    [lists, setActiveDropTarget]
  );

  const onDragEnd = useCallback(
    (event) => {
      const { active, over } = event;
      setActiveCard(null);
      setActiveListId(null);
      setActiveDropTarget?.(null);

      if (!over) return;

      const activeId = String(active.id);
      const overId = String(over.id);

      if (listIds.includes(activeId) && listIds.includes(overId)) {
        const fromIndex = listIds.indexOf(activeId);
        const toIndex = listIds.indexOf(overId);
        if (fromIndex >= 0 && toIndex >= 0 && fromIndex !== toIndex && onReorderLists) {
          const newOrder = [...listIds];
          const [removed] = newOrder.splice(fromIndex, 1);
          newOrder.splice(toIndex, 0, removed);
          onReorderLists(newOrder);
        }
        return;
      }

      if (activeId.startsWith(CARD_PREFIX)) {
        const cardId = activeId.slice(CARD_PREFIX.length);
        const sourceList = lists.find((l) => (l.Cards || []).some((c) => c.Id === cardId));
        const sourceIndex = sourceList?.Cards?.findIndex((c) => c.Id === cardId) ?? -1;
        if (sourceIndex < 0) return;

        let targetListId = null;
        let targetIndex = null;

        const slotData = parseSlotId(overId);
        if (slotData) {
          targetListId = slotData.listId;
          targetIndex = slotData.index;
        } else {
          const appendListId = parseListAppendId(overId);
          if (appendListId) {
            targetListId = appendListId;
            const list = lists.find((l) => l.Id === appendListId);
            targetIndex = (list?.Cards?.length ?? 0);
          }
        }

        if (targetListId != null && targetIndex != null && onMoveCardAt) {
          const sameList = sourceList?.Id === targetListId;
          const sameIndex = sameList && sourceIndex === targetIndex;
          const nextIndexSameList = sameList && sourceIndex === targetIndex - 1;
          if (!sameIndex && !nextIndexSameList) {
            onMoveCardAt(cardId, targetListId, targetIndex);
          }
        }
      }
    },
    [listIds, lists, onMoveCardAt, onReorderLists, setActiveCard, setActiveListId, setActiveDropTarget]
  );

  const onDragCancel = useCallback(() => {
    setActiveCard(null);
    setActiveListId(null);
    setActiveDropTarget?.(null);
  }, [setActiveCard, setActiveListId, setActiveDropTarget]);

  return { sensors, onDragStart, onDragOver, onDragEnd, onDragCancel };
}
