import { Module } from '@nestjs/common';
import { ArticulosService } from './articulos.service';

@Module({
  providers: [ArticulosService]
})
export class ArticulosModule { }
