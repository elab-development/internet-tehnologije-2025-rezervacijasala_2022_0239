"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation"; 

export default function DataEntryPage() {
  const { user } = useAuth();
  const router = useRouter();

  // State za forme
  const [cityName, setCityName] = useState("");
  const [catName, setCatName] = useState("");

  const [cityMsg, setCityMsg] = useState("");
  const [catMsg, setCatMsg] = useState("");

  // Zaštita rute (samo manager/admin)
  if (!user || (user.role !== "MANAGER" && user.role !== "ADMIN")) {
     return <p style={{ padding: 40, textAlign: "center" }}>Nemate pristup ovoj stranici.</p>;
  }

  // Funkcija za dodavanje grada
  async function handleAddCity(e: React.FormEvent) {
    e.preventDefault();
    setCityMsg("");
    try {
      // ✅ Ovo je dobro jer je folder app/api/cities
      await apiFetch("/api/cities", {
        method: "POST",
        body: JSON.stringify({ name: cityName }),
      });
      setCityMsg("✅ Grad uspešno dodat!");
      setCityName(""); 
    } catch (err: any) {
      setCityMsg("❌ Greška: " + (err.message || "Neuspešno."));
    }
  }

  // Funkcija za dodavanje kategorije
  async function handleAddCategory(e: React.FormEvent) {
    e.preventDefault();
    setCatMsg("");
    try {
      // ⚠️ IZMENA: Ruta mora da se slaže sa nazivom foldera na backendu
      // Bilo je "/api/categories", sada je "/api/hall-categories"
      await apiFetch("/api/hall-categories", {
        method: "POST",
        body: JSON.stringify({ name: catName }),
      });
      setCatMsg("✅ Kategorija uspešno dodata!");
      setCatName(""); 
    } catch (err: any) {
      setCatMsg("❌ Greška: " + (err.message || "Neuspešno."));
    }
  }

  // ... (Ostatak dizajna ostaje isti kao u prethodnoj poruci)
  
  const cardStyle = {
    backgroundColor: "white",
    padding: "30px",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
    border: "1px solid #f0f0f0",
    flex: 1,
    minWidth: "300px"
  };

  const buttonStyle = {
    width: "100%",
    padding: "12px",
    backgroundColor: "#6b21a8",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "16px"
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #cbd5e0",
    marginTop: "8px",
    fontSize: "16px"
  };

  return (
    <main style={{ padding: "40px 24px", maxWidth: 900, margin: "0 auto", minHeight: "80vh" }}>
      
      <button 
        onClick={() => router.back()} 
        style={{ background: "none", border: "none", cursor: "pointer", marginBottom: 20, color: "#718096", display: "flex", alignItems: "center", gap: 5 }}
      >
        ← Nazad na sale
      </button>

      <h1 style={{ textAlign: "center", marginBottom: 40, color: "#1a202c" }}>Upravljanje šifarnicima</h1>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "32px", alignItems: "flex-start" }}>
        
        {/* --- KARTICA ZA GRAD --- */}
        <div style={cardStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ width: 40, height: 40, backgroundColor: "#e9d8fd", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>📍</div>
            <h2 style={{ margin: 0, fontSize: "1.25rem" }}>Dodaj Grad</h2>
          </div>
          
          <form onSubmit={handleAddCity}>
            <label style={{ fontSize: "14px", fontWeight: "600", color: "#4a5568" }}>Naziv grada</label>
            <input 
              type="text" 
              placeholder="npr. Novi Sad" 
              value={cityName} 
              onChange={(e) => setCityName(e.target.value)}
              style={inputStyle}
              required
            />
            <button type="submit" style={buttonStyle}>Sačuvaj grad</button>
          </form>

          {cityMsg && <p style={{ marginTop: 15, padding: 10, borderRadius: 6, backgroundColor: cityMsg.includes("✅") ? "#f0fff4" : "#fff5f5", color: cityMsg.includes("✅") ? "#2f855a" : "#c53030", fontSize: "14px", textAlign: "center" }}>{cityMsg}</p>}
        </div>

        {/* --- KARTICA ZA KATEGORIJU --- */}
        <div style={cardStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ width: 40, height: 40, backgroundColor: "#bee3f8", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>🏷️</div>
            <h2 style={{ margin: 0, fontSize: "1.25rem" }}>Dodaj Kategoriju</h2>
          </div>

          <form onSubmit={handleAddCategory}>
            <label style={{ fontSize: "14px", fontWeight: "600", color: "#4a5568" }}>Naziv kategorije</label>
            <input 
              type="text" 
              placeholder="npr. Vjenčanja" 
              value={catName} 
              onChange={(e) => setCatName(e.target.value)}
              style={inputStyle}
              required
            />
            <button type="submit" style={{ ...buttonStyle, backgroundColor: "#3182ce" }}>Sačuvaj kategoriju</button>
          </form>

          {catMsg && <p style={{ marginTop: 15, padding: 10, borderRadius: 6, backgroundColor: catMsg.includes("✅") ? "#f0fff4" : "#fff5f5", color: catMsg.includes("✅") ? "#2f855a" : "#c53030", fontSize: "14px", textAlign: "center" }}>{catMsg}</p>}
        </div>

      </div>
    </main>
  );
}