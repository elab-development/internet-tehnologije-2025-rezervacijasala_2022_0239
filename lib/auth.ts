// lib/auth.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export type Role = "USER" | "MANAGER" | "ADMIN";

/**
 * Minimalna serverska autentifikacija (bez JWT/session):
 * - klijent šalje samo x-user-id
 * - server iz baze dohvaća korisnika i njegovu rolu
 *
 * Ovo uklanja kritičnu rupu gdje klijent može lažirati x-user-role.
 */
export async function getAuth(req: Request) {
  const idHeader = req.headers.get("x-user-id");
  const userId = idHeader ? Number(idHeader) : NaN;

  if (Number.isNaN(userId)) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { role: true },
  });

  if (!user || !user.role || !user.role.name) {
    return null;
  }

  // Prisma Role.name je String; ovdje ga tretiramo kao naš Role union.
  const role = user.role.name as Role;
  return { role, userId };
}

export async function requireRole(roles: Role[], req: Request) {
  const auth = await getAuth(req);

  if (!auth) {
    return NextResponse.json(
      { error: "Niste prijavljeni (Missing auth header)" },
      { status: 401 }
    );
  }

  if (!roles.includes(auth.role)) {
    return NextResponse.json(
      { error: "Nemate dozvolu za ovu akciju (Forbidden)" },
      { status: 403 }
    );
  }

  return null;
}
