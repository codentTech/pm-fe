"use client";

import { Trash2, GripVertical, Calendar, User } from "lucide-react";
import { AVATAR_COLORS, CARD_COLORS } from "@/common/constants/colors.constant";
import useCardItem from "./use-card-item.hook";

function getCardColor(index) {
  return CARD_COLORS[(index ?? 0) % CARD_COLORS.length];
}

function getAvatarColor(idOrName) {
  const str = String(idOrName || "");
  let hash = 0;
  for (let i = 0; i < str.length; i++)
    hash = (hash << 5) - hash + str.charCodeAt(i);
  const idx = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

function AssigneeAvatars({ assignees }) {
  const list = (assignees || []).slice(0, 4);
  if (list.length === 0) return null;
  return (
    <div
      className="flex h-6 shrink-0 items-center -space-x-1.5"
      title={list.map((a) => a.User?.FullName || "Assignee").join(", ")}
    >
      {list.map((a) => {
        const user = a.User || a;
        const name = user.FullName || user.fullName || user.Email || "?";
        const initials = name
          .split(/\s+/)
          .map((p) => p[0])
          .join("")
          .toUpperCase()
          .slice(0, 2);
        const bgColor = getAvatarColor(user.Id || user.id || a.UserId || name);
        return (
          <div
            key={user.Id || user.id || a.UserId}
            className={`flex h-6 w-6 items-center justify-center rounded-full border-2 border-white text-[10px] font-medium text-white ${bgColor}`}
            title={name}
          >
            {initials || <User className="h-3 w-3" />}
          </div>
        );
      })}
    </div>
  );
}

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
      className={`inline-flex h-6 shrink-0 items-center gap-1 rounded px-2 font-medium leading-none typography-caption ${
        isOverdue
          ? "bg-danger-100 text-danger-700"
          : isToday
            ? "bg-warning-100 text-warning-700"
            : "bg-neutral-100 text-neutral-600"
      }`}
    >
      <Calendar className="h-3 w-3" />
      {isOverdue ? "Overdue" : isToday ? "Today" : "Due"}{" "}
      {date.toLocaleDateString()}
    </span>
  );
}

export default function CardItem({
  card,
  cardIndex = 0,
  onMoveTo,
  onDelete,
  onCardClick,
  otherLists,
  wipByListId,
}) {
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
      className="group relative min-h-[72px] cursor-pointer overflow-hidden rounded-lg bg-white p-3 text-left shadow-sm transition-shadow duration-150 hover:shadow-md focus:outline-none"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="font-bold text-neutral-800 typography-body">
            {card.Title}
          </p>
          {showPreview && (
            <p className="mt-1 line-clamp-2 font-medium text-neutral-600 typography-caption">
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
                    {otherLists.map((l) => {
                      const wipInfo = wipByListId?.[l.Id];
                      const isBlocked = !!wipInfo?.isBlocked;
                      return (
                        <button
                          key={l.Id}
                          type="button"
                          disabled={isBlocked}
                          className={`block w-full px-3 py-2 text-left typography-body ${
                            isBlocked
                              ? "cursor-not-allowed text-neutral-300"
                              : "text-neutral-700 hover:bg-primary-50 hover:text-primary-700"
                          }`}
                          title={isBlocked ? "WIP limit reached" : l.Title}
                          onClick={() => {
                            if (isBlocked) return;
                            onMoveTo(card.Id, l.Id);
                            setShowMoveMenu(false);
                          }}
                        >
                          <span className="flex items-center justify-between gap-2">
                            <span>{l.Title}</span>
                            {wipInfo?.limit ? (
                              <span
                                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                                  isBlocked
                                    ? "bg-danger-100 text-danger-700"
                                    : "bg-neutral-100 text-neutral-600"
                                }`}
                              >
                                {wipInfo.count}/{wipInfo.limit}
                              </span>
                            ) : null}
                          </span>
                        </button>
                      );
                    })}
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
              className="rounded p-1 text-danger-600 hover:bg-danger-50 hover:text-danger-700 focus:outline-none"
              aria-label="Delete card"
              title="Delete"
            >
              <Trash2 className="h-4 w-4 shrink-0" />
            </button>
          )}
        </div>
      </div>
      <div className="mt-2 flex min-h-6 flex-wrap items-center justify-between gap-1.5">
        <div className="flex flex-wrap items-center gap-1.5">
          {(card.CardLabels || [])
            .map((cl) => cl.Label || cl)
            .filter(Boolean)
            .slice(0, 3)
            .map((label) => (
              <span
                key={label.Id}
                className="flex h-6 shrink-0 items-center rounded px-1.5 typography-caption font-medium leading-none text-white"
                style={{ backgroundColor: label.Color || "#6b7280" }}
              >
                {label.Name}
              </span>
            ))}
          {card.DueDate && <DueDateBadge dueDate={card.DueDate} />}
        </div>
        <div className="flex shrink-0 items-center">
          <AssigneeAvatars assignees={card.CardAssignees} />
        </div>
      </div>
    </div>
  );
}
