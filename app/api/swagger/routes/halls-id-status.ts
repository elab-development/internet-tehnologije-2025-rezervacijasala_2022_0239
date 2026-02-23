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
