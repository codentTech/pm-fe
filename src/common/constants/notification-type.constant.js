import {
  FileText,
  UserPlus,
  MessageSquare,
  Calendar,
  Mail,
} from "lucide-react";

export const NOTIFICATION_TYPE_ICONS = Object.freeze({
  assigned: UserPlus,
  mentioned: MessageSquare,
  due_soon: Calendar,
  comment: MessageSquare,
  invitation: Mail,
});

export function getNotificationUrl(notification) {
  const data = notification?.Data || {};
  if (data.boardId && data.cardId)
    return `/projects/${data.boardId}?card=${data.cardId}`;
  if (data.boardId) return `/projects/${data.boardId}`;
  if (data.todoListId) return "/todos";
  return "/settings";
}
