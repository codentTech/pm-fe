export const DAILY_UPDATE_ROLE_OPTIONS = [
  { value: "developer", label: "Developer" },
  { value: "qa", label: "Quality Assurance" },
  { value: "pm", label: "Project Manager" },
  { value: "bd", label: "Business Development" },
];

export const DAILY_UPDATE_STATUS_OPTIONS = [
  { value: "on_track", label: "On track" },
  { value: "at_risk", label: "At risk" },
  { value: "blocked", label: "Blocked" },
];

export const WORK_ITEM_STATUS_OPTIONS = [
  { value: "completed", label: "Completed" },
  { value: "in_progress", label: "In progress" },
  { value: "blocked", label: "Blocked" },
];

export const BLOCKER_TYPE_OPTIONS = [
  { value: "client", label: "Client" },
  { value: "tech", label: "Tech" },
  { value: "dependency", label: "Dependency" },
  { value: "capacity", label: "Capacity" },
];

export const WORK_ITEM_TYPES_BY_ROLE = {
  developer: [
    { value: "ticket_work", label: "Ticket work" },
    { value: "bug_fix", label: "Bug fix" },
    { value: "code_review", label: "Code review" },
    { value: "meeting", label: "Meeting" },
    { value: "support", label: "Support / Ad-hoc" },
    { value: "tech_debt", label: "Technical debt" },
  ],
  qa: [
    { value: "ticket_work", label: "Ticket work" },
    { value: "bug_fix", label: "Bug fix" },
    { value: "code_review", label: "Code review" },
    { value: "meeting", label: "Meeting" },
    { value: "support", label: "Support / Ad-hoc" },
    { value: "tech_debt", label: "Technical debt" },
  ],
  pm: [
    { value: "ticket_work", label: "Ticket work" },
    { value: "meeting", label: "Meeting" },
    { value: "support", label: "Support / Ad-hoc" },
    { value: "tech_debt", label: "Technical debt" },
  ],
  bd: [
    { value: "bid_drafted", label: "Bid drafted" },
    { value: "bid_submitted", label: "Bid submitted" },
    { value: "follow_up", label: "Follow-up" },
    { value: "interview", label: "Interview" },
    { value: "proposal_revision", label: "Proposal revision" },
    { value: "client_communication", label: "Client communication" },
    { value: "research", label: "Research" },
  ],
};

export const WORK_ITEM_TYPES_REQUIRE_REFERENCE = new Set([
  "ticket_work",
  "bug_fix",
  "bid_drafted",
  "bid_submitted",
  "follow_up",
  "interview",
  "proposal_revision",
]);

export const WORK_ITEM_TYPES_TICKET = new Set(["ticket_work", "bug_fix"]);
export const WORK_ITEM_TYPES_BID = new Set([
  "bid_drafted",
  "bid_submitted",
  "follow_up",
  "interview",
  "proposal_revision",
]);

export const DAILY_UPDATE_CUTOFF_HOURS = 6;
export const DAILY_TIME_CAP_HOURS = 12;
