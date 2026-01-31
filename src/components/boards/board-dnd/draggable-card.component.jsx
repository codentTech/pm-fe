"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

const CARD_PREFIX = "card-";

export function getCardId(cardId) {
  return `${CARD_PREFIX}${cardId}`;
}

export default function DraggableCard({ card, listId, children, isDragOverlay }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: getCardId(card.Id),
    data: { type: "card", card, listId },
  });

  const style = transform
    ? { transform: CSS.Translate.toString(transform) }
    : undefined;

  if (isDragOverlay) {
    return (
      <div className="cursor-grabbing rounded-lg border border-neutral-200 bg-white p-3 shadow-xl ring-2 ring-primary-400/50">
        {children}
      </div>
    );
  }

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        className="min-h-[56px] rounded-lg border border-neutral-200 bg-neutral-100/90 opacity-40 shadow-sm"
        style={{ minHeight: "56px" }}
        aria-hidden
      />
    );
  }

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="touch-none cursor-grab active:cursor-grabbing">
      {children}
    </div>
  );
}
