"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import Button from "../../../components/Button";
import Input from "../../../components/Input";

type Hall = {
  id: number;
  name: string;
  capacity: number;
  price: number;
  isActive: boolean;
};

const KEY = "mock_halls";

export default function ManagerHallsPage() {
  const { user } = useAuth();
  const [halls, setHalls] = useState<Hall[]>([]);
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const existing = JSON.parse(localStorage.getItem(KEY) || "[]");
    setHalls(existing);
  }, []);

  function save(next: Hall[]) {
    setHalls(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  }

  function addHall() {
    setMessage(null);

    if (!name.trim()) {
      setMessage("Unesi naziv sale.");
      return;
    }
    const c = Number(capacity);
    if (!c || c < 1) {
      setMessage("Kapacitet mora biti broj > 0.");
      return;
    }
    const p = Number(price);
    if (!p || p < 1) {
      setMessage("Cena mora biti broj > 0.");
      return;
    }

    const newHall: Hall = {
      id: Date.now(),
      name: name.trim(),
      capacity: c,
      price: p,
      isActive: true,
    };

    save([newHall, ...halls]);
    setName("");
    setCapacity("");
    setPrice("");
    setMessage("Sala dodata ✅");
  }

  function toggleActive(id: number) {
    const next = halls.map((h) =>
      h.id === id ? { ...h, isActive: !h.isActive } : h
    );
    save(next);
  }

  function removeHall(id: number) {
    const next = halls.filter((h) => h.id !== id);
    save(next);
  }

  // ✅ Zaštita rute
  if (!user || (user.role !== "MANAGER" && user.role !== "ADMIN")) {
    return (
      <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
        <h1>Menadžer - Sale</h1>
        <p>Nemaš pristup ovoj stranici.</p>
      </main>
    );
  }

  return (
    <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h1>Menadžer - Upravljanje salama</h1>

      <section
        style={{
          marginTop: 16,
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          padding: 14,
          display: "grid",
          gap: 12,
          maxWidth: 520,
        }}
      >
        <h2 style={{ margin: 0 }}>Dodaj novu salu</h2>

        <Input label="Naziv" value={name} onChange={setName} />
        <Input
          label="Kapacitet"
          type="number"
          value={capacity}
          onChange={setCapacity}
          placeholder="npr. 120"
        />
        <Input
          label="Cena"
          type="number"
          value={price}
          onChange={setPrice}
          placeholder="npr. 150"
        />

        <Button type="button" onClick={addHall}>
          Dodaj salu
        </Button>

        {message && <p style={{ fontSize: 14 }}>{message}</p>}
      </section>

      <section style={{ marginTop: 22 }}>
        <h2>Postojeće sale (mock)</h2>

        {halls.length === 0 ? (
          <p>Nema sala. Dodaj prvu salu gore.</p>
        ) : (
          <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
            {halls.map((h) => (
              <div
                key={h.id}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: 12,
                  padding: 14,
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  alignItems: "center",
                }}
              >
                <div>
                  <div style={{ fontWeight: 700 }}>
                    {h.name} {h.isActive ? "" : "(neaktivna)"}
                  </div>
                  <div style={{ fontSize: 14, opacity: 0.8 }}>
                    Kapacitet: {h.capacity} • Cena: {h.price}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <Button type="button" onClick={() => toggleActive(h.id)}>
                    {h.isActive ? "Deaktiviraj" : "Aktiviraj"}
                  </Button>
                  <Button type="button" onClick={() => removeHall(h.id)}>
                    Obriši
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
