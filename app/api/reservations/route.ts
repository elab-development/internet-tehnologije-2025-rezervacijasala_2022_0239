import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

    // 1️⃣ Provera da li sala postoji
    const hall = await prisma.hall.findUnique({
      where: { id: Number(hallId) },
    });

    if (!hall) {
      return NextResponse.json(
        { error: "Hall not found" },
        { status: 404 }
      );
    }

    // 2️⃣ Provera kapaciteta
    if (numberOfGuests > hall.capacity) {
      return NextResponse.json(
        { error: "Number of guests exceeds hall capacity" },
        { status: 400 }
      );
    }

    // 3️⃣ Provera da li je sala zauzeta u tom terminu
    const overlappingReservation =
      await prisma.reservation.findFirst({
        where: {
          hallId: Number(hallId),
          status: "ACTIVE",
          OR: [
            {
              startDateTime: {
                lt: new Date(endDateTime),
              },
              endDateTime: {
                gt: new Date(startDateTime),
              },
            },
          ],
        },
      });

    if (overlappingReservation) {
      return NextResponse.json(
        { error: "Hall is already reserved for this time" },
        { status: 409 }
      );
    }

    // 4️⃣ Kreiranje rezervacije
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
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create reservation" },
      { status: 500 }
    );
  }
}
export async function GET() {
  try {
    const reservations = await prisma.reservation.findMany({
      include: {
        user: true,
        hall: true,
      },
    });

    return NextResponse.json(reservations);
  } catch (error) {
  console.error("RESERVATION POST ERROR:", error);
  return NextResponse.json(
    { error: "Failed to create reservation" },
    { status: 500 }
  );
}
}

