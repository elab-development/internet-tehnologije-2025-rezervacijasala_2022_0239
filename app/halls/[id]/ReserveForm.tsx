"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";

export default function ReserveForm({ hallId }: { hallId: number }) {
  const { user } = useAuth();

  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!user) {
      setError("Morate biti ulogovani da biste rezervisali salu.");
      return;
    }

    try {
      setLoading(true);
    
      await apiFetch(
        "/api/reservations",
        {
          method: "POST",
          body: JSON.stringify({
            userId: user.id,
            hallId,
            startDateTime,
            endDateTime,
            numberOfGuests,
          }),
        },
        { user }
      );

      setMessage("Rezervacija uspešno kreirana!");
      setStartDateTime("");
      setEndDateTime("");
      setNumberOfGuests(1);
    } catch (err: any) {
      setError(err.message || "Greška pri rezervaciji");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Početak</label>
        <input
          type="datetime-local"
          value={startDateTime}
          onChange={(e) => setStartDateTime(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Kraj</label>
        <input
          type="datetime-local"
          value={endDateTime}
          onChange={(e) => setEndDateTime(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Broj gostiju</label>
        <input
          type="number"
          min={1}
          value={numberOfGuests}
          onChange={(e) => setNumberOfGuests(Number(e.target.value))}
          required
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Rezervišem..." : "Rezerviši"}
      </button>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
