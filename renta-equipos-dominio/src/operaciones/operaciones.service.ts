import { Inject, Injectable } from '@nestjs/common';
import { BITACORA_REPOSITORY } from './operaciones.tokens';
import type { BitacoraReservaRepository } from './repositorios/bitacora.reserva.repository';
import { ReservasService } from 'src/reservas/reservas.service';
import { BitacoraReserva, RegistroEntradaBitacora } from 'src/dominio/entidades';
import { DepositoGarantiaRequeridoError, ReservaNoEncontradaError } from 'src/dominio/errores';

@Injectable()
export class OperacionesService {

    constructor(
        @Inject(BITACORA_REPOSITORY)
        private readonly bitacoraRepo: BitacoraReservaRepository,
        private readonly reservasService: ReservasService
    ) {}

    async registrarEntrega(reservaId: number): Promise<BitacoraReserva> {
        const reserva = await this.reservasService.buscarPorId(reservaId);
        if (!reserva) throw new ReservaNoEncontradaError(reservaId);

        const depositoGarantia = await this.reservasService.obtenerGarantiaPorReserva(reserva.id);
        if (!depositoGarantia) throw new DepositoGarantiaRequeridoError();

        const nuevaBitacora: RegistroEntradaBitacora = {
            reservaId: reservaId,
            montoTotalGarantía: depositoGarantia.monto
        };
        return this.bitacoraRepo.entregar(nuevaBitacora);
    }

}
