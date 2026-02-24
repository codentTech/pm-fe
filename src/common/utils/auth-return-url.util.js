/**
 * Storage key for auth return URL (e.g. after sign-up verification).
 * Uses localStorage so the URL is available when the user opens the
 * verification link in a new tab (e.g. from email).
 */
const RETURN_URL_KEY = "auth_return_url";

/**
 * Reads the stored return URL without removing it.
 * Use when the value might be set later by another tab (e.g. check-email).
 * @returns {string|null} The return URL or null if not found
 */
export function peekStoredReturnUrl() {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(RETURN_URL_KEY);
  } catch (_) {}
  return null;
}

/**
 * Gets and removes the stored return URL from storage.
 * Call this when actually redirecting (e.g. on "Next" click) so we read the
 * latest value (e.g. set by check-email in the other tab).
 * @returns {string|null} The return URL or null if not found
 */
export function getStoredReturnUrl() {
  if (typeof window === "undefined") return null;
  try {
    const url = localStorage.getItem(RETURN_URL_KEY);
    if (url) {
      localStorage.removeItem(RETURN_URL_KEY);
      return url;
    }
  } catch (_) {}
  return null;
}

/**
 * Stores return URL for use after verification (e.g. invitation accept page).
 * @param {string} url - The return URL to store
 */
export function setStoredReturnUrl(url) {
  if (typeof window === "undefined" || !url) return;
  try {
    localStorage.setItem(RETURN_URL_KEY, url);
  } catch (_) {}
}
