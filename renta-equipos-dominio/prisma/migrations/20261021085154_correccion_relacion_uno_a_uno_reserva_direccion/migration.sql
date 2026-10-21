/*
  Warnings:

  - A unique constraint covering the columns `[direccionEntregaId]` on the table `reservas` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `reservas_direccionEntregaId_key` ON `reservas`(`direccionEntregaId`);
