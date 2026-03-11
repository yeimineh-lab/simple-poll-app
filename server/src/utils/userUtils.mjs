// Normalize username input so comparisons are consistent
export function normalizeUsername(value) {
  return String(value || "").trim().toLowerCase();
}