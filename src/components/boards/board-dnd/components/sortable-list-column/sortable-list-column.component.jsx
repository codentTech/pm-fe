"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus, MoreHorizontal, Trash2 } from "lucide-react";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import TextArea from "@/common/components/text-area/text-area.component";
import CardItem from "@/components/boards/card-item/card-item.component";
import DraggableCard from "../draggable-card/draggable-card.component";
import DropSlot from "../drop-slot/drop-slot.component";
import ListAppendDrop from "../list-append-drop/list-append-drop.component";
import { LIST_COLORS } from "@/common/constants/colors.constant";
import useSortableListColumn from "./use-sortable-list-column.hook";

function getListColor(index) {
  return LIST_COLORS[(index ?? 0) % LIST_COLORS.length];
}

// Card-sized gap in the flow; spacing matches card gaps (py-0.5 = 2px, slot = 8px).
function InsertionPlaceholder() {
  return (
    <div
      className="my-0.5 min-h-[72px] shrink-0 rounded-lg border border-neutral-300 bg-neutral-100/60 animate-fade-in"
      aria-hidden
    />
  );
}

export default function SortableListColumn({
  list,
  listIndex = 0,
  activeDropTarget,
  activeCard,
  onAddCard,
  showAddCard,
  onSaveCard,
  onCancelCard,
  onMoveCard,
  onRequestDeleteList,
  onDeleteCard,
  onCardClick,
  otherLists,
  isSavingCard = false,
}) {
  const {
    cardTitle,
    setCardTitle,
    cardDescription,
    setCardDescription,
    cardDueDate,
    setCardDueDate,
    showMenu,
    setShowMenu,
    cards,
    handleSaveCard,
    handleCardFormKeyDown,
    handleCancelCard,
  } = useSortableListColumn(list, onSaveCard, onCancelCard);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: list.Id, data: { type: "list", listId: list.Id } });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="min-w-[240px] max-w-[240px] shrink-0 rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-100/80 opacity-60 sm:min-w-[280px] sm:max-w-[280px]"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`min-w-[240px] max-w-[240px] shrink-0 overflow-hidden rounded-xl bg-gradient-to-br sm:min-w-[280px] sm:max-w-[280px] ${getListColor(listIndex)}`}
    >
      <div className="flex h-full flex-col rounded-[10px] border border-neutral-200 bg-neutral-100/80 p-2.5 sm:p-3">
        <div
          className="mb-2 flex cursor-grab flex-col active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <div className={`h-2 rounded-t-[10px] ${getListColor(listIndex)}`} />
          <div className="flex items-center justify-between gap-2">
            <h3 className="flex-1 truncate font-bold text-neutral-800 typography-h4">
              {list.Title}
            </h3>
            <span className="typography-caption font-medium text-neutral-600">
              {cards.length}
            </span>
            <div
              className="relative shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              {onRequestDeleteList && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setShowMenu(showMenu === list.Id ? null : list.Id)
                    }
                    className="rounded p-1 text-neutral-600 hover:bg-neutral-300 hover:text-neutral-800 focus:outline-none"
                    aria-label="List options"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                  {showMenu === list.Id && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        aria-hidden
                        onClick={() => setShowMenu(null)}
                      />
                      <div className="absolute right-0 top-full z-20 mt-1 w-36 rounded-lg border border-neutral-200 bg-white py-1 shadow-lg">
                        <button
                          type="button"
                          onClick={() => {
                            onRequestDeleteList(list.Id);
                            setShowMenu(null);
                          }}
                          className="flex w-full items-center gap-2 px-3 py-2 font-medium text-danger-600 typography-body hover:bg-danger-50"
                        >
                          <Trash2 className="h-4 w-4 shrink-0" />
                          Delete list
                        </button>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        <div className="space-y-0">
          {cards.map((card, index) => (
            <div key={card.Id} className="space-y-0">
              <DropSlot listId={list.Id} index={index} />
              {activeCard &&
                activeDropTarget?.listId === list.Id &&
                activeDropTarget?.index === index && <InsertionPlaceholder />}
              {activeCard &&
                activeDropTarget?.listId === list.Id &&
                activeDropTarget?.index === index && (
                  <div className="h-2 shrink-0" aria-hidden />
                )}
              <div className="py-0.5">
                <DraggableCard card={card} listId={list.Id}>
                  <CardItem
                    card={card}
                    cardIndex={index}
                    onMoveTo={onMoveCard}
                    onDelete={onDeleteCard}
                    onCardClick={onCardClick}
                    otherLists={otherLists}
                  />
                </DraggableCard>
              </div>
            </div>
          ))}
          <DropSlot listId={list.Id} index={cards.length} />
          {activeCard &&
            activeDropTarget?.listId === list.Id &&
            activeDropTarget?.index === cards.length && (
              <InsertionPlaceholder />
            )}
          {activeCard &&
            activeDropTarget?.listId === list.Id &&
            activeDropTarget?.index === cards.length && (
              <div className="h-2 shrink-0" aria-hidden />
            )}
          <ListAppendDrop listId={list.Id}>
            <div className="py-0.5">
              {showAddCard ? (
                <div className="rounded-lg border border-neutral-200 bg-white p-3 shadow-sm">
                  <div className="mb-2 [&_.form-group]:!mb-0">
                    <CustomInput
                      name="cardTitle"
                      type="text"
                      placeholder="Enter a title for this card…"
                      value={cardTitle}
                      onChange={(e) => setCardTitle(e.target.value)}
                      onKeyDown={handleCardFormKeyDown}
                    />
                  </div>
                  <div className="mb-2 [&_.form-group]:!mb-0">
                    <TextArea
                      name="cardDescription"
                      placeholder="Description (optional)"
                      minRows={2}
                      value={cardDescription}
                      onChange={(e) => setCardDescription(e.target.value)}
                    />
                  </div>
                  <div className="mb-3 [&_.form-group]:!mb-0">
                    <CustomInput
                      name="cardDueDate"
                      type="date"
                      value={cardDueDate}
                      onChange={(e) => setCardDueDate(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <CustomButton
                      text="Add card"
                      variant="primary"
                      onClick={handleSaveCard}
                      className="rounded-lg"
                      loading={isSavingCard}
                    />
                    <CustomButton
                      text="Cancel"
                      variant="cancel"
                      onClick={handleCancelCard}
                      className="rounded-lg"
                    />
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={onAddCard}
                  className="flex w-full items-center gap-2 rounded-lg bg-white/80 py-2.5 pl-3 text-left font-medium text-neutral-600 typography-body transition-colors hover:bg-white hover:text-neutral-800 focus:outline-none"
                >
                  <Plus className="h-4 w-4 shrink-0" />
                  Add a card
                </button>
              )}
            </div>
          </ListAppendDrop>
        </div>
      </div>
    </div>
  );
}
