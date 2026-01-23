import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";


export async function GET() {
  try {
    const halls = await prisma.hall.findMany({
      where: { isActive: true },
    });

    return NextResponse.json(halls);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch halls" },
      { status: 500 }
    );
  }
}


export async function POST(req: Request) {

  const roleCheck =
  requireRole(["MANAGER", "ADMIN"], req);

  if (roleCheck) return roleCheck;
  
  try {
    const body = await req.json();
    const { name, description, capacity, pricePerEvent } = body;

    if (!name || !capacity || !pricePerEvent) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    const hall = await prisma.hall.create({
      data: {
        name,
        description: description || "",
        capacity: Number(capacity),
        pricePerEvent: Number(pricePerEvent),
        isActive: true,
      },
    });

    return NextResponse.json(
      {
        message: "Hall created",
        hall,
      },
      { status: 201 }
    );
  } catch (error) {
  console.error(error);
  return NextResponse.json(
    { error: "Failed to create hall", details: String(error) },
    { status: 500 }
  );
}
}
