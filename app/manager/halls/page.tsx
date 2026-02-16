"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { apiFetch } from "@/lib/api";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import ConfirmModal from "../../../components/Confirm";
import { useCurrency } from "@/lib/CurrencyContext";
import ImageUpload from "@/components/ImageUpload";

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

// --- MODAL ZA IZMJENU SALE ---
function EditHallModal({ 
  hall, 
  cities, 
  categories, 
  onClose, 
  onSave 
}: { 
  hall: Hall; 
  cities: City[]; 
  categories: Category[]; 
  onClose: () => void; 
  onSave: (updatedData: any) => void;
}) {
  const [name, setName] = useState(hall.name);
  const [description, setDescription] = useState(hall.description || "");
  const [capacity, setCapacity] = useState(String(hall.capacity));
  const [pricePerHour, setPricePerHour] = useState(String(hall.pricePerHour));
  const [cityId, setCityId] = useState(String(hall.city?.id));
  const [categoryId, setCategoryId] = useState(String(hall.category?.id));
  const [hasStage, setHasStage] = useState(hall.hasStage);
  const [isClosed, setIsClosed] = useState(hall.isClosed);
  const [imageUrl, setImageUrl] = useState(hall.imageUrl || "");

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
      backgroundColor: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000,
      padding: 20
    }}>
      <div style={{ 
        backgroundColor: "white", padding: 24, borderRadius: 12, width: "100%", 
        maxWidth: 500, maxHeight: "90vh", overflowY: "auto", color: "#333" 
      }}>
        <h3 style={{ marginTop: 0 }}>Izmijeni salu: {hall.name}</h3>
        
        <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
          <div style={{ marginBottom: 10 }}>
            <label style={{ fontWeight: 700, fontSize: 14, display: "block", marginBottom: 5 }}>Slika sale</label>
            <ImageUpload value={imageUrl} onUpload={setImageUrl} />
          </div>
          <Input label="Naziv" value={name} onChange={setName} />
          <Input label="Opis" value={description} onChange={setDescription} />
          <Input label="Kapacitet" type="number" value={capacity} onChange={setCapacity} />
          <Input label="Cijena po satu (€)" type="number" value={pricePerHour} onChange={setPricePerHour} />
          
          <div style={{ display: "grid", gap: 4 }}>
            <label style={{ fontWeight: 700, fontSize: 14 }}>Grad</label>
            <select 
                style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }} 
                value={cityId} 
                onChange={(e) => setCityId(e.target.value)}
            >
              {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div style={{ display: "grid", gap: 4 }}>
            <label style={{ fontWeight: 700, fontSize: 14 }}>Kategorija</label>
            <select 
                style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }} 
                value={categoryId} 
                onChange={(e) => setCategoryId(e.target.value)}
            >
              {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
          </div>

          <label style={{ display: "flex", gap: 10, alignItems: "center", cursor: "pointer" }}>
            <input type="checkbox" checked={hasStage} onChange={e => setHasStage(e.target.checked)} /> 
            Ima binu
          </label>
          
          <label style={{ display: "flex", gap: 10, alignItems: "center", cursor: "pointer" }}>
            <input type="checkbox" checked={isClosed} onChange={e => setIsClosed(e.target.checked)} /> 
            Zatvoren prostor (Unutra)
          </label>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
          <Button onClick={() => onSave({ 
            name, description, capacity: Number(capacity), pricePerHour: Number(pricePerHour), 
            cityId: Number(cityId), categoryId: Number(categoryId), hasStage, isClosed,imageUrl 
          })}>
            Sačuvaj izmjene
          </Button>
          <Button onClick={onClose}>
            Otkaži
          </Button>
        </div>
      </div>
    </div>
  );
}

// --- GLAVNA KOMPONENTA ---
export default function ManagerHallsPage() {
  const { currency } = useCurrency();
  const { user } = useAuth();

  const [halls, setHalls] = useState<Hall[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Form state za novu salu
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [capacity, setCapacity] = useState("");
  const [pricePerHour, setPricePerHour] = useState("");
  const [cityId, setCityId] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [hasStage, setHasStage] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [addMessage, setAddMessage] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmHallId, setConfirmHallId] = useState<number | null>(null);
  const [editingHall, setEditingHall] = useState<Hall | null>(null);

  const isPrivileged = user?.role === "MANAGER" || user?.role === "ADMIN";

  useEffect(() => {
    if (!isPrivileged) {
      setLoading(false);
      return;
    }

    Promise.all([
      apiFetch("/api/halls/admin"),
      apiFetch("/api/cities"),
      apiFetch("/api/hall-categories"),
    ])
      .then(([hallsData, citiesData, categoriesData]) => {
        setHalls(hallsData);
        setCities(citiesData);
        setCategories(categoriesData);

        if (citiesData?.length && !cityId) setCityId(String(citiesData[0].id));
        if (categoriesData?.length && !categoryId) setCategoryId(String(categoriesData[0].id));
      })
      .catch((e: any) => {
        console.error(e);
        setActionMessage("Greška pri učitavanju podataka");
      })
      .finally(() => setLoading(false));
  }, [isPrivileged, user]);

  // --- CRUD FUNKCIJE ---
  async function addHall() {
    setAddMessage(null);
    const c = Number(capacity);
    const p = Number(pricePerHour);
    const cId = Number(cityId);
    const catId = Number(categoryId);

    if (!name.trim() || !c || !p || !cId || !catId) {
      return setAddMessage("Sva polja (Naziv, Kapacitet, Cijena, Grad, Kategorija) su obavezna.");
    }

    try {
      const res = await apiFetch("/api/halls", {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          capacity: c,
          pricePerHour: p,
          cityId: cId,
          categoryId: catId,
          hasStage,
          isClosed,
          imageUrl,
        }),
      });

      const created = res.hall ?? res;
      setHalls((prev) => [created, ...prev]);
      
      // Reset forme
      setName(""); setDescription(""); setCapacity(""); setPricePerHour("");
      setHasStage(false); setIsClosed(false);
      setImageUrl(""); 
      setAddMessage("Sala uspješno dodata!");
    } catch (err: any) {
      setAddMessage(err.message || "Greška pri dodavanju");
    }
  }

  async function updateHall(updatedData: any) {
    if (!editingHall) return;
    try {
      const response = await apiFetch(`/api/halls/${editingHall.id}`, {
        method: "PUT",
        body: JSON.stringify(updatedData),
      });
      const updatedHall = response.hall || response;
      setHalls(prev => prev.map(h => h.id === editingHall.id ? updatedHall : h));
      setEditingHall(null);
      setActionMessage("Izmjene sačuvane!");
    } catch (err: any) {
      setActionMessage(err.message || "Greška pri izmjeni");
    }
  }

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

  if (loading) return <p style={{ padding: 24 }}>Učitavanje podataka...</p>;
  if (!isPrivileged) return <p style={{ padding: 24 }}>Nemaš pristup ovoj stranici.</p>;

  return (
    <main style={{ padding: 24, maxWidth: 900, margin: "0 auto", }}>
      <h1>Upravljanje salama</h1>

      {/* SEKCIJA ZA DODAVANJE */}
      <section style={{ 
        marginTop: 16, border: "1px solid #e5e7eb", borderRadius: 12, 
        padding: 20, display: "grid", gap: 12, maxWidth: 620 
      }}>
        <h2 style={{ margin: 0 }}>Dodaj novu salu</h2>
        <div style={{ marginBottom: 10 }}>
          <label style={{ fontWeight: 700 }}>Slika sale</label>
          <ImageUpload value={imageUrl} onUpload={setImageUrl} />
        </div>
        <Input label="Naziv" value={name} onChange={setName} />
        <Input label="Opis" value={description} onChange={setDescription} />
        <Input label="Kapacitet" type="number" value={capacity} onChange={setCapacity} />
        <Input label="Cijena po satu (€)" type="number" value={pricePerHour} onChange={setPricePerHour} />

        <div style={{ display: "grid", gap: 4 }}>
          <label style={{ fontWeight: 700 }}>Grad</label>
          <select value={cityId} onChange={(e) => setCityId(e.target.value)} style={{ padding: 8, borderRadius: 6 }}>
            {cities.map((c) => <option key={c.id} value={String(c.id)}>{c.name}</option>)}
          </select>
        </div>

        <div style={{ display: "grid", gap: 4 }}>
          <label style={{ fontWeight: 700 }}>Kategorija</label>
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} style={{ padding: 8, borderRadius: 6 }}>
            {categories.map((k) => <option key={k.id} value={String(k.id)}>{k.name}</option>)}
          </select>
        </div>

        <label style={{ display: "flex", gap: 10 }}><input type="checkbox" checked={hasStage} onChange={e => setHasStage(e.target.checked)} /> Ima binu</label>
        <label style={{ display: "flex", gap: 10 }}><input type="checkbox" checked={isClosed} onChange={e => setIsClosed(e.target.checked)} /> Zatvorena (unutra)</label>

        <Button onClick={addHall}>Dodaj salu</Button>
        {addMessage && (
          <p style={{ color: "purple", fontWeight: "600" }}>{addMessage}</p>
        )}
      </section>

      {/* LISTA SALA */}
      <section style={{ marginTop: 32 }}>
        <h2>Postojeće sale</h2>
         {actionMessage && (
          <p style={{ 
            marginTop: 8, 
            marginBottom: 16,
            color: "purple", 
            fontWeight: 600 
          }}>
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
                <div style={{ fontWeight: 700, fontSize: 18 }}>{h.name} {!h.isActive && "(NEAKTIVNA)"}</div>
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

      {/* MODALI */}
      
      <ConfirmModal
        open={confirmHallId !== null}
        title="Brisanje sale"
        message="Da li si siguran da želiš da obrišeš salu?"
        confirmText="Obriši"
        confirmVariant="danger"
        onCancel={() => setConfirmHallId(null)}
        onConfirm={() => removeHall(confirmHallId!)}
      />

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