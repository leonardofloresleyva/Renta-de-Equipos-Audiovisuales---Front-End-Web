import { ARTICULOS, ARTICULOS_RESERVA, PIEZAS_MANTENIMIENTO, RESERVAS } from "src/datos/renta.equipo.seed";
import { DisponibilidadRepository } from "../repo/disponibilidad.repository";
import { Articulo } from "src/dominio/entidades";

export class DisponibilidadMemoriaRepository implements DisponibilidadRepository {

    async obtenerExistenciasArticulo(id: number): Promise<number | null> {
        const articulo = ARTICULOS.get(id);
        return (articulo) ? articulo.existencias : null;
    }

    async obtenerPiezasMantenimiento(articuloId: number): Promise<number> {
        let cantidadPiezas = 0;
        [...PIEZAS_MANTENIMIENTO.values()].filter((p) => p.articuloId === articuloId).forEach((p) => cantidadPiezas += p.cantidad);
        return cantidadPiezas;
    }

    async obtenerPiezasMantenimientoPeriodo(articuloId: number, fechaInicio: Date, fechaFin: Date): Promise<number> {
        let cantidadPiezas = 0;
        const piezas = [...PIEZAS_MANTENIMIENTO.values()]
            .filter((p) => p.articuloId === articuloId && (
                (fechaInicio >= p.fechaInicio && fechaInicio <= p.fechaTermino) ||
                (fechaFin >= p.fechaInicio && fechaFin <= p.fechaTermino)
            ));
        piezas.forEach((p) => cantidadPiezas += p.cantidad);
        return cantidadPiezas;
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