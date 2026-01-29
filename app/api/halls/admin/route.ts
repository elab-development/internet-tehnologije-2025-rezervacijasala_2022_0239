import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

/**
 * GET /api/halls/admin
 * MANAGER / ADMIN
 */
export async function GET(req: Request) {
  const roleCheck = await requireRole(["MANAGER", "ADMIN"], req);
  if (roleCheck) return roleCheck;

  const halls = await prisma.hall.findMany({
    include: {
      city: { select: { id: true, name: true } },
      category: { select: { id: true, name: true } },
    },
    orderBy: { id: "desc" },
  });

  return NextResponse.json(halls);
}
