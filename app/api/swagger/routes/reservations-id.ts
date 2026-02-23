/**
 * @swagger
 * /api/reservations/{id}:
 *   get:
 *     tags:
 *       - Reservations
 *     summary: Dohvati rezervaciju po ID-u
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID rezervacije
 *     responses:
 *       200:
 *         description: Rezervacija je uspešno dohvaćena
 *       404:
 *         description: Rezervacija nije pronađena
 */