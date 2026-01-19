"use client";

import { useState } from "react";
import Link from "next/link";
import HallCard from "../../components/HallCard";

const halls = [
  {
    id: 1,
    name: "Velika svečana sala",
    capacity: 300,
    pricePerHour: 120,
  },
  {
    id: 2,
    name: "Mala sala",
    capacity: 80,
    pricePerHour: 60,
  },
  {
    id: 3,
    name: "VIP sala",
    capacity: 150,
    pricePerHour: 100,
  },
];

export default function HallsPage() {
  const [search, setSearch] = useState("");

  const filteredHalls = halls.filter((hall) =>
    hall.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main style={{ padding: 24, maxWidth: 1000, margin: "0 auto" }}>
      <h1>Sale</h1>

      <input
        placeholder="Pretraži sale..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ padding: 8, marginBottom: 20, width: "100%" }}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: 16,
        }}
      >
        {filteredHalls.map((hall) => (
          <HallCard key={hall.id} hall={hall} />
        ))}
      </div>
    </main>
  );
}
