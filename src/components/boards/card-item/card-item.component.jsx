"use client";

import { Trash2, GripVertical, Calendar } from "lucide-react";
import useCardItem from "./use-card-item.hook";

function DueDateBadge({ dueDate }) {
  if (!dueDate) return null;
  const date = new Date(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(date);
  due.setHours(0, 0, 0, 0);
  const isOverdue = due < today;
  const isToday = due.getTime() === today.getTime();

  return (
    <span
      className={`mt-2 inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium ${
        isOverdue
          ? "bg-danger-100 text-danger-700"
          : isToday
            ? "bg-warning-100 text-warning-700"
            : "bg-neutral-100 text-neutral-600"
      }`}
    >
      <Calendar className="h-3 w-3" />
      {isOverdue ? "Overdue" : isToday ? "Today" : "Due"} {date.toLocaleDateString()}
    </span>
  );
}

export default function CardItem({ card, onMoveTo, onDelete, onCardClick, otherLists }) {
  const { showMoveMenu, setShowMoveMenu } = useCardItem();

  const handleCardClick = (e) => {
    if (onCardClick && !e.target.closest("button")) onCardClick(card);
  };

  const descriptionPreview = card.Description?.trim();
  const showPreview = descriptionPreview && descriptionPreview.length > 0;

  return (
    <div
      role={onCardClick ? "button" : undefined}
      tabIndex={onCardClick ? 0 : undefined}
      onClick={onCardClick ? handleCardClick : undefined}
      onKeyDown={
        onCardClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onCardClick(card);
              }
            }
          : undefined
      }
      className="group cursor-pointer rounded-lg border border-neutral-200 bg-white p-3 text-left shadow-sm transition-shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-neutral-800">{card.Title}</p>
          {showPreview && (
            <p className="mt-1 line-clamp-2 text-xs text-neutral-500">
              {descriptionPreview}
            </p>
          )}
        </div>
        <div
          className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100"
          onClick={(e) => e.stopPropagation()}
        >
          {otherLists?.length > 0 && (
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMoveMenu(!showMoveMenu);
                }}
                className="rounded p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
                aria-label="Move card"
                title="Move"
              >
                <GripVertical className="h-4 w-4" />
              </button>
              {showMoveMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    aria-hidden
                    onClick={() => setShowMoveMenu(false)}
                  />
                  <div className="absolute left-0 top-full z-20 mt-1 max-h-48 w-44 overflow-y-auto rounded-lg border border-neutral-200 bg-white py-1 shadow-lg">
                    {otherLists.map((l) => (
                      <button
                        key={l.Id}
                        type="button"
                        className="block w-full px-3 py-2 text-left text-sm text-neutral-700 hover:bg-primary-50 hover:text-primary-700"
                        onClick={() => {
                          onMoveTo(card.Id, l.Id);
                          setShowMoveMenu(false);
                        }}
                      >
                        {l.Title}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(card.Id);
              }}
              className="rounded p-1 text-neutral-400 hover:bg-danger-50 hover:text-danger-600"
              aria-label="Delete card"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      {card.DueDate && (
        <div className="mt-2">
          <DueDateBadge dueDate={card.DueDate} />
        </div>
      )}
    </div>
  );
}
