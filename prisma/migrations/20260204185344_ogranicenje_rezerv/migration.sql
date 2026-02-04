/*
  Warnings:

  - A unique constraint covering the columns `[hallId,startDateTime,endDateTime]` on the table `Reservation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Reservation_hallId_startDateTime_endDateTime_key` ON `Reservation`(`hallId`, `startDateTime`, `endDateTime`);
