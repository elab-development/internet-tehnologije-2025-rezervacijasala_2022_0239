// lib/auth.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export type Role = "USER" | "MANAGER" | "ADMIN";

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

/*Backend helper. API ruta poziva auth.ts da bi utvrdila ko je user i koja mu je uloga. Sa getAuth saznajmo usera, a sa 
requireRole da li njegov role ima dopustenje da odradi taj neki zahtev. Ovo je sad prava backend zastita (za razliku od AuthContexta
koji je sluzio samo da bi frontend upravljao sa informacijom ko je ulogovan). Ovo je kao neki middelware
*/