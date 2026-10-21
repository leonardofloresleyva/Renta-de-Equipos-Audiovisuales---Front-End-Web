-- CreateTable
CREATE TABLE `bitacoras_reserva` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `reservaId` INTEGER NOT NULL,
    `fechaHoraEntregada` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fechaHoraRecolectada` DATETIME(3) NULL,
    `montoTotalGarantia` DECIMAL(10, 2) NOT NULL,

    UNIQUE INDEX `bitacoras_reserva_reservaId_key`(`reservaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inspecciones_pieza` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `articuloReservadoId` INTEGER NOT NULL,
    `bitacoraReservaId` INTEGER NOT NULL,
    `piezasCompletas` INTEGER NOT NULL,
    `piezasDaniadas` INTEGER NULL,
    `piezasFaltantes` INTEGER NULL,
    `montoGarantia` DECIMAL(10, 2) NULL,

    INDEX `inspecciones_pieza_articuloReservadoId_idx`(`articuloReservadoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `inspecciones_pieza` ADD CONSTRAINT `inspecciones_pieza_bitacoraReservaId_fkey` FOREIGN KEY (`bitacoraReservaId`) REFERENCES `bitacoras_reserva`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
