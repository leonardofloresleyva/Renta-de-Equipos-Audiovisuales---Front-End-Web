import { Module } from '@nestjs/common';
import { DisponibilidadService } from './disponibilidad.service';
import { DISPONIBILIDAD_REPOSITORY } from './disponibilidad.tokens';
import { DisponibilidadController } from './disponibilidad.controller';
import { DisponibilidadPrismaRepository } from './infra/disponibilidad.prisma.repository';

@Module({
  providers: [DisponibilidadService, {
    provide: DISPONIBILIDAD_REPOSITORY,
    useClass: DisponibilidadPrismaRepository
  }],
  exports: [DisponibilidadService],
  controllers: [DisponibilidadController]
})
export class DisponibilidadModule {}
