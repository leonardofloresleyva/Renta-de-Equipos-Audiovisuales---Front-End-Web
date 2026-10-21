import { PrismaService } from "src/prisma/prisma.service";
import { ReservaRepository } from "../repositorios/reserva.repository";
import { FiltrosReserva, NuevaReserva, NuevoArticuloReserva, Reserva } from "src/dominio/entidades";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ReservaPrismaRepository implements ReservaRepository {
    constructor(private readonly prisma: PrismaService) { }

    async listar(filtros?: FiltrosReserva): Promise<Reserva[]> {
        if (!filtros) return this.prisma.reserva.findMany({ include: { direccionEntrega: true } }) as Promise<Reserva[]>;
        return this.prisma.reserva.findMany({
            where: {
                cliente: {
                    nombre: {
                        contains: filtros.nombreCliente
                    }
                },
                fechaEntrega: filtros.fechaEntrega,
                fechaRecoleccion: filtros.fechaRecoleccion,
                estado: filtros.estado
            },
            include: { direccionEntrega: true }
        }) as Promise<Reserva[]>;
    }

    async buscarPorId(id: number): Promise<Reserva | null> {
        return this.prisma.reserva.findUnique({
            where: { id: id }, include: { direccionEntrega: true }
        }) as Promise<Reserva | null>;
    }

    async buscarPorFolio(folio: string): Promise<Reserva | null> {
        return this.prisma.reserva.findUnique({
            where: { folio: folio }, include: { direccionEntrega: true }
        }) as Promise<Reserva | null>;
    }

    async buscarPorCliente(clienteId: number): Promise<Reserva[]> {
        return this.prisma.reserva.findMany({
            where: {
                cliente: { id: clienteId }
            }, include: {
                direccionEntrega: true
            }
        }) as Promise<Reserva[]>;
    }

    async crear(datosReserva: NuevaReserva, datosArticulos: NuevoArticuloReserva[]): Promise<Reserva> {
        return this.prisma.$transaction(async (tx) => {
            // Se crea la reserva
            const reserva = await tx.reserva.create({
                data: {
                    cliente: {
                        connect: { id: datosReserva.clienteId }
                    },
                    folio: datosReserva.folio,
                    montoTotal: datosReserva.montoTotal,
                    fechaEntrega: datosReserva.fechaEntrega,
                    fechaRecoleccion: datosReserva.fechaRecoleccion,
                    direccionEntrega: {
                        create: {
                            calle: datosReserva.calle,
                            colonia: datosReserva.colonia,
                            numero: datosReserva.numero
                        }
                    }
                }, include: {
                    direccionEntrega: true
                }
            });
            // Se crea cada artículo reservado (se inyecta el id de la reserva)
            for (const a of datosArticulos) {
                await tx.articuloReserva.create({
                    data: {
                        reservaId: reserva.id,
                        articuloId: a.articuloId,
                        cantidad: a.cantidad,
                        precioUnitario: a.precioUnitario,
                        subtotal: a.subtotal
                    }
                });
            }
            // Se crea el depósito de la garantía
            await tx.depositoGarantia.create({
                data: {
                    reservaId: reserva.id,
                    monto: datosReserva.montoGarantia
                }
            });
            // Se regresa la reserva
            return reserva;

        }) as Promise<Reserva>;
    }

    async entregar(id: number): Promise<Reserva | null> {
        const reserva = await this.prisma.reserva.findUnique({ where: { id } });
        if (!reserva) return null;
        return this.prisma.reserva.update({
            where: { id },
            data: {
                estado: "entregada"
            }, include: {
                direccionEntrega: true
            }
        }) as Promise<Reserva>;
    }

    async recolectar(id: number): Promise<Reserva | null> {
        const reserva = await this.prisma.reserva.findUnique({ where: { id } });
        if (!reserva) return null;
        return this.prisma.reserva.update({
            where: { id },
            data: {
                estado: "devuelta"
            }, include: {
                direccionEntrega: true
            }
        }) as Promise<Reserva>;
    }

    async cancelar(id: number): Promise<Reserva | null> {
        const reserva = await this.prisma.reserva.findUnique({ where: { id } });
        if (!reserva) return null;
        return this.prisma.$transaction(async (tx) => {
            // Aprueba la solicitud asociada a la reserva (si existe)
            if (await tx.solicitudCancelacion.findUnique({ where: { reservaId: reserva.id } })) {
                await tx.solicitudCancelacion.update({
                    where: { reservaId: reserva.id },
                    data: {
                        estadoSolicitud: "aprobada"
                    }
                });
            }
            // Cancela la reserva y la devuelve
            return tx.reserva.update({
                where: { id },
                data: {
                    estado: "cancelada"
                }, include: {
                    direccionEntrega: true
                }
            });
        }) as Promise<Reserva>;
    }


}