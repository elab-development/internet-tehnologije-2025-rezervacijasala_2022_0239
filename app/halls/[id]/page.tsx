"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ReserveForm from "./ReserveForm";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";
import { useCurrency } from "@/lib/CurrencyContext";

type Hall = {
  id: number;
  name: string;
  capacity: number;
  description: string;
  pricePerHour: number;
  isActive: boolean;
  isClosed: boolean;
  hasStage: boolean;
  imageUrl?: string;
  city: { id: number; name: string };
  category: { id: number; name: string };
};

type ReservationSlot = {
  startDateTime: string;
  endDateTime: string;
};

export default function HallDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { convertPrice } = useCurrency();
  const { id } = use(params);
  const { user } = useAuth();

  const [hall, setHall] = useState<Hall | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [reservedSlots, setReservedSlots] = useState<ReservationSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(true);

  useEffect(() => {
    apiFetch(`/api/halls/${id}`)
      .then(setHall)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    apiFetch(`/api/halls/${id}/reservations`)
      .then(setReservedSlots)
      .catch(() => {})
      .finally(() => setLoadingSlots(false));
  }, [id]);


  function formatDate(dateISO: string) {
    return new Date(dateISO).toLocaleDateString("sr-RS", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  function formatTime(dateISO: string) {
    return new Date(dateISO).toLocaleTimeString("sr-RS", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }


  const groupedByDate = useMemo(() => {
    return reservedSlots.reduce<Record<string, ReservationSlot[]>>(
      (acc, slot) => {
        const dateKey = slot.startDateTime.split("T")[0];
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(slot);
        return acc;
      },
      {}
    );
  }, [reservedSlots]);

  if (loading) {
    return (
      <main style={{ padding: 24 }}>
        <p>Učitavanje...</p>
      </main>
    );
  }

  if (error || !hall) {
    return (
      <main style={{ padding: 24 }}>
        <h1>Sala nije pronađena</h1>
        <Link href="/halls">Nazad na sale</Link>
      </main>
    );
  }

  return (
    <main style={{ padding: 24, maxWidth: 800, margin: "0 auto" }}>
      <Link href="/halls">← Nazad</Link>

      <img
        src={hall.imageUrl || `/images/halls/${hall.id}.jpg`}
        alt={hall.name}
        onError={(e) => {
          // Ako ni jedna slika ne radi, postavi placeholder
          (e.target as HTMLImageElement).src = "/images/placeholder-hall.jpg";
        }}
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

      {hall.description?.trim() && (
        <p style={{ marginTop: 8, color: "var(--text-muted)", lineHeight: 1.6 }}>
          {hall.description}
        </p>
      )}

      <p>Grad: {hall.city?.name}</p>
      <p>Kategorija: {hall.category?.name}</p>
      <p>Kapacitet: {hall.capacity}</p>
      <p>Cena po satu: <strong>{convertPrice(hall.pricePerHour)}</strong></p>

      <p>
        Ima binu: <strong>{hall.hasStage ? "Da" : "Ne"}</strong>
      </p>

      <p>
        Tip:{" "}
        <strong>
          {hall.isClosed ? "U zatvorenom prostoru" : "Na otvorenom"}
        </strong>
      </p>

      <hr style={{ margin: "24px 0" }} />

<div
  style={{
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 32,
    alignItems: "start",
  }}
>
  {/* LEVO – REZERVACIJA */}
  <div>
    <h2>Rezerviši ovu salu</h2>

    <ReserveForm
      hallId={hall.id}
      pricePerHour={hall.pricePerHour}
      capacity={hall.capacity}
    />
  </div>

  {/* DESNO – ZAUZETI TERMINI */}
  <div>
    <h3>Zauzeti termini</h3>

    {loadingSlots ? (
      <p>Učitavanje termina...</p>
    ) : reservedSlots.length === 0 ? (
      <p style={{ color: "green", fontWeight: 600 }}>
        Sala je trenutno slobodna.
      </p>
    ) : (
      <div style={{ display: "grid", gap: 16, marginTop: 16 }}>
        {Object.entries(groupedByDate).map(([date, slots]) => (
          <div
            key={date}
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: 12,
              padding: 14,
              background: "#fff7f7",
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: 8 }}>
               {formatDate(date)}
            </div>

            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {slots.map((slot, i) => (
                <li
                  key={i}
                  style={{ color: "#b91c1c", fontWeight: 600 }}
                >
                   {formatTime(slot.startDateTime)} –{" "}
                  {formatTime(slot.endDateTime)}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    )}
  </div>
</div>

    </main>
  );
}
