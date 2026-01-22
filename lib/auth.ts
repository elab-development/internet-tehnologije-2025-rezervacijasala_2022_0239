import { NextResponse } from "next/server";

export function requireRole(
  roles: Array<"USER" | "MANAGER" | "ADMIN">,
  req: Request
) {
  const userRole = req.headers.get("x-user-role");

  if (!userRole) {
    return NextResponse.json(
      { error: "Missing role header" },
      { status: 401 }
    );
  }

  if (!roles.includes(userRole as any)) {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    );
  }

  return null;
}
