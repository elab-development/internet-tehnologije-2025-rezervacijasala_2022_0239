"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import ReserveForm from "./ReserveForm";

type Hall = {
  id: number;
  name: string;
  capacity: number;
  price: number;
  isActive: boolean;
};

const KEY = "mock_halls";

export default function HallDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params); // ✅ unwrapping Promise params

  const [hall, setHall] = useState<Hall | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const idNum = Number(id);
    const halls: Hall[] = JSON.parse(localStorage.getItem(KEY) || "[]");
    const found = halls.find((h) => h.id === idNum);

    if (!found) {
      setNotFound(true);
      return;
    }

    setNotFound(false);
    setHall(found);
  }, [id]);

  if (notFound) {
    return (
      <main style={{ padding: 24 }}>
        <h1>Sala nije pronađena</h1>
        <Link href="/halls">Nazad na sale</Link>
      </main>
    );
  }

  if (!hall) {
    return (
      <main style={{ padding: 24 }}>
        <p>Učitavanje...</p>
      </main>
    );
  }

  return (
    <main style={{ padding: 24, maxWidth: 800, margin: "0 auto" }}>
      <Link href="/halls">← Nazad</Link>

      <h1>{hall.name}</h1>
      <p>Kapacitet: {hall.capacity}</p>
      <p>Cijena: {hall.price} €</p>

      <hr style={{ margin: "24px 0" }} />

      <h2>Rezerviši ovu salu</h2>
      <ReserveForm hallId={hall.id} />
    </main>
  );
}
