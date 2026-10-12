import { ARTICULOS_RESERVA, DEPOSITOS_GARANTIA, RESERVAS } from "src/datos/renta.equipo.seed";
import { ReservaRepository } from "../repositorios/reserva.repository";
import { DepositoGarantia, NuevaReserva, NuevoArticuloReserva, Reserva } from "src/dominio/entidades";

export class ReservaMemoriaRepository implements ReservaRepository {

    private proximoId = 3;
    private proximoIdArticulos = 6;
    private proximoIdDireccion = 1;
    private proximoGarantiaId = 3;

    async listar(): Promise<Reserva[]> {
        return [...RESERVAS.values()];
    }

    async buscarPorId(id: number): Promise<Reserva | null> {
        const reserva = RESERVAS.get(id);
        return (reserva) ? reserva : null;
    }

    async buscarPorFolio(folio: string): Promise<Reserva | null> {
        const reserva = [...RESERVAS.values()].find((r) => r.folio === folio);
        return (reserva) ? reserva : null;
    }

    async buscarPorCliente(clienteId: number): Promise<Reserva[]> {
        return [...RESERVAS.values()].filter((r) => r.clienteId === clienteId);
    }

    async crear(datosReserva: NuevaReserva, datosArticulos: NuevoArticuloReserva[]): Promise<Reserva> {
        // Se contruye la nueva reserva
        const id = this.proximoId++;
        const nuevaReserva: Reserva = {
            id,
            clienteId: datosReserva.clienteId,
            folio: datosReserva.folio,
            montoTotal: datosReserva.montoTotal,
            fechaEntrega: datosReserva.fechaEntrega,
            fechaRecoleccion: datosReserva.fechaRecoleccion,
            creadoEn: new Date(),
            estado: 'apartada',
            direccionEntrega: {
                id: this.proximoIdDireccion++,
                numero: datosReserva.numero,
                calle: datosReserva.calle,
                colonia: datosReserva.colonia
            }
        };
        // Se contruye y se guarda el nuevo depósito de garantía
        const depositoGarantia: DepositoGarantia = {
            id: this.proximoGarantiaId++,
            reservaId: nuevaReserva.id,
            monto: datosReserva.montoGarantia,
            confirmado: false,
            devuelto: false
        };
        DEPOSITOS_GARANTIA.set(depositoGarantia.id, depositoGarantia);
        // Se contruyen y se guardan los artículos reservados
        datosArticulos.forEach((a) => {
            const id = this.proximoIdArticulos++;
            const nuevoArticuloReserva = {
                id,
                articuloId: a.articuloId,
                reservaId: nuevaReserva.id,
                cantidad: a.cantidad,
                precioUnitario: a.precioUnitario,
                subtotal: a.subtotal
            };
            ARTICULOS_RESERVA.set(id, nuevoArticuloReserva);
        });
        // Finalmente, se guarda la nueva reserva
        RESERVAS.set(id, nuevaReserva);
        return nuevaReserva;
    }

    async actualizar(id: number, datos: Partial<Reserva>): Promise<Reserva | null> {
        const reservaExistente = RESERVAS.get(id);
        if (!reservaExistente) return null;

        const reservaActualizada: Reserva = {
            ...reservaExistente,
            ...datos,
            id: reservaExistente.id,
            direccionEntrega: datos.direccionEntrega
                ? { ...reservaExistente.direccionEntrega, ...datos.direccionEntrega }
                : reservaExistente.direccionEntrega,
        };
        RESERVAS.set(id, reservaActualizada);
        return {
            ...reservaActualizada,
            direccionEntrega: { ...reservaActualizada.direccionEntrega },
        };
    }

    async eliminar(id: number): Promise<Reserva | null> {
        const reserva = RESERVAS.get(Number(id));
        if (!reserva) return null;

        reserva.estado = 'cancelada';
        RESERVAS.set(reserva.id, reserva);
        return reserva;
    }

    async obtenerPiezasReservadas(articuloId: number): Promise<number> {
        let piezasReservadas = 0;
        [...ARTICULOS_RESERVA.values()]
            .filter((a) => a.articuloId === articuloId && (RESERVAS.get(a.reservaId)?.estado ?? 'apartada') === 'apartada')
            .forEach((a) => piezasReservadas += a.cantidad);
        return piezasReservadas;
    }

    async obtenerPiezasReservadasPeriodo(articuloId: number, fechaInicio: Date, fechaFin: Date): Promise<number> {
        let piezasReservadas = 0;
        const reservados = [...ARTICULOS_RESERVA.values()]
            .filter((a) => a.articuloId === articuloId &&
                (RESERVAS.get(a.reservaId)?.estado ?? 'apartada') === 'apartada' &&
                (
                    (
                        fechaInicio >= (RESERVAS.get(a.reservaId)?.fechaEntrega ?? new Date()) ||
                        fechaInicio <= (RESERVAS.get(a.reservaId)?.fechaRecoleccion ?? new Date())
                    ) ||
                    (
                        fechaFin >= (RESERVAS.get(a.reservaId)?.fechaEntrega ?? new Date()) ||
                        fechaFin <= (RESERVAS.get(a.reservaId)?.fechaRecoleccion ?? new Date())
                    )
                ));
        reservados.forEach((a) => piezasReservadas += a.cantidad);
        return piezasReservadas;
    }
}