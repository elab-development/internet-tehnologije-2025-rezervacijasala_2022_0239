/**
 * @swagger
 * /api/hall-categories/{id}:
 *   delete:
 *     summary: Obriši kategoriju sale po ID-u (zahteva MANAGER ili ADMIN rolu)
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID kategorije koja se briše
 *     responses:
 *       200:
 *         description: Kategorija uspešno obrisana
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Kategorija uspešno obrisana
 *       400:
 *         description: Neispravan ID ili kategorija je dodeljena nekim salama
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Kategorija je dodeljena nekim salama i ne može biti obrisana.
 *       401:
 *         description: Nema pristup (nije MANAGER ili ADMIN)
 *       500:
 *         description: Greška na serveru
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Greška na serveru
 */
