"use client";

import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import { useEffect, useRef, useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // dropdown se skloni kad se klikne negdje na stranici
    useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!open) return;
      const target = e.target as Node;
      if (menuRef.current && !menuRef.current.contains(target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);


  return (
    <header style={{ borderBottom: "1px solid var(--border-color)" }}>
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
        {/*lijevi blok*/}
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <Link href="/">Početna</Link>
          <Link href="/halls">Sale</Link>
          <Link href="/about">O restoranu</Link>
        </div>

        {/* desni blok*/}
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {!user && (
            <>
              <Link href="/login">Prijavi se</Link>
              <Link href="/register">Registracija</Link>
            </>
          )}

          {user && (
            <div
              ref={menuRef}
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: 12,
              }}
            >
              
              <Link href="/reservations">Moje rezervacije</Link>

              {/* Dropdown */}
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={open}
                style={{
                  padding: "10px 14px",
                  borderRadius: 999,
                  border: "1px solid var(--border-color)",
                  background: "var(--card-bg)",
                  color: "var(--text-main)",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  boxShadow: "0 10px 22px rgba(37, 26, 43, 0.08)",
                }}
              >
                Moj nalog
                <span style={{ fontSize: 12, opacity: 0.75 }}>
                  {open ? "▲" : "▼"}
                </span>
              </button>

              {/* dropdown meni */}
              {open && (
                <div
                  role="menu"
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "calc(100% + 10px)",
                    width: 240,
                    background: "var(--card-bg)",
                    border: "1px solid var(--border-color)",
                    borderRadius: 14,
                    overflow: "hidden",
                    boxShadow: "0 24px 60px rgba(37, 26, 43, 0.18)",
                    zIndex: 50,
                  }}
                >
                 

                  <div style={{ height: 1, background: "var(--border-color)" }} />

                  {/* satvke u dropdownu*/}
                  <MenuLink href="/profile" onClick={() => setOpen(false)}>
                    Lični podaci
                  </MenuLink>

                  {(user.role === "MANAGER" || user.role === "ADMIN") && (
                    <MenuLink
                      href="/manager/halls"
                      onClick={() => setOpen(false)}
                    >
                      Upravljanje salama
                    </MenuLink>
                  )}

                  {user.role === "ADMIN" && (
                    <MenuLink href="/admin/users" onClick={() => setOpen(false)}>
                      Upravljanje korisnicima
                    </MenuLink>
                  )}

                  <div style={{ height: 1, background: "var(--border-color)" }} />

                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setOpen(false);
                      logout();
                    }}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "12px 14px",
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                      fontWeight: 800,
                      color: "white",
                      backgroundImage:
                        "linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))",
                    }}
                  >
                    Odjavi se
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

function MenuLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      role="menuitem"
      style={{
        display: "block",
        padding: "12px 14px",
        textDecoration: "none",
        color: "var(--text-main)",
        fontWeight: 700,
      }}
    >
      {children}
    </Link>
  );
}
