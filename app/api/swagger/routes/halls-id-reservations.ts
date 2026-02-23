/**
 * @swagger
 * /api/halls/{id}/reservations:
 *   get:
 *     summary: Dohvati sve aktivne rezervacije za određenu salu
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID sale
 *     responses:
 *       200:
 *         description: Lista aktivnih rezervacija uspešno dohvaćena
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   startDateTime:
 *                     type: string
 *                     format: date-time
 *                     example: 2026-03-01T10:00:00Z
 *                   endDateTime:
 *                     type: string
 *                     format: date-time
 *                     example: 2026-03-01T12:00:00Z
 *       400:
 *         description: Neispravan ID sale
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid hall id
 *       500:
 *         description: Greška na serveru prilikom dohvaćanja rezervacija
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to fetch reservations
 */
