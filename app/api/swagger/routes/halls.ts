/**
 * @swagger
 * /api/halls:
 *   get:
 *     tags:
 *       - Halls
 *     summary: Dohvati sve aktivne sale
 *     responses:
 *       200:
 *         description: Lista sala uspešno dohvaćena
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
 *                     example: Sala 1
 *                   description:
 *                     type: string
 *                     example: Velika konferencijska sala
 *                   capacity:
 *                     type: integer
 *                     example: 50
 *                   pricePerHour:
 *                     type: number
 *                     example: 1500
 *                   hasStage:
 *                     type: boolean
 *                     example: true
 *                   isClosed:
 *                     type: boolean
 *                     example: false
 *                   imageUrl:
 *                     type: string
 *                     example: https://example.com/image.jpg
 *                   city:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: Beograd
 *                   category:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                         example: 2
 *                       name:
 *                         type: string
 *                         example: Konferencijska
 *       500:
 *         description: Greška na serveru
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Neuspesno
 *   post:
 *     tags:
 *       - Halls
 *     summary: Kreiraj novu salu (zahteva MANAGER ili ADMIN rolu)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Sala 1
 *               description:
 *                 type: string
 *                 example: Velika konferencijska sala
 *               capacity:
 *                 type: integer
 *                 example: 50
 *               pricePerHour:
 *                 type: number
 *                 example: 1500
 *               cityId:
 *                 type: integer
 *                 example: 1
 *               categoryId:
 *                 type: integer
 *                 example: 2
 *               hasStage:
 *                 type: boolean
 *                 example: true
 *               isClosed:
 *                 type: boolean
 *                 example: false
 *               imageUrl:
 *                 type: string
 *                 example: https://example.com/image.jpg
 *     responses:
 *       201:
 *         description: Sala uspešno kreirana
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Hall created
 *                 hall:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: Sala 1
 *                     description:
 *                       type: string
 *                       example: Velika konferencijska sala
 *                     capacity:
 *                       type: integer
 *                       example: 50
 *                     pricePerHour:
 *                       type: number
 *                       example: 1500
 *                     hasStage:
 *                       type: boolean
 *                       example: true
 *                     isClosed:
 *                       type: boolean
 *                       example: false
 *                     imageUrl:
 *                       type: string
 *                       example: https://example.com/image.jpg
 *                     city:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: number
 *                           example: 1
 *                         name:
 *                           type: string
 *                           example: Beograd
 *                     category:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: number
 *                           example: 2
 *                         name:
 *                           type: string
 *                           example: Konferencijska
 *       400:
 *         description: Nedostaju obavezna polja ili su pogrešne vrednosti
 *       401:
 *         description: Nema pristup (nije MANAGER ili ADMIN)
 *       500:
 *         description: Greška na serveru prilikom kreiranja sale
 */