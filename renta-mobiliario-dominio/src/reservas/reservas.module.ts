import { Module } from '@nestjs/common';
import { ReservasService } from './reservas.service';
import { ADMIN_REPOSITORY, ARTICULO_REPOSITORY, CLIENTE_REPOSITORY, RESERVA_REPOSITORY } from './reservas.tokens';
import { ClienteMemoriaRepository } from 'src/infra/cliente.memoria.repository';
import { ArticuloMemoriaRepository } from 'src/infra/articulo.memoria.repository';
import { ReservaMemoriaRepository } from 'src/infra/reserva.memoria.repository';
import { AdminMemoriaRepository } from 'src/infra/admin.memoria.repository';

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
    }],
    exports: [ReservasModule]
})
export class ReservasModule { }
