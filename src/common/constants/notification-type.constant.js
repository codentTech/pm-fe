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
  const projectId = data.projectId ?? data.boardId;
  if (projectId && data.cardId)
    return `/projects/${projectId}?card=${data.cardId}`;
  if (projectId) return `/projects/${projectId}`;
  if (data.todoListId) return "/todos";
  return "/settings";
}
