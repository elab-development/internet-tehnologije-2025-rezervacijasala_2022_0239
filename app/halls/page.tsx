"use client";

import { useEffect, useMemo, useState } from "react";
import HallCard from "@/components/HallCard";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";
import Link from "next/link";
import Button from "@/components/Button";
import { useCurrency } from "@/lib/CurrencyContext";

type City = { id: number; name: string };
type Category = { id: number; name: string };

type Hall = {
  id: number;
  name: string;
  capacity: number;
  pricePerHour: number;
  isActive: boolean;
  isClosed: boolean; // true = unutra, false = na otvorenom
  hasStage: boolean;
  city?: City;
  category?: Category;
};

export default function HallsPage() {
  const { currency } = useCurrency();
  const { user } = useAuth();

  const [halls, setHalls] = useState<Hall[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // FILTER STATE
  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [hasStageOnly, setHasStageOnly] = useState(false);

  const [selectedCity, setSelectedCity] = useState("ALL");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  const [openOnly, setOpenOnly] = useState(false);
  const [closedOnly, setClosedOnly] = useState(false);

  const isPrivileged = user?.role === "MANAGER" || user?.role === "ADMIN";

  useEffect(() => {
    setLoading(true);

    Promise.all([
      apiFetch("/api/halls"),
      apiFetch("/api/cities"),
      apiFetch("/api/hall-categories"),
    ])
      .then(([hallsData, citiesData, categoriesData]) => {
        setHalls(hallsData);
        setCities(citiesData);
        setCategories(categoriesData);
      })
      .catch((err) => setError(err.message || "Greška pri učitavanju."))
      .finally(() => setLoading(false));
  }, []);

  const filteredHalls = useMemo(() => {
    return halls.filter((hall) => {
      if (search && !hall.name.toLowerCase().includes(search.toLowerCase()))
        return false;

      if (maxPrice !== "" && hall.pricePerHour > maxPrice) return false;

      if (hasStageOnly && !hall.hasStage) return false;

      if (selectedCity !== "ALL" && hall.city?.name !== selectedCity)
        return false;

      if (
        selectedCategory !== "ALL" &&
        hall.category?.name !== selectedCategory
      )
        return false;

      const bothChecked = openOnly && closedOnly;
      const noneChecked = !openOnly && !closedOnly;

      if (!bothChecked && !noneChecked) {
        if (openOnly && hall.isClosed) return false;
        if (closedOnly && !hall.isClosed) return false;
      }

      return true;
    });
  }, [
    halls,
    search,
    maxPrice,
    hasStageOnly,
    selectedCity,
    selectedCategory,
    openOnly,
    closedOnly,
  ]);

  if (loading)
    return <p style={{ padding: 40, textAlign: "center" }}>Učitavanje...</p>;
  if (error)
    return (
      <p style={{ padding: 40, color: "red", textAlign: "center" }}>{error}</p>
    );

  const inputStyle: React.CSSProperties = {
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    fontSize: "14px",
  };

  return (
    <main style={{ padding: "40px 24px", maxWidth: 1100, margin: "0 auto" }}>
      {/* === ZAGLAVLJE === */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 32,
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <h1 style={{ margin: 0, fontSize: "2rem", color: "#1a202c" }}>Sale</h1>

        {isPrivileged && (
          <div style={{ display: "flex", gap: 12 }}>
            <Link href="/manager/data">
              <Button>+ Šifarnici (Grad / Kat)</Button>
            </Link>

            <Link href="/manager/halls">
              <Button>Upravljaj salama →</Button>
            </Link>
          </div>
        )}
      </div>

      {/* === FILTERI === */}
      <div
        style={{
          backgroundColor: "white",
          padding: 24,
          borderRadius: 16,
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          marginBottom: 32,
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
          alignItems: "center",
          border: "1px solid #f0f0f0",
        }}
      >
        <div style={{ flex: "2 1 200px" }}>
          <input
            placeholder="Pretraga po nazivu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ ...inputStyle, width: "100%" }}
          />
        </div>

        <div style={{ flex: "1 1 140px" }}>
        <input
          type="number"
          placeholder={`Max ${currency}/h`}
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value === "" ? "" : Number(e.target.value))}
          style={{ ...inputStyle, width: "100%" }}
        />
      </div>

        <div style={{ flex: "1 1 160px" }}>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            style={{ ...inputStyle, width: "100%" }}
          >
            <option value="ALL">Svi gradovi</option>
            {cities.map((city) => (
              <option key={city.id} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ flex: "1 1 160px" }}>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ ...inputStyle, width: "100%" }}
          >
            <option value="ALL">Sve kategorije</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <input
            type="checkbox"
            checked={hasStageOnly}
            onChange={(e) => setHasStageOnly(e.target.checked)}
          />
          Ima binu
        </label>

        <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <input
            type="checkbox"
            checked={openOnly}
            onChange={(e) => setOpenOnly(e.target.checked)}
          />
          Na otvorenom
        </label>

        <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <input
            type="checkbox"
            checked={closedOnly}
            onChange={(e) => setClosedOnly(e.target.checked)}
          />
          Unutra
        </label>
      </div>

      {/* === REZULTATI === */}
      {filteredHalls.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#718096" }}>
          <p style={{ fontSize: "1.2rem" }}>Nema rezultata</p>
          <p>Pokušajte da promenite filtere.</p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 24,
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
