import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, password } = body;

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Korinsik vec postoji" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userRole = await prisma.role.findFirst({
      where: { name: "USER" },
    });

    if (!userRole) {
      return NextResponse.json(
        { error: "Rola nije pronadjena" },
        { status: 500 }
      );
    }

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        passwordHash: hashedPassword,
        roleId: userRole.id,
      },
    });

    return NextResponse.json({ message: "Korisik kreiran", user });
  } catch (error) {
    return NextResponse.json(
      { error: "Greska na serveru" },
      { status: 500 }
    );
  }
}
