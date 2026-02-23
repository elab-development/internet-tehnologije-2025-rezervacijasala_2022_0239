import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

/**
 * @swagger
 * /api/halls/{id}/status:
 *   put:
 *     summary: Promeni status sale (isActive i isClosed) – zahteva MANAGER ili ADMIN rolu
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID sale
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isActive:
 *                 type: boolean
 *                 example: true
 *                 description: Da li je sala aktivna
 *               isClosed:
 *                 type: boolean
 *                 example: false
 *                 description: Da li je sala zatvorena
 *     responses:
 *       200:
 *         description: Status sale uspešno promenjen
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Hall status updated
 *                 hall:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: Sala 1
 *                     isActive:
 *                       type: boolean
 *                       example: true
 *                     isClosed:
 *                       type: boolean
 *                       example: false
 *                     city:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: number
 *                           example: 1
 *                         name:
 *                           type: string
 *                           example: Beograd
 *                     category:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: number
 *                           example: 2
 *                         name:
 *                           type: string
 *                           example: Konferencijska
 *       400:
 *         description: Nedostaju ili pogrešne vrednosti za isActive/isClosed ili neispravan ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Provide isActive and/or isClosed
 *       401:
 *         description: Nema pristup (nije MANAGER ili ADMIN)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Nema pristup
 *       404:
 *         description: Sala nije pronađena
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Hall not found
 */


export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
  const roleCheck = await requireRole(["MANAGER", "ADMIN"], req);
  if (roleCheck) return roleCheck;

  const { id } = await context.params;
  const hallId = Number(id);

  if (Number.isNaN(hallId)) {
    return NextResponse.json({ error: "Invalid hall id" }, { status: 400 });
  }

  const body = await req.json();
  const { isActive, isClosed } = body;

  const data: { isActive?: boolean; isClosed?: boolean } = {};

  if (isActive !== undefined) {
    if (typeof isActive !== "boolean") {
      return NextResponse.json({ error: "isActive must be boolean" }, { status: 400 });
    }
    data.isActive = isActive;
  }

  if (isClosed !== undefined) {
    if (typeof isClosed !== "boolean") {
      return NextResponse.json({ error: "isClosed must be boolean" }, { status: 400 });
    }
    data.isClosed = isClosed;
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "Provide isActive and/or isClosed" }, { status: 400 });
  }

  const hall = await prisma.hall.findUnique({ where: { id: hallId } });
  if (!hall) return NextResponse.json({ error: "Hall not found" }, { status: 404 });

  const updated = await prisma.hall.update({
    where: { id: hallId },
    data,
    include: {
      city: { select: { id: true, name: true } },
      category: { select: { id: true, name: true } },
    },
  });

  return NextResponse.json({ message: "Hall status updated", hall: updated });
}
