"use client";

import { useState } from "react";
import { useAuth } from "../../providers";
import Button from "../../../components/Button";

type Role = "USER" | "MANAGER" | "ADMIN";

type MockUser = {
  id: number;
  email: string;
  role: Role;
};

export default function AdminUsersPage() {
  const { user } = useAuth();

  const [users, setUsers] = useState<MockUser[]>([
    { id: 1, email: "user@test.com", role: "USER" },
    { id: 2, email: "manager@test.com", role: "MANAGER" },
    { id: 3, email: "admin@test.com", role: "ADMIN" },
  ]);

  function setRole(id: number, role: Role) {
    setUsers(users.map((u) => (u.id === id ? { ...u, role } : u)));
  }

  if (!user || user.role !== "ADMIN") {
    return (
      <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
        <h1>Admin - Korisnici</h1>
        <p>Nemaš pristup ovoj stranici.</p>
      </main>
    );
  }

  return (
    <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h1>Admin - Korisnici (mock)</h1>

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
              gap: 12,
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontWeight: 700 }}>{u.email}</div>
              <div style={{ fontSize: 14, opacity: 0.8 }}>Uloga: {u.role}</div>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <Button type="button" onClick={() => setRole(u.id, "USER")}>
                USER
              </Button>
              <Button type="button" onClick={() => setRole(u.id, "MANAGER")}>
                MANAGER
              </Button>
              <Button type="button" onClick={() => setRole(u.id, "ADMIN")}>
                ADMIN
              </Button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
