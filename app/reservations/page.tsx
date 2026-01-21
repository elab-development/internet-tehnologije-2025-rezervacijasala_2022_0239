"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";
import Link from "next/link";

type Reservation = {
  id: number;
  startDateTime: string;
  endDateTime: string;
  numberOfGuests: number;
  hall: {
    name: string;
  };
};

export default function MyReservationsPage() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    apiFetch("/api/reservations/my", {}, { user })
      .then((data) => {
        setReservations(data);
      })
      .catch((err) => {
        setError(err.message || "Greška pri učitavanju rezervacija");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user]);

  if (!user) {
    return (
      <main style={{ padding: 24 }}>
        <p>Morate biti prijavljeni da biste videli rezervacije.</p>
        <Link href="/login">Prijavi se</Link>
      </main>
    );
  }

  if (loading) {
    return <p style={{ padding: 24 }}>Učitavanje rezervacija...</p>;
  }

  if (error) {
    return <p style={{ padding: 24, color: "red" }}>{error}</p>;
  }

  return (
    <main style={{ padding: 24, maxWidth: 800, margin: "0 auto" }}>
      <h1>Moje rezervacije</h1>

      {reservations.length === 0 ? (
        <p>Nemate nijednu rezervaciju.</p>
      ) : (
        <ul style={{ display: "grid", gap: 12 }}>
          {reservations.map((r) => (
            <li
              key={r.id}
              style={{
                border: "1px solid #ddd",
                padding: 12,
                borderRadius: 6,
              }}
            >
              <strong>Sala:</strong> {r.hall.name} <br />
              <strong>Od:</strong>{" "}
              {new Date(r.startDateTime).toLocaleString()} <br />
              <strong>Do:</strong>{" "}
              {new Date(r.endDateTime).toLocaleString()} <br />
              <strong>Broj gostiju:</strong> {r.numberOfGuests}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
