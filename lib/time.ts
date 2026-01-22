// lib/time.ts

export function todayISODate() {
  // YYYY-MM-DD
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function buildHourOptions() {
  const options: string[] = [];

  // 08:00 → 23:00
  for (let h = 8; h <= 23; h++) {
    options.push(`${String(h).padStart(2, "0")}:00`);
  }

  // 00:00 → 02:00 (poslije ponoći)
  for (let h = 0; h <= 2; h++) {
    options.push(`${String(h).padStart(2, "0")}:00`);
  }

  return options;
}

export function formatDateSR(dateISO: string) {
  // "2026-08-25" -> "25.08.2026."
  const [y, m, d] = dateISO.split("-");
  return `${d}.${m}.${y}.`;
}

export function toISOStringFromDateAndTime(
  dateISO: string,
  timeHHMM: string,
  opts?: { nextDay?: boolean }
) {
  // dateISO: "2026-08-25", time: "18:00"
  // -> Date u lokalnom vremenu, pa ISO string
  // opts.nextDay: ako je true, datum +1 dan (za 00:00–02:00 kao "kraj" poslije ponoći)
  const [y, m, d] = dateISO.split("-").map(Number);
  const [hh, mm] = timeHHMM.split(":").map(Number);

  const dt = new Date(y, m - 1, d, hh, mm, 0, 0);

  if (opts?.nextDay) {
    dt.setDate(dt.getDate() + 1);
  }

  return dt.toISOString();
}

export function calcDurationHoursCrossMidnight(startHHMM: string, endHHMM: string) {
  // radi samo sa punim satima, ali ok je i za :30 itd.
  // ako je end <= start, tretiramo kao prelazak preko ponoći
  const [sh, sm] = startHHMM.split(":").map(Number);
  const [eh, em] = endHHMM.split(":").map(Number);

  const startMinutes = sh * 60 + sm;
  let endMinutes = eh * 60 + em;

  if (endMinutes <= startMinutes) {
    endMinutes += 24 * 60;
  }

  return (endMinutes - startMinutes) / 60;
}

export function diffHours(startISO: string, endISO: string) {
  const start = new Date(startISO).getTime();
  const end = new Date(endISO).getTime();
  return Math.max(0, (end - start) / (1000 * 60 * 60));
}

export function overlaps(
  aStart: string,
  aEnd: string,
  bStart: string,
  bEnd: string
) {
  // [aStart, aEnd) preklapa [bStart, bEnd)
  const A1 = new Date(aStart).getTime();
  const A2 = new Date(aEnd).getTime();
  const B1 = new Date(bStart).getTime();
  const B2 = new Date(bEnd).getTime();
  return A1 < B2 && A2 > B1;
}
