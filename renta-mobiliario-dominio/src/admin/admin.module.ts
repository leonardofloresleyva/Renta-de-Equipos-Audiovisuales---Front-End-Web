import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ADMIN_REPOSITORY, ARTICULO_REPOSITORY, RESERVA_REPOSITORY } from './admin.tokens';
import { ArticuloMemoriaRepository } from 'src/infra/articulo.memoria.repository';
import { ReservaMemoriaRepository } from 'src/infra/reserva.memoria.repository';
import { AdminMemoriaRepository } from 'src/infra/admin.memoria.repository';

@Module({
  providers: [AdminService,
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
export class AdminModule { }
