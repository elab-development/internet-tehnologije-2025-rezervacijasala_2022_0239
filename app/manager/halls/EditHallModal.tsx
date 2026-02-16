"use client";
import { useState } from "react";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
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

export default function EditHallModal({ 
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
          <Button onClick={() => {
          if (!imageUrl.trim()) {
            alert("Slika sale je obavezna!");
            return;
          }
          onSave({ 
            name, description, capacity: Number(capacity), pricePerHour: Number(pricePerHour), 
            cityId: Number(cityId), categoryId: Number(categoryId), hasStage, isClosed,imageUrl 
          });
          }}>
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