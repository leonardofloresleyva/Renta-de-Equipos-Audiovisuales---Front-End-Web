import { Module } from '@nestjs/common';
import { OperacionesService } from './operaciones.service';

@Module({
  providers: [OperacionesService]
})
export class OperacionesModule {}
