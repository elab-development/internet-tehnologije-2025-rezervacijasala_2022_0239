import { NextResponse } from "next/server";
import bcrypt from "bcrypt"; // Koristimo običan bcrypt kao u login-u
import { prisma } from "@/lib/prisma";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> } // Next.js 15+ podrška
) {
  try {
    const { id } = await context.params;
    const userId = Number(id);
    const { oldPassword, newPassword } = await req.json();

    if (!oldPassword || !newPassword) {
      return NextResponse.json(
        { error: "Oba polja su obavezna" },
        { status: 400 }
      );
    }

    // 1. Nađi korisnika u bazi
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Korisnik nije pronađen" },
        { status: 404 }
      );
    }

    // 2. Uporedi staru šifru (kao u tvom login-u)
    const passwordMatch = await bcrypt.compare(
      oldPassword,
      user.passwordHash
    );

    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Trenutna šifra nije ispravna" },
        { status: 401 }
      );
    }

    // 3. Heširaj novu šifru
    // Koristimo isti broj krugova (salt) kao što je standard
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // 4. Sačuvaj promjenu
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: hashedNewPassword },
    });

    return NextResponse.json({ message: "Šifra uspješno promijenjena" });

  } catch (error) {
    console.error("Greška na serveru:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}