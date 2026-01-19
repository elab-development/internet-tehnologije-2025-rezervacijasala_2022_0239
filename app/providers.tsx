"use client";

import React, { createContext, useContext, useState } from "react";

export type Role = "GUEST" | "USER" | "MANAGER" | "ADMIN";
export type User = { name: string; role: Role } | null;

type AuthContextValue = {
  user: User;
  login: (role: Role) => void;
  logout: () => void;
};

const AuthCtx = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);

  function login(role: Role) {
    setUser({ name: "Doris", role });
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthCtx.Provider value={{ user, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}
