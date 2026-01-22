import { NextResponse } from "next/server";


export type Role = "USER" | "MANAGER" | "ADMIN";

export function getAuth(req: Request) {
  const role = req.headers.get("x-user-role") as Role | null;
  const idHeader = req.headers.get("x-user-id");
  const userId = idHeader ? Number(idHeader) : NaN;

  if (!role || Number.isNaN(userId)) return null;
  return { role, userId };
}

export function requireRole(roles: Role[], req: Request) {
  const auth = getAuth(req);

  if (!auth) {
    return NextResponse.json({ error: "Missing auth headers" }, { status: 401 });
  }

  if (!roles.includes(auth.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return null;
}




