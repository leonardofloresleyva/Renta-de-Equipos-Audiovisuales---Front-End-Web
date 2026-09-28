import { Module } from '@nestjs/common';
import { ReservasService } from './reservas.service';
import { AdminMemoriaRepository, ArticuloMemoriaRepository, ClienteMemoriaRepository, ReservaMemoriaRepository } from 'src/infra';
import { ADMIN_REPOSITORY, ARTICULO_REPOSITORY, CLIENTE_REPOSITORY, RESERVA_REPOSITORY } from './reservas.tokens';

@Module({
  providers: [
    ReservasService,
    {
      provide: CLIENTE_REPOSITORY,
      useClass: ClienteMemoriaRepository
    },
    {
      provide: ARTICULO_REPOSITORY,
      useClass: ArticuloMemoriaRepository
    },
    {
      provide: RESERVA_REPOSITORY,
      useClass: ReservaMemoriaRepository
    },
    {
      provide: ADMIN_REPOSITORY,
      useClass: AdminMemoriaRepository
    }]
})
export class ReservasModule { }
