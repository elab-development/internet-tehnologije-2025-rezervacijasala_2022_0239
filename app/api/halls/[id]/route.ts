import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export async function GET(_req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const hallId = Number(id);

  if (Number.isNaN(hallId)) {
    return NextResponse.json({ error: "Invalid hall id" }, { status: 400 });
  }

  const hall = await prisma.hall.findUnique({
    where: { id: hallId },
    include: {
      city: { select: { id: true, name: true } },
      category: { select: { id: true, name: true } },
    },
  });

  if (!hall) {
    return NextResponse.json({ error: "Hall not found" }, { status: 404 });
  }

  return NextResponse.json(hall);
}

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  const roleCheck = requireRole(["MANAGER", "ADMIN"], req);
  if (roleCheck) return roleCheck;

  const { id } = await context.params;
  const hallId = Number(id);

  if (Number.isNaN(hallId)) {
    return NextResponse.json({ error: "Invalid hall id" }, { status: 400 });
  }

  const body = await req.json();

  const {
    name,
    description,
    capacity,
    pricePerHour,
    cityId,
    categoryId,
    hasStage,
    isClosed,
  } = body;

  if (
    !name ||
    capacity === undefined ||
    pricePerHour === undefined ||
    cityId === undefined ||
    categoryId === undefined
  ) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const cap = Number(capacity);
  const price = Number(pricePerHour);
  const cId = Number(cityId);
  const catId = Number(categoryId);

  if (!Number.isFinite(cap) || cap <= 0) {
    return NextResponse.json({ error: "capacity must be a positive number" }, { status: 400 });
  }

  if (!Number.isFinite(price) || price <= 0) {
    return NextResponse.json({ error: "pricePerHour must be a positive number" }, { status: 400 });
  }

  if (!Number.isFinite(cId) || cId <= 0) {
    return NextResponse.json({ error: "cityId must be a valid number" }, { status: 400 });
  }

  if (!Number.isFinite(catId) || catId <= 0) {
    return NextResponse.json({ error: "categoryId must be a valid number" }, { status: 400 });
  }

  const hall = await prisma.hall.findUnique({ where: { id: hallId } });
  if (!hall) return NextResponse.json({ error: "Hall not found" }, { status: 404 });

  const [city, category] = await Promise.all([
    prisma.city.findUnique({ where: { id: cId } }),
    prisma.hallCategory.findUnique({ where: { id: catId } }),
  ]);

  if (!city) return NextResponse.json({ error: "City not found" }, { status: 404 });
  if (!category) return NextResponse.json({ error: "Category not found" }, { status: 404 });

  const updated = await prisma.hall.update({
    where: { id: hallId },
    data: {
      name,
      description: description ?? "",
      capacity: cap,
      pricePerHour: price,
      cityId: cId,
      categoryId: catId,
      hasStage: typeof hasStage === "boolean" ? hasStage : hall.hasStage,
      isClosed: typeof isClosed === "boolean" ? isClosed : hall.isClosed,
    },
    include: {
      city: { select: { id: true, name: true } },
      category: { select: { id: true, name: true } },
    },
  });

  return NextResponse.json({ message: "Hall updated", hall: updated });
}

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const roleCheck = requireRole(["MANAGER", "ADMIN"], req);
  if (roleCheck) return roleCheck;

  const { id } = await context.params;
  const hallId = Number(id);

  if (Number.isNaN(hallId)) {
    return NextResponse.json({ error: "Invalid hall id" }, { status: 400 });
  }

  const reservationsCount = await prisma.reservation.count({
    where: { hallId },
  });

  if (reservationsCount > 0) {
    return NextResponse.json(
      {
        error:
          "Sala ima postojeće rezervacije i ne može biti obrisana. Možete je deaktivirati.",
      },
      { status: 400 }
    );
  }

  const hall = await prisma.hall.findUnique({ where: { id: hallId } });
  if (!hall) return NextResponse.json({ error: "Hall not found" }, { status: 404 });

  await prisma.hall.delete({ where: { id: hallId } });

  return NextResponse.json({ message: "Hall deleted successfully" });
}
