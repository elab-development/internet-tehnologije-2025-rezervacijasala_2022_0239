"use client";

import { useEffect, useState } from "react";
import HallCard from "@/components/HallCard";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";

type Hall = {
  id: number;
  name: string;
  capacity: number;
  pricePerHour: number;
  isActive: boolean;
  isClosed: boolean;
  hasStage: boolean;
  city?: { id: number; name: string };
  category?: { id: number; name: string };
};

export default function HallsPage() {
  const { user } = useAuth();
  const [halls, setHalls] = useState<Hall[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch("/api/halls", {}, user ? { user } : undefined)
      .then((data) => setHalls(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <p style={{ padding: 24 }}>Učitavanje sala...</p>;
  if (error) return <p style={{ padding: 24 }}>{error}</p>;

  return (
    <main style={{ padding: 24, maxWidth: 1000, margin: "0 auto" }}>
      <h1>Sale</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: 16,
        }}
      >
        {halls.map((hall) => (
          <HallCard key={hall.id} hall={hall} />
        ))}
      </div>
    </main>
  );
}
