/**
 * @swagger
 * /api/halls/{id}:
 *   get:
 *     summary: Dohvati salu po ID-u
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID sale
 *     responses:
 *       200:
 *         description: Sala uspešno pronađena
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: Sala 1
 *                 description:
 *                   type: string
 *                   example: Velika konferencijska sala
 *                 capacity:
 *                   type: integer
 *                   example: 50
 *                 pricePerHour:
 *                   type: number
 *                   example: 1500
 *                 hasStage:
 *                   type: boolean
 *                   example: true
 *                 isClosed:
 *                   type: boolean
 *                   example: false
 *                 imageUrl:
 *                   type: string
 *                   example: https://example.com/image.jpg
 *                 city:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: Beograd
 *                 category:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                       example: 2
 *                     name:
 *                       type: string
 *                       example: Konferencijska
 *       400:
 *         description: Neispravan ID
 *       404:
 *         description: Sala nije pronađena
 *   put:
 *     summary: Izmeni salu po ID-u (zahteva MANAGER ili ADMIN rolu)
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID sale koja se menja
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Sala 1
 *               description:
 *                 type: string
 *                 example: Velika konferencijska sala
 *               capacity:
 *                 type: integer
 *                 example: 50
 *               pricePerHour:
 *                 type: number
 *                 example: 1500
 *               cityId:
 *                 type: integer
 *                 example: 1
 *               categoryId:
 *                 type: integer
 *                 example: 2
 *               hasStage:
 *                 type: boolean
 *                 example: true
 *               isClosed:
 *                 type: boolean
 *                 example: false
 *               imageUrl:
 *                 type: string
 *                 example: https://example.com/image.jpg
 *     responses:
 *       200:
 *         description: Sala uspešno izmenjena
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Hall updated
 *                 hall:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: Sala 1
 *                     description:
 *                       type: string
 *                       example: Velika konferencijska sala
 *                     capacity:
 *                       type: integer
 *                       example: 50
 *                     pricePerHour:
 *                       type: number
 *                       example: 1500
 *                     hasStage:
 *                       type: boolean
 *                       example: true
 *                     isClosed:
 *                       type: boolean
 *                       example: false
 *                     imageUrl:
 *                       type: string
 *                       example: https://example.com/image.jpg
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
 *         description: Nedostaju ili pogrešne vrednosti
 *       401:
 *         description: Nema pristup (nije MANAGER ili ADMIN)
 *       404:
 *         description: Sala nije pronađena
 *   delete:
 *     summary: Obriši salu po ID-u (zahteva MANAGER ili ADMIN rolu)
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID sale koja se briše
 *     responses:
 *       200:
 *         description: Sala uspešno obrisana
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Hall deleted successfully
 *       400:
 *         description: Sala ima postojeće rezervacije i ne može biti obrisana
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Sala ima postojeće rezervacije i ne može biti obrisana. Možete je deaktivirati.
 *       401:
 *         description: Nema pristup (nije MANAGER ili ADMIN)
 *       404:
 *         description: Sala nije pronađena
 */