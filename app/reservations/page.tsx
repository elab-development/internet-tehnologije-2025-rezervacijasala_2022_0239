"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";
import ReservationCard from "./ReservationCard";
import EditReservationModal from "./EditReservationModal";

type Status = "ACTIVE" | "CANCELLED" | "COMPLETED" | "PENDING";

export type Reservation = {
  id: number;
  startDateTime: string;
  endDateTime: string;
  numberOfGuests: number;
  status: Status;
  hall: { name: string; pricePerHour: number };
  user?: { firstName?: string; lastName?: string; email: string};
};

export default function MyReservationsPage() {
  const { user } = useAuth();

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editing, setEditing] = useState<Reservation | null>(null);

  // Koristimo useMemo da sortiramo podatke čim stignu iz baze
  const sortedReservations = useMemo(() => {
    return [...reservations].sort((a, b) => {
      const dateA = new Date(a.startDateTime).getTime();
      const dateB = new Date(b.startDateTime).getTime();
      
      // Od najbližeg datuma ka najdaljem (Hronološki)
      return dateA - dateB;
    });
  }, [reservations]);

  async function load() {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const isPrivileged = user.role === "ADMIN" || user.role === "MANAGER";
    const url = isPrivileged ? "/api/reservations" : "/api/reservations/my";

    try {
      const data = await apiFetch(url);
      setReservations(data);
    } catch (e: any) {
      setError(e?.message || "Greška pri učitavanju rezervacija");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [user?.id, user?.role]);

  if (!user) {
    return (
      <main style={{ padding: 24 }}>
        <p>Morate biti prijavljeni da biste videli rezervacije.</p>
        <Link href="/login">Prijavi se</Link>
      </main>
    );
  }

  if (loading) return <p style={{ padding: 24 }}>Učitavanje rezervacija...</p>;
  if (error) return <p style={{ padding: 24, color: "red" }}>{error}</p>;

  const isPrivileged = user.role === "ADMIN" || user.role === "MANAGER";

  return (
    <main style={{ padding: 24, maxWidth: 980, margin: "0 auto" }}>
      <h1>{isPrivileged ? "Rezervacije svih korisnika" : "Moje rezervacije"}</h1>

      {sortedReservations.length === 0 ? (
        <p>Nemate nijednu rezervaciju.</p>
      ) : (
        <div style={{ display: "grid", gap: 14, marginTop: 16 }}>
          {/* Mapiramo kroz sortirani niz umesto kroz osnovni state */}
          {sortedReservations.map((r) => (
            <ReservationCard
              key={r.id}
              reservation={r}
              isPrivileged={isPrivileged}
              onEdit={() => setEditing(r)}
              onChanged={load} 
            />
          ))}
        </div>
      )}

      {editing && (
        <EditReservationModal
          reservation={editing}
          onClose={() => setEditing(null)}
          onSaved={() => {
            setEditing(null);
            load();
          }}
        />
      )}
    </main>
  );
}