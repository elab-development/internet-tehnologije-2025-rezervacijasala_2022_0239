/**
 * @swagger
 * /api/reservations:
 *   post:
 *     tags:
 *       - Reservations
 *     summary: Kreiraj novu rezervaciju (zahteva USER, MANAGER ili ADMIN rolu)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               hallId:
 *                 type: integer
 *                 example: 1
 *                 description: ID sale
 *               startDateTime:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-03-20T10:00:00Z
 *               endDateTime:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-03-20T12:00:00Z
 *               numberOfGuests:
 *                 type: integer
 *                 example: 20
 *     responses:
 *       201:
 *         description: Rezervacija uspešno kreirana
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Reservation created
 *                 reservation:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                       example: 1
 *                     hallId:
 *                       type: number
 *                       example: 1
 *                     userId:
 *                       type: number
 *                       example: 5
 *                     startDateTime:
 *                       type: string
 *                       format: date-time
 *                       example: 2026-03-20T10:00:00Z
 *                     endDateTime:
 *                       type: string
 *                       format: date-time
 *                       example: 2026-03-20T12:00:00Z
 *                     numberOfGuests:
 *                       type: integer
 *                       example: 20
 *                     status:
 *                       type: string
 *                       example: PENDING
 *       400:
 *         description: Nedostaju polja ili pogrešni datumi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Missing fields
 *       401:
 *         description: Nema pristup (neautorizovan korisnik)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Unauthorized
 *       404:
 *         description: Sala ne postoji
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Sala ne postoji
 *       409:
 *         description: Konflikt termina (sala već rezervisana)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Sala je već rezervisana u tom terminu
 *
 *   get:
 *     tags:
 *       - Reservations
 *     summary: Dohvati sve rezervacije (zahteva ADMIN ili MANAGER rolu)
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
 *         description: Nema pristup (nije ADMIN ili MANAGER)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Nema pristup
 */