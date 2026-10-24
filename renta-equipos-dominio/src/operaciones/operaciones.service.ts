import { Inject, Injectable } from '@nestjs/common';
import { BITACORA_REPOSITORY } from './operaciones.tokens';
import type { BitacoraReservaRepository } from './repositorios/bitacora.reserva.repository';
import { ReservasService } from 'src/reservas/reservas.service';
import {
    BitacoraReserva,
    NuevoInspeccionPieza,
    RegistroEntradaBitacora
} from 'src/dominio/entidades';
import {
    DepositoGarantiaRequeridoError,
    EstadoReservaInvalidoError,
    ReservaNoEncontradaError
} from 'src/dominio/errores';

@Injectable()
export class OperacionesService {

    constructor(
        @Inject(BITACORA_REPOSITORY)
        private readonly bitacoraRepo: BitacoraReservaRepository,
        private readonly reservasService: ReservasService
    ) {}

    async listarBitacoras(): Promise<BitacoraReserva[]> {
        return this.bitacoraRepo.listar();
    }

    async buscarBitacoraPorId(id: number): Promise<BitacoraReserva | null> {
        return this.bitacoraRepo.buscarPorId(id);
    }

    async buscarBitacoraPorReserva(reservaId: number): Promise<BitacoraReserva | null> {
        return this.bitacoraRepo.buscarPorReserva(reservaId);
    }

    async registrarEntrega(reservaId: number): Promise<BitacoraReserva> {
        const reserva = await this.reservasService.buscarPorId(reservaId);
        if (!reserva) throw new ReservaNoEncontradaError(reservaId);
        if (reserva.estado !== 'apartada') throw new EstadoReservaInvalidoError();

        const depositoGarantia = await this.reservasService.obtenerGarantiaPorReserva(reserva.id);
        if (!depositoGarantia || !depositoGarantia.confirmado) {
            throw new DepositoGarantiaRequeridoError();
        }

        const nuevaBitacora: RegistroEntradaBitacora = {
            reservaId: reservaId,
            montoTotalGarantia: depositoGarantia.monto
        };
        await this.reservasService.entregar(reservaId);
        return this.bitacoraRepo.entregar(nuevaBitacora);
    }

    async registrarRecoleccion(
        bitacoraId: number,
        inspeccionesPiezas: NuevoInspeccionPieza[]
    ): Promise<BitacoraReserva | null> {
        const bitacora = await this.bitacoraRepo.buscarPorId(bitacoraId);
        if (!bitacora) return null;
        if (bitacora.fechaHoraRecolectada) {
            throw new EstadoReservaInvalidoError(
                'La bitácora ya tiene registrada la recolección.'
            );
        }

        const articulosReservados = await this.reservasService.buscarArticulosPorReserva(
            bitacora.reservaId
        );
        const articulosInspeccionados = new Set<number>();
        for (const inspeccion of inspeccionesPiezas) {
            if (articulosInspeccionados.has(inspeccion.articuloReservadoId)) {
                throw new EstadoReservaInvalidoError(
                    `El artículo reservado ${inspeccion.articuloReservadoId} aparece más de una vez en las inspecciones.`
                );
            }
            articulosInspeccionados.add(inspeccion.articuloReservadoId);

            const articuloReservado = articulosReservados.find(
                (articulo) => articulo.id === inspeccion.articuloReservadoId
            );
            if (!articuloReservado) {
                throw new EstadoReservaInvalidoError(
                    `El artículo reservado ${inspeccion.articuloReservadoId} no pertenece a la reserva ${bitacora.reservaId}.`
                );
            }
            const piezasInspeccionadas =
                inspeccion.piezasCompletas +
                (inspeccion.piezasDaniadas ?? 0) +
                (inspeccion.piezasFaltantes ?? 0);
            if (piezasInspeccionadas > articuloReservado.cantidad) {
                throw new EstadoReservaInvalidoError(
                    `La cantidad inspeccionada del artículo reservado ${articuloReservado.id} supera la cantidad de la reserva.`
                );
            }
        }

        await this.reservasService.recolectar(bitacora.reservaId);
        return this.bitacoraRepo.recolectar(bitacoraId, inspeccionesPiezas);
    }

}
