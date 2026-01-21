"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { apiFetch } from "@/lib/api";
import Button from "../../../components/Button";

type UserRow = {
  id: number;
  email: string;
  role:
    | "USER"
    | "MANAGER"
    | "ADMIN"
    | {
        name: "USER" | "MANAGER" | "ADMIN";
      };
};

export default function AdminUsersPage() {
  const { user } = useAuth();

  const [users, setUsers] = useState<UserRow[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  /* ============================
     FETCH USERS (backend)
     ============================ */
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    if (user.role !== "ADMIN") {
      setLoading(false);
      return;
    }

    const authUser = {
      id: user.id,
      role: user.role,
    };

    apiFetch("/api/users", {}, { user: authUser })
      .then(setUsers)
      .catch(() => setMessage("Greška pri učitavanju korisnika"))
      .finally(() => setLoading(false));
  }, [user]);

  /* ============================
     GUARDOVI
     ============================ */
  if (!user) {
    return null;
  }

  if (user.role !== "ADMIN") {
    return (
      <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
        <h1>Admin - Korisnici</h1>
        <p>Nemaš pristup ovoj stranici.</p>
      </main>
    );
  }

  const authUser = {
    id: user.id,
    role: user.role,
  };

  /* ============================
     BRISANJE KORISNIKA
     ============================ */
  async function removeUser(id: number) {
    if (!confirm("Da li si siguran da želiš da obrišeš korisnika?")) return;

    try {
      await apiFetch(
        `/api/users/${id}`,
        { method: "DELETE" },
        { user: authUser }
      );

      setUsers(users.filter((u) => u.id !== id));
    } catch {
      setMessage("Greška pri brisanju korisnika");
    }
  }

  if (loading) {
    return <p style={{ padding: 24 }}>Učitavanje korisnika...</p>;
  }

  return (
    <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h1>Admin - Upravljanje korisnicima</h1>

      {message && <p style={{ fontSize: 14 }}>{message}</p>}

      {users.length === 0 ? (
        <p>Nema korisnika u sistemu.</p>
      ) : (
        <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
          {users.map((u) => (
            <div
              key={u.id}
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 12,
                padding: 14,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div style={{ fontWeight: 700 }}>{u.email}</div>
                <div style={{ fontSize: 14, opacity: 0.8 }}>
                  Uloga:{" "}
                  {typeof u.role === "string" ? u.role : u.role.name}
                </div>
              </div>

              <div>
                <Button
                  type="button"
                  onClick={() => removeUser(u.id)}
                  disabled={u.id === user.id}
                >
                  Obriši
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
