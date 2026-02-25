"use client";

import { useCallback, useRef } from "react";
import {
  PointerSensor,
  TouchSensor,
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
  wipByListId,
}) {
  // Trello-style: 5px activation distance for snappier feel; TouchSensor for mobile
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 5 },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 150, tolerance: 5 },
  });
  const keyboardSensor = useSensor(KeyboardSensor);
  const sensors = useSensors(pointerSensor, touchSensor, keyboardSensor);

  // functions
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

  const lastTargetRef = useRef(null);
  const onDragOver = useCallback(
    (event) => {
      const { active, over } = event;
      let nextTarget = null;
      if (over) {
        const overId = String(over.id);
        const slotData = parseSlotId(overId);
        if (slotData) {
          nextTarget = { listId: slotData.listId, index: slotData.index };
        } else {
          const appendListId = parseListAppendId(overId);
          if (appendListId) {
            const list = lists.find((l) => l.Id === appendListId);
            nextTarget = {
              listId: appendListId,
              index: (list?.Cards?.length ?? 0),
            };
          }
        }
      }
      if (nextTarget && typeof active?.id === "string" && active.id.startsWith(CARD_PREFIX)) {
        const cardId = active.id.slice(CARD_PREFIX.length);
        const sourceList = lists.find((l) => (l.Cards || []).some((c) => c.Id === cardId));
        const sourceListId = sourceList?.Id;
        const wipInfo = wipByListId?.[nextTarget.listId];
        const isBlocked =
          !!wipInfo?.isBlocked && sourceListId && sourceListId !== nextTarget.listId;
        if (isBlocked) {
          lastTargetRef.current = null;
          setActiveDropTarget?.(null);
          return;
        }
      }

      const prev = lastTargetRef.current;
      const same =
        prev &&
        nextTarget &&
        prev.listId === nextTarget.listId &&
        prev.index === nextTarget.index;
      if (!same) {
        lastTargetRef.current = nextTarget;
        setActiveDropTarget?.(nextTarget);
      }
    },
    [lists, setActiveDropTarget, wipByListId]
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
        const sourceListId = sourceList?.Id;

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
          const targetWip = wipByListId?.[targetListId];
          const wipBlocked =
            !!targetWip?.isBlocked && sourceListId && sourceListId !== targetListId;
          if (!sameIndex && !nextIndexSameList && !wipBlocked) {
            onMoveCardAt(cardId, targetListId, targetIndex);
          }
        }
      }
    },
    [
      listIds,
      lists,
      onMoveCardAt,
      onReorderLists,
      setActiveCard,
      setActiveListId,
      setActiveDropTarget,
      wipByListId,
    ]
  );

  const onDragCancel = useCallback(() => {
    lastTargetRef.current = null;
    setActiveCard(null);
    setActiveListId(null);
    setActiveDropTarget?.(null);
  }, [setActiveCard, setActiveListId, setActiveDropTarget]);

  return { sensors, onDragStart, onDragOver, onDragEnd, onDragCancel };
}
