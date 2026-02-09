"use client";

import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchNotifications,
  fetchUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/provider/features/notifications/notifications.slice";
import { formatRelativeTime } from "@/common/utils/date.util";

export default function useNotificationsCenter(show, onClose) {
  // stats
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);
  const {
    notifications,
    unreadCount,
    fetchNotifications: fetchState,
  } = useSelector((s) => s.notifications || {});

  const loading = fetchState?.isLoading;
  const hasUnread = (unreadCount || 0) > 0;

  // useEffect
  useEffect(() => {
    if (show) {
      dispatch(fetchNotifications(50));
      dispatch(fetchUnreadCount());
    }
  }, [show, dispatch]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (show) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [show, onClose]);

  // functions
  function formatTime(dateStr) {
    return formatRelativeTime(dateStr);
  }

  function handleMarkAsRead(e, id) {
    e.preventDefault();
    e.stopPropagation();
    dispatch(markNotificationAsRead(id));
  }

  function handleMarkAllAsRead(e) {
    e.preventDefault();
    dispatch(markAllNotificationsAsRead());
  }

  return {
    show,
    dropdownRef,
    notifications,
    unreadCount,
    loading,
    hasUnread,
    formatTime: formatRelativeTime,
    handleMarkAsRead,
    handleMarkAllAsRead,
    onClose,
  };
}
