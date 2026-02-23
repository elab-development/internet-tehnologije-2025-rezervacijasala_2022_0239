/**
 * @swagger
 * /api/cities:
 *   get:
 *     tags:
 *       - Cities
 *     summary: Dohvati sve gradove
 *     responses:
 *       200:
 *         description: Lista gradova uspešno dohvaćena
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
 *                     example: Beograd
 *   post:
 *     tags:
 *       - Cities
 *     summary: Kreiraj novi grad (zahteva MANAGER ili ADMIN rolu)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Novi Sad
 *     responses:
 *       201:
 *         description: Grad uspešno kreiran
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Grad kreiran
 *                 city:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: number
 *                       example: 2
 *                     name:
 *                       type: string
 *                       example: Novi Sad
 *       400:
 *         description: Nije prosleđeno ime grada
 *       401:
 *         description: Nema pristup (ako nije MANAGER ili ADMIN)
 */

/**
 * @swagger
 * /api/cities/{id}:
 *   delete:
 *     tags:
 *       - Cities
 *     summary: Obriši grad po ID-u (zahteva MANAGER ili ADMIN rolu)
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID grada koji se briše
 *     responses:
 *       200:
 *         description: Grad uspešno obrisan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Grad uspešno obrisan
 *       400:
 *         description: Neispravan ID ili grad ima povezane sale
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Grad ima povezane sale i ne može biti obrisan.
 *       401:
 *         description: Nema pristup (nije MANAGER ili ADMIN)
 *       500:
 *         description: Greška na serveru pri brisanju grada
 */