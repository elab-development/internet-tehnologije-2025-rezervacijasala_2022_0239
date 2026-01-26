"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { apiFetch } from "@/lib/api";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import ConfirmModal from "../../../components/Confirm";

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
  city?: City;
  category?: Category;
};

export default function ManagerHallsPage() {
  const { user } = useAuth();

  const [halls, setHalls] = useState<Hall[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [capacity, setCapacity] = useState("");
  const [pricePerHour, setPricePerHour] = useState("");
  const [cityId, setCityId] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [hasStage, setHasStage] = useState(false);
  const [isClosed, setIsClosed] = useState(false);

  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmHallId, setConfirmHallId] = useState<number | null>(null);

  if (!user) return null;

  const isPrivileged = user.role === "MANAGER" || user.role === "ADMIN";

  const authUser = useMemo(
    () => ({ id: user.id, role: user.role }),
    [user.id, user.role]
  );

  useEffect(() => {
    if (!isPrivileged) {
      setLoading(false);
      return;
    }

    // učitaj sve: sale, gradove, kategorije
    Promise.all([
      apiFetch("/api/halls/admin", {}, { user: authUser }),
      apiFetch("/api/cities", {}, { user: authUser }),
      apiFetch("/api/hall-categories", {}, { user: authUser }),
    ])
      .then(([hallsData, citiesData, categoriesData]) => {
        setHalls(hallsData);
        setCities(citiesData);
        setCategories(categoriesData);

        // default selekcije
        if (citiesData?.length && !cityId) setCityId(String(citiesData[0].id));
        if (categoriesData?.length && !categoryId) setCategoryId(String(categoriesData[0].id));
      })
      .catch((e: any) => {
        console.error(e);
        setMessage("Greška pri učitavanju podataka");
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPrivileged]);

  if (!isPrivileged) {
    return (
      <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
        <h1>Menadžer - Sale</h1>
        <p>Nemaš pristup ovoj stranici.</p>
      </main>
    );
  }

  async function addHall() {
    setMessage(null);

    const c = Number(capacity);
    const p = Number(pricePerHour);
    const cId = Number(cityId);
    const catId = Number(categoryId);

    if (!name.trim()) return setMessage("Unesi naziv sale.");
    if (!c || c < 1) return setMessage("Kapacitet mora biti broj > 0.");
    if (!p || p < 1) return setMessage("Cena mora biti broj > 0.");
    if (!cId) return setMessage("Izaberi grad.");
    if (!catId) return setMessage("Izaberi kategoriju.");

    try {
      const res = await apiFetch(
        "/api/halls",
        {
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
          }),
        },
        { user: authUser }
      );

      // tvoj API vraća { message, hall }
      const created = res.hall ?? res;

      setHalls((prev) => [created, ...prev]);
      setName("");
      setDescription("");
      setCapacity("");
      setPricePerHour("");
      setHasStage(false);
      setIsClosed(false);
      setMessage("Sala dodata ✅");
    } catch (err: any) {
      setMessage(err.message || "Greška pri dodavanju sale");
    }
  }

  async function toggleActive(hall: Hall) {
    try {
      const response = await apiFetch(
        `/api/halls/${hall.id}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isActive: !hall.isActive }),
        },
        { user: authUser }
      );

      setHalls((prev) => prev.map((h) => (h.id === hall.id ? response.hall : h)));
    } catch (err) {
      console.error(err);
      setMessage("Greška pri promeni statusa sale");
    }
  }

  async function toggleClosed(hall: Hall) {
    try {
      const response = await apiFetch(
        `/api/halls/${hall.id}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isClosed: !hall.isClosed }),
        },
        { user: authUser }
      );

      setHalls((prev) => prev.map((h) => (h.id === hall.id ? response.hall : h)));
    } catch (err) {
      console.error(err);
      setMessage("Greška pri promeni tipa sale");
    }
  }

  async function removeHall(id: number) {
    try {
      await apiFetch(`/api/halls/${id}`, { method: "DELETE" }, { user: authUser });
      setHalls((prev) => prev.filter((h) => h.id !== id));
      setConfirmHallId(null);
    } catch (err: any) {
      setMessage(err.message || "Greška pri brisanju sale");
      setConfirmHallId(null);
    }
  }

  if (loading) return <p style={{ padding: 24 }}>Učitavanje...</p>;

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
          maxWidth: 620,
        }}
      >
        <h2 style={{ margin: 0 }}>Dodaj novu salu</h2>

        <Input label="Naziv" value={name} onChange={setName} />
        <Input label="Opis" value={description} onChange={setDescription} />

        <Input label="Kapacitet" type="number" value={capacity} onChange={setCapacity} />
        <Input label="Cijena po satu (€)" type="number" value={pricePerHour} onChange={setPricePerHour} />

        {/* Grad */}
        <div style={{ display: "grid", gap: 6 }}>
          <label style={{ fontWeight: 700 }}>Grad</label>
          <select value={cityId} onChange={(e) => setCityId(e.target.value)}>
            {cities.map((c) => (
              <option key={c.id} value={String(c.id)}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Kategorija */}
        <div style={{ display: "grid", gap: 6 }}>
          <label style={{ fontWeight: 700 }}>Kategorija</label>
          <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            {categories.map((k) => (
              <option key={k.id} value={String(k.id)}>
                {k.name}
              </option>
            ))}
          </select>
        </div>

        {/* checkbox */}
        <label style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <input
            type="checkbox"
            checked={hasStage}
            onChange={(e) => setHasStage(e.target.checked)}
          />
          Ima binu
        </label>

        <label style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <input
            type="checkbox"
            checked={isClosed}
            onChange={(e) => setIsClosed(e.target.checked)}
          />
          Zatvorena (ako nije čekirano = na otvorenom)
        </label>

        <Button type="button" onClick={addHall}>
          Dodaj salu
        </Button>

        {message && <p style={{ fontSize: 14 }}>{message}</p>}
      </section>

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
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <div style={{ fontWeight: 700 }}>
                    {h.name} {!h.isActive && "(neaktivna)"}
                  </div>

                  <div style={{ fontSize: 14, opacity: 0.85 }}>
                    {h.city?.name ? `${h.city.name} • ` : ""}
                    {h.category?.name ? `${h.category.name} • ` : ""}
                    Kapacitet: {h.capacity} • Cijena/h: {h.pricePerHour} €
                  </div>

                  <div style={{ fontSize: 13, opacity: 0.8 }}>
                    {h.hasStage ? "Ima binu" : "Nema bine"} •{" "}
                    {h.isClosed ? "Zatvorena" : "Na otvorenom"}
                  </div>
                </div>

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <Button type="button" onClick={() => toggleActive(h)}>
                    {h.isActive ? "Deaktiviraj" : "Aktiviraj"}
                  </Button>

                  <Button type="button" onClick={() => toggleClosed(h)}>
                    {h.isClosed ? "Postavi otvorenu" : "Postavi zatvorenu"}
                  </Button>

                  <Button type="button" onClick={() => setConfirmHallId(h.id)}>
                    Obriši
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

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
