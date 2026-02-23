/**
 * @swagger
 * /api/auth:
 *   post:
 *     summary: Registracija novog korisnika
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Jovan
 *               lastName:
 *                 type: string
 *                 example: Teofilovic
 *               email:
 *                 type: string
 *                 example: jovan@example.com
 *               password:
 *                 type: string
 *                 example: mysecretpassword
 *     responses:
 *       200:
 *         description: Korisnik uspešno kreiran
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Korisnik kreiran
 *                 user:
 *                   type: object
 *       400:
 *         description: Nedostaju obavezna polja
 *       409:
 *         description: Korisnik već postoji
 *       500:
 *         description: Greška na serveru ili rola nije pronađena
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Logovanje korisnika
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: jovan@example.com
 *               password:
 *                 type: string
 *                 example: mysecretpassword
 *     responses:
 *       200:
 *         description: Uspešno logovanje
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Uspesno logovanje
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: 1
 *                     firstName:
 *                       type: string
 *                       example: Jovan
 *                     lastName:
 *                       type: string
 *                       example: Teofilovic
 *                     email:
 *                       type: string
 *                       example: jovan@example.com
 *                     role:
 *                       type: string
 *                       example: USER
 *       400:
 *         description: Nedostaju obavezna polja (email i password)
 *       401:
 *         description: Neispravan email ili password
 *       500:
 *         description: Greška na serveru
 */
