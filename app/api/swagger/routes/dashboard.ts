/**
 * @swagger
 * /api/dashboard:
 *   get:
 *     summary: Dohvati statistiku dashboard-a
 *     description: Vraća top 5 najpopularnijih sala i mesečnu statistiku broja rezervacija i prihoda
 *     responses:
 *       200:
 *         description: Statistika uspešno dohvaćena
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 popularHalls:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         example: Sala 1
 *                       count:
 *                         type: integer
 *                         example: 12
 *                 monthlyData:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       month:
 *                         type: string
 *                         example: Jan
 *                       count:
 *                         type: integer
 *                         example: 5
 *                       revenue:
 *                         type: number
 *                         example: 2500
 *       500:
 *         description: Greška na serveru prilikom učitavanja statistike
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Neuspešno učitavanje podataka
 */
