"use client";

import { Plus, MoreHorizontal, Trash2 } from "lucide-react";
import CustomButton from "@/common/components/custom-button/custom-button.component";
import CardItem from "@/components/boards/card-item/card-item.component";
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
    resetCardForm,
  } = useListColumn(list);

  const handleSaveCard = () => {
    if (!cardTitle?.trim()) return;
    onSaveCard({
      Title: cardTitle.trim(),
      Description: cardDescription?.trim() || undefined,
      DueDate: cardDueDate || undefined,
    });
    resetCardForm();
  };

  return (
    <div className="min-w-[280px] max-w-[280px] shrink-0 rounded-lg border border-neutral-200 bg-neutral-200/50 p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="flex-1 truncate font-semibold text-neutral-800">{list.Title}</h3>
        <span className="text-xs font-medium text-neutral-500">{cards.length}</span>
        <div className="relative">
          {onDeleteList && (
            <>
              <button
                type="button"
                onClick={() => setShowMenu(showMenu === list.Id ? null : list.Id)}
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
            <input
              type="text"
              value={cardTitle}
              onChange={(e) => setCardTitle(e.target.value)}
              placeholder="Enter a title for this card…"
              className="mb-2 w-full rounded border border-neutral-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              autoFocus
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
            <textarea
              value={cardDescription}
              onChange={(e) => setCardDescription(e.target.value)}
              placeholder="Description (optional)"
              rows={2}
              className="mb-2 w-full resize-none rounded border border-neutral-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
            <input
              type="date"
              value={cardDueDate}
              onChange={(e) => setCardDueDate(e.target.value)}
              className="mb-3 w-full rounded border border-neutral-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
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
    </div>
  );
}
