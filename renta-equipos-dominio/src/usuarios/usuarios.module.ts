import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { AdminPrismaRepository } from './infra/admin.prisma.repository';
import { ADMIN_REPOSITORY, CLIENTE_REPOSITORY } from './usuarios.tokens';
import { ClienteMemoriaRepository } from './infra/cliente.memoria.repository';
import { UsuariosController } from './usuarios.controller';

@Module({
  providers: [UsuariosService, 
    {
      provide: ADMIN_REPOSITORY,
      useClass: AdminPrismaRepository
    },
    {
      provide: CLIENTE_REPOSITORY,
      useClass: ClienteMemoriaRepository
    }
  ],
  exports: [UsuariosService],
  controllers: [UsuariosController]
})
export class UsuariosModule {}
