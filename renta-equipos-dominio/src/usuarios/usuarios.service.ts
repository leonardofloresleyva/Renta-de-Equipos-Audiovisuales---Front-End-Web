import { Inject, Injectable } from '@nestjs/common';
import type { ClienteRepository } from './repositorios/cliente.repository';
import { ADMIN_REPOSITORY, CLIENTE_REPOSITORY } from './usuarios.tokens';
import type { AdminRepository } from './repositorios/admin.repository';
import { Administrador, Cliente } from 'src/dominio/entidades';

@Injectable()
export class UsuariosService {
    constructor(
        @Inject(CLIENTE_REPOSITORY)
        private readonly clienteRepo: ClienteRepository,
        @Inject(ADMIN_REPOSITORY)
        private readonly adminRepo: AdminRepository
    ) {}

    buscarClientePorId(idCliente: number): Promise<Cliente | null> {
        return this.clienteRepo.buscarPorId(idCliente);
    }

    buscarAdminPorId(idAdmin: number): Promise<Administrador | null> {
        return this.adminRepo.buscarPorId(idAdmin);
    }
}
