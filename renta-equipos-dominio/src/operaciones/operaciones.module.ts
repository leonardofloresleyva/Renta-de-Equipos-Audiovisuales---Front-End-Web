import { Module } from '@nestjs/common';
import { OperacionesService } from './operaciones.service';
import { BITACORA_REPOSITORY } from './operaciones.tokens';
import { BitacoraReservaPrismaRepository } from './infra/bitacora.reserva.prisma.repository';
import { ReservasModule } from 'src/reservas/reservas.module';
import { OperacionesController } from './operaciones.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [
    OperacionesService,
    {
      provide: BITACORA_REPOSITORY,
      useClass: BitacoraReservaPrismaRepository,
    },
  ],
  imports: [ReservasModule, PrismaModule],
  controllers: [OperacionesController],
})
export class OperacionesModule {}
