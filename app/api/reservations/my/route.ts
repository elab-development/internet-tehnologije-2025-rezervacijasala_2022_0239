import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuth } from "@/lib/auth";


export async function GET(req: Request) {
  const auth = await getAuth(req);

  if (!auth) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const reservations = await prisma.reservation.findMany({
  where: {
    userId: auth.userId,
  },
  include: {
    hall: true,
    user: { // DODAJEMO OVO
      select: {
        firstName: true,
        lastName: true,
        email: true,
      }
    }
  },
  orderBy: {
    startDateTime: "desc",
  },
});

  return NextResponse.json(reservations);
}
