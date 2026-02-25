"use client";

import { Plus, MoreHorizontal, Trash2 } from "lucide-react";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import CustomInput from "@/common/components/custom-input/custom-input.component";
import TextArea from "@/common/components/text-area/text-area.component";
import CardItem from "@/components/projects/card-item/card-item.component";
import useListColumn from "./use-list-column.hook";

export default function ListColumn({
  list,
  onAddCard,
  showAddCard,
  onSaveCard,
  onCancelCard,
  onMoveCard,
  onDeleteList,
  onDeleteCard,
  onCardClick,
  otherLists,
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
  } = useListColumn(list, onSaveCard, onCancelCard);

  return (
    <div className="min-w-[280px] max-w-[280px] shrink-0 rounded-lg border border-neutral-200 bg-neutral-200/50 p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="flex-1 truncate typography-h4 text-neutral-800">
          {list.Title}
        </h3>
        <span className="typography-caption font-medium text-neutral-500">
          {cards.length}
        </span>
        <div className="relative">
          {onDeleteList && (
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
                        onDeleteList();
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

      <div className="space-y-2">
        {cards.map((card) => (
          <CardItem
            key={card.Id}
            card={card}
            onMoveTo={onMoveCard}
            onDelete={onDeleteCard}
            onCardClick={onCardClick}
            otherLists={otherLists}
          />
        ))}

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
            className="flex w-full items-center gap-2 rounded-lg bg-white/80 py-2.5 pl-3 text-left typography-body font-medium text-neutral-600 transition-colors hover:bg-white hover:text-neutral-800"
          >
            <Plus className="h-4 w-4 shrink-0" />
            Add a card
          </button>
        )}
      </div>
    </div>
  );
}
