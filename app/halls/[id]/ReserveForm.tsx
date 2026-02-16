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
  diffHours, // Koristimo novu diffHours umesto stare calcDuration
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

  // Računamo trajanje koristeći nove ISO funkcije
  const durationHours = useMemo(() => {
    if (!dateISO || !startHHMM || !endHHMM) return 0;
    const startISO = toISOStringFromDateAndTime(dateISO, startHHMM);
    const endISO = toISOStringFromDateAndTime(dateISO, endHHMM);
    return diffHours(startISO, endISO);
  }, [dateISO, startHHMM, endHHMM]);

  const totalPrice = useMemo(() => {
    if (durationHours <= 0) return 0;
    return durationHours * pricePerHour;
  }, [durationHours, pricePerHour]);

  function validate() {
    if (!user) return "Morate biti ulogovani da biste rezervisali salu.";
    if (!dateISO) return "Izaberi datum.";

  
    if (durationHours <= 0) return "Kraj mora biti nakon početka (istog dana).";
    if (durationHours < 1) return "Minimalno trajanje je 1 sat.";

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

    const startISO = toISOStringFromDateAndTime(dateISO, startHHMM);
    const endISO = toISOStringFromDateAndTime(dateISO, endHHMM);

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

      setMessage("Rezervacija uspešno kreirana!");

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
        border: "1px solid #ddd",
        background: "#fff",
        color: "#333"
      }}
    >
      <div style={{ display: "grid", gap: 6 }}>
        <label style={{ fontWeight: 700 }}>Datum</label>
        <input
          type="date"
          style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}
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
          <select 
            style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}
            value={startHHMM} 
            onChange={(e) => setStartHHMM(e.target.value)}
          >
            {hourOptions.map((t) => (
              <option key={`s-${t}`} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div style={{ display: "grid", gap: 6 }}>
          <label style={{ fontWeight: 700 }}>Kraj</label>
          <select 
            style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}
            value={endHHMM} 
            onChange={(e) => setEndHHMM(e.target.value)}
          >
            {hourOptions.map((t) => (
              <option key={`e-${t}`} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ display: "grid", gap: 6 }}>
        <label style={{ fontWeight: 700 }}>Broj gostiju</label>
        <input
          type="number"
          style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}
          min={1}
          max={capacity}
          value={numberOfGuests}
          onChange={(e) => setNumberOfGuests(Number(e.target.value))}
        />
      </div>

      <div
        style={{
          border: "1px solid #eee",
          borderRadius: 14,
          padding: 12,
          display: "grid",
          gap: 6,
          background: "#f9f9f9",
        }}
      >
        <div style={{ fontWeight: 800 }}>Sažetak</div>
        <div>Trajanje: <b>{durationHours > 0 ? durationHours : 0} h</b></div>
        <div>Ukupno: <b>{convertPrice(totalPrice)}</b></div>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Rezervišem..." : "Rezerviši"}
      </Button>

      {message && <p style={{ color: "green", fontWeight: 600 }}>{message}</p>}
      {error && <p style={{ color: "crimson", fontWeight: 700 }}>{error}</p>}
    </form>
  );
}