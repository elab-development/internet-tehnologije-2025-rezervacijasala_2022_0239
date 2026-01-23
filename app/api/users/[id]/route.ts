
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const roleCheck = requireRole(["ADMIN"], req);

  if (roleCheck) return roleCheck;

  const { id } = await context.params;
  const userId = Number(id);

  if (Number.isNaN(userId)) {
    return NextResponse.json(
      { error: "Invalid user id" },
      { status: 400 }
    );
  }
//ne moze samog sebe
  const authUser = req.headers.get("x-user-id");
  if (authUser && Number(authUser) === userId) {
    return NextResponse.json(
      { error: "You cannot delete your own account" },
      { status: 400 }
    );
  }

  //ne moze ako ima rezervacije
  const reservationsCount = await prisma.reservation.count({
    where: { userId },
  });

  if (reservationsCount > 0) {
    return NextResponse.json(
      {
        error:
          "Korisnik ima rezervacije i ne moze biti izbrisan",
      },
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
