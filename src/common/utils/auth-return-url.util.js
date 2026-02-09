/**
 * Session storage key for auth return URL (e.g. after sign-up verification).
 */
const RETURN_URL_KEY = "auth_return_url";

/**
 * Gets and removes the stored return URL from session storage.
 * Used when redirecting after email verification to preserve invitation flow.
 * @returns {string|null} The return URL or null if not found
 */
export function getStoredReturnUrl() {
  if (typeof window === "undefined") return null;
  try {
    const url = sessionStorage.getItem(RETURN_URL_KEY);
    if (url) {
      sessionStorage.removeItem(RETURN_URL_KEY);
      return url;
    }
  } catch (_) {}
  return null;
}

/**
 * Stores return URL in session storage for use after verification.
 * @param {string} url - The return URL to store
 */
export function setStoredReturnUrl(url) {
  if (typeof window === "undefined" || !url) return;
  try {
    sessionStorage.setItem(RETURN_URL_KEY, url);
  } catch (_) {}
}
