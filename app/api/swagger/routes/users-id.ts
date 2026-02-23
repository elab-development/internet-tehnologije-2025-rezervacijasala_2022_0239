/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Ažuriraj korisnika po ID-u
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID korisnika
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
 *                 example: Teofilović
 *               role:
 *                 type: string
 *                 example: ADMIN
 *                 description: Samo ADMIN može menjati rolu
 *     responses:
 *       200:
 *         description: Korisnik uspešno ažuriran
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: number
 *                   example: 1
 *                 firstName:
 *                   type: string
 *                   example: Jovan
 *                 lastName:
 *                   type: string
 *                   example: Teofilović
 *                 email:
 *                   type: string
 *                   example: jovan@example.com
 *                 role:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: ADMIN
 *       400:
 *         description: Neispravan ID ili nedostaju obavezna polja
 *       401:
 *         description: Neautorizovan korisnik
 *       403:
 *         description: Zabranjen pristup (nije ADMIN ili pokušava promeniti tuđu rolu)
 *       500:
 *         description: Greška na serveru
 * 
 *   delete:
 *     summary: Obriši korisnika po ID-u (zahteva ADMIN)
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID korisnika
 *     responses:
 *       200:
 *         description: Korisnik uspešno obrisan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User deleted
 *       400:
 *         description: Ne može obrisati sopstveni nalog ili korisnik ima rezervacije
 *       401:
 *         description: Neautorizovan korisnik
 *       403:
 *         description: Zabranjen pristup (nije ADMIN)
 *       404:
 *         description: Korisnik nije pronađen
 *       500:
 *         description: Greška na serveru
 */