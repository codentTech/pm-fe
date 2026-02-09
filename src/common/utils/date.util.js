/**
 * Format a date as locale date/time string (e.g. "1/30/25, 2:45 PM").
 * @param {string|Date} date - Date string or Date object
 * @returns {string}
 */
export function formatDateTime(date) {
  return date ? new Date(date).toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" }) : "—";
}

/**
 * Format a date string as relative time (e.g. "Just now", "5m ago", "2h ago", "3d ago").
 * Falls back to locale date string for older dates.
 * @param {string} dateStr - ISO date string
 * @returns {string}
 */
export function formatRelativeTime(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now - d) / 60000);
  if (diff < 1) return "Just now";
  if (diff < 60) return `${diff}m ago`;
  if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
  if (diff < 43200) return `${Math.floor(diff / 1440)}d ago`;
  return d.toLocaleDateString();
}
