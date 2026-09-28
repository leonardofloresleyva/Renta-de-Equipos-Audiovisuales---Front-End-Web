import { Module } from '@nestjs/common';
import { ArticulosService } from './articulos.service';
import { ArticuloMemoriaRepository } from 'src/infra';
import { ARTICULO_REPOSITORY } from './articulos.tokens';

@Module({
  providers: [ArticulosService,
    {
      provide: ARTICULO_REPOSITORY,
      useClass: ArticuloMemoriaRepository
    }
  ]
})
export class ArticulosModule { }
