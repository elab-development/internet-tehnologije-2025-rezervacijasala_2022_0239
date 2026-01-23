"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { apiFetch } from "@/lib/api";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import ConfirmModal from "../../../components/Confirm";

type Hall = {
  id: number;
  name: string;
  description?: string;
  capacity: number;
  pricePerEvent: number;
  isActive: boolean;
};

export default function ManagerHallsPage() {
  const { user } = useAuth();

  const [halls, setHalls] = useState<Hall[]>([]);
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [price, setPrice] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmHallId, setConfirmHallId] = useState<number | null>(null);

  /* vrati sale */
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    if (user.role !== "MANAGER" && user.role !== "ADMIN") {
      setLoading(false);
      return;
    }

    const authUser = {
      id: user.id,
      role: user.role,
    };

    apiFetch("/api/halls/admin", {}, { user: authUser })
      .then(setHalls)
      .catch(() => setMessage("Greška pri učitavanju sala"))
      .finally(() => setLoading(false));
  }, [user]);

  /* zastita */
  if (!user) return null;

  if (user.role !== "MANAGER" && user.role !== "ADMIN") {
    return (
      <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
        <h1>Menadžer - Sale</h1>
        <p>Nemaš pristup ovoj stranici.</p>
      </main>
    );
  }

  const authUser = {
    id: user.id,
    role: user.role,
  };

  /* dodavanje sale */
  async function addHall() {
    setMessage(null);

    const c = Number(capacity);
    const p = Number(price);

    if (!name.trim()) {
      setMessage("Unesi naziv sale.");
      return;
    }
    if (!c || c < 1) {
      setMessage("Kapacitet mora biti broj > 0.");
      return;
    }
    if (!p || p < 1) {
      setMessage("Cena mora biti broj > 0.");
      return;
    }

    try {
      const newHall = await apiFetch(
        "/api/halls",
        {
          method: "POST",
          body: JSON.stringify({
            name: name.trim(),
            capacity: c,
            pricePerEvent: p,
          }),
        },
        { user: authUser }
      );

      setHalls((prev) => [newHall, ...prev]);
      setName("");
      setCapacity("");
      setPrice("");
      setMessage("Sala dodata ✅");
    } catch (err: any) {
      setMessage(err.message || "Greška pri dodavanju sale");
    }
  }

  /* deaktiviranje i aktiviranje sale */
  async function toggleActive(hall: Hall) {
    try {
      const response = await apiFetch(
        `/api/halls/${hall.id}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            isActive: !hall.isActive,
          }),
        },
        { user: authUser }
      );

      setHalls((prev) =>
        prev.map((h) => (h.id === hall.id ? response.hall : h))
      );
    } catch (err) {
      console.error(err);
      setMessage("Greška pri promeni statusa sale");
    }
  }

  /* brisanje sale */
  async function removeHall(id: number) {
    try {
      await apiFetch(
        `/api/halls/${id}`,
        { method: "DELETE" },
        { user: authUser }
      );

      setHalls((prev) => prev.filter((h) => h.id !== id));
      setConfirmHallId(null);
    } catch (err: any) {
      setMessage(err.message || "Greška pri brisanju sale");
      setConfirmHallId(null);
    }
  }

  if (loading) {
    return <p style={{ padding: 24 }}>Učitavanje sala...</p>;
  }

  return (
    <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h1>Menadžer - Upravljanje salama</h1>

      {/*Dodavanje sale */}
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
        />
        <Input
          label="Cena po događaju"
          type="number"
          value={price}
          onChange={setPrice}
        />

        <Button type="button" onClick={addHall}>
          Dodaj salu
        </Button>

        {message && <p style={{ fontSize: 14 }}>{message}</p>}
      </section>

      {/*lista sala */}
      <section style={{ marginTop: 22 }}>
        <h2>Postojeće sale</h2>

        {halls.length === 0 ? (
          <p>Nema sala u sistemu.</p>
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
                    {h.name} {!h.isActive && "(neaktivna)"}
                  </div>
                  <div style={{ fontSize: 14, opacity: 0.8 }}>
                    Kapacitet: {h.capacity} • Cena: {h.pricePerEvent}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 8 }}>
                  <Button type="button" onClick={() => toggleActive(h)}>
                    {h.isActive ? "Deaktiviraj" : "Aktiviraj"}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setConfirmHallId(h.id)}
                  >
                    Obriši
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* prozor za potvrdu*/}
      <ConfirmModal
        open={confirmHallId !== null}
        title="Brisanje sale"
        message="Da li si siguran da želiš da obrišeš ovu salu?"
        onCancel={() => setConfirmHallId(null)}
        onConfirm={() => removeHall(confirmHallId!)}
      />
    </main>
  );
}
