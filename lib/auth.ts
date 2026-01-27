// lib/auth.ts
import { NextResponse } from "next/server";

export type Role = "USER" | "MANAGER" | "ADMIN";

export function getAuth(req: Request) {
  // Next.js ponekad normalizuje hedere na mala slova, 
  // zato je sigurnije čitati ih ovako:
  const role = req.headers.get("x-user-role") as Role | null;
  const idHeader = req.headers.get("x-user-id");
  
  const userId = idHeader ? Number(idHeader) : NaN;

  if (!role || Number.isNaN(userId)) {
    return null;
  }

  return { role, userId };
}

export function requireRole(roles: Role[], req: Request) {
  const auth = getAuth(req);

  // Ako getAuth vrati null, znači da hederi nedostaju (korisnik nije ulogovan)
  if (!auth) {
    return NextResponse.json(
      { error: "Niste prijavljeni (Missing auth headers)" }, 
      { status: 401 }
    );
  }

  // Ako uloga iz hedera nije na listi dozvoljenih uloga za tu rutu
  if (!roles.includes(auth.role)) {
    return NextResponse.json(
      { error: "Nemate dozvolu za ovu akciju (Forbidden)" }, 
      { status: 403 }
    );
  }

  return null; // Sve je u redu
}