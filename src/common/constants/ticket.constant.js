export const TICKET_TYPE_OPTIONS = [
  { value: "epic", label: "Epic" },
  { value: "story", label: "Story" },
  { value: "task", label: "Task" },
  { value: "bug", label: "Bug" },
];

export const TICKET_PRIORITY_OPTIONS = [
  { value: "p0", label: "P0" },
  { value: "p1", label: "P1" },
  { value: "p2", label: "P2" },
  { value: "p3", label: "P3" },
];

export const TICKET_SEVERITY_OPTIONS = [
  { value: "critical", label: "Critical" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
];

export const TICKET_STATUS_OPTIONS = [
  { value: "backlog", label: "Backlog" },
  { value: "ready", label: "Ready" },
  { value: "in_progress", label: "In progress" },
  { value: "blocked", label: "Blocked" },
  { value: "code_review", label: "Code review" },
  { value: "qa", label: "QA" },
  { value: "done", label: "Done" },
  { value: "reopened", label: "Reopened" },
];

export const TICKET_STATUS_BY_LIST_TITLE = {
  backlog: "backlog",
  ready: "ready",
  "in progress": "in_progress",
  blocked: "blocked",
  "code review": "code_review",
  "qa / validation": "qa",
  qa: "qa",
  done: "done",
  reopened: "reopened",
};

export const TICKET_WIP_LIMITS_BY_STATUS = {
  ready: 5,
  in_progress: 3,
  blocked: 5,
  code_review: 3,
  qa: 3,
};
