import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  // ⬇️ KLJUČNA LINIJA
  const { id } = await context.params;

  const hallId = Number(id);

  if (Number.isNaN(hallId)) {
    return NextResponse.json(
      { error: "Invalid hall id" },
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

  return NextResponse.json(hall);
}
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
  const { name, description, capacity, pricePerEvent } = body;

  if (!name || !description || !capacity || !pricePerEvent) {
    return NextResponse.json(
      { error: "Missing fields" },
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
    data: {
      name,
      description,
      capacity: Number(capacity),
      pricePerEvent: Number(pricePerEvent),
    },
  });

  return NextResponse.json({
    message: "Hall updated",
    hall: updated,
  });
}