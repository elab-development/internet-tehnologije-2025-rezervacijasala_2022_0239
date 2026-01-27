"use client";

import { useEffect, useMemo, useState } from "react";
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
  isClosed: boolean; // true = zatvorena, false = otvorena
  hasStage: boolean;
  city?: { id: number; name: string };
  category?: { id: number; name: string };
};

type SpaceType = "ALL" | "OPEN" | "CLOSED";

export default function HallsPage() {
  const { user } = useAuth();

  const [halls, setHalls] = useState<Hall[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔎 FILTER STATE
  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [hasStageOnly, setHasStageOnly] = useState(false);
  const [selectedCity, setSelectedCity] = useState("ALL");
  const [spaceType, setSpaceType] = useState<SpaceType>("ALL");

  // Provera da li je korisnik admin ili manager
  const isPrivileged = user?.role === "MANAGER" || user?.role === "ADMIN";

  /* ============================
     FETCH SALA
     ============================ */
  useEffect(() => {
    apiFetch("/api/halls")
      .then(setHalls)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  /* ============================
     LISTA GRADOVA
     ============================ */
  const cities = useMemo(() => {
    return Array.from(
      new Set(
        halls
          .map((h) => h.city?.name)
          .filter(Boolean) as string[]
      )
    );
  }, [halls]);

  /* ============================
     FILTER LOGIKA
     ============================ */
  const filteredHalls = useMemo(() => {
    return halls.filter((hall) => {
      // 🔍 pretraga po nazivu
      if (
        search &&
        !hall.name.toLowerCase().includes(search.toLowerCase())
      ) {
        return false;
      }

      // 💰 filter po ceni
      if (maxPrice !== "" && hall.pricePerHour > maxPrice) {
        return false;
      }

      // 🎤 ima binu
      if (hasStageOnly && !hall.hasStage) {
        return false;
      }

      // 🌆 grad
      if (
        selectedCity !== "ALL" &&
        hall.city?.name !== selectedCity
      ) {
        return false;
      }

      // 🚪 tip sale (otvorena / zatvorena)
      if (spaceType === "OPEN" && hall.isClosed) {
        return false;
      }
      if (spaceType === "CLOSED" && !hall.isClosed) {
        return false;
      }

      return true;
    });
  }, [
    halls,
    search,
    maxPrice,
    hasStageOnly,
    selectedCity,
    spaceType,
  ]);

  if (loading) return <p style={{ padding: 24 }}>Učitavanje sala...</p>;
  if (error) return <p style={{ padding: 24 }}>{error}</p>;

  return (
    <main style={{ padding: 24, maxWidth: 1000, margin: "0 auto" }}>
      {/* NASLOV + LINK */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <h1 style={{ margin: 0 }}>Sale</h1>

        {isPrivileged && (
          <Link
            href="/manager/halls"
            style={{
              backgroundColor: "#6b21a8",
              color: "white",
              padding: "8px 16px",
              borderRadius: "8px",
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: "600",
            }}
          >
            Upravljaj salama →
          </Link>
        )}
      </div>

      {/* FILTERI */}
      <section
  style={{
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: 16,
    marginBottom: 24,
    alignItems: "start",
  }}
>
  {/* LEVA STRANA – search + ostalo */}
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: 12,
    }}
  >
    <input
      placeholder="Pretraga po nazivu..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />

    <input
      type="number"
      placeholder="Maks. cena po satu"
      value={maxPrice}
      onChange={(e) =>
        setMaxPrice(
          e.target.value === "" ? "" : Number(e.target.value)
        )
      }
    />

    <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
      <input
        type="checkbox"
        checked={hasStageOnly}
        onChange={(e) => setHasStageOnly(e.target.checked)}
      />
      Ima binu
    </label>
  </div>

  {/* DESNA STRANA – dropdowni jedan ispod drugog */}
  <div style={{ display: "grid", gap: 12 }}>
    <select
      value={spaceType}
      onChange={(e) => setSpaceType(e.target.value as SpaceType)}
    >
      <option value="ALL">Sve sale</option>
      <option value="OPEN">Otvorene sale</option>
      <option value="CLOSED">Zatvorene sale</option>
    </select>

    <select
      value={selectedCity}
      onChange={(e) => setSelectedCity(e.target.value)}
    >
      <option value="ALL">Svi gradovi</option>
      {cities.map((city) => (
        <option key={city} value={city}>
          {city}
        </option>
      ))}
    </select>
  </div>
</section>


      {/* LISTA SALA */}
      {filteredHalls.length === 0 ? (
        <p>Nema sala koje odgovaraju filterima.</p>
      ) : (
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
      )}
    </main>
  );
}
