"use client";

import { useDroppable } from "@dnd-kit/core";

export function getSlotId(listId, index) {
  return `slot-${listId}--${index}`;
}

export default function DropSlot({ listId, index, children }) {
  const { setNodeRef } = useDroppable({
    id: getSlotId(listId, index),
    data: { listId, index },
  });

  return (
    <div
      ref={setNodeRef}
      className="min-h-[6px] flex-shrink-0"
      aria-hidden
    >
      {children}
    </div>
  );
}
