/**
 * @swagger
 * /api/halls/admin:
 *   get:
 *     summary: Dohvati sve sale (samo za MANAGER ili ADMIN)
 *     description: Vraća sve sale uključujući njihove gradove i kategorije. Pristup je ograničen na MANAGER i ADMIN.
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
 *       401:
 *         description: Nema pristup (nije MANAGER ili ADMIN)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Nema pristup
 *       500:
 *         description: Greška na serveru
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Server error
 */
