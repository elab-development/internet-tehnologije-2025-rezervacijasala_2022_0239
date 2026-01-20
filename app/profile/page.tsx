"use client";

import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import Button from "../../components/Button";

export default function ProfilePage() {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
        <h1>Profil</h1>
        <p>Nisi prijavljena.</p>
        <Link href="/login">Idi na prijavu</Link>
      </main>
    );
  }

  return (
    <main style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h1>Profil</h1>

      <div
        style={{
          marginTop: 12,
          border: "1px solid #e5e7eb",
          borderRadius: 12,
          padding: 14,
          maxWidth: 520,
        }}
      >
        <p>
          <b>Ime:</b> {user.name}
        </p>
        <p>
          <b>Uloga:</b> {user.role}
        </p>

        <div style={{ display: "flex", gap: 10, marginTop: 12, flexWrap: "wrap" }}>
          <Link href="/reservations">Moje rezervacije</Link>

          {(user.role === "MANAGER" || user.role === "ADMIN") && (
            <Link href="/manager/halls">Menadžer</Link>
          )}

          {user.role === "ADMIN" && <Link href="/admin/users">Admin</Link>}
        </div>

        <div style={{ marginTop: 14 }}>
          <Button type="button" onClick={logout}>
            Odjavi se
          </Button>
        </div>
      </div>
    </main>
  );
}

