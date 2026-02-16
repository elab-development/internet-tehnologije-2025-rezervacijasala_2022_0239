import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { getAuth } from "@/lib/auth";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getAuth(req);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const userId = Number(id);

    if (Number.isNaN(userId)) {
      return NextResponse.json({ error: "Invalid user id" }, { status: 400 });
    }

    const body = await req.json().catch(() => ({}));
    const newPassword = (body?.newPassword ?? "").trim();
    const oldPassword = (body?.oldPassword ?? "").trim();

    if (!newPassword) {
      return NextResponse.json(
        { error: "Nova šifra je obavezna" },
        { status: 400 }
      );
    }


    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json(
        { error: "Korisnik nije pronađen" },
        { status: 404 }
      );
    }

    const isAdmin = auth.role === "ADMIN";


    if (!isAdmin) {
      if (auth.userId !== userId) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      if (!oldPassword) {
        return NextResponse.json(
          { error: "Trenutna šifra je obavezna" },
          { status: 400 }
        );
      }

      const passwordMatch = await bcrypt.compare(oldPassword, user.passwordHash);
      if (!passwordMatch) {
        return NextResponse.json(
          { error: "Trenutna šifra nije ispravna" },
          { status: 401 }
        );
      }
    }


    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: hashedNewPassword },
    });

    return NextResponse.json({
      message: isAdmin ? "Šifra je resetovana" : "Šifra uspješno promijenjena",
    });
  } catch (error) {
    console.error("Greška na serveru:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
