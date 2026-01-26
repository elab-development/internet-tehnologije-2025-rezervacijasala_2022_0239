/*
  Warnings:

  - You are about to drop the column `pricePerEvent` on the `hall` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `user` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `Hall` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cityId` to the `Hall` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pricePerHour` to the `Hall` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `hall` DROP COLUMN `pricePerEvent`,
    ADD COLUMN `categoryId` INTEGER NOT NULL,
    ADD COLUMN `cityId` INTEGER NOT NULL,
    ADD COLUMN `hasStage` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `isClosed` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `pricePerHour` DOUBLE NOT NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `phone`;

-- CreateTable
CREATE TABLE `City` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `City_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HallCategory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `HallCategory_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Hall_cityId_idx` ON `Hall`(`cityId`);

-- CreateIndex
CREATE INDEX `Hall_categoryId_idx` ON `Hall`(`categoryId`);

-- AddForeignKey
ALTER TABLE `Hall` ADD CONSTRAINT `Hall_cityId_fkey` FOREIGN KEY (`cityId`) REFERENCES `City`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Hall` ADD CONSTRAINT `Hall_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `HallCategory`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
