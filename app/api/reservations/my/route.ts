import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/reservations/my
 * USER -> samo svoje rezervacije
 */
export async function GET(req: Request) {
  const userIdHeader = req.headers.get("x-user-id");

  if (!userIdHeader) {
    return NextResponse.json(
      { error: "Missing user id header" },
      { status: 401 }
    );
  }

  const userId = Number(userIdHeader);

  if (Number.isNaN(userId)) {
    return NextResponse.json(
      { error: "Invalid user id" },
      { status: 400 }
    );
  }

  const reservations = await prisma.reservation.findMany({
    where: {
      userId,
    },
    include: {
      hall: true,
    },
    orderBy: {
      startDateTime: "desc",
    },
  });

  return NextResponse.json(reservations);
}
