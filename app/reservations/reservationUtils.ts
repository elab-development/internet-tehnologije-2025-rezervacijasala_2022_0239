export type Status = "ACTIVE" | "CANCELLED" | "COMPLETED" | "PENDING";

const FIFTEEN_DAYS_MS = 15 * 24 * 60 * 60 * 1000;

export function canModifyOrCancel(startISO: string) {
  return new Date(startISO).getTime() - Date.now() >= FIFTEEN_DAYS_MS;
}

export function statusLabel(status: Status) {
  switch (status) {
    case "PENDING": 
      return "Na čekanju";
    case "ACTIVE":
      return "Aktivna";
    case "CANCELLED":
      return "Otkazana";
    case "COMPLETED":
      return "Završena";
    default:
      return status;
  }
}

export function fmtDateTimeSR(iso: string) {
  return new Date(iso).toLocaleString("sr-RS", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
