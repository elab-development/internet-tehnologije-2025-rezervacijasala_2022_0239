import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuth } from "@/lib/auth";

const FIFTEEN_DAYS_MS = 15 * 24 * 60 * 60 * 1000;


export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await getAuth(req); 
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
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
      hall: true,
      user: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
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
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await getAuth(req);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const reservationId = Number(id);

  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId },
  });

  if (!reservation) {
    return NextResponse.json({ error: "Reservation not found" }, { status: 404 });
  }

  const body = await req.json();
  const { startDateTime, endDateTime, numberOfGuests, status } = body;

  const isPrivileged = auth.role === "ADMIN" || auth.role === "MANAGER";

  if (!isPrivileged && reservation.userId !== auth.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }


  if (!isPrivileged && (startDateTime || endDateTime)) {
    const diff = new Date(reservation.startDateTime).getTime() - Date.now();
    if (diff < FIFTEEN_DAYS_MS) {
      return NextResponse.json(
        { error: "Too late to modify reservation" },
        { status: 403 }
      );
    }
  }


  if (startDateTime && endDateTime && (status === "ACTIVE" || reservation.status === "ACTIVE")) {
    const conflict = await prisma.reservation.findFirst({
      where: {
        hallId: reservation.hallId,
        status: "ACTIVE",
        id: { not: reservationId },
        startDateTime: { lt: new Date(endDateTime) },
        endDateTime: { gt: new Date(startDateTime) },
      },
    });

    if (conflict) {
      return NextResponse.json(
        { error: "Hall already reserved for this period" },
        { status: 409 }
      );
    }
  }


  const updated = await prisma.reservation.update({
    where: { id: reservationId },
    data: {

      startDateTime: startDateTime ? new Date(startDateTime) : undefined,
      endDateTime: endDateTime ? new Date(endDateTime) : undefined,
      numberOfGuests: numberOfGuests !== undefined ? numberOfGuests : undefined,
      status: status !== undefined ? status : undefined,
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await getAuth(req);
  if (!auth) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id } = await context.params;
  const reservationId = Number(id);

  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId },
  });

  if (!reservation) {
    return NextResponse.json(
      { error: "Reservation not found" },
      { status: 404 }
    );
  }

  if (
    auth.role === "USER" &&
    reservation.userId !== auth.userId
  ) {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 }
    );
  }

  const diff =
    new Date(reservation.startDateTime).getTime() -
    Date.now();

  if (diff < FIFTEEN_DAYS_MS) {
    return NextResponse.json(
      { error: "Too late to cancel reservation" },
      { status: 403 }
    );
  }

  const cancelled = await prisma.reservation.update({
    where: { id: reservationId },
    data: { status: "CANCELLED" },
  });

  return NextResponse.json(cancelled);
}
