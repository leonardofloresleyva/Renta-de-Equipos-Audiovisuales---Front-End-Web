import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

// @Global(): se importa una sola vez en AppModule y ya esta
// disponible para inyectar en cualquier otro modulo.
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
