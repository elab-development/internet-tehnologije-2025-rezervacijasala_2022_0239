import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  const roleCheck = requireRole(["MANAGER", "ADMIN"], req);
  if (roleCheck) return roleCheck;

  const { id } = await context.params;
  const hallId = Number(id);

  if (Number.isNaN(hallId)) {
    return NextResponse.json({ error: "Invalid hall id" }, { status: 400 });
  }

  const body = await req.json();
  const { isActive, isClosed } = body;

  const data: { isActive?: boolean; isClosed?: boolean } = {};

  if (isActive !== undefined) {
    if (typeof isActive !== "boolean") {
      return NextResponse.json({ error: "isActive must be boolean" }, { status: 400 });
    }
    data.isActive = isActive;
  }

  if (isClosed !== undefined) {
    if (typeof isClosed !== "boolean") {
      return NextResponse.json({ error: "isClosed must be boolean" }, { status: 400 });
    }
    data.isClosed = isClosed;
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Provide isActive and/or isClosed" }, { status: 400 });
  }

  const hall = await prisma.hall.findUnique({ where: { id: hallId } });
  if (!hall) return NextResponse.json({ error: "Hall not found" }, { status: 404 });

  const updated = await prisma.hall.update({
    where: { id: hallId },
    data,
    include: {
      city: { select: { id: true, name: true } },
      category: { select: { id: true, name: true } },
    },
  });

  return NextResponse.json({ message: "Hall status updated", hall: updated });
}
