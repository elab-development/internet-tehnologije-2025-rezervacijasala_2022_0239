import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  // ⬇️ KLJUČNA LINIJA
  const { id } = await context.params;

  const hallId = Number(id);

  if (Number.isNaN(hallId)) {
    return NextResponse.json(
      { error: "Invalid hall id" },
      { status: 400 }
    );
  }

  const hall = await prisma.hall.findUnique({
    where: { id: hallId },
  });

  if (!hall) {
    return NextResponse.json(
      { error: "Hall not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(hall);
}
