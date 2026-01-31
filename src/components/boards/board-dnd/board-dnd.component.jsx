"use client";

import {
  DndContext,
  DragOverlay,
  closestCenter,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import CardItem from "@/components/boards/card-item/card-item.component";
import DraggableCard from "./draggable-card.component";
import useBoardDnd from "./use-board-dnd.hook";

// Use closestCenter so the slot whose center is closest to the dragging card wins.
// This lets small (6px) slots between cards win over the large list-append area.
function cardCollisionDetection(args) {
  return closestCenter(args);
}

const dropAnimationConfig = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: "0.5",
      },
    },
  }),
  duration: 200,
  easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
};

export default function BoardDnd({
  listIds,
  lists,
  onMoveCardAt,
  onReorderLists,
  activeCard,
  setActiveCard,
  setActiveListId,
  setActiveDropTarget,
  children,
}) {
  const { sensors, onDragStart, onDragOver, onDragEnd, onDragCancel } = useBoardDnd({
    listIds,
    lists,
    onMoveCardAt,
    onReorderLists,
    setActiveCard,
    setActiveListId,
    setActiveDropTarget,
  });

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={cardCollisionDetection}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      onDragCancel={onDragCancel}
    >
      <SortableContext items={listIds} strategy={horizontalListSortingStrategy}>
        {children}
      </SortableContext>
      <DragOverlay dropAnimation={dropAnimationConfig}>
        {activeCard ? (
          <DraggableCard card={activeCard} listId={activeCard.ListId} isDragOverlay>
            <CardItem
              card={activeCard}
              onMoveTo={() => {}}
              onDelete={null}
              onCardClick={null}
              otherLists={[]}
            />
          </DraggableCard>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
