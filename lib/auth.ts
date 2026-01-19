import { NextResponse } from "next/server";

export function requireRole(
  role: "USER" | "MANAGER" | "ADMIN",
  req: Request
) {
  const userRole = req.headers.get("x-user-role");

  if (!userRole) {
    return NextResponse.json(
      { error: "Missing role header" },
      { status: 401 }
    );
  }

  if (userRole !== role && userRole !== "ADMIN") {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    );
  }

  return null; // znači OK
}
