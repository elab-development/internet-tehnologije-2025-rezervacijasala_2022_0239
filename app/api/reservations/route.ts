import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole, getAuth } from "@/lib/auth";


export async function POST(req: Request) {
  try {
    // 1. DODAJ OVU PROVERU - Da li je korisnik ulogovan?
    // Bilo koji ulogovan korisnik (USER, MANAGER, ADMIN) može da rezerviše
    const authError = requireRole(["USER", "MANAGER", "ADMIN"], req);
    if (authError) return authError;

    const auth = getAuth(req);
    // Ako getAuth vrati null (što ne bi trebalo zbog requireRole iznad), 
    // ovaj if osigurava da TypeScript bude srećan:
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const authenticatedUserId = auth.userId; // Sada TypeScript zna da je ovo broj

    const body = await req.json();
    const {
      hallId, // userId nam više ne treba iz body-ja, imamo ga iz auth
      startDateTime,
      endDateTime,
      numberOfGuests,
    } = body;

    // ... ostatak validacije (if !hallId itd.) ...

    const reservation = await prisma.reservation.create({
      data: {
        userId: authenticatedUserId, // Koristimo ID iz sigurnog headera
        hallId: Number(hallId),
        startDateTime: new Date(startDateTime),
        endDateTime: new Date(endDateTime),
        numberOfGuests,
        status: "ACTIVE",
      },
    });

    return NextResponse.json({ message: "Reservation created", reservation }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create reservation" }, { status: 500 });
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
