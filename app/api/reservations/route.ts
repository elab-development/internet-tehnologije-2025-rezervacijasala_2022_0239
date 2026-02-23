import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole, getAuth } from "@/lib/auth";
import { Resend } from 'resend';



const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
  
    const roleCheck = await requireRole(["USER", "MANAGER", "ADMIN"], req);
    if (roleCheck) return roleCheck;

    const auth = await getAuth(req);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = auth.userId;

    const body = await req.json();
    const { hallId, startDateTime, endDateTime, numberOfGuests } = body;


    if (!hallId || !startDateTime || !endDateTime || !numberOfGuests) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    const start = new Date(startDateTime);
    const end = new Date(endDateTime);

    if (end <= start) {
      return NextResponse.json(
        { error: "Kraj mora biti posle početka" },
        { status: 400 }
      );
    }

    const hall = await prisma.hall.findUnique({
      where: { id: Number(hallId) },
    });

    if (!hall) {
      return NextResponse.json(
        { error: "Sala ne postoji" },
        { status: 404 }
      );
    }

    if (numberOfGuests > hall.capacity) {
      return NextResponse.json(
        {
          error: `Broj gostiju premašuje kapacitet sale (${hall.capacity})`,
        },
        { status: 400 }
      );
    }


    const conflict = await prisma.reservation.findFirst({
      where: {
        hallId: Number(hallId),
        status: "ACTIVE",
        AND: [
          {
            startDateTime: {
              lt: end,
            },
          },
          {
            endDateTime: {
              gt: start,
            },
          },
        ],
      },
    });

    if (conflict) {
      return NextResponse.json(
        {
          error: "Sala je već rezervisana u tom terminu",
        },
        { status: 409 } 
      );
    }


    const reservation = await prisma.reservation.create({
      data: {
        userId,
        hallId: Number(hallId),
        startDateTime: start,
        endDateTime: end,
        numberOfGuests,
        status: "PENDING",
      },
      include: {
        hall: true, 
        user: true, 
      }
    });


    await resend.emails.send({
      from: 'Rezervacije <onboarding@resend.dev>',
      to: reservation.user.email,
      subject: 'Vaš zahtev za rezervaciju je primljen',
      html: `Zdravo, primili smo vaš zahtev za salu <strong>${reservation.hall.name}</strong>. Obavestićemo Vas čim menadžer odobri termin.`
    });


    await resend.emails.send({
      from: 'Sistem <onboarding@resend.dev>',
      to: 'tvoj-menadzer-email@gmail.com',
      subject: 'Nova rezervacija čeka odobrenje',
      html: `Stigao je novi zahtev za salu <strong>${reservation.hall.name}</strong>. <a href="http://localhost:3000/reservations">Klikni ovde da odobriš</a>.`
    });

    return NextResponse.json(
      { message: "Reservation created", reservation },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create reservation" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const roleCheck = await requireRole(["ADMIN", "MANAGER"], req);
  if (roleCheck) return roleCheck;

  const reservations = await prisma.reservation.findMany({
    include: {
      hall: true,
      user: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
    orderBy: {
      startDateTime: "desc",
    },
  });

  return NextResponse.json(reservations);
}
