-- CreateTable
CREATE TABLE `Usuario` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Usuario_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Cliente` (
    `id` INTEGER NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `telefono` VARCHAR(191) NOT NULL,
    `direccionId` INTEGER NOT NULL,

    UNIQUE INDEX `Cliente_direccionId_key`(`direccionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Administrador` (
    `id` INTEGER NOT NULL,
    `nombre` VARCHAR(191) NOT NULL,
    `telefono` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Direccion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `numero` VARCHAR(191) NOT NULL,
    `calle` VARCHAR(191) NOT NULL,
    `colonia` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Reserva` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `folio` VARCHAR(191) NOT NULL,
    `montoTotal` DOUBLE NOT NULL,
    `fechaEntrega` DATE NOT NULL,
    `fechaRecoleccion` DATE NOT NULL,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `estado` ENUM('APARTADA', 'ENTREGADA', 'DEVUELTA', 'CANCELADA') NOT NULL,
    `clienteId` INTEGER NOT NULL,
    `direccionEntregaId` INTEGER NOT NULL,

    UNIQUE INDEX `Reserva_folio_key`(`folio`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SolicitudCancelacion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fechaSolicitud` DATE NOT NULL,
    `estadoSolicitud` ENUM('PENDIENTE', 'APROBADA', 'RECHAZADA') NOT NULL,
    `clienteId` INTEGER NOT NULL,
    `reservaId` INTEGER NOT NULL,

    UNIQUE INDEX `SolicitudCancelacion_reservaId_key`(`reservaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DepositoGarantia` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `monto` DOUBLE NOT NULL,
    `confirmado` BOOLEAN NOT NULL DEFAULT false,
    `devuelto` BOOLEAN NOT NULL DEFAULT false,
    `reservaId` INTEGER NOT NULL,

    UNIQUE INDEX `DepositoGarantia_reservaId_key`(`reservaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BitacoraReserva` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fechaHoraRecolectada` DATETIME(3) NULL,
    `fechaHoraEntregada` DATETIME(3) NOT NULL,
    `montoTotalGarantia` DOUBLE NOT NULL,
    `reservaId` INTEGER NOT NULL,

    UNIQUE INDEX `BitacoraReserva_reservaId_key`(`reservaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ArticuloReserva` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cantidad` INTEGER NOT NULL,
    `precioUnitario` DOUBLE NOT NULL,
    `subtotal` DOUBLE NOT NULL,
    `articuloId` INTEGER NOT NULL,
    `reservaId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `InspeccionPieza` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `piezasCompletas` INTEGER NOT NULL,
    `piezasDaniadas` INTEGER NULL,
    `piezasFaltantes` INTEGER NULL,
    `montoGarantia` DOUBLE NULL,
    `articuloReservadoId` INTEGER NOT NULL,
    `bitacoraReservaId` INTEGER NOT NULL,

    UNIQUE INDEX `InspeccionPieza_articuloReservadoId_key`(`articuloReservadoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Articulo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(191) NOT NULL,
    `descripcion` TEXT NOT NULL,
    `precioPorDia` DOUBLE NOT NULL,
    `existencias` INTEGER NOT NULL,
    `categoria` VARCHAR(191) NOT NULL,
    `fotografiasUrl` JSON NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AjusteExistencia` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cantidad` INTEGER NOT NULL,
    `esIncremento` BOOLEAN NOT NULL,
    `motivo` ENUM('PERDIDA', 'ADQUISICION', 'DETERIORO') NOT NULL,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `articuloId` INTEGER NOT NULL,
    `adminId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PiezasMantenimiento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cantidad` INTEGER NOT NULL,
    `fechaInicio` DATE NOT NULL,
    `fechaTermino` DATE NOT NULL,
    `motivo` ENUM('REPARACION', 'LIMPIEZA') NOT NULL,
    `articuloId` INTEGER NOT NULL,
    `adminId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Cliente` ADD CONSTRAINT `Cliente_id_fkey` FOREIGN KEY (`id`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Cliente` ADD CONSTRAINT `Cliente_direccionId_fkey` FOREIGN KEY (`direccionId`) REFERENCES `Direccion`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Administrador` ADD CONSTRAINT `Administrador_id_fkey` FOREIGN KEY (`id`) REFERENCES `Usuario`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reserva` ADD CONSTRAINT `Reserva_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `Cliente`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reserva` ADD CONSTRAINT `Reserva_direccionEntregaId_fkey` FOREIGN KEY (`direccionEntregaId`) REFERENCES `Direccion`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SolicitudCancelacion` ADD CONSTRAINT `SolicitudCancelacion_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `Cliente`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SolicitudCancelacion` ADD CONSTRAINT `SolicitudCancelacion_reservaId_fkey` FOREIGN KEY (`reservaId`) REFERENCES `Reserva`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DepositoGarantia` ADD CONSTRAINT `DepositoGarantia_reservaId_fkey` FOREIGN KEY (`reservaId`) REFERENCES `Reserva`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BitacoraReserva` ADD CONSTRAINT `BitacoraReserva_reservaId_fkey` FOREIGN KEY (`reservaId`) REFERENCES `Reserva`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ArticuloReserva` ADD CONSTRAINT `ArticuloReserva_articuloId_fkey` FOREIGN KEY (`articuloId`) REFERENCES `Articulo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ArticuloReserva` ADD CONSTRAINT `ArticuloReserva_reservaId_fkey` FOREIGN KEY (`reservaId`) REFERENCES `Reserva`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InspeccionPieza` ADD CONSTRAINT `InspeccionPieza_articuloReservadoId_fkey` FOREIGN KEY (`articuloReservadoId`) REFERENCES `ArticuloReserva`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InspeccionPieza` ADD CONSTRAINT `InspeccionPieza_bitacoraReservaId_fkey` FOREIGN KEY (`bitacoraReservaId`) REFERENCES `BitacoraReserva`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AjusteExistencia` ADD CONSTRAINT `AjusteExistencia_articuloId_fkey` FOREIGN KEY (`articuloId`) REFERENCES `Articulo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AjusteExistencia` ADD CONSTRAINT `AjusteExistencia_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `Administrador`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PiezasMantenimiento` ADD CONSTRAINT `PiezasMantenimiento_articuloId_fkey` FOREIGN KEY (`articuloId`) REFERENCES `Articulo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PiezasMantenimiento` ADD CONSTRAINT `PiezasMantenimiento_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `Administrador`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
