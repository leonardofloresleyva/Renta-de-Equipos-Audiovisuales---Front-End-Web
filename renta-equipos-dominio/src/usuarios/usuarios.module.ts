import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { AdminMemoriaRepository } from './infra/admin.memoria.repository';
import { ADMIN_REPOSITORY, CLIENTE_REPOSITORY } from './usuarios.tokens';
import { ClienteMemoriaRepository } from './infra/cliente.memoria.repository';

@Module({
  providers: [UsuariosService, 
    {
      provide: ADMIN_REPOSITORY,
      useClass: AdminMemoriaRepository
    },
    {
      provide: CLIENTE_REPOSITORY,
      useClass: ClienteMemoriaRepository
    }
  ],
  exports: [UsuariosService]
})
export class UsuariosModule {}
