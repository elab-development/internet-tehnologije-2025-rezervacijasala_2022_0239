"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";

import Button from "@/components/Button";
import Input from "@/components/Input";

export default function DataEntryPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [cityName, setCityName] = useState("");
  const [catName, setCatName] = useState("");

  const [cityMsg, setCityMsg] = useState("");
  const [catMsg, setCatMsg] = useState("");

  // Guard
  if (!user || (user.role !== "MANAGER" && user.role !== "ADMIN")) {
    return (
      <p style={{ padding: 40, textAlign: "center" }}>
        Nemate pristup ovoj stranici.
      </p>
    );
  }

  async function handleAddCity(e: React.FormEvent) {
    e.preventDefault();
    setCityMsg("");

    if (!cityName.trim()) {
      setCityMsg("Naziv grada je obavezan.");
      return;
    }

    try {
      await apiFetch("/api/cities", {
        method: "POST",
        body: JSON.stringify({ name: cityName.trim() }),
      });

      setCityMsg("✅ Grad uspešno dodat!");
      setCityName("");
    } catch (err: any) {
      setCityMsg("Greška: " + (err.message || "Neuspešno."));
    }
  }

  async function handleAddCategory(e: React.FormEvent) {
    e.preventDefault();
    setCatMsg("");

    if (!catName.trim()) {
      setCatMsg("Naziv kategorije je obavezan.");
      return;
    }

    try {
      await apiFetch("/api/hall-categories", {
        method: "POST",
        body: JSON.stringify({ name: catName.trim() }),
      });

      setCatMsg("✅ Kategorija uspešno dodata!");
      setCatName("");
    } catch (err: any) {
      setCatMsg("Greška: " + (err.message || "Neuspešno."));
    }
  }

  const cardStyle: React.CSSProperties = {
    backgroundColor: "white",
    padding: 30,
    borderRadius: 16,
    boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
    border: "1px solid #f0f0f0",
    flex: 1,
    minWidth: 300,
  };

  return (
    <main style={{ padding: "40px 24px", maxWidth: 900, margin: "0 auto" }}>
      {/* Nazad */}
      <Button onClick={() => router.back()}>← Nazad na sale</Button>

      <h1 style={{ textAlign: "center", margin: "30px 0", color: "#1a202c" }}>
        Upravljanje šifarnicima
      </h1>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 32,
          alignItems: "flex-start",
        }}
      >
        {/* GRAD */}
        <div style={cardStyle}>
          <h2>📍 Dodaj grad</h2>

          <form onSubmit={handleAddCity} style={{ display: "grid", gap: 12 }}>
            <Input
              label="Naziv grada"
              value={cityName}
              onChange={setCityName}
              placeholder="npr. Novi Sad"
            />

            <Button type="submit">Sačuvaj grad</Button>
          </form>

          {cityMsg && (
            <p
              style={{
                marginTop: 12,
                fontSize: 14,
                textAlign: "center",
                color: cityMsg.includes("✅") ? "#2f855a" : "#c53030",
              }}
            >
              {cityMsg}
            </p>
          )}
        </div>

        {/* KATEGORIJA */}
        <div style={cardStyle}>
          <h2>🏷️ Dodaj kategoriju</h2>

          <form
            onSubmit={handleAddCategory}
            style={{ display: "grid", gap: 12 }}
          >
            <Input
              label="Naziv kategorije"
              value={catName}
              onChange={setCatName}
              placeholder="npr. Vjenčanja"
            />

            <Button type="submit">Sačuvaj kategoriju</Button>
          </form>

          {catMsg && (
            <p
              style={{
                marginTop: 12,
                fontSize: 14,
                textAlign: "center",
                color: catMsg.includes("✅") ? "#2f855a" : "#c53030",
              }}
            >
              {catMsg}
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
