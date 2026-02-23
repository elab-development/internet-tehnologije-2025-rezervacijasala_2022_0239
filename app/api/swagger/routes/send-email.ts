/**
 * @swagger
 * /api/send-email:
 *   post:
 *     summary: Pošalji email koristeći Resend servis
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               to:
 *                 type: string
 *                 example: korisnik@example.com
 *                 description: Email primaoca
 *               subject:
 *                 type: string
 *                 example: Vaša rezervacija je primljena
 *                 description: Naslov email-a
 *               html:
 *                 type: string
 *                 example: "<p>Zdravo, primili smo vaš zahtev za rezervaciju.</p>"
 *                 description: HTML sadržaj email-a
 *     responses:
 *       200:
 *         description: Email uspešno poslat
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: { id: "email_1234567890", status: "queued" }
 *       500:
 *         description: Greška prilikom slanja email-a
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Greška pri slanju mejla
 */