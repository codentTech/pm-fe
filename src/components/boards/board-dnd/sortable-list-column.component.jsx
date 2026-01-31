"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus, MoreHorizontal, Trash2 } from "lucide-react";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import TextArea from "@/common/components/text-area/text-area.component";
import CardItem from "@/components/boards/card-item/card-item.component";
import useListColumn from "@/components/boards/list-column/use-list-column.hook";
import DraggableCard from "./draggable-card.component";
import DropSlot from "./drop-slot.component";
import ListAppendDrop from "./list-append-drop.component";

// Trello-style: card-sized gap in the flow so other cards shift to make room.
function InsertionPlaceholder() {
  return (
    <div
      className="my-1 min-h-[56px] shrink-0 rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-100/50 transition-all"
      aria-hidden
    />
  );
}

export default function SortableListColumn({
  list,
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
    resetCardForm,
  } = useListColumn(list);

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

  const handleSaveCard = () => {
    if (!cardTitle?.trim()) return;
    onSaveCard({
      Title: cardTitle.trim(),
      Description: cardDescription?.trim() || undefined,
      DueDate: cardDueDate || undefined,
    });
    resetCardForm();
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="min-w-[280px] max-w-[280px] shrink-0 rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-100/80 opacity-60"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="min-w-[280px] max-w-[280px] shrink-0 rounded-lg border border-neutral-200 bg-neutral-200/50 p-3"
    >
      <div
        className="mb-2 flex cursor-grab items-center justify-between gap-2 active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <h3 className="flex-1 truncate font-semibold text-neutral-800">
          {list.Title}
        </h3>
        <span className="text-xs font-medium text-neutral-500">
          {cards.length}
        </span>
        <div className="relative" onClick={(e) => e.stopPropagation()}>
          {onRequestDeleteList && (
            <>
              <button
                type="button"
                onClick={() =>
                  setShowMenu(showMenu === list.Id ? null : list.Id)
                }
                className="rounded p-1 text-neutral-500 hover:bg-neutral-300 hover:text-neutral-700"
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
                      className="flex w-full items-center gap-2 px-3 py-2 text-sm text-danger-600 hover:bg-danger-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete list
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>

      <div className="space-y-0">
        {cards.map((card, index) => (
          <div key={card.Id} className="space-y-0">
            <DropSlot listId={list.Id} index={index} />
            {activeCard &&
              activeDropTarget?.listId === list.Id &&
              activeDropTarget?.index === index && <InsertionPlaceholder />}
            <div className="py-0.5">
              <DraggableCard card={card} listId={list.Id}>
                <CardItem
                  card={card}
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
          activeDropTarget?.index === cards.length && <InsertionPlaceholder />}
        <ListAppendDrop listId={list.Id}>
          <div className="py-0.5">
            {showAddCard ? (
              <div className="rounded-lg border border-neutral-200 bg-white p-3 shadow-sm">
                <div className="mb-2">
                  <CustomInput
                    name="cardTitle"
                    type="text"
                    placeholder="Enter a title for this card…"
                    value={cardTitle}
                    onChange={(e) => setCardTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSaveCard();
                      }
                      if (e.key === "Escape") {
                        resetCardForm();
                        onCancelCard();
                      }
                    }}
                  />
                </div>
                <div className="mb-2">
                  <TextArea
                    name="cardDescription"
                    placeholder="Description (optional)"
                    minRows={2}
                    value={cardDescription}
                    onChange={(e) => setCardDescription(e.target.value)}
                  />
                </div>
                <div className="mb-3">
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
                    onClick={() => {
                      resetCardForm();
                      onCancelCard();
                    }}
                    className="rounded-lg"
                  />
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={onAddCard}
                className="flex w-full items-center gap-2 rounded-lg bg-white/80 py-2.5 pl-3 text-left text-sm font-medium text-neutral-600 transition-colors hover:bg-white hover:text-neutral-800"
              >
                <Plus className="h-4 w-4 shrink-0" />
                Add a card
              </button>
            )}
          </div>
        </ListAppendDrop>
      </div>
    </div>
  );
}
