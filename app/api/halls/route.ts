import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
  try {
    const body = await req.json();
    const { name, description, capacity, pricePerEvent } = body;

    if (!name || !description || !capacity || !pricePerEvent) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    const hall = await prisma.hall.create({
      data: {
        name,
        description,
        capacity,
        pricePerEvent,
        isActive: true,
      },
    });

    return NextResponse.json(
      { message: "Hall created", hall },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create hall" },
      { status: 500 }
    );
  }
}
