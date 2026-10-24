import { Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import {
  Administrador,
  Cliente,
  Direccion,
  NuevoUsuario,
  Rol,
} from 'src/dominio/entidades';
import type { ClienteRepository } from './repositorios/cliente.repository';
import { ADMIN_REPOSITORY, CLIENTE_REPOSITORY } from './usuarios.tokens';
import type { AdminRepository } from './repositorios/admin.repository';
import { CrearAdministradorDto } from './dto/crear.administrador.dto';
import { ActualizarAdministradorDto } from './dto/actualizar.administrador.dto';
import { CrearClienteDto } from './dto/crear.cliente.dto';
import { ActualizarClienteDto } from './dto/actualizar.cliente.dto';

const VUELTAS = 10;

type DatosActualizacionUsuario = {
  email?: string;
  passwordHash?: string;
  nombre?: string;
  telefono?: string;
};

@Injectable()
export class UsuariosService {
  constructor(
    @Inject(CLIENTE_REPOSITORY)
    private readonly clienteRepo: ClienteRepository,
    @Inject(ADMIN_REPOSITORY)
    private readonly adminRepo: AdminRepository,
  ) {}

  buscarClientePorId(idCliente: number): Promise<Cliente | null> {
    return this.clienteRepo.buscarPorId(idCliente);
  }

  buscarAdminPorId(idAdmin: number): Promise<Administrador | null> {
    return this.adminRepo.buscarPorId(idAdmin);
  }

  listarClientes(): Promise<Cliente[]> {
    return this.clienteRepo.listar();
  }

  async crearCliente(dto: CrearClienteDto): Promise<Cliente> {
    const nuevo: NuevoUsuario = {
      email: dto.correo.toLowerCase(),
      passwordHash: await bcrypt.hash(dto.password, VUELTAS),
      nombre: dto.nombre,
      telefono: dto.telefono,
    };

    return this.clienteRepo.crear(nuevo, dto.direccion);
  }

  async actualizarCliente(
    id: number,
    dto: ActualizarClienteDto,
  ): Promise<Cliente | null> {
    const existente = await this.clienteRepo.buscarPorId(id);
    if (!existente) return null;

    const datos: DatosActualizacionUsuario & { direccion?: Direccion } = {};

    if (dto.correo !== undefined) datos.email = dto.correo.toLowerCase();
    if (dto.password !== undefined) {
      datos.passwordHash = await bcrypt.hash(dto.password, VUELTAS);
    }
    if (dto.nombre !== undefined) datos.nombre = dto.nombre;
    if (dto.telefono !== undefined) datos.telefono = dto.telefono;
    if (dto.direccion !== undefined) {
      datos.direccion = {
        id: existente.direccion.id,
        calle: dto.direccion.calle ?? existente.direccion.calle,
        colonia: dto.direccion.colonia ?? existente.direccion.colonia,
        numero: dto.direccion.numero ?? existente.direccion.numero,
      };
    }

    return this.clienteRepo.actualizar(id, datos);
  }

  eliminarCliente(id: number): Promise<Cliente | null> {
    return this.clienteRepo.eliminar(id);
  }

  listarAdministradores(): Promise<Administrador[]> {
    return this.adminRepo.listar();
  }

  async crearAdministrador(dto: CrearAdministradorDto): Promise<Administrador> {
    const nuevo: Omit<Administrador, 'id'> = {
      email: dto.correo.toLowerCase(),
      passwordHash: await bcrypt.hash(dto.password, VUELTAS),
      rol: Rol.administrador,
      creadoEn: new Date(),
      nombre: dto.nombre,
      telefono: dto.telefono,
    };

    return this.adminRepo.crear(nuevo);
  }

  async actualizarAdministrador(
    id: number,
    dto: ActualizarAdministradorDto,
  ): Promise<Administrador | null> {
    const existente = await this.adminRepo.buscarPorId(id);
    if (!existente) return null;

    const datos: DatosActualizacionUsuario = {};
    if (dto.correo !== undefined) datos.email = dto.correo.toLowerCase();
    if (dto.password !== undefined) {
      datos.passwordHash = await bcrypt.hash(dto.password, VUELTAS);
    }
    if (dto.nombre !== undefined) datos.nombre = dto.nombre;
    if (dto.telefono !== undefined) datos.telefono = dto.telefono;

    return this.adminRepo.actualizar(id, datos);
  }

  eliminarAdministrador(id: number): Promise<Administrador | null> {
    return this.adminRepo.eliminar(id);
  }
}
