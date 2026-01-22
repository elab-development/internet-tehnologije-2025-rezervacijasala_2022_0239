"use client";

import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";


export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header style={{ borderBottom: "1px solid #e5e7eb" }}>
      <nav
  style={{
    maxWidth: 1100,
    margin: "0 auto",
    padding: "16px 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  }}
>
  {/* LEVI BLOK */}
  <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
    <Link href="/">Početna</Link>
    <Link href="/halls">Sale</Link>
    <Link href="/about">O restoranu</Link>
  </div>

  {/* DESNI BLOK */}
  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
    {!user && (
      <>
        <Link href="/login">Prijavi se</Link>
        <Link href="/register">Registracija</Link>
      </>
    )}

    {user && (
      <>
        <Link href="/reservations">Moje rezervacije</Link>

        {(user.role === "MANAGER" || user.role === "ADMIN") && (
          <Link href="/manager/halls">Upravljanje salama</Link>
        )}

        {user.role === "ADMIN" && <Link href="/admin/users">Upravljanje korisnicima</Link>}

        <Link href="/profile">Profil</Link>

        <button
        type="button"
        onClick={logout}
        className="nav-btn"
      >
        Odjavi se
      </button>

      </>
    )}
  </div>
</nav>

    </header>
  );
}
