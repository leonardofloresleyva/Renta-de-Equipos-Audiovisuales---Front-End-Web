import { Module } from '@nestjs/common';
import { ArticulosService } from './articulos.service';
import { ADMIN_REPOSITORY, ARTICULO_REPOSITORY, RESERVA_REPOSITORY } from './articulos.tokens';
import { ReservaMemoriaRepository } from 'src/infra/reserva.memoria.repository';
import { ArticuloMemoriaRepository } from 'src/infra/articulo.memoria.repository';
import { AdminMemoriaRepository } from 'src/infra/admin.memoria.repository';

@Module({
  providers: [ArticulosService,
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
    }
  ]
})
export class ArticulosModule { }
