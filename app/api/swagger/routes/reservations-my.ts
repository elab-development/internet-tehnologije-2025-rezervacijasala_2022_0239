/**
 * @swagger
 * /api/reservations/my:
 *   get:
 *     tags:
 *       - Reservations
 *     summary: Dohvati sve rezervacije trenutno ulogovanog korisnika
 *     responses:
 *       200:
 *         description: Lista rezervacija uspešno dohvaćena
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
 *                   hall:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: Sala 1
 *                   user:
 *                     type: object
 *                     properties:
 *                       firstName:
 *                         type: string
 *                         example: Jovan
 *                       lastName:
 *                         type: string
 *                         example: Teofilović
 *                       email:
 *                         type: string
 *                         example: jovan@example.com
 *                   startDateTime:
 *                     type: string
 *                     format: date-time
 *                     example: 2026-03-20T10:00:00Z
 *                   endDateTime:
 *                     type: string
 *                     format: date-time
 *                     example: 2026-03-20T12:00:00Z
 *                   numberOfGuests:
 *                     type: integer
 *                     example: 20
 *                   status:
 *                     type: string
 *                     example: PENDING
 *       401:
 *         description: Neautorizovan korisnik
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Unauthorized
 */
