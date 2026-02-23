/**
 * @swagger
 * /api/users/{id}/password:
 *   put:
 *     tags:
 *       - Users
 *     summary: Promeni ili resetuj lozinku korisnika
 *     description: 
 *       - ADMIN može resetovati lozinku bilo kog korisnika bez stare lozinke.
 *       - Korisnik može promeniti sopstvenu lozinku, ali mora uneti trenutnu lozinku.
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
 *               oldPassword:
 *                 type: string
 *                 example: staraSifra123
 *                 description: Trenutna lozinka (obavezno za korisnike koji nisu ADMIN)
 *               newPassword:
 *                 type: string
 *                 example: novaSifra456
 *                 description: Nova lozinka
 *     responses:
 *       200:
 *         description: Lozinka uspešno promenjena ili resetovana
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Šifra uspješno promijenjena"
 *       400:
 *         description: Nedostaju obavezna polja ili neispravan ID korisnika
 *       401:
 *         description: Neautorizovan pristup ili stara lozinka nije ispravna
 *       403:
 *         description: Zabranjen pristup (korisnik pokušava promeniti tuđu lozinku)
 *       404:
 *         description: Korisnik nije pronađen
 *       500:
 *         description: Greška na serveru
 */