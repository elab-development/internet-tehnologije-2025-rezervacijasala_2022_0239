/**
 * @swagger
 * /api/users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Dohvati sve korisnike (zahteva ADMIN rolu)
 *     responses:
 *       200:
 *         description: Lista korisnika uspešno dohvaćena
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: number
 *                     example: 1
 *                   firstName:
 *                     type: string
 *                     example: Jovan
 *                   lastName:
 *                     type: string
 *                     example: Teofilović
 *                   email:
 *                     type: string
 *                     example: jovan@example.com
 *                   role:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: ADMIN
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: 2026-02-15T10:00:00Z
 *       401:
 *         description: Neautorizovan korisnik (nije ADMIN)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Nema pristup
 *       500:
 *         description: Greška na serveru prilikom preuzimanja korisnika
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Failed to fetch users
 */