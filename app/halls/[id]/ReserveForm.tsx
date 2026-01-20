"use client";

import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import Button from "../../../components/Button";
import Input from "../../../components/Input";

type Props = {
  hallId: number;
};

export default function ReserveForm({ hallId }: Props) {
  const { user } = useAuth();

  const [dateTime, setDateTime] = useState("");
  const [guests, setGuests] = useState("");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    // Validacije
    if (!dateTime) {
      setMessage("Izaberi datum i vrijeme.");
      return;
    }

    const g = Number(guests);
    if (!g || g < 1) {
      setMessage("Unesi ispravan broj zvanica.");
      return;
    }

    if (!user) {
      setMessage("Moraš biti ulogovana da bi napravila rezervaciju.");
      return;
    }

    // Mock rezervacija
    const reservation = {
      id: Date.now(),
      hallId,
      dateTime,
      numberOfGuests: g,
      note,
      status: "ACTIVE",
      createdAt: new Date().toISOString(),
    };

    const STORAGE_KEY = "mock_reservations";
    const existing = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || "[]"
    );

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([reservation, ...existing])
    );

    setMessage("Rezervacija uspešno sačuvana ✅");

    // Reset forme
    setDateTime("");
    setGuests("");
    setNote("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "grid", gap: 14, maxWidth: 520 }}
    >
      <Input
        label="Datum i vrijeme"
        type="datetime-local"
        value={dateTime}
        onChange={setDateTime}
      />

      <Input
        label="Broj zvanica"
        type="number"
        value={guests}
        onChange={setGuests}
        placeholder="npr. 120"
      />

      <Input
        label="Napomena"
        value={note}
        onChange={setNote}
        placeholder="npr. rođendan, posebni zahtevi..."
      />

      <Button type="submit">Potvrdi rezervaciju</Button>

      {message && (
        <p style={{ fontSize: 14, marginTop: 4 }}>{message}</p>
      )}
    </form>
  );
}
