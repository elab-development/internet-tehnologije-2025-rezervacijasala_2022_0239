import Link from "next/link";

export default function Navbar() {
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
            <Link href="/login">Prijavi se</Link>
            <Link href="/register">Registracija</Link>
            <Link href="/profile">Profil</Link>
          </div>
      </nav>
    </header>
  );
}
