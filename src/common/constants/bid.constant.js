import { Eye, Pencil, Trash2, User } from "lucide-react";

export const BID_PLATFORM_OPTIONS = [
  { value: "upwork", label: "Upwork" },
  { value: "fiverr", label: "Fiverr" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "email", label: "Email" },
  { value: "other", label: "Other" },
];

export const BID_STATUS_OPTIONS = [
  { value: "draft", label: "Draft" },
  { value: "submitted", label: "Submitted" },
  { value: "viewed", label: "Viewed" },
  { value: "interview", label: "Interview" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
  { value: "ghosted", label: "Ghosted" },
  { value: "withdrawn", label: "Withdrawn" },
];

export const BID_STATUS_LABELS = Object.freeze({
  draft: "Draft",
  submitted: "Submitted",
  viewed: "Viewed",
  interview: "Interview",
  won: "Won",
  lost: "Lost",
  ghosted: "Ghosted",
  withdrawn: "Withdrawn",
});

export const BID_TERMINAL_STATUSES = ["won", "lost", "ghosted", "withdrawn"];

const BID_PLATFORM_BADGE_CLASSES = {
  upwork: "border-green-200 bg-green-50 text-green-700", // Upwork Green
  fiverr: "border-emerald-200 bg-emerald-50 text-emerald-700", // Fiverr Green
  linkedin: "border-indigo-900 bg-indigo-900 text-white", // LinkedIn Blue
  email: "border-slate-200 bg-slate-100 text-slate-700", // Slate Gray
  other: "border-neutral-200 bg-neutral-100 text-neutral-700", // Neutral Gray
};

const CURRENCY_SYMBOLS = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  INR: "₹",
  JPY: "¥",
  CNY: "¥",
  CAD: "C$",
  AUD: "A$",
};

const getCurrencySymbol = (code) => {
  if (!code) return "";
  return CURRENCY_SYMBOLS[String(code).toUpperCase()] || "";
};

export const BID_VALID_TRANSITIONS = {
  draft: ["submitted", "withdrawn"],
  submitted: ["viewed", "interview", "ghosted", "withdrawn"],
  viewed: ["interview", "ghosted"],
  interview: ["won", "lost", "ghosted"],
  won: [],
  lost: [],
  ghosted: [],
  withdrawn: [],
};

export const BID_LOSS_REASON_OPTIONS = [
  { value: "price_too_high", label: "Price too high" },
  { value: "skill_mismatch", label: "Skill mismatch" },
  { value: "client_trust_issue", label: "Client trust issue" },
  { value: "timeline_mismatch", label: "Timeline mismatch" },
  { value: "client_chose_cheaper", label: "Client chose cheaper option" },
  { value: "other", label: "Other" },
];

export const BID_WITHDRAWAL_REASON_OPTIONS = [
  { value: "capacity_issue", label: "Capacity issue" },
  { value: "scope_changed", label: "Scope changed" },
  { value: "client_red_flags", label: "Client red flags" },
  { value: "internal_priority_shift", label: "Internal priority shift" },
];

export const BID_COLUMNS = [
  { key: "BidTitle", title: "Bid", sortable: true },
  {
    key: "ClientDisplayName",
    title: "Client",
    sortable: true,
    customRender: (row) => (
      <span className="flex items-center gap-2 font-medium text-neutral-800">
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100">
          <User className="h-3.5 w-3.5 text-slate-600" />
        </span>
        {row.ClientDisplayName}
      </span>
    ),
  },
  {
    key: "Platform",
    title: "Platform",
    sortable: true,
    customRender: (row) => {
      const p = row.Platform ? String(row.Platform) : "";
      const label = p
        ? p.charAt(0).toUpperCase() + p.slice(1).toLowerCase()
        : "—";
      const classes =
        BID_PLATFORM_BADGE_CLASSES[p.toLowerCase()] ||
        BID_PLATFORM_BADGE_CLASSES.other;
      return (
        <span
          className={`inline-flex items-center rounded-lg border px-2 py-0.5 text-xs font-semibold ${classes}`}
        >
          {label}
        </span>
      );
    },
  },
  {
    key: "CurrentStatus",
    title: "Status",
    sortable: true,
    customRender: (row) => (
      <span className="rounded-full px-2 py-0.5 typography-caption font-medium bg-neutral-100 text-neutral-700">
        {BID_STATUS_LABELS[row.CurrentStatus] ?? row.CurrentStatus}
      </span>
    ),
  },
  {
    key: "ProposedPrice",
    title: "Price",
    sortable: true,
    customRender: (row) => {
      const symbol = getCurrencySymbol(row.Currency);
      const formatted = Number(row.ProposedPrice ?? 0).toLocaleString();
      return (
        <span className="font-medium text-neutral-700">
          {symbol
            ? `${symbol}${formatted}`
            : `${row.Currency ?? ""} ${formatted}`.trim()}
        </span>
      );
    },
  },
  {
    key: "SubmissionDate",
    title: "Submitted",
    sortable: true,
    customRender: (row) => (
      <span className="text-neutral-500">
        {row.SubmissionDate
          ? new Date(row.SubmissionDate).toLocaleDateString()
          : "—"}
      </span>
    ),
  },
];

export const BID_ACTIONS = [
  { key: "view", label: "View details", icon: <Eye className="h-4 w-4" /> },
  { key: "edit", label: "Edit", icon: <Pencil className="h-4 w-4" /> },
  {
    key: "delete",
    label: "Delete",
    icon: <Trash2 className="h-4 w-4 text-danger-600" />,
  },
];
