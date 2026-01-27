"use client";

import { useEffect, useState } from "react";
import HallCard from "@/components/HallCard";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";
import Link from "next/link";

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

  // Provera da li je korisnik admin ili manager
  const isPrivileged = user?.role === "MANAGER" || user?.role === "ADMIN";

  useEffect(() => {
    apiFetch("/api/halls")
      .then((data) => setHalls(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <p style={{ padding: 24 }}>Učitavanje sala...</p>;
  if (error) return <p style={{ padding: 24 }}>{error}</p>;

 return (
    <main style={{ padding: 24, maxWidth: 1000, margin: "0 auto" }}>
      {/* 2. Naslov i Link u flex kontejneru */}
      <div style={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        marginBottom: 24 
      }}>
        <h1 style={{ margin: 0 }}>Sale</h1>
        
        {isPrivileged && (
          <Link 
            href="/manager/halls" 
            style={{ 
              backgroundColor: "#6b21a8", // Ljubičasta kao sa tvoje slike
              color: "white", 
              padding: "8px 16px", 
              borderRadius: "8px",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: "600"
            }}
          >
            Upravljaj salama →
          </Link>
        )}
      </div>

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
