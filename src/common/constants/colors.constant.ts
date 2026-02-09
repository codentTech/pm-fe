/** Gradient colors for lists, cards, and page separators */
export const LIST_COLORS = [
  "from-indigo-500 to-indigo-700",
  "from-emerald-500 to-emerald-700",
  "from-amber-500 to-amber-700",
  "from-rose-500 to-rose-700",
  "from-sky-500 to-sky-700",
  "from-violet-500 to-violet-700",
] as const;

export const BOARD_CARD_COLORS = LIST_COLORS;
export const CARD_COLORS = LIST_COLORS;
export const KPI_SEPARATOR_COLORS = LIST_COLORS;
export const LIST_CARD_COLORS = LIST_COLORS;

/** Solid background colors for avatars (assignee initials) */
export const AVATAR_COLORS = [
  "bg-indigo-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-cyan-500",
  "bg-violet-500",
  "bg-orange-500",
  "bg-teal-500",
] as const;

/** Light background colors for skeleton loaders */
export const SKELETON_COLORS = [
  "bg-indigo-200",
  "bg-emerald-200",
  "bg-amber-200",
  "bg-rose-200",
  "bg-sky-200",
  "bg-violet-200",
] as const;
