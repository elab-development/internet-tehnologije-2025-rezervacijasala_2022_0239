"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import ReserveForm from "./ReserveForm";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";

type Hall = {
  id: number;
  name: string;
  capacity: number;
  pricePerEvent: number;
  isActive: boolean;
};

export default function HallDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params); 
  const { user } = useAuth();

  const [hall, setHall] = useState<Hall | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
      apiFetch(`/api/halls/${id}`, {}, user ? { user } : undefined)
      .then((data) => {
        setHall(data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, user]);

  if (loading) {
    return (
      <main style={{ padding: 24 }}>
        <p>Učitavanje...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main style={{ padding: 24 }}>
        <h1>Sala nije pronađena</h1>
        <Link href="/halls">Nazad na sale</Link>
      </main>
    );
  }

  if (!hall) {
    return null;
  }

  return (
    <main style={{ padding: 24, maxWidth: 800, margin: "0 auto" }}>
      <Link href="/halls">← Nazad</Link>
      <img
      src={`/images/halls/${hall.id}.jpg`}
      alt={hall.name}
      style={{
        width: "100%",
        height: 300,
        objectFit: "cover",
        borderRadius: 18,
        margin: "16px 0",
        border: "1px solid var(--border-color)",
      }}
    />
      <h1>{hall.name}</h1>
      <p>Kapacitet: {hall.capacity}</p>
      <p>Cijena: {hall.pricePerEvent} €</p>

      <hr style={{ margin: "24px 0" }} />

      <h2>Rezerviši ovu salu</h2>
      <ReserveForm hallId={hall.id} pricePerEvent={hall.pricePerEvent} />
    </main>
  );
}
