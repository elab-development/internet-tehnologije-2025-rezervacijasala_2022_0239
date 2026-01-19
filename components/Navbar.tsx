"use client";

import Link from "next/link";
import { useAuth } from "@/app/providers";

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
          gap: 16,
          alignItems: "center",
        }}
      >
        <Link href="/">Početna</Link>
        <Link href="/halls">Sale</Link>
        <Link href="/about">O restoranu</Link>

        <div style={{ marginLeft: "auto", display: "flex", gap: 12 }}>
          {/* AKO NIJE ULOGOVANA */}
          {!user && (
            <>
              <Link href="/login">Prijavi se</Link>
              <Link href="/register">Registracija</Link>
            </>
          )}

          {/* AKO JESTE ULOGOVANA */}
          {user && (
            <>
              <Link href="/profile">Profil</Link>
              <button onClick={logout}>Odjavi se</button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
