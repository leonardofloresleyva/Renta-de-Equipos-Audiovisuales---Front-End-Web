import { Module } from '@nestjs/common';
import { OperacionesService } from './operaciones.service';
import { BITACORA_REPOSITORY } from './operaciones.tokens';
import { BitacoraReservaMemoriaRepository } from './infra/bitacora.reserva.memoria.repository';
import { ReservasModule } from 'src/reservas/reservas.module';

@Module({
  providers: [OperacionesService, {
    provide: BITACORA_REPOSITORY,
    useClass: BitacoraReservaMemoriaRepository
  }],
  imports: [ReservasModule]
})
export class OperacionesModule {}
