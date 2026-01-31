/**
 * App theme constants – single source for branding.
 * Tailwind extends these via tailwind.config.js; use for non-Tailwind (e.g. inline) when needed.
 */
export const APP_NAME = "Trello Clone";

export const THEME = Object.freeze({
  primary: {
    DEFAULT: "#6366F1",
    light: "#818CF8",
    dark: "#4F46E5",
    bg: "#EEF2FF",
  },
  neutral: {
    text: "#111827",
    textSecondary: "#6B7280",
    border: "#E5E7EB",
    bg: "#F9FAFB",
  },
  radius: {
    sm: "0.375rem",
    DEFAULT: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
  },
  shadow: {
    card: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    hover: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  },
});
