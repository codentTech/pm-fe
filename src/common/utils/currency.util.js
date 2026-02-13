/**
 * Format a value as currency.
 * @param {number|string|null|undefined} val - Value to format
 * @param {string} [currency="USD"] - ISO 4217 currency code
 * @returns {string}
 */
export function formatCurrency(val, currency = "USD") {
  if (val == null) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(val));
}
