import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export async function GET() {
  const categories = await prisma.hallCategory.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json(categories);
}

export async function POST(req: Request) {
  const roleCheck = requireRole(["MANAGER", "ADMIN"], req);
  if (roleCheck) return roleCheck;

  const body = await req.json();
  const { name } = body;

  if (!name) return NextResponse.json({ error: "Missing name" }, { status: 400 });

  const category = await prisma.hallCategory.create({ data: { name } });
  return NextResponse.json({ message: "Category created", category }, { status: 201 });
}
