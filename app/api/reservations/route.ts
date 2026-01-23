import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      userId,
      hallId,
      startDateTime,
      endDateTime,
      numberOfGuests,
    } = body;

    if (
      !userId ||
      !hallId ||
      !startDateTime ||
      !endDateTime ||
      !numberOfGuests
    ) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    const hall = await prisma.hall.findUnique({
      where: { id: Number(hallId) },
    });

    if (!hall) {
      return NextResponse.json(
        { error: "Hall not found" },
        { status: 404 }
      );
    }

    if (numberOfGuests > hall.capacity) {
      return NextResponse.json(
        { error: "Number of guests exceeds hall capacity" },
        { status: 400 }
      );
    }

    const conflict = await prisma.reservation.findFirst({
      where: {
        hallId: Number(hallId),
        status: "ACTIVE",
        startDateTime: { lt: new Date(endDateTime) },
        endDateTime: { gt: new Date(startDateTime) },
      },
    });

    if (conflict) {
      return NextResponse.json(
        { error: "Hall is already reserved for this time" },
        { status: 409 }
      );
    }

    const reservation = await prisma.reservation.create({
      data: {
        userId: Number(userId),
        hallId: Number(hallId),
        startDateTime: new Date(startDateTime),
        endDateTime: new Date(endDateTime),
        numberOfGuests,
        status: "ACTIVE",
      },
    });

    return NextResponse.json(
      { message: "Reservation created", reservation },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to create reservation" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const roleCheck = requireRole(["ADMIN", "MANAGER"], req);
  if (roleCheck) return roleCheck;

  const reservations = await prisma.reservation.findMany({
    include: {
      hall: true,
      user: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
    orderBy: {
      startDateTime: "desc",
    },
  });

  return NextResponse.json(reservations);
}
