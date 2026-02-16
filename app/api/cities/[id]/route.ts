import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
  const roleCheck = await requireRole(["MANAGER", "ADMIN"], req);
  if (roleCheck) return roleCheck;

  try {
    const { id } = await context.params;
    const cityId = Number(id);

    if (Number.isNaN(cityId)) {
      return NextResponse.json({ error: "Neispravan id" }, { status: 400 });
    }


    const hallsCount = await prisma.hall.count({
      where: { cityId },
    });

    if (hallsCount > 0) {
      return NextResponse.json(
        { error: "Grad ima povezane sale i ne može biti obrisan." },
        { status: 400 }
      );
    }

    await prisma.city.delete({
      where: { id: cityId },
    });

    return NextResponse.json({ message: "Grad uspešno obrisan" });
  } catch (error) {
    return NextResponse.json({ error: "Greška na serveru pri brisanju grada" }, { status: 500 });
  }
}