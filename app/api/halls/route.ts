import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export async function GET() {
  try {
    const halls = await prisma.hall.findMany({
      where: {
        isActive: true,
      },
      include: {
        city: { select: { id: true, name: true } },
        category: { select: { id: true, name: true } },
      },
      orderBy: { id: "desc" },
    });

    return NextResponse.json(halls);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch halls" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const roleCheck = await requireRole(["MANAGER", "ADMIN"], req);
  if (roleCheck) return roleCheck;

  try {
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

    // obavezna polja
    if (
      !name ||
      capacity === undefined ||
      pricePerHour === undefined ||
      cityId === undefined ||
      categoryId === undefined
    ) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // validacije
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

    // provjera da City i Category postoje
    const [city, category] = await Promise.all([
      prisma.city.findUnique({ where: { id: cId } }),
      prisma.hallCategory.findUnique({ where: { id: catId } }),
    ]);

    if (!city) return NextResponse.json({ error: "City not found" }, { status: 404 });
    if (!category) return NextResponse.json({ error: "Category not found" }, { status: 404 });

    const hall = await prisma.hall.create({
      data: {
        name,
        description: description || "",
        capacity: cap,
        pricePerHour: price,
        isActive: true,
        hasStage: typeof hasStage === "boolean" ? hasStage : false,
        isClosed: typeof isClosed === "boolean" ? isClosed : false,
        cityId: cId,
        categoryId: catId,
      },
      include: {
        city: { select: { id: true, name: true } },
        category: { select: { id: true, name: true } },
      },
    });

    return NextResponse.json({ message: "Hall created", hall }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create hall", details: String(error) },
      { status: 500 }
    );
  }
}
