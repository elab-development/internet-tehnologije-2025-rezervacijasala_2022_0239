import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole, getAuth } from "@/lib/auth";

/**
 * PUT /api/users/[id]
 * USER može menjati samo sebe
 * ADMIN može menjati svakoga
 */
export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // ⬅️ OVO JE KLJUČ
    const userId = Number(id);

    if (Number.isNaN(userId)) {
      return NextResponse.json(
        { error: "Invalid user id" },
        { status: 400 }
      );
    }

    const { firstName, lastName } = await req.json();

    if (!firstName || !lastName) {
      return NextResponse.json(
        { error: "Ime i prezime su obavezni" },
        { status: 400 }
      );
    }

    // 🔐 autorizacija: USER/MANAGER mogu menjati samo sebe; ADMIN može bilo koga
    const auth = await getAuth(req);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (auth.role !== "ADMIN" && auth.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { firstName, lastName },
      include: { role: true },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Greška pri ažuriranju korisnika:", error);
    return NextResponse.json(
      { error: "Greška na serveru" },
      { status: 500 }
    );
  }
}


/**
 * DELETE /api/users/[id]
 * Samo ADMIN
 */
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  // 🔐 samo ADMIN
  const roleCheck = await requireRole(["ADMIN"], req);
  if (roleCheck) return roleCheck;

  // 🔑 KLJUČNA ISPRAVKA
  const { id } = await context.params;
  const userId = Number(id);

  if (Number.isNaN(userId)) {
    return NextResponse.json(
      { error: "Invalid user id" },
      { status: 400 }
    );
  }

  const auth = await getAuth(req);
  const authUserId = auth?.userId;
  if (authUserId === userId) {
    return NextResponse.json(
      { error: "Ne možeš obrisati sopstveni nalog" },
      { status: 400 }
    );
  }

  const reservationsCount = await prisma.reservation.count({
    where: { userId },
  });

  if (reservationsCount > 0) {
    return NextResponse.json(
      { error: "Korisnik ima rezervacije i ne može biti obrisan" },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return NextResponse.json(
      { error: "User not found" },
      { status: 404 }
    );
  }

  await prisma.user.delete({
    where: { id: userId },
  });

  return NextResponse.json({ message: "User deleted" });
}
