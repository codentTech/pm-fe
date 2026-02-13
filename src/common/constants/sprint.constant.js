export const SPRINT_STATUS_OPTIONS = [
  { value: "planned", label: "Planned" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
  { value: "closed", label: "Closed" },
];

export const SPRINT_STATUS_LABELS = {
  planned: "Planned",
  active: "Active",
  completed: "Completed",
  closed: "Closed",
};

export const SPRINT_STATUS_CLASSES = {
  planned: "bg-neutral-100 text-neutral-700",
  active: "bg-indigo-100 text-indigo-700",
  completed: "bg-emerald-100 text-emerald-700",
  closed: "bg-slate-200 text-slate-700",
};

export const SPRINT_STATUS_TRANSITIONS = {
  planned: ["active"],
  active: ["completed"],
  completed: ["closed"],
  closed: [],
};
