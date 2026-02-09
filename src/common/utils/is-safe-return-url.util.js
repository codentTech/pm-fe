/**
 * Validates that a return URL is safe for client-side redirect.
 * Only allows relative paths (starting with /) to prevent open redirects.
 */
export function isSafeReturnUrl(url) {
  if (typeof url !== "string" || !url.trim()) return false;
  const trimmed = url.trim();
  // Must start with / but not // (protocol-relative)
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) return false;
  // Reject protocol schemes (javascript:, data:, etc.)
  if (/^[a-z][a-z0-9+.-]*:/i.test(trimmed)) return false;
  return true;
}
