import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { AdminPrismaRepository } from './infra/admin.prisma.repository';
import { ADMIN_REPOSITORY, CLIENTE_REPOSITORY } from './usuarios.tokens';
import { ClientePrismaRepository } from './infra/cliente.prisma.repository';
import { UsuariosController } from './usuarios.controller';

@Module({
  providers: [
    UsuariosService,
    {
      provide: ADMIN_REPOSITORY,
      useClass: AdminPrismaRepository,
    },
    {
      provide: CLIENTE_REPOSITORY,
      useClass: ClientePrismaRepository,
    },
  ],
  exports: [UsuariosService],
  controllers: [UsuariosController],
})
export class UsuariosModule {}
