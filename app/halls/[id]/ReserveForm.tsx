"use client";

import { useMemo, useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { apiFetch } from "@/lib/api";
import Button from "@/components/Button";
import {
  todayISODate,
  buildHourOptions,
  formatDateSR,
  toISOStringFromDateAndTime,
  calcDurationHoursCrossMidnight,
} from "@/lib/time";
import { useCurrency } from "@/lib/CurrencyContext";

export default function ReserveForm({
  hallId,
  pricePerHour,
  capacity,
}: {
  hallId: number;
  pricePerHour: number;
  capacity: number;
}) {
  const { user } = useAuth();
  const { convertPrice } = useCurrency();
  const [dateISO, setDateISO] = useState("");
  const [startHHMM, setStartHHMM] = useState("08:00");
  const [endHHMM, setEndHHMM] = useState("10:00");
  const [numberOfGuests, setNumberOfGuests] = useState(1);

  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const hourOptions = useMemo(() => buildHourOptions(), []);

  const durationHours = useMemo(() => {
    if (!dateISO) return 0;
    return calcDurationHoursCrossMidnight(startHHMM, endHHMM);
  }, [dateISO, startHHMM, endHHMM]);

  const totalPrice = useMemo(() => {
    if (durationHours <= 0) return 0;
    return durationHours * pricePerHour;
  }, [durationHours, pricePerHour]);

  function validate() {
    if (!user) return "Morate biti ulogovani da biste rezervisali salu.";
    if (!dateISO) return "Izaberi datum.";

    const hours = calcDurationHoursCrossMidnight(startHHMM, endHHMM);
    if (hours <= 0) return "Kraj mora biti nakon početka.";
    if (hours < 1) return "Minimalno trajanje je 1 sat.";

    if (!numberOfGuests || numberOfGuests < 1) {
      return "Unesi ispravan broj gostiju.";
    }

    if (numberOfGuests > capacity) {
      return `Broj gostiju premašuje kapacitet sale (${capacity}).`;
    }

    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setError(null);

    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    if (!user) return;

    const crossesMidnight = (() => {
      const [sh, sm] = startHHMM.split(":").map(Number);
      const [eh, em] = endHHMM.split(":").map(Number);
      return eh * 60 + em <= sh * 60 + sm;
    })();

    const startISO = toISOStringFromDateAndTime(dateISO, startHHMM);
    const endISO = toISOStringFromDateAndTime(dateISO, endHHMM, {
      nextDay: crossesMidnight,
    });

    try {
      setLoading(true);

      await apiFetch("/api/reservations", {
        method: "POST",
        body: JSON.stringify({
          hallId,
          startDateTime: startISO,
          endDateTime: endISO,
          numberOfGuests,
        }),
      });

      setMessage("Rezervacija uspešno kreirana");
      setDateISO("");
      setStartHHMM("08:00");
      setEndHHMM("10:00");
      setNumberOfGuests(1);
    } catch (err: any) {
      setError(err?.message || "Greška pri rezervaciji.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "grid",
        gap: 14,
        maxWidth: 560,
        padding: 16,
        borderRadius: 16,
        border: "1px solid var(--border-color)",
        background: "var(--card-bg)",
      }}
    >
      <div style={{ display: "grid", gap: 6 }}>
        <label style={{ fontWeight: 700 }}>Datum</label>
        <input
          type="date"
          value={dateISO}
          min={todayISODate()}
          onChange={(e) => setDateISO(e.target.value)}
        />
        {dateISO && (
          <div style={{ fontSize: 13, opacity: 0.85 }}>
            Izabrano: <b>{formatDateSR(dateISO)}</b>
          </div>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ display: "grid", gap: 6 }}>
          <label style={{ fontWeight: 700 }}>Početak</label>
          <select value={startHHMM} onChange={(e) => setStartHHMM(e.target.value)}>
            {hourOptions.map((t) => (
              <option key={`s-${t}`} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: "grid", gap: 6 }}>
          <label style={{ fontWeight: 700 }}>Kraj</label>
          <select value={endHHMM} onChange={(e) => setEndHHMM(e.target.value)}>
            {hourOptions.map((t) => (
              <option key={`e-${t}`} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ display: "grid", gap: 6 }}>
        <label style={{ fontWeight: 700 }}>Broj gostiju</label>
        <input
          type="number"
          min={1}
          max={capacity}
          value={numberOfGuests}
          onChange={(e) => setNumberOfGuests(Number(e.target.value))}
        />
      </div>

      <div
        style={{
          border: "1px solid var(--border-color)",
          borderRadius: 14,
          padding: 12,
          display: "grid",
          gap: 6,
          background: "rgba(255,255,255,0.65)",
        }}
      >
        <div style={{ fontWeight: 800 }}>Sažetak</div>
        <div>
          Trajanje: <b>{dateISO ? durationHours : 0} h</b>
        </div>
        <div>
         Ukupno: <b>{dateISO ? convertPrice(totalPrice) : convertPrice(0)}</b>
        </div>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Rezervišem..." : "Rezerviši"}
      </Button>

      {message && <p>{message}</p>}
      {error && (
        <p style={{ color: "crimson", fontWeight: 700 }}>{error}</p>
      )}
    </form>
  );
}
