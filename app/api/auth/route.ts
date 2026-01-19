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
        { error: "User already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // USER role (pretpostavljamo da postoji u bazi)
    const userRole = await prisma.role.findFirst({
      where: { name: "USER" },
    });

    if (!userRole) {
      return NextResponse.json(
        { error: "Role USER not found" },
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

    return NextResponse.json({ message: "User created", user });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
