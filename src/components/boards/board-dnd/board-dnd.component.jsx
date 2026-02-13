"use client";

import {
  DndContext,
  DragOverlay,
  closestCorners,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import CardItem from "@/components/boards/card-item/card-item.component";
import DraggableCard from "./components/draggable-card/draggable-card.component";
import useBoardDnd from "./use-board-dnd.hook";

// Use closestCorners so you can drop anywhere near a slot - no need to be precisely over the tiny gap.
// pointerWithin required the cursor inside the droppable, making 12px slots nearly impossible to hit.
function cardCollisionDetection(args) {
  return closestCorners(args);
}

const dropAnimationConfig = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: "0",
        transition: "opacity 180ms cubic-bezier(0.25, 0.1, 0.25, 1)",
      },
    },
  }),
  duration: 200,
  easing: "cubic-bezier(0.22, 1, 0.36, 1)",
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
  wipByListId,
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
    wipByListId,
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
