"use client";

import { useEffect, useMemo, useState } from "react";
import HallCard from "@/components/HallCard";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";
import Link from "next/link";

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
  const { user } = useAuth();

  const [halls, setHalls] = useState<Hall[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔎 FILTER STATE
  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [hasStageOnly, setHasStageOnly] = useState(false);

  const [selectedCity, setSelectedCity] = useState("ALL");
  const [selectedCategory, setSelectedCategory] = useState("ALL");

  // ✅ novi checkbox filteri za otvoreno/zatvoreno
  const [openOnly, setOpenOnly] = useState(false);     // na otvorenom
  const [closedOnly, setClosedOnly] = useState(false); // unutra

  const isPrivileged = user?.role === "MANAGER" || user?.role === "ADMIN";

  // FETCH PODATAKA (Sale + Gradovi + Kategorije)
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

  // FILTER LOGIKA
  const filteredHalls = useMemo(() => {
    return halls.filter((hall) => {
      // Naziv
      if (search && !hall.name.toLowerCase().includes(search.toLowerCase()))
        return false;

      // Cena (max)
      if (maxPrice !== "" && hall.pricePerHour > maxPrice) return false;

      // Bina
      if (hasStageOnly && !hall.hasStage) return false;

      // Grad
      if (selectedCity !== "ALL" && hall.city?.name !== selectedCity)
        return false;

      // Kategorija
      if (
        selectedCategory !== "ALL" &&
        hall.category?.name !== selectedCategory
      )
        return false;

      /**
       * Otvoreno/Zatvoreno (checkbox logika):
       * - nijedan čekiran -> prikaži sve
       * - oba čekirana -> prikaži sve
       * - samo open -> prikaži samo gdje isClosed === false
       * - samo closed -> prikaži samo gdje isClosed === true
       */
      const bothChecked = openOnly && closedOnly;
      const noneChecked = !openOnly && !closedOnly;

      if (!bothChecked && !noneChecked) {
        if (openOnly && hall.isClosed) return false;      // tražimo otvoreno, a ovo je zatvoreno
        if (closedOnly && !hall.isClosed) return false;   // tražimo zatvoreno, a ovo je otvoreno
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

  // Stilovi za inpute da izgledaju isto
  const inputStyle: React.CSSProperties = {
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    fontSize: "14px",
    outline: "none",
  };

  return (
    <main style={{ padding: "40px 24px", maxWidth: 1100, margin: "0 auto" }}>
      {/* --- ZAGLAVLJE I DUGMAD --- */}
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
          <div style={{ display: "flex", gap: "12px" }}>
            <Link
              href="/manager/data"
              style={{
                backgroundColor: "white",
                color: "#6b21a8",
                border: "1px solid #6b21a8",
                padding: "10px 20px",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: "600",
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                transition: "0.2s",
              }}
            >
              + Šifarnici (Grad/Kat)
            </Link>

            <Link
              href="/manager/halls"
              style={{
                backgroundColor: "#6b21a8",
                color: "white",
                padding: "10px 20px",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: "600",
                fontSize: "14px",
                boxShadow: "0 4px 6px rgba(107, 33, 168, 0.2)",
                display: "flex",
                alignItems: "center",
              }}
            >
              Upravljaj salama →
            </Link>
          </div>
        )}
      </div>

      {/* --- BAR ZA PRETRAGU I FILTRIRANJE --- */}
      <div
        style={{
          backgroundColor: "white",
          padding: "24px",
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          marginBottom: "32px",
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          alignItems: "center",
          border: "1px solid #f0f0f0",
        }}
      >
        {/* Search */}
        <div style={{ flex: "2 1 200px" }}>
          <input
            placeholder="Pretraga po nazivu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ ...inputStyle, width: "100%" }}
          />
        </div>

        {/* Max Cena */}
        <div style={{ flex: "1 1 140px" }}>
          <input
            type="number"
            placeholder="Max €/h"
            value={maxPrice}
            onChange={(e) =>
              setMaxPrice(e.target.value === "" ? "" : Number(e.target.value))
            }
            style={{ ...inputStyle, width: "100%" }}
          />
        </div>

        {/* Grad Dropdown */}
        <div style={{ flex: "1 1 160px" }}>
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            style={{
              ...inputStyle,
              width: "100%",
              cursor: "pointer",
              backgroundColor: "white",
            }}
          >
            <option value="ALL">Svi gradovi</option>
            {cities.map((city) => (
              <option key={city.id} value={city.name}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        {/* Kategorija Dropdown (umjesto open/closed dropdown) */}
        <div style={{ flex: "1 1 160px" }}>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{
              ...inputStyle,
              width: "100%",
              cursor: "pointer",
              backgroundColor: "white",
            }}
          >
            <option value="ALL">Sve kategorije</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Checkbox: bina */}
        <div
          style={{
            flex: "0 0 auto",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            paddingLeft: "8px",
          }}
        >
          <input
            type="checkbox"
            id="stageCheck"
            checked={hasStageOnly}
            onChange={(e) => setHasStageOnly(e.target.checked)}
            style={{
              width: 18,
              height: 18,
              cursor: "pointer",
              accentColor: "#6b21a8",
            }}
          />
          <label
            htmlFor="stageCheck"
            style={{
              cursor: "pointer",
              fontSize: "14px",
              color: "#4a5568",
              fontWeight: "500",
            }}
          >
            Ima binu
          </label>
        </div>

        {/* Checkbox: otvoreno */}
        <div
          style={{
            flex: "0 0 auto",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <input
            type="checkbox"
            id="openCheck"
            checked={openOnly}
            onChange={(e) => setOpenOnly(e.target.checked)}
            style={{
              width: 18,
              height: 18,
              cursor: "pointer",
              accentColor: "#6b21a8",
            }}
          />
          <label
            htmlFor="openCheck"
            style={{
              cursor: "pointer",
              fontSize: "14px",
              color: "#4a5568",
              fontWeight: "500",
            }}
          >
            Na otvorenom
          </label>
        </div>

        {/* Checkbox: zatvoreno */}
        <div
          style={{
            flex: "0 0 auto",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <input
            type="checkbox"
            id="closedCheck"
            checked={closedOnly}
            onChange={(e) => setClosedOnly(e.target.checked)}
            style={{
              width: 18,
              height: 18,
              cursor: "pointer",
              accentColor: "#6b21a8",
            }}
          />
          <label
            htmlFor="closedCheck"
            style={{
              cursor: "pointer",
              fontSize: "14px",
              color: "#4a5568",
              fontWeight: "500",
            }}
          >
            Unutra (zatvoreno)
          </label>
        </div>
      </div>

      {/* --- REZULTATI --- */}
      {filteredHalls.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#718096" }}>
          <p style={{ fontSize: "1.2rem", marginBottom: 10 }}>Nema rezultata</p>
          <p style={{ fontSize: "0.9rem" }}>
            Pokušajte da promenite filtere ili kriterijume pretrage.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "24px",
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
