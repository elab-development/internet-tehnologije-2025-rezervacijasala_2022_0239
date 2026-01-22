// app/api/reservations/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const MS_IN_DAY = 24 * 60 * 60 * 1000;

function canModifyOrCancel(startDateTime: Date, minDays = 15) {
  const now = new Date();
  const diffMs = startDateTime.getTime() - now.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays >= minDays;
}

function parseDate(value: any) {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function getAuth(req: Request) {
  const role = req.headers.get("x-user-role"); // "USER" | "MANAGER" | "ADMIN"
  const idHeader = req.headers.get("x-user-id");
  const userId = idHeader ? Number(idHeader) : NaN;

  if (!role || Number.isNaN(userId)) return null;
  return { role, userId };
}

function isPrivileged(role: string) {
  return role === "MANAGER" || role === "ADMIN";
}

/**
 * GET /api/reservations/{id}
 * USER -> samo svoju
 * MANAGER / ADMIN -> bilo koju
 */
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const auth = getAuth(req);
  if (!auth) {
    return NextResponse.json({ error: "Missing auth headers" }, { status: 401 });
  }

  const { id } = await context.params;
  const reservationId = Number(id);

  if (Number.isNaN(reservationId)) {
    return NextResponse.json({ error: "Invalid reservation id" }, { status: 400 });
  }

  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId },
    include: {
      hall: true,
      user: true,
    },
  });

  if (!reservation) {
    return NextResponse.json({ error: "Reservation not found" }, { status: 404 });
  }

  // USER može samo svoju
  if (auth.role === "USER" && reservation.userId !== auth.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(reservation);
}

/**
 * PUT /api/reservations/{id}
 * USER -> samo svoju
 * MANAGER / ADMIN -> bilo koju
 * Pravilo: može menjati samo ako ima >= 15 dana do početka
 */
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const reservationId = Number(id);

  if (Number.isNaN(reservationId)) {
    return NextResponse.json({ error: "Invalid reservation id" }, { status: 400 });
  }

  const body = await req.json();
  const { startDateTime, endDateTime, numberOfGuests } = body;

  if (!startDateTime || !endDateTime || !numberOfGuests) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const userRole = req.headers.get("x-user-role");
  const userIdHeader = req.headers.get("x-user-id");

  if (!userRole || !userIdHeader) {
    return NextResponse.json({ error: "Missing auth headers" }, { status: 401 });
  }

  const userId = Number(userIdHeader);

  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId },
  });

  if (!reservation) {
    return NextResponse.json({ error: "Reservation not found" }, { status: 404 });
  }

  // USER može samo svoju
  if (userRole === "USER" && reservation.userId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Pravilo 15 dana (računamo na osnovu TRENUTNOG početka rezervacije)
  if (!canModifyOrCancel(reservation.startDateTime, 15)) {
    return NextResponse.json(
      { error: "Reservation can be changed only 15+ days before start date" },
      { status: 400 }
    );
  }

  const newStart = new Date(startDateTime);
  const newEnd = new Date(endDateTime);

  if (Number.isNaN(newStart.getTime()) || Number.isNaN(newEnd.getTime())) {
    return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
  }

  if (newEnd <= newStart) {
    return NextResponse.json(
      { error: "End time must be after start time" },
      { status: 400 }
    );
  }

  // Konflikt termina (ignorišemo samu sebe)
  const conflict = await prisma.reservation.findFirst({
    where: {
      hallId: reservation.hallId,
      status: "ACTIVE",
      id: { not: reservationId },
      startDateTime: { lt: newEnd },
      endDateTime: { gt: newStart },
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
      startDateTime: newStart,
      endDateTime: newEnd,
      numberOfGuests: Number(numberOfGuests),
    },
  });

  return NextResponse.json({
    message: "Reservation updated",
    reservation: updated,
  });
}

/**
 * DELETE /api/reservations/{id}
 * USER -> samo svoju
 * MANAGER / ADMIN -> bilo koju
 * Pravilo: može otkazati samo ako ima >= 15 dana do početka
 */
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const reservationId = Number(id);

  if (Number.isNaN(reservationId)) {
    return NextResponse.json({ error: "Invalid reservation id" }, { status: 400 });
  }

  const userRole = req.headers.get("x-user-role");
  const userIdHeader = req.headers.get("x-user-id");

  if (!userRole || !userIdHeader) {
    return NextResponse.json({ error: "Missing auth headers" }, { status: 401 });
  }

  const userId = Number(userIdHeader);

  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId },
  });

  if (!reservation) {
    return NextResponse.json({ error: "Reservation not found" }, { status: 404 });
  }

  // USER može samo svoju
  if (userRole === "USER" && reservation.userId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Ne dozvoli otkaz ako je preblizu (ili prošlo)
  if (!canModifyOrCancel(reservation.startDateTime, 15)) {
    return NextResponse.json(
      { error: "Reservation can be cancelled only 15+ days before start date" },
      { status: 400 }
    );
  }

  // Soft cancel
  const cancelled = await prisma.reservation.update({
    where: { id: reservationId },
    data: { status: "CANCELLED" },
  });

  return NextResponse.json({
    message: "Reservation cancelled",
    reservation: cancelled,
  });
}
