/*
  Warnings:

  - You are about to drop the `administrador` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ajusteexistencia` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `articulo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `articuloreserva` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `bitacorareserva` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `cliente` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `depositogarantia` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `direccion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `inspeccionpieza` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `piezasmantenimiento` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `reserva` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `solicitudcancelacion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `usuario` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `administrador` DROP FOREIGN KEY `Administrador_id_fkey`;

-- DropForeignKey
ALTER TABLE `ajusteexistencia` DROP FOREIGN KEY `AjusteExistencia_adminId_fkey`;

-- DropForeignKey
ALTER TABLE `ajusteexistencia` DROP FOREIGN KEY `AjusteExistencia_articuloId_fkey`;

-- DropForeignKey
ALTER TABLE `articuloreserva` DROP FOREIGN KEY `ArticuloReserva_articuloId_fkey`;

-- DropForeignKey
ALTER TABLE `articuloreserva` DROP FOREIGN KEY `ArticuloReserva_reservaId_fkey`;

-- DropForeignKey
ALTER TABLE `bitacorareserva` DROP FOREIGN KEY `BitacoraReserva_reservaId_fkey`;

-- DropForeignKey
ALTER TABLE `cliente` DROP FOREIGN KEY `Cliente_direccionId_fkey`;

-- DropForeignKey
ALTER TABLE `cliente` DROP FOREIGN KEY `Cliente_id_fkey`;

-- DropForeignKey
ALTER TABLE `depositogarantia` DROP FOREIGN KEY `DepositoGarantia_reservaId_fkey`;

-- DropForeignKey
ALTER TABLE `inspeccionpieza` DROP FOREIGN KEY `InspeccionPieza_articuloReservadoId_fkey`;

-- DropForeignKey
ALTER TABLE `inspeccionpieza` DROP FOREIGN KEY `InspeccionPieza_bitacoraReservaId_fkey`;

-- DropForeignKey
ALTER TABLE `piezasmantenimiento` DROP FOREIGN KEY `PiezasMantenimiento_adminId_fkey`;

-- DropForeignKey
ALTER TABLE `piezasmantenimiento` DROP FOREIGN KEY `PiezasMantenimiento_articuloId_fkey`;

-- DropForeignKey
ALTER TABLE `reserva` DROP FOREIGN KEY `Reserva_clienteId_fkey`;

-- DropForeignKey
ALTER TABLE `reserva` DROP FOREIGN KEY `Reserva_direccionEntregaId_fkey`;

-- DropForeignKey
ALTER TABLE `solicitudcancelacion` DROP FOREIGN KEY `SolicitudCancelacion_clienteId_fkey`;

-- DropForeignKey
ALTER TABLE `solicitudcancelacion` DROP FOREIGN KEY `SolicitudCancelacion_reservaId_fkey`;

-- DropTable
DROP TABLE `administrador`;

-- DropTable
DROP TABLE `ajusteexistencia`;

-- DropTable
DROP TABLE `articulo`;

-- DropTable
DROP TABLE `articuloreserva`;

-- DropTable
DROP TABLE `bitacorareserva`;

-- DropTable
DROP TABLE `cliente`;

-- DropTable
DROP TABLE `depositogarantia`;

-- DropTable
DROP TABLE `direccion`;

-- DropTable
DROP TABLE `inspeccionpieza`;

-- DropTable
DROP TABLE `piezasmantenimiento`;

-- DropTable
DROP TABLE `reserva`;

-- DropTable
DROP TABLE `solicitudcancelacion`;

-- DropTable
DROP TABLE `usuario`;

-- CreateTable
CREATE TABLE `usuarios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(256) NOT NULL,
    `passwordHash` VARCHAR(256) NOT NULL,
    `rol` ENUM('cliente', 'administrador') NOT NULL DEFAULT 'cliente',
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `usuarios_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `clientes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuarioId` INTEGER NOT NULL,
    `nombre` VARCHAR(300) NOT NULL,
    `telefono` VARCHAR(20) NOT NULL,
    `direccionId` INTEGER NOT NULL,

    UNIQUE INDEX `clientes_usuarioId_key`(`usuarioId`),
    UNIQUE INDEX `clientes_direccionId_key`(`direccionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `administradores` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuarioId` INTEGER NOT NULL,
    `nombre` VARCHAR(300) NOT NULL,
    `telefono` VARCHAR(20) NULL,

    UNIQUE INDEX `administradores_usuarioId_key`(`usuarioId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `direcciones` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `numero` VARCHAR(20) NOT NULL,
    `calle` VARCHAR(100) NOT NULL,
    `colonia` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reservas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `folio` VARCHAR(100) NOT NULL,
    `montoTotal` DOUBLE NOT NULL,
    `fechaEntrega` DATE NOT NULL,
    `fechaRecoleccion` DATE NOT NULL,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `estado` ENUM('apartada', 'entregada', 'devuelta', 'cancelada') NOT NULL DEFAULT 'apartada',
    `clienteId` INTEGER NOT NULL,
    `direccionEntregaId` INTEGER NOT NULL,

    UNIQUE INDEX `reservas_folio_key`(`folio`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `solicitudes_cancelacion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fechaSolicitud` DATE NOT NULL,
    `estadoSolicitud` ENUM('pendiente', 'aprobada', 'rechazada') NOT NULL DEFAULT 'pendiente',
    `clienteId` INTEGER NOT NULL,
    `reservaId` INTEGER NOT NULL,

    UNIQUE INDEX `solicitudes_cancelacion_reservaId_key`(`reservaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `depositos_garantia` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `monto` DOUBLE NOT NULL,
    `confirmado` BOOLEAN NOT NULL DEFAULT false,
    `devuelto` BOOLEAN NOT NULL DEFAULT false,
    `reservaId` INTEGER NOT NULL,

    UNIQUE INDEX `depositos_garantia_reservaId_key`(`reservaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bitacoras_reserva` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fechaHoraRecolectada` DATETIME(3) NULL,
    `fechaHoraEntregada` DATETIME(3) NOT NULL,
    `montoTotalGarantia` DOUBLE NOT NULL,
    `reservaId` INTEGER NOT NULL,

    UNIQUE INDEX `bitacoras_reserva_reservaId_key`(`reservaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `articulos_reserva` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cantidad` INTEGER NOT NULL,
    `precioUnitario` DOUBLE NOT NULL,
    `subtotal` DOUBLE NOT NULL,
    `articuloId` INTEGER NOT NULL,
    `reservaId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inspecciones_piezas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `piezasCompletas` INTEGER NOT NULL,
    `piezasDaniadas` INTEGER NULL,
    `piezasFaltantes` INTEGER NULL,
    `montoGarantia` DOUBLE NULL,
    `articuloReservadoId` INTEGER NOT NULL,
    `bitacoraReservaId` INTEGER NOT NULL,

    UNIQUE INDEX `inspecciones_piezas_articuloReservadoId_key`(`articuloReservadoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `articulos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(200) NOT NULL,
    `descripcion` TEXT NOT NULL,
    `precioPorDia` DOUBLE NOT NULL,
    `existencias` INTEGER NOT NULL,
    `categoria` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fotografias_url` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `url` VARCHAR(500) NOT NULL,
    `articuloId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ajustes_existencias` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cantidad` INTEGER NOT NULL,
    `esIncremento` BOOLEAN NOT NULL,
    `motivo` ENUM('perdida', 'adquisicion', 'deterioro') NOT NULL,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `articuloId` INTEGER NOT NULL,
    `adminId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `piezas_mantenimiento` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cantidad` INTEGER NOT NULL,
    `fechaInicio` DATE NOT NULL,
    `fechaTermino` DATE NOT NULL,
    `motivo` ENUM('reparacion', 'limpieza') NOT NULL,
    `articuloId` INTEGER NOT NULL,
    `adminId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `clientes` ADD CONSTRAINT `clientes_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `clientes` ADD CONSTRAINT `clientes_direccionId_fkey` FOREIGN KEY (`direccionId`) REFERENCES `direcciones`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `administradores` ADD CONSTRAINT `administradores_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reservas` ADD CONSTRAINT `reservas_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `clientes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reservas` ADD CONSTRAINT `reservas_direccionEntregaId_fkey` FOREIGN KEY (`direccionEntregaId`) REFERENCES `direcciones`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `solicitudes_cancelacion` ADD CONSTRAINT `solicitudes_cancelacion_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `clientes`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `solicitudes_cancelacion` ADD CONSTRAINT `solicitudes_cancelacion_reservaId_fkey` FOREIGN KEY (`reservaId`) REFERENCES `reservas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `depositos_garantia` ADD CONSTRAINT `depositos_garantia_reservaId_fkey` FOREIGN KEY (`reservaId`) REFERENCES `reservas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bitacoras_reserva` ADD CONSTRAINT `bitacoras_reserva_reservaId_fkey` FOREIGN KEY (`reservaId`) REFERENCES `reservas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `articulos_reserva` ADD CONSTRAINT `articulos_reserva_articuloId_fkey` FOREIGN KEY (`articuloId`) REFERENCES `articulos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `articulos_reserva` ADD CONSTRAINT `articulos_reserva_reservaId_fkey` FOREIGN KEY (`reservaId`) REFERENCES `reservas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inspecciones_piezas` ADD CONSTRAINT `inspecciones_piezas_articuloReservadoId_fkey` FOREIGN KEY (`articuloReservadoId`) REFERENCES `articulos_reserva`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inspecciones_piezas` ADD CONSTRAINT `inspecciones_piezas_bitacoraReservaId_fkey` FOREIGN KEY (`bitacoraReservaId`) REFERENCES `bitacoras_reserva`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `fotografias_url` ADD CONSTRAINT `fotografias_url_articuloId_fkey` FOREIGN KEY (`articuloId`) REFERENCES `articulos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ajustes_existencias` ADD CONSTRAINT `ajustes_existencias_articuloId_fkey` FOREIGN KEY (`articuloId`) REFERENCES `articulos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ajustes_existencias` ADD CONSTRAINT `ajustes_existencias_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `administradores`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `piezas_mantenimiento` ADD CONSTRAINT `piezas_mantenimiento_articuloId_fkey` FOREIGN KEY (`articuloId`) REFERENCES `articulos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `piezas_mantenimiento` ADD CONSTRAINT `piezas_mantenimiento_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `administradores`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
