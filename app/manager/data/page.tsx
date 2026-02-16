"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";

import Button from "@/components/Button";
import Input from "@/components/Input";
import ConfirmModal from "@/components/Confirm";

interface City { id: number; name: string; }
interface Category { id: number; name: string; }

export default function DataEntryPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [cityName, setCityName] = useState("");
  const [catName, setCatName] = useState("");
  const [cities, setCities] = useState<City[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Poruke za uspeh i greške
  const [cityMsg, setCityMsg] = useState("");
  const [catMsg, setCatMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Modal stanja
  const [modalOpen, setModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: number; name: string; type: "city" | "category" } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [citiesData, catsData] = await Promise.all([
        apiFetch("/api/cities"),
        apiFetch("/api/hall-categories")
      ]);
      setCities(citiesData || []);
      setCategories(catsData || []);
    } catch (err: any) {
      setErrorMsg(err.message || "Greška pri učitavanju podataka.");
    }
  }

  async function handleAddCity(e: React.FormEvent) {
    e.preventDefault();
    setCityMsg("");
    if (!cityName.trim()) return;
    try {
      await apiFetch("/api/cities", {
        method: "POST",
        body: JSON.stringify({ name: cityName.trim() }),
      });
      setCityName("");
      setCityMsg("✅ Dodato");
      fetchData();
      setTimeout(() => setCityMsg(""), 3000);
    } catch (err: any) {
      setCityMsg("❌ Greška: " + err.message);
    }
  }

  async function handleAddCategory(e: React.FormEvent) {
    e.preventDefault();
    setCatMsg("");
    if (!catName.trim()) return;
    try {
      await apiFetch("/api/hall-categories", {
        method: "POST",
        body: JSON.stringify({ name: catName.trim() }),
      });
      setCatName("");
      setCatMsg("✅ Dodato");
      fetchData();
      setTimeout(() => setCatMsg(""), 3000);
    } catch (err: any) {
      setCatMsg("❌ Greška: " + err.message);
    }
  }

  function openDeleteModal(id: number, name: string, type: "city" | "category") {
    setErrorMsg(null);
    setItemToDelete({ id, name, type });
    setModalOpen(true);
  }

  async function confirmDeletion() {
    if (!itemToDelete) return;

    try {
      setIsDeleting(true);
      setErrorMsg(null);

      await apiFetch(
        itemToDelete.type === "city" 
          ? `/api/cities/${itemToDelete.id}` 
          : `/api/hall-categories/${itemToDelete.id}`, 
        { method: "DELETE" }
      );

      setModalOpen(false);
      setItemToDelete(null);
      fetchData();
    } catch (err: any) {
      // Baš kao u tvom primeru za korisnike:
      setModalOpen(false);
      setErrorMsg(err.message || "Stavka se koristi i ne može biti obrisana.");
    } finally {
      setIsDeleting(false);
    }
  }

  // --- STILOVI ---
  const containerStyle: React.CSSProperties = { padding: "60px 20px", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", minHeight: "100vh" };
  const contentWrapper: React.CSSProperties = { width: "100%", maxWidth: "1100px", display: "flex", flexDirection: "column" };
  const gridStyle: React.CSSProperties = { display: "flex", gap: "30px", flexWrap: "wrap", width: "100%", justifyContent: "center", marginTop: "40px" };
  const cardStyle: React.CSSProperties = { flex: "1", minWidth: "320px", maxWidth: "480px", backgroundColor: "white", padding: "40px", borderRadius: "28px", boxShadow: "0 15px 45px rgba(0,0,0,0.05)", border: "1px solid #f0f0f0" };

  if (!user || (user.role !== "MANAGER" && user.role !== "ADMIN")) {
    return <p style={{ padding: 40, textAlign: "center" }}>Pristup odbijen.</p>;
  }

  return (
    <main style={containerStyle}>
      <ConfirmModal 
        open={modalOpen}
        title="Potvrda brisanja"
        message={<p>Da li ste sigurni da želite da obrišete <b>{itemToDelete?.name}</b>?</p>}
        confirmText={isDeleting ? "Brisanje..." : "Obriši"}
        confirmVariant="danger"
        onConfirm={confirmDeletion}
        onCancel={() => setModalOpen(false)}
        disabled={isDeleting}
      />

      <div style={contentWrapper}>
        <div style={{ alignSelf: "flex-start",paddingLeft:"25px" }}>
          <Button onClick={() => router.back()}>← Nazad na sale</Button>
        </div>

        <h1 style={{ textAlign: "center", color: "#1a202c", fontWeight: 800, marginTop: "20px" }}>
          Upravljanje šifarnicima
        </h1>

        {/* PORUKA GREŠKE SA BACKENDA (ISTI STIL KAO KOD KORISNIKA) */}
        {errorMsg && (
          <p style={{ color: "#000000", fontSize: 14, marginTop: 8, textAlign: "center" }}>
            {errorMsg}
          </p>
        )}

        <div style={gridStyle}>
          {/* GRAD SEKCIJA */}
          <section style={cardStyle}>
            <h2 style={{ marginBottom: "20px" }}>📍 Gradovi</h2>
            <form onSubmit={handleAddCity} style={{ display: "grid", gap: "15px" }}>
              <Input label="Novi grad" value={cityName} onChange={setCityName} placeholder="npr. Novi Sad" />
              <Button type="submit">Sačuvaj grad</Button>
            </form>
            <div style={{ marginTop: "30px", maxHeight: "350px", overflowY: "auto" }}>
              {cities.map(city => (
                <div key={city.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #f5f5f5" }}>
                  <span style={{ fontWeight: 600 }}>{city.name}</span>
                  <Button onClick={() => openDeleteModal(city.id, city.name, "city")}>
                    <span>Izbriši</span>
                  </Button>
                </div>
              ))}
            </div>
          </section>

          {/* KATEGORIJA SEKCIJA */}
          <section style={cardStyle}>
            <h2 style={{ marginBottom: "20px" }}>🏷️ Kategorije</h2>
            <form onSubmit={handleAddCategory} style={{ display: "grid", gap: "15px" }}>
              <Input label="Nova kategorija" value={catName} onChange={setCatName} placeholder="npr. Vjenčanja" />
              <Button type="submit">Sačuvaj kategoriju</Button>
            </form>
            <div style={{ marginTop: "30px", maxHeight: "350px", overflowY: "auto" }}>
              {categories.map(cat => (
                <div key={cat.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #f5f5f5" }}>
                  <span style={{ fontWeight: 600 }}>{cat.name}</span>
                  <Button onClick={() => openDeleteModal(cat.id, cat.name, "category")}>
                    <span>Izbriši</span>
                  </Button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}