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
      <div
        className="cursor-grabbing overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-2xl will-change-transform"
        style={{
          transform: "scale(1.02) rotate(0.5deg)",
          boxShadow:
            "0 25px 50px -12px rgba(0,0,0,0.25), 0 0 0 1px rgba(0,0,0,0.05)",
        }}
      >
        {children}
      </div>
    );
  }

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        className="min-h-[72px] rounded-lg border border-neutral-300 bg-neutral-100/60 transition-opacity duration-150"
        style={{ minHeight: "72px" }}
        aria-hidden
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="touch-none cursor-grab active:cursor-grabbing transition-shadow duration-150"
    >
      {children}
    </div>
  );
}
