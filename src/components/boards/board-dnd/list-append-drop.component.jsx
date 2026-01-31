"use client";

import { useDroppable } from "@dnd-kit/core";

export function getListAppendId(listId) {
  return `list-append-${listId}`;
}

export default function ListAppendDrop({ listId, children }) {
  const { setNodeRef } = useDroppable({
    id: getListAppendId(listId),
    data: { listId },
  });

  return (
    <div ref={setNodeRef} className="min-h-[32px] shrink-0 rounded-lg">
      {children}
    </div>
  );
}
