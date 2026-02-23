"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import ImageUpload from "@/components/ImageUpload";

interface AddHallFormProps {
  cities: { id: number; name: string }[];
  categories: { id: number; name: string }[];
  onSuccess: (newHall: any) => void;
}

export default function AddHallForm({ cities, categories, onSuccess }: AddHallFormProps) {
 
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [capacity, setCapacity] = useState("");
  const [pricePerHour, setPricePerHour] = useState("");
  const [cityId, setCityId] = useState(cities[0]?.id ? String(cities[0].id) : "");
  const [categoryId, setCategoryId] = useState(categories[0]?.id ? String(categories[0].id) : "");
  const [hasStage, setHasStage] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  async function handleAdd() {
    setMessage(null);
    const c = Number(capacity);
    const p = Number(pricePerHour);

    if (!name.trim() || !c || !p || !cityId || !categoryId || !imageUrl.trim()) {
      return setMessage("Sva polja su obavezna.");
    }

    try {
      const res = await apiFetch("/api/halls", {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          capacity: c,
          pricePerHour: p,
          cityId: Number(cityId),
          categoryId: Number(categoryId),
          hasStage,
          isClosed,
          imageUrl,
        }),
      });

      const created = res.hall ?? res;
      onSuccess(created); 

 
      setName(""); setDescription(""); setCapacity(""); setPricePerHour("");
      setHasStage(false); setIsClosed(false); setImageUrl("");
      setMessage("Sala uspješno dodata!");
    } catch (err: any) {
      setMessage(err.message || "Greška pri dodavanju");
    }
  }

  return (
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

      <Button onClick={handleAdd}>Dodaj salu</Button>
      {message && <p style={{ color: "purple", fontWeight: "600" }}>{message}</p>}
    </section>
  );
}