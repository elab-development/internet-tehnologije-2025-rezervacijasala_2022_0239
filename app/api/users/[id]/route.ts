import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

// --- PUT METODA ZA IZMJENU PODATAKA (Ime i prezime) ---
export async function PUT(
  req: Request,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;
    const userId = Number(id);
    const { firstName, lastName } = await req.json();

    if (!firstName || !lastName) {
      return NextResponse.json({ error: "Ime i prezime su obavezni" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { firstName, lastName },
      include: { role: true } // Uključujemo rolu da bi frontend dobio kompletan objekat
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Greška pri ažuriranju korisnika:", error);
    return NextResponse.json({ error: "Greška na serveru" }, { status: 500 });
  }
}

// --- TVOJA POSTOJEĆA DELETE METODA ---
export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  // Ovde ostaje tvoj kod koji si poslala...
  const roleCheck = requireRole(["ADMIN"], req);
  if (roleCheck) return roleCheck;

  const { id } = context.params;
  const userId = Number(id);

  if (Number.isNaN(userId)) {
    return NextResponse.json({ error: "Invalid user id" }, { status: 400 });
  }

  const authUser = req.headers.get("x-user-id");
  if (authUser && Number(authUser) === userId) {
    return NextResponse.json({ error: "You cannot delete your own account" }, { status: 400 });
  }

  const reservationsCount = await prisma.reservation.count({
    where: { userId },
  });

  if (reservationsCount > 0) {
    return NextResponse.json({ error: "Korisnik ima rezervacije i ne moze biti izbrisan" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  await prisma.user.delete({ where: { id: userId } });
  return NextResponse.json({ message: "User deleted" });
}