import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { Rol } from 'src/dominio/entidades';
import {
  AdminNoEncontradoError,
  ClienteNoEncontradoError,
  NoSePuedeEliminarPropiaCuentaError,
} from 'src/dominio/errores';
import { Roles } from 'src/auth/decoradores/rol.decorator';
import { UsuarioActual } from 'src/auth/decoradores/usuario-actual.decorator';
import type { PayloadJwt } from 'src/auth/dominio/payload.jwt';
import { UsuariosService } from './usuarios.service';
import { CrearAdministradorDto } from './dto/crear.administrador.dto';
import { ActualizarAdministradorDto } from './dto/actualizar.administrador.dto';
import { CrearClienteDto } from './dto/crear.cliente.dto';
import { ActualizarClienteDto } from './dto/actualizar.cliente.dto';
import {
  aAdministradorDto,
  type AdministradorRespuestaDto,
} from './dto/administrador.respuesta.dto';
import {
  aClienteDto,
  type ClienteRespuestaDto,
} from './dto/cliente.respuesta.dto';

@ApiTags('Usuarios')
@ApiBearerAuth()
@Roles(Rol.administrador)
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuarios: UsuariosService) {}

  @Get('administradores')
  @ApiOperation({ summary: 'Listar administradores' })
  async listarAdministradores(): Promise<AdministradorRespuestaDto[]> {
    const administradores = await this.usuarios.listarAdministradores();
    return administradores.map(aAdministradorDto);
  }

  @Get('administradores/:id')
  @ApiOperation({ summary: 'Consultar un administrador por ID' })
  async buscarAdministrador(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<AdministradorRespuestaDto> {
    const administrador = await this.usuarios.buscarAdminPorId(id);
    if (!administrador) throw new AdminNoEncontradoError(id);
    return aAdministradorDto(administrador);
  }

  @Post('administradores')
  @HttpCode(201)
  @ApiOperation({ summary: 'Registrar un administrador' })
  async crearAdministrador(
    @Body() dto: CrearAdministradorDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<AdministradorRespuestaDto> {
    const administrador = await this.usuarios.crearAdministrador(dto);
    res.setHeader('Location', `/usuarios/administradores/${administrador.id}`);
    return aAdministradorDto(administrador);
  }

  @Patch('administradores/:id')
  @ApiOperation({ summary: 'Actualizar un administrador' })
  async actualizarAdministrador(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ActualizarAdministradorDto,
  ): Promise<AdministradorRespuestaDto> {
    const administrador = await this.usuarios.actualizarAdministrador(id, dto);
    if (!administrador) throw new AdminNoEncontradoError(id);
    return aAdministradorDto(administrador);
  }

  @Delete('administradores/:id')
  @ApiOperation({ summary: 'Eliminar un administrador' })
  async eliminarAdministrador(
    @Param('id', ParseIntPipe) id: number,
    @UsuarioActual() usuario: PayloadJwt,
  ): Promise<AdministradorRespuestaDto> {
    const administrador = await this.usuarios.buscarAdminPorId(id);
    if (!administrador) throw new AdminNoEncontradoError(id);

    if (administrador.email.toLowerCase() === usuario.correo.toLowerCase()) {
      throw new NoSePuedeEliminarPropiaCuentaError();
    }

    const eliminado = await this.usuarios.eliminarAdministrador(id);
    if (!eliminado) throw new AdminNoEncontradoError(id);
    return aAdministradorDto(eliminado);
  }

  @Get('clientes')
  @ApiOperation({ summary: 'Listar clientes' })
  async listarClientes(): Promise<ClienteRespuestaDto[]> {
    const clientes = await this.usuarios.listarClientes();
    return clientes.map(aClienteDto);
  }

  @Get('clientes/:id')
  @ApiOperation({ summary: 'Consultar un cliente por ID' })
  async buscarCliente(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ClienteRespuestaDto> {
    const cliente = await this.usuarios.buscarClientePorId(id);
    if (!cliente) throw new ClienteNoEncontradoError(id);
    return aClienteDto(cliente);
  }

  @Post('clientes')
  @HttpCode(201)
  @ApiOperation({ summary: 'Registrar un cliente' })
  async crearCliente(
    @Body() dto: CrearClienteDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<ClienteRespuestaDto> {
    const cliente = await this.usuarios.crearCliente(dto);
    res.setHeader('Location', `/usuarios/clientes/${cliente.id}`);
    return aClienteDto(cliente);
  }

  @Patch('clientes/:id')
  @ApiOperation({ summary: 'Actualizar un cliente' })
  async actualizarCliente(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ActualizarClienteDto,
  ): Promise<ClienteRespuestaDto> {
    const cliente = await this.usuarios.actualizarCliente(id, dto);
    if (!cliente) throw new ClienteNoEncontradoError(id);
    return aClienteDto(cliente);
  }

  @Delete('clientes/:id')
  @ApiOperation({ summary: 'Eliminar un cliente' })
  async eliminarCliente(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ClienteRespuestaDto> {
    const cliente = await this.usuarios.eliminarCliente(id);
    if (!cliente) throw new ClienteNoEncontradoError(id);
    return aClienteDto(cliente);
  }
}
