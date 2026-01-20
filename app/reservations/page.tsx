"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Button from "../../components/Button";
import { useAuth } from "../providers";

type Reservation = {
  id: number;
  hallId: number;
  dateTime: string;
  numberOfGuests: number;
  note: string;
  status: "ACTIVE" | "CANCELLED";
  createdAt: string;
};

const STORAGE_KEY = "mock_reservations";

export default function ReservationsPage() {
  const { user } = useAuth();
  const [items, setItems] = useState<Reservation[]>([]);

  useEffect(() => {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    setItems(existing);
  }, []);

  function cancelReservation(id: number) {
    const updated = items.map((r) =>
      r.id === id ? { ...r, status: "CANCELLED" as const } : r
    );
    setItems(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  if (!user) {
    return (
      <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
        <h1>Moje rezervacije</h1>
        <p>Moraš biti ulogovana da vidiš rezervacije.</p>
        <Link href="/login">Idi na prijavu</Link>
      </main>
    );
  }

  return (
    <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h1>Moje rezervacije</h1>

      {items.length === 0 ? (
        <p>
          Nema rezervacija. Idi na <Link href="/halls">Sale</Link> i rezerviši.
        </p>
      ) : (
        <div style={{ display: "grid", gap: 12, marginTop: 14 }}>
          {items.map((r) => (
            <div
              key={r.id}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 12,
                padding: 14,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  alignItems: "flex-start",
                }}
              >
                <div>
                  <div style={{ fontWeight: 700 }}>
                    Sala #{r.hallId} • {new Date(r.dateTime).toLocaleString()}
                  </div>
                  <div style={{ fontSize: 14, opacity: 0.8, marginTop: 4 }}>
                    Zvanice: {r.numberOfGuests} • Status: {r.status}
                  </div>
                  {r.note ? (
                    <div style={{ fontSize: 14, marginTop: 6 }}>
                      Napomena: {r.note}
                    </div>
                  ) : null}
                </div>

                <div style={{ display: "grid", gap: 8, justifyItems: "end" }}>
                  <Link href={`/halls/${r.hallId}`}>Detalji sale</Link>

                  {r.status === "ACTIVE" && (
                    <Button type="button" onClick={() => cancelReservation(r.id)}>
                      Otkaži
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
