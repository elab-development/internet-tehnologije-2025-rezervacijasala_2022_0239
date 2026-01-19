import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

/**
 * PUT /api/halls/{id}/status
 * MANAGER / ADMIN
 */
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const roleCheck = requireRole("MANAGER", req);
  if (roleCheck) return roleCheck;

  const { id } = await context.params;
  const hallId = Number(id);

  if (Number.isNaN(hallId)) {
    return NextResponse.json(
      { error: "Invalid hall id" },
      { status: 400 }
    );
  }

  const body = await req.json();
  const { isActive } = body;

  if (typeof isActive !== "boolean") {
    return NextResponse.json(
      { error: "isActive must be boolean" },
      { status: 400 }
    );
  }

  const hall = await prisma.hall.findUnique({
    where: { id: hallId },
  });

  if (!hall) {
    return NextResponse.json(
      { error: "Hall not found" },
      { status: 404 }
    );
  }

  const updated = await prisma.hall.update({
    where: { id: hallId },
    data: { isActive },
  });

  return NextResponse.json({
    message: "Hall status updated",
    hall: updated,
  });
}
