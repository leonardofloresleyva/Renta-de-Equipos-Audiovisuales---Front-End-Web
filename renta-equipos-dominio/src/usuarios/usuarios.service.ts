import { Inject, Injectable } from '@nestjs/common';
import type { ClienteRepository } from './repositorios/cliente.repository';
import { ADMIN_REPOSITORY, CLIENTE_REPOSITORY } from './usuarios.tokens';
import type { AdminRepository } from './repositorios/admin.repository';

@Injectable()
export class UsuariosService {
    constructor(
        @Inject(CLIENTE_REPOSITORY)
        private readonly clienteRepo: ClienteRepository,
        @Inject(ADMIN_REPOSITORY)
        private readonly adminRepo: AdminRepository
    ) {}

    
}
