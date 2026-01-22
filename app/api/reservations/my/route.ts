import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/reservations/my
 * - USER: samo svoje rezervacije (svi statusi)
 * - MANAGER / ADMIN: sve rezervacije (svi statusi) + user (ime/prezime)
 */
export async function GET(req: Request) {
  const userIdHeader = req.headers.get("x-user-id");
  const userRole = req.headers.get("x-user-role"); // USER | MANAGER | ADMIN

  if (!userIdHeader || !userRole) {
    return NextResponse.json(
      { error: "Missing auth headers" },
      { status: 401 }
    );
  }

  const userId = Number(userIdHeader);
  if (Number.isNaN(userId)) {
    return NextResponse.json({ error: "Invalid user id" }, { status: 400 });
  }

  const isPrivileged = userRole === "MANAGER" || userRole === "ADMIN";

  const reservations = await prisma.reservation.findMany({
    where: isPrivileged ? {} : { userId },
    include: {
      hall: true,
      user: isPrivileged
        ? { select: { firstName: true, lastName: true } }
        : false,
    },
    orderBy: {
      startDateTime: "desc",
    },
  });

  return NextResponse.json(reservations);
}
