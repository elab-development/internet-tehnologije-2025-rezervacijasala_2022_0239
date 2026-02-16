"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { apiFetch } from "@/lib/api";
import { useCurrency } from "@/lib/CurrencyContext";

// Komponente
import Button from "../../../components/Button";
import ConfirmModal from "../../../components/Confirm";
import AddHallForm from "./AddHallForm";
import EditHallModal from "./EditHallModal";

// Tipovi podataka
type City = { id: number; name: string };
type Category = { id: number; name: string };

type Hall = {
  id: number;
  name: string;
  description?: string;
  capacity: number;
  pricePerHour: number;
  isActive: boolean;
  isClosed: boolean;
  hasStage: boolean;
  imageUrl?: string;
  city?: City;
  category?: Category;
};

export default function ManagerHallsPage() {
  const { user } = useAuth();
  
  // Glavni podaci koje stranica prati
  const [halls, setHalls] = useState<Hall[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Stanja za interakciju i poruke
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [confirmHallId, setConfirmHallId] = useState<number | null>(null);
  const [editingHall, setEditingHall] = useState<Hall | null>(null);

  // Provjera dozvola (samo manager i admin)
  const isPrivileged = user?.role === "MANAGER" || user?.role === "ADMIN";

  useEffect(() => {
    if (!isPrivileged) {
      setLoading(false);
      return;
    }

    // Učitavamo sve potrebne podatke odjednom
    Promise.all([
      apiFetch("/api/halls/admin"),
      apiFetch("/api/cities"),
      apiFetch("/api/hall-categories"),
    ])
      .then(([hallsData, citiesData, categoriesData]) => {
        setHalls(hallsData);
        setCities(citiesData);
        setCategories(categoriesData);
      })
      .catch((e: any) => {
        console.error("Greška pri inicijalnom učitavanju:", e);
        setActionMessage("Greška pri učitavanju podataka");
      })
      .finally(() => setLoading(false));
  }, [isPrivileged, user]);

  //LOGIKA ZA UPRAVLJANJE

  async function updateHall(updatedData: any) {
    if (!editingHall) return;
    try {
      const response = await apiFetch(`/api/halls/${editingHall.id}`, {
        method: "PUT",
        body: JSON.stringify(updatedData),
      });
      const updatedHall = response.hall || response;
      
      // Ažuriraj listu tako što zamijeniš staru salu novom
      setHalls(prev => prev.map(h => h.id === editingHall.id ? updatedHall : h));
      setEditingHall(null);
      setActionMessage("Izmjene sačuvane!");
    } catch (err: any) {
      setActionMessage(err.message || "Greška pri izmjeni");
    }
  }
  //promjena statusa
  async function toggleActive(hall: Hall) {
    try {
      const response = await apiFetch(`/api/halls/${hall.id}/status`, {
        method: "PUT",
        body: JSON.stringify({ isActive: !hall.isActive }),
      });
      const updated = response.hall || response;
      setHalls((prev) => prev.map((h) => (h.id === hall.id ? updated : h)));
    } catch (err) {
      setActionMessage("Greška pri promjeni statusa");
    }
  }
  //brisanje sale
  async function removeHall(id: number) {
    try {
      await apiFetch(`/api/halls/${id}`, { method: "DELETE" });
      setHalls((prev) => prev.filter((h) => h.id !== id));
      setConfirmHallId(null);
      setActionMessage("Sala obrisana.");
    } catch (err: any) {
      setActionMessage(err.message || "Greška pri brisanju");
      setConfirmHallId(null);
    }
  }

  // Prikaz učitavanja i zabrane pristupa
  if (loading) return <p style={{ padding: 24 }}>Učitavanje podataka...</p>;
  if (!isPrivileged) return <p style={{ padding: 24 }}>Nemaš pristup ovoj stranici.</p>;

  return (
    <main style={{ padding: 24, maxWidth: 900, margin: "0 auto", }}>
      <h1>Upravljanje salama</h1>

      {/* 1. SEKCIJA: FORMA ZA DODAVANJE (Izdvojena komponenta) */}
      <AddHallForm 
        cities={cities} 
        categories={categories} 
        onSuccess={(newHall) => setHalls((prev) => [newHall, ...prev])} 
      />

      {/* 2. SEKCIJA: LISTA POSTOJEĆIH SALA */}
      <section style={{ marginTop: 32 }}>
        <h2>Postojeće sale</h2>
        {actionMessage && (
          <p style={{ marginTop: 8, marginBottom: 16, color: "purple", fontWeight: 600 }}>
            {actionMessage}
          </p>
        )}
        
        <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
          {halls.map((h) => (
            <div key={h.id} style={{ 
              border: "1px solid #e5e7eb", borderRadius: 12, padding: 16, 
              display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" 
            }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 18 }}>
                  {h.name} {!h.isActive && <span style={{color: 'red', fontSize: 12}}>(NEAKTIVNA)</span>}
                </div>
                <div style={{ fontSize: 14, color: "#555" }}>
                  {h.city?.name} • {h.category?.name} • Kapacitet: {h.capacity} • {h.pricePerHour} €/h
                </div>
                <div style={{ fontSize: 13, marginTop: 4, color: "#888" }}>
                  {h.isClosed ? "Zatvoren prostor" : "Na otvorenom"} • {h.hasStage ? "Sa binom" : "Nema binu"}
                </div>
              </div>

              <div style={{ display: "flex", gap: 8 }}>
                <Button onClick={() => toggleActive(h)}>
                  {h.isActive ? "Deaktiviraj" : "Aktiviraj"}
                </Button>
                <Button onClick={() => setEditingHall(h)}>
                  Izmijeni
                </Button>
                <Button onClick={() => setConfirmHallId(h.id)}>
                  Obriši
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. SEKCIJA: MODALI (Pojavljuju se samo kad su potrebni) */}
      
      {/* Modal za potvrdu brisanja */}
      <ConfirmModal
        open={confirmHallId !== null}
        title="Brisanje sale"
        message="Da li si siguran da želiš da obrišeš salu?"
        confirmText="Obriši"
        confirmVariant="danger"
        onCancel={() => setConfirmHallId(null)}
        onConfirm={() => removeHall(confirmHallId!)}
      />

      {/* Modal za izmjenu (Izdvojena komponenta) */}
      {editingHall && (
        <EditHallModal 
          hall={editingHall}
          cities={cities}
          categories={categories}
          onClose={() => setEditingHall(null)}
          onSave={updateHall}
        />
      )}
    </main>
  );
}