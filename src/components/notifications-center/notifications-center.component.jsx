"use client";

import Link from "next/link";
import { Bell, Check, CheckCheck, FileText } from "lucide-react";
import {
  NOTIFICATION_TYPE_ICONS,
  getNotificationUrl,
} from "@/common/constants/notification-type.constant";
import Loader from "@/common/components/loader/loader.component";
import useNotificationsCenter from "./use-notifications-center.hook";

export default function NotificationsCenter({ show, onClose }) {
  const {
    dropdownRef,
    notifications,
    unreadCount,
    loading,
    hasUnread,
    formatTime,
    handleMarkAsRead,
    handleMarkAllAsRead,
    onClose: closeHandler,
  } = useNotificationsCenter(show, onClose);

  if (!show) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full z-50 mt-1.5 w-[360px] max-w-[95vw] overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-lg"
    >
      <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-neutral-600" />
          <h3 className="font-semibold text-neutral-900">Notifications</h3>
          {hasUnread && (
            <span className="rounded-full bg-primary-100 px-2 py-0.5 typography-caption font-medium text-primary-700">
              {unreadCount}
            </span>
          )}
        </div>
        {hasUnread && (
          <button
            type="button"
            onClick={handleMarkAllAsRead}
            className="flex items-center gap-1 rounded px-2 py-1 typography-caption font-medium text-primary-600 hover:bg-primary-50"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            Mark all read
          </button>
        )}
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader loading />
          </div>
        ) : !notifications?.length ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100">
              <Bell className="h-6 w-6 text-neutral-400" />
            </div>
            <p className="typography-body text-neutral-500">
              No notifications yet
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-neutral-100">
            {notifications.map((n) => {
              const Icon = NOTIFICATION_TYPE_ICONS[n.Type] || FileText;
              const url = getNotificationUrl(n);
              return (
                <li key={n.Id}>
                  <Link
                    href={url}
                    onClick={handleClose}
                    className={`flex gap-3 px-4 py-3 transition-colors hover:bg-neutral-50 ${
                      !n.IsRead ? "bg-primary-50/50" : ""
                    }`}
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-600">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-neutral-900">{n.Title}</p>
                      {n.Body && (
                        <p className="mt-0.5 line-clamp-2 typography-caption text-neutral-500">
                          {n.Body}
                        </p>
                      )}
                      <p className="mt-1 typography-caption text-neutral-400">
                        {formatTime(n.CreatedAt)}
                      </p>
                    </div>
                    {!n.IsRead && (
                      <button
                        type="button"
                        onClick={(e) => handleMarkAsRead(e, n.Id)}
                        className="shrink-0 rounded p-1 text-neutral-400 hover:bg-neutral-100 hover:text-primary-600"
                        title="Mark as read"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
