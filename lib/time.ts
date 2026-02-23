export function todayISODate() {
  // Vraća današnji datum u formatu YYYY-MM-DD (npr. "2026-02-16")
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function buildHourOptions() {
  const options: string[] = [];
  // Generiše sate od 08:00 do 23:00
  for (let h = 8; h <= 23; h++) {
    options.push(`${String(h).padStart(2, "0")}:00`);
  }
  return options;
}

export function formatDateSR(dateISO: string) {
  // Pretvara "2026-08-25" -> "25.08.2026." (naš format)
  const [y, m, d] = dateISO.split("-");
  return `${d}.${m}.${y}.`;
}

export function toISOStringFromDateAndTime(dateISO: string, timeHHMM: string) {
  // Spaja datum "2026-08-25" i vrijeme "18:00" u jedan ISO string
  const [y, m, d] = dateISO.split("-").map(Number);
  const [hh, mm] = timeHHMM.split(":").map(Number);
  
  // Pravi datum u lokalnom vremenu (mjesec je 0-indexed, pa ide m-1)
  const dt = new Date(y, m - 1, d, hh, mm, 0, 0);
  return dt.toISOString();
}

export function diffHours(startISO: string, endISO: string) {
  // Računa razliku u satima između dva ISO stringa
  const start = new Date(startISO).getTime();
  const end = new Date(endISO).getTime();
  const diff = (end - start) / (1000 * 60 * 60);
  return Math.max(0, diff);
}

export function overlaps(aStart: string, aEnd: string, bStart: string, bEnd: string) {
  // Provjerava da li se termin A preklapa sa terminom B
  if (!aStart || !aEnd || !bStart || !bEnd) return false;
  const A1 = new Date(aStart).getTime();
  const A2 = new Date(aEnd).getTime();
  const B1 = new Date(bStart).getTime();
  const B2 = new Date(bEnd).getTime();
  return A1 < B2 && A2 > B1;
}