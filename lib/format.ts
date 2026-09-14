export function formatDate(date: string) {
  const parsed = new Date(/^\d{4}-\d{2}-\d{2}$/.test(date) ? `${date}T00:00:00.000Z` : date);
  if (Number.isNaN(parsed.getTime())) return "";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(parsed);
}

export function formatCount(count: number) {
  return new Intl.NumberFormat("en", {
    notation: count > 999 ? "compact" : "standard",
  }).format(count);
}
