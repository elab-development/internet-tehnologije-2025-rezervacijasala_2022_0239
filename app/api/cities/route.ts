import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export async function GET() {
  const cities = await prisma.city.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json(cities);
}

export async function POST(req: Request) {
  const roleCheck = await requireRole(["MANAGER", "ADMIN"], req);
  if (roleCheck) return roleCheck;

  const body = await req.json();
  const { name } = body;

  if (!name) return NextResponse.json({ error: "Nema imena" }, { status: 400 });

  const city = await prisma.city.create({ data: { name } });
  return NextResponse.json({ message: "Grad kreiran", city }, { status: 201 });
}
