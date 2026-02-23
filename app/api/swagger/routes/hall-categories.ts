/**
 * @swagger
 * /api/hall-categories:
 *   get:
 *     summary: Dohvati sve kategorije sala
 *     responses:
 *       200:
 *         description: Lista kategorija uspešno dohvaćena
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
 *                   name:
 *                     type: string
 *                     example: Konferencijska
 *   post:
 *     summary: Kreiraj novu kategoriju sale (zahteva MANAGER ili ADMIN rolu)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Seminar sala
 *     responses:
 *       201:
 *         description: Kategorija uspešno kreirana
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Kategorija napravljena
 *                 category:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                       example: 2
 *                     name:
 *                       type: string
 *                       example: Seminar sala
 *       400:
 *         description: Nedostaje ime kategorije
 *       401:
 *         description: Nema pristup (nije MANAGER ili ADMIN)
 */
