import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const roleCheck = await requireRole(["MANAGER", "ADMIN"], req);
  if (roleCheck) return roleCheck;

  const { id } = await context.params;
  const categoryId = Number(id);

  if (Number.isNaN(categoryId)) {
    return NextResponse.json({ error: "Invalid category id" }, { status: 400 });
  }

  try {
    const hallsCount = await prisma.hall.count({
      where: { categoryId },
    });

    if (hallsCount > 0) {
      return NextResponse.json(
        { error: "Kategorija je dodeljena nekim salama i ne može biti obrisana." },
        { status: 400 }
      );
    }

    await prisma.hallCategory.delete({
      where: { id: categoryId },
    });

    return NextResponse.json({ message: "Kategorija uspešno obrisana" });
  } catch (error) {
    return NextResponse.json({ error: "Greška na serveru" }, { status: 500 });
  }
}