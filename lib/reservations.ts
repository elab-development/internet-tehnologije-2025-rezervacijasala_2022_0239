export function canChangeReservation(startDateTime: Date, minDays = 15) {
  const now = new Date();
  const limit = new Date(now.getTime() + minDays * 24 * 60 * 60 * 1000);
  // dozvoljeno samo ako je start >= (sad + 15 dana)
  return startDateTime.getTime() >= limit.getTime();
}