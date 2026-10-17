import { Module } from '@nestjs/common';
import { DisponibilidadService } from './disponibilidad.service';
import { DISPONIBILIDAD_REPOSITORY } from './disponibilidad.tokens';
import { DisponibilidadMemoriaRepository } from './infra/disponibilidad.memoria.repository';
import { DisponibilidadController } from './disponibilidad.controller';

@Module({
  providers: [DisponibilidadService, {
    provide: DISPONIBILIDAD_REPOSITORY,
    useClass: DisponibilidadMemoriaRepository
  }],
  exports: [DisponibilidadService],
  controllers: [DisponibilidadController]
})
export class DisponibilidadModule {}
