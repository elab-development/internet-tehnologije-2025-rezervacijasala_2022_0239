/**
 * @swagger
 * /api/convert:
 *   get:
 *     summary: Dohvati kursne liste valuta (EUR, RSD, USD, CHF, GBP, AUD, CAD, BAM)
 *     responses:
 *       200:
 *         description: Kursne liste uspešno dohvaćene
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               additionalProperties:
 *                 type: number
 *               example:
 *                 EUR: 1
 *                 RSD: 117.5
 *                 USD: 1.09
 *                 CHF: 0.98
 *                 GBP: 0.88
 *                 AUD: 1.63
 *                 CAD: 1.44
 *                 BAM: 1.96
 *       500:
 *         description: Greška na serveru ili API key nedostaje
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: API key is missing
 */
