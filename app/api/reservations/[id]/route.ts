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
/**
 * DELETE /api/reservations/{id}
 * USER -> samo svoju
 * MANAGER / ADMIN -> bilo koju
 */
export async function DELETE(
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

  // ⬇️ MVP auth simulacija (header)
  const userRole = _req.headers.get("x-user-role");
  const userIdHeader = _req.headers.get("x-user-id");

  if (!userRole || !userIdHeader) {
    return NextResponse.json(
      { error: "Missing auth headers" },
      { status: 401 }
    );
  }

  const userId = Number(userIdHeader);

  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId },
  });

  if (!reservation) {
    return NextResponse.json(
      { error: "Reservation not found" },
      { status: 404 }
    );
  }

  // USER može samo svoju rezervaciju
  if (userRole === "USER" && reservation.userId !== userId) {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    );
  }

  // ⬇️ Umesto brisanja – soft delete
  const cancelled = await prisma.reservation.update({
    where: { id: reservationId },
    data: {
      status: "CANCELLED",
    },
  });

  return NextResponse.json({
    message: "Reservation cancelled",
    reservation: cancelled,
  });
}
export async function PUT(
  req: Request,
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

  const body = await req.json();
  const { startDateTime, endDateTime, numberOfGuests } = body;

  if (!startDateTime || !endDateTime || !numberOfGuests) {
    return NextResponse.json(
      { error: "Missing fields" },
      { status: 400 }
    );
  }

  // 🔐 MVP auth (header-based)
  const userRole = req.headers.get("x-user-role");
  const userIdHeader = req.headers.get("x-user-id");

  if (!userRole || !userIdHeader) {
    return NextResponse.json(
      { error: "Missing auth headers" },
      { status: 401 }
    );
  }

  const userId = Number(userIdHeader);

  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId },
  });

  if (!reservation) {
    return NextResponse.json(
      { error: "Reservation not found" },
      { status: 404 }
    );
  }

  // USER može samo svoju rezervaciju
  if (userRole === "USER" && reservation.userId !== userId) {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    );
  }

  // 🔄 Provera konflikta (ignorišemo samu sebe)
  const conflict = await prisma.reservation.findFirst({
    where: {
      hallId: reservation.hallId,
      status: "ACTIVE",
      id: { not: reservationId },
      OR: [
        {
          startDateTime: { lt: new Date(endDateTime) },
          endDateTime: { gt: new Date(startDateTime) },
        },
      ],
    },
  });

  if (conflict) {
    return NextResponse.json(
      { error: "Hall is already reserved for this time" },
      { status: 409 }
    );
  }

  const updated = await prisma.reservation.update({
    where: { id: reservationId },
    data: {
      startDateTime: new Date(startDateTime),
      endDateTime: new Date(endDateTime),
      numberOfGuests,
    },
  });

  return NextResponse.json({
    message: "Reservation updated",
    reservation: updated,
  });
}