// app/api/reservations/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const MS_IN_DAY = 24 * 60 * 60 * 1000;

function canModifyOrCancel(startDateTime: Date) {
  const now = new Date();
  const diffDays = (startDateTime.getTime() - now.getTime()) / MS_IN_DAY;
  return diffDays >= 15;
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
 * Pravilo: izmjena samo ako je >= 15 dana do početka i status je ACTIVE
 */
export async function PUT(
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

  const body = await req.json().catch(() => null);
  const start = parseDate(body?.startDateTime);
  const end = parseDate(body?.endDateTime);
  const guests = Number(body?.numberOfGuests);

  if (!start || !end || Number.isNaN(guests) || guests < 1) {
    return NextResponse.json(
      { error: "Missing/invalid fields" },
      { status: 400 }
    );
  }

  if (end <= start) {
    return NextResponse.json(
      { error: "End must be after start" },
      { status: 400 }
    );
  }

  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId },
  });

  if (!reservation) {
    return NextResponse.json({ error: "Reservation not found" }, { status: 404 });
  }

  // USER može samo svoju
  if (auth.role === "USER" && reservation.userId !== auth.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Dozvoli izmjene samo za ACTIVE
  if (reservation.status !== "ACTIVE") {
    return NextResponse.json(
      { error: "Reservation cannot be edited (not ACTIVE)." },
      { status: 400 }
    );
  }

  // 15 dana pravilo (za sve uloge)
  if (!canModifyOrCancel(reservation.startDateTime)) {
    return NextResponse.json(
      { error: "Izmjena je moguća najkasnije 15 dana prije početka." },
      { status: 400 }
    );
  }

  // Konflikt termina (ignorišemo samu sebe)
  const conflict = await prisma.reservation.findFirst({
    where: {
      hallId: reservation.hallId,
      status: "ACTIVE",
      id: { not: reservationId },
      startDateTime: { lt: end },
      endDateTime: { gt: start },
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
      startDateTime: start,
      endDateTime: end,
      numberOfGuests: guests,
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
 * Pravilo: otkaz samo ako je >= 15 dana do početka i status je ACTIVE
 * Soft delete: status = CANCELLED
 */
export async function DELETE(
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
  });

  if (!reservation) {
    return NextResponse.json({ error: "Reservation not found" }, { status: 404 });
  }

  // USER može samo svoju
  if (auth.role === "USER" && reservation.userId !== auth.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Dozvoli otkaz samo za ACTIVE
  if (reservation.status !== "ACTIVE") {
    return NextResponse.json(
      { error: "Reservation cannot be cancelled (not ACTIVE)." },
      { status: 400 }
    );
  }

  // 15 dana pravilo (za sve uloge)
  if (!canModifyOrCancel(reservation.startDateTime)) {
    return NextResponse.json(
      { error: "Otkazivanje je moguće najkasnije 15 dana prije početka." },
      { status: 400 }
    );
  }

  const cancelled = await prisma.reservation.update({
    where: { id: reservationId },
    data: { status: "CANCELLED" },
  });

  return NextResponse.json({
    message: "Reservation cancelled",
    reservation: cancelled,
  });
}
