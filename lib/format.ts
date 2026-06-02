export function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00.000Z`));
}

export function formatCount(count: number) {
  return new Intl.NumberFormat("en", {
    notation: count > 999 ? "compact" : "standard",
  }).format(count);
}
