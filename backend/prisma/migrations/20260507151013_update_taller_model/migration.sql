/*
  Warnings:

  - Added the required column `direccion` to the `Taller` table without a default value. This is not possible if the table is not empty.
  - Added the required column `latitud` to the `Taller` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitud` to the `Taller` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Taller` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Taller` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `descripcion` TEXT NULL,
    ADD COLUMN `direccion` VARCHAR(191) NOT NULL,
    ADD COLUMN `email` VARCHAR(191) NULL,
    ADD COLUMN `latitud` DOUBLE NOT NULL,
    ADD COLUMN `logo` VARCHAR(191) NULL,
    ADD COLUMN `longitud` DOUBLE NOT NULL,
    ADD COLUMN `puntuacion` DOUBLE NOT NULL DEFAULT 0.0,
    ADD COLUMN `telefono` VARCHAR(191) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    ADD COLUMN `web` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `Vehiculo` ADD COLUMN `enVenta` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `precio` DOUBLE NULL;

-- CreateTable
CREATE TABLE `ForoTema` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `titulo` VARCHAR(191) NOT NULL,
    `contenido` TEXT NOT NULL,
    `categoria` VARCHAR(191) NOT NULL,
    `fecha_creacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `usuarioId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ForoRespuesta` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `contenido` TEXT NOT NULL,
    `fecha_creacion` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `temaId` INTEGER NOT NULL,
    `usuarioId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ForoTema` ADD CONSTRAINT `ForoTema_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ForoRespuesta` ADD CONSTRAINT `ForoRespuesta_temaId_fkey` FOREIGN KEY (`temaId`) REFERENCES `ForoTema`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ForoRespuesta` ADD CONSTRAINT `ForoRespuesta_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
