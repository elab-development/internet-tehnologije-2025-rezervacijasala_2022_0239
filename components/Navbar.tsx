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

        <Link href="/login" style={{ marginLeft: "auto" }}>
          Prijavi se
        </Link>
      </nav>
    </header>
  );
}
