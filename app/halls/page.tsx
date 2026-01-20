"use client";

import { useEffect, useMemo, useState } from "react";
import HallCard from "../../components/HallCard";
import Input from "../../components/Input";

type Hall = {
  id: number;
  name: string;
  capacity: number;
  price: number;
  isActive: boolean;
};

const KEY = "mock_halls";

const DEFAULT_HALLS: Hall[] = [
  { id: 1, name: "Velika svečana sala", capacity: 300, price: 120, isActive: true },
  { id: 2, name: "Mala sala", capacity: 80, price: 60, isActive: true },
  { id: 3, name: "VIP sala", capacity: 150, price: 100, isActive: true },
];

export default function HallsPage() {
  const [halls, setHalls] = useState<Hall[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const existing = localStorage.getItem(KEY);
    if (!existing) {
      localStorage.setItem(KEY, JSON.stringify(DEFAULT_HALLS));
      setHalls(DEFAULT_HALLS);
    } else {
      setHalls(JSON.parse(existing));
    }
  }, []);

  const filteredHalls = useMemo(() => {
    return halls.filter(
      (h) =>
        h.isActive &&
        h.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [halls, search]);

  return (
    <main style={{ padding: 24, maxWidth: 1000, margin: "0 auto" }}>
      <h1>Sale</h1>

      <Input
        label="Pretraga"
        value={search}
        onChange={setSearch}
        placeholder="Pretraži sale..."
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: 16,
          marginTop: 20,
        }}
      >
        {filteredHalls.map((hall) => (
          <HallCard key={hall.id} hall={hall} />
        ))}
      </div>

      {filteredHalls.length === 0 && (
        <p style={{ marginTop: 16 }}>Nema dostupnih sala.</p>
      )}
    </main>
  );
}
