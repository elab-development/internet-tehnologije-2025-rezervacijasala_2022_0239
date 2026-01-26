"use client";

import { useMemo, useState } from "react";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";
import { buildHourOptions, diffHours, toISOStringFromDateAndTime, todayISODate } from "@/lib/time";
import { Reservation } from "./page";
import { canModifyOrCancel } from "./reservationUtils";

export default function EditReservationModal({
  reservation,
  onClose,
  onSaved,
}: {
  reservation: Reservation;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { user } = useAuth();
  const hours = useMemo(() => buildHourOptions(), []);

  const start = new Date(reservation.startDateTime);
  const end = new Date(reservation.endDateTime);

  const initDate = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, "0")}-${String(
    start.getDate()
  ).padStart(2, "0")}`;

  const [dateISO, setDateISO] = useState(initDate);
  const [startTime, setStartTime] = useState(`${String(start.getHours()).padStart(2, "0")}:00`);
  const [endTime, setEndTime] = useState(`${String(end.getHours()).padStart(2, "0")}:00`);
  const [guests, setGuests] = useState(reservation.numberOfGuests);

  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  function computeISO() {
    const startISO = toISOStringFromDateAndTime(dateISO, startTime);

    const sh = Number(startTime.split(":")[0]);
    const eh = Number(endTime.split(":")[0]);

    let endDateISO = dateISO;
    if (eh < sh) {
      const d = new Date(dateISO + "T00:00:00");
      d.setDate(d.getDate() + 1);
      endDateISO = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate()
      ).padStart(2, "0")}`;
    }

    const endISO = toISOStringFromDateAndTime(endDateISO, endTime);
    return { startISO, endISO };
  }

  const durationHours = useMemo(() => {
    try {
      const { startISO, endISO } = computeISO();
      const h = diffHours(startISO, endISO);
      return h > 0 ? h : 0;
    } catch {
      return 0;
    }
  }, [dateISO, startTime, endTime]);

  const durationLabel = useMemo(() => {
    if (durationHours <= 0) return "—";
    return `${durationHours.toFixed(durationHours % 1 === 0 ? 0 : 1)} h`;
  }, [durationHours]);

  const totalPrice = useMemo(() => {
    const pricePerHour = reservation.hall?.pricePerHour ?? 0;
    if (durationHours <= 0 || pricePerHour <= 0) return 0;
    return durationHours * pricePerHour;
  }, [durationHours, reservation.hall?.pricePerHour]);

  async function save() {
    if (!user) return;

    setErr(null);

    if (reservation.status !== "ACTIVE") {
      setErr("Možeš mijenjati samo aktivne rezervacije.");
      return;
    }

    if (!canModifyOrCancel(reservation.startDateTime)) {
      setErr("Izmjena nije moguća jer je manje od 15 dana do termina.");
      return;
    }

    if (guests < 1) {
      setErr("Broj gostiju mora biti najmanje 1.");
      return;
    }

    const { startISO, endISO } = computeISO();
    const h = diffHours(startISO, endISO);
    if (h <= 0) {
      setErr("Kraj mora biti poslije početka (može i preko ponoći).");
      return;
    }

    try {
      setSaving(true);

      await apiFetch(
        `/api/reservations/${reservation.id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            startDateTime: startISO,
            endDateTime: endISO,
            numberOfGuests: guests,
          }),
        },
        { user }
      );

      onSaved();
    } catch (e: any) {
      setErr(e?.message || "Greška pri izmjeni rezervacije");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.35)",
        display: "grid",
        placeItems: "center",
        padding: 16,
        zIndex: 50,
      }}
    >
      <div className="card" onClick={(e) => e.stopPropagation()} style={{ width: "min(720px, 100%)", display: "grid", gap: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
          <h2 style={{ margin: 0 }}>Izmijeni rezervaciju</h2>
          <button type="button" onClick={onClose} style={{ padding: "10px 14px" }}>
            Zatvori
          </button>
        </div>

        <div style={{ display: "grid", gap: 12 }}>
          <div style={{ display: "grid", gap: 6 }}>
            <label style={{ fontWeight: 700 }}>Datum</label>
            <input type="date" min={todayISODate()} value={dateISO} onChange={(e) => setDateISO(e.target.value)} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ display: "grid", gap: 6 }}>
              <label style={{ fontWeight: 700 }}>Početak</label>
              <select value={startTime} onChange={(e) => setStartTime(e.target.value)}>
                {hours.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: "grid", gap: 6 }}>
              <label style={{ fontWeight: 700 }}>Kraj</label>
              <select value={endTime} onChange={(e) => setEndTime(e.target.value)}>
                {hours.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gap: 6 }}>
            <label style={{ fontWeight: 700 }}>Broj gostiju</label>
            <input type="number" min={1} value={guests} onChange={(e) => setGuests(Number(e.target.value))} />
          </div>

          <div style={{ display: "flex", gap: 18, flexWrap: "wrap", fontSize: 14, color: "var(--text-muted)" }}>
            <div>
              Trajanje: <strong style={{ color: "var(--text-main)" }}>{durationLabel}</strong>
            </div>
            <div>
              Ukupno: <strong style={{ color: "var(--text-main)" }}>{totalPrice.toFixed(2)} €</strong>
            </div>
          </div>

          {err && <p style={{ margin: 0, color: "crimson", fontWeight: 700 }}>{err}</p>}

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={onClose}
              style={{ background: "transparent", color: "var(--accent-primary)", border: "1px solid var(--border-color)" }}
            >
              Odustani
            </button>
            <button type="button" onClick={save} disabled={saving}>
              {saving ? "Čuvam..." : "Sačuvaj"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
