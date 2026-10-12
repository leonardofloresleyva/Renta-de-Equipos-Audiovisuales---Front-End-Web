import { Module } from '@nestjs/common';
import { OperacionesService } from './operaciones.service';
import { BITACORA_REPOSITORY } from './operaciones.tokens';
import { BitacoraReservaMemoriaRepository } from './infra/bitacora.reserva.memoria.repository';

@Module({
  providers: [OperacionesService, {
    provide: BITACORA_REPOSITORY,
    useClass: BitacoraReservaMemoriaRepository
  }]
})
export class OperacionesModule {}
