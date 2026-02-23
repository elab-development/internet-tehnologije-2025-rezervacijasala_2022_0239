import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";



export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {

    const { id } = await context.params;
    const hallId = Number(id);

    if (Number.isNaN(hallId)) {
      return NextResponse.json(
        { error: "Invalid hall id" },
        { status: 400 }
      );
    }

    const reservations = await prisma.reservation.findMany({
      where: {
        hallId,
        status: "ACTIVE",
      },
      select: {
        startDateTime: true,
        endDateTime: true,
      },
      orderBy: {
        startDateTime: "asc",
      },
    });

    return NextResponse.json(reservations);
  } catch (error) {
    console.error("Error fetching hall reservations:", error);
    return NextResponse.json(
      { error: "Failed to fetch reservations" },
      { status: 500 }
    );
  }
}
