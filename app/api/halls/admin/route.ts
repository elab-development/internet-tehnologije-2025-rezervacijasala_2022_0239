import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

/**
 * GET /api/halls/admin
 * MANAGER / ADMIN
 */
export async function GET(req: Request) {
  const roleCheck =
    requireRole(["MANAGER", "ADMIN"], req);

  if (roleCheck) return roleCheck;

  const halls = await prisma.hall.findMany({
    orderBy: { id: "desc" }, // 👈 SVE sale
  });

  return NextResponse.json(halls);
}
