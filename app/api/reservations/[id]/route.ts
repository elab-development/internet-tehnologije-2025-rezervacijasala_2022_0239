import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const reservationId = Number(id);

  if (Number.isNaN(reservationId)) {
    return NextResponse.json(
      { error: "Invalid reservation id" },
      { status: 400 }
    );
  }

  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId },
    include: {
      user: true,
      hall: true,
    },
  });

  if (!reservation) {
    return NextResponse.json(
      { error: "Reservation not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(reservation);
}
