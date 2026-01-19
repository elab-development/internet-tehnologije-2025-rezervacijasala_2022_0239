"use client";

import { useState } from "react";
import Button from "../../../components/Button";
import Input from "../../../components/Input";

export default function ReserveForm({ hallId }: { hallId: number }) {
  const [dateTime, setDateTime] = useState("");
  const [guests, setGuests] = useState("");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!dateTime) {
      setMessage("Izaberi datum i vrijeme.");
      return;
    }
    const g = Number(guests);
    if (!g || g < 1) {
      setMessage("Unesi ispravan broj zvanica.");
      return;
    }

    setMessage(
      `Rezervacija je validna za salu #${hallId}. Sledeće povezujemo na backend.`
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "grid", gap: 14, maxWidth: 520 }}>
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

      {message && <p style={{ fontSize: 14 }}>{message}</p>}
    </form>
  );
}
