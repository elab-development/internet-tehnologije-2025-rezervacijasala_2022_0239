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
  isClosed: boolean;
  hasStage: boolean;
  city?: City;
  category?: Category;
};

type SpaceType = "ALL" | "OPEN" | "CLOSED";

export default function HallsPage() {
  const { user } = useAuth();

  const [halls, setHalls] = useState<Hall[]>([]);
  const [cities, setCities] = useState<City[]>([]); // Svi gradovi iz baze
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔎 FILTER STATE
  const [search, setSearch] = useState("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [hasStageOnly, setHasStageOnly] = useState(false);
  const [selectedCity, setSelectedCity] = useState("ALL");
  const [spaceType, setSpaceType] = useState<SpaceType>("ALL");

  const isPrivileged = user?.role === "MANAGER" || user?.role === "ADMIN";

  // FETCH PODATAKA (Sale + Gradovi)
  useEffect(() => {
    setLoading(true);
    Promise.all([
      apiFetch("/api/halls"),
      apiFetch("/api/cities") // Očekujemo da ova ruta vraća niz svih gradova
    ])
      .then(([hallsData, citiesData]) => {
        setHalls(hallsData);
        setCities(citiesData);
      })
      .catch((err) => setError(err.message || "Greška pri učitavanju."))
      .finally(() => setLoading(false));
  }, []);

  // FILTER LOGIKA
  const filteredHalls = useMemo(() => {
    return halls.filter((hall) => {
      // 🔍 Naziv
      if (search && !hall.name.toLowerCase().includes(search.toLowerCase())) return false;
      // 💰 Cena
      if (maxPrice !== "" && hall.pricePerHour > maxPrice) return false; // Ispravljeno: ako je cena VEĆA od max, sakrij
      // 🎤 Bina
      if (hasStageOnly && !hall.hasStage) return false;
      // 🌆 Grad
      if (selectedCity !== "ALL" && hall.city?.name !== selectedCity) return false;
      // 🚪 Tip
      if (spaceType === "OPEN" && hall.isClosed) return false;
      if (spaceType === "CLOSED" && !hall.isClosed) return false;

      return true;
    });
  }, [halls, search, maxPrice, hasStageOnly, selectedCity, spaceType]);

  if (loading) return <p style={{ padding: 40, textAlign: "center" }}>Učitavanje...</p>;
  if (error) return <p style={{ padding: 40, color: "red", textAlign: "center" }}>{error}</p>;

  // Stilovi za inpute da izgledaju isto
  const inputStyle = {
    padding: "10px 12px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    fontSize: "14px",
    outline: "none",
  };

  return (
    <main style={{ padding: "40px 24px", maxWidth: 1100, margin: "0 auto" }}>
      
      {/* --- ZAGLAVLJE I DUGMAD --- */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
        <h1 style={{ margin: 0, fontSize: "2rem", color: "#1a202c" }}>Sale</h1>

        {isPrivileged && (
          <div style={{ display: "flex", gap: "12px" }}>
            {/* Dugme za dodavanje kategorija/gradova */}
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
                transition: "0.2s"
              }}
            >
              + Šifarnici (Grad/Kat)
            </Link>

            {/* Dugme za upravljanje salama */}
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
                alignItems: "center"
              }}
            >
              Upravljaj salama →
            </Link>
          </div>
        )}
      </div>

      {/* --- BAR ZA PRETRAGU I FILTRIRANJE --- */}
      <div style={{
        backgroundColor: "white",
        padding: "24px",
        borderRadius: "16px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        marginBottom: "32px",
        display: "flex",
        flexWrap: "wrap",
        gap: "16px",
        alignItems: "center",
        border: "1px solid #f0f0f0"
      }}>
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
             onChange={(e) => setMaxPrice(e.target.value === "" ? "" : Number(e.target.value))}
             style={{ ...inputStyle, width: "100%" }}
           />
        </div>

        {/* Grad Dropdown */}
        <div style={{ flex: "1 1 160px" }}>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              style={{ ...inputStyle, width: "100%", cursor: "pointer", backgroundColor: "white" }}
            >
              <option value="ALL">Svi gradovi</option>
              {cities.map((city) => (
                <option key={city.id} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
        </div>

        {/* Tip Sale Dropdown */}
        <div style={{ flex: "1 1 160px" }}>
            <select
              value={spaceType}
              onChange={(e) => setSpaceType(e.target.value as SpaceType)}
              style={{ ...inputStyle, width: "100%", cursor: "pointer", backgroundColor: "white" }}
            >
              <option value="ALL">Sve vrste</option>
              <option value="OPEN">Otvorene</option>
              <option value="CLOSED">Zatvorene</option>
            </select>
        </div>

        {/* Checkbox */}
        <div style={{ flex: "0 0 auto", display: "flex", alignItems: "center", gap: "8px", paddingLeft: "8px" }}>
           <input
             type="checkbox"
             id="stageCheck"
             checked={hasStageOnly}
             onChange={(e) => setHasStageOnly(e.target.checked)}
             style={{ width: 18, height: 18, cursor: "pointer", accentColor: "#6b21a8" }}
           />
           <label htmlFor="stageCheck" style={{ cursor: "pointer", fontSize: "14px", color: "#4a5568", fontWeight: "500" }}>
             Ima binu
           </label>
        </div>
      </div>

      {/* --- REZULTATI --- */}
      {filteredHalls.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#718096" }}>
           <p style={{ fontSize: "1.2rem", marginBottom: 10 }}>Nema rezultata</p>
           <p style={{ fontSize: "0.9rem" }}>Pokušajte da promenite filtere ili kriterijume pretrage.</p>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", // Malo šire kartice
          gap: "24px",
        }}>
          {filteredHalls.map((hall) => (
            <HallCard key={hall.id} hall={hall} />
          ))}
        </div>
      )}
    </main>
  );
}