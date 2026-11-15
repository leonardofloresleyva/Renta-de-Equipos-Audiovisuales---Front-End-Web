import type { Response } from 'express';
import { Body, Controller, Delete, ForbiddenException, Get, HttpCode, NotFoundException, Param, ParseIntPipe, Post, Query, Res } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Rol } from 'src/dominio/entidades';
import { Roles } from 'src/auth/decoradores/rol.decorator';
import { UsuarioActual } from 'src/auth/decoradores/usuario-actual.decorator';
import type { PayloadJwt } from 'src/auth/dominio/payload.jwt';
import { ReservasService } from './reservas.service';
import { aReservaDto } from './dto/reserva.respuesta.dto';
import { CrearReservaDto } from './dto/crear.reserva.dto';
import { aDepositoGarantiaDto } from './dto/deposito.garantia.respuesta';
import { FiltrosReserva } from './dto/filtros.reserva.dto';
import { FiltrosSolicitudesDto } from './dto/filtros.solicitudes.dto';
import { aSolicitudDto } from './dto/solicitud.respuesta.dto';
import { CrearSolicitudDto } from './dto/crear.solicitud.dto';

@Controller('reservas')
@ApiBearerAuth()
export class ReservasController {
    constructor(private readonly servicio: ReservasService) {}

    @Roles(Rol.administrador)
    @Get()
    async listar(@Query() dto: FiltrosReserva) {
        const reservas =  await this.servicio.listar({
            nombreCliente: dto.nombreCliente,
            fechaEntrega: dto.fechaEntrega,
            fechaRecoleccion: dto.fechaRecoleccion,
            estado: dto.estado
        });
        return reservas.map(aReservaDto);
    }

    @Roles(Rol.cliente)
    @Get('mias')
    async listarPropias(@UsuarioActual() usuario: PayloadJwt) {
        const reservas = await this.servicio.buscarPorCliente(usuario.perfilId);
        return reservas.map(aReservaDto);
    }

    @Roles(Rol.administrador)
    @Get(":id")
    async buscarPorId(@Param("id", ParseIntPipe) id: number) {
        const reserva = await this.servicio.buscarPorId(id);
        if (!reserva) {
            throw new NotFoundException(`No existe la reserva ${id}`);
        }
        return aReservaDto(reserva);
    }

    @Roles(Rol.administrador)
    @Get("clientes/:id")
    async buscarPorCliente(@Param("id", ParseIntPipe) idCliente: number) {
        const reservas = await this.servicio.buscarPorCliente(idCliente);
        return reservas.map(aReservaDto);
    }

    @Roles(Rol.cliente, Rol.administrador)
    @Get("articulos/:id")
    async buscarArticulosPorId(
        @Param("id", ParseIntPipe) reservaId: number,
        @UsuarioActual() usuario: PayloadJwt,
    ) {
        await this.verificarAccesoReserva(reservaId, usuario);
        return this.servicio.buscarArticulosPorReserva(reservaId);
    }

    
    @Roles(Rol.cliente)
    @Post()
    @HttpCode(201)
    async crear(
        @Body() dto: CrearReservaDto,
        @UsuarioActual() usuario: PayloadJwt,
        @Res({passthrough: true}) res: Response
    ) {
        const reserva = await this.servicio.crear(dto, usuario.perfilId);
        res.setHeader("Location", `/reservas/${reserva.id}`);
        return aReservaDto(reserva);
    }

    @Roles(Rol.cliente, Rol.administrador)
    @Get("garantias/:id")
    async obtenerGarantiaPorReserva(
        @Param("id", ParseIntPipe) id: number,
        @UsuarioActual() usuario: PayloadJwt,
    ) {
        await this.verificarAccesoReserva(id, usuario);
        const garantia = await this.servicio.obtenerGarantiaPorReserva(id);
        if (!garantia) {
            throw new NotFoundException(`No existe el depósito de garantía ${id}`);
        }
        return aDepositoGarantiaDto(garantia);
    }

    @Roles(Rol.administrador)
    @Delete(":id")
    async cancelar(@Param("id") id: number) {
        const cancelado = await this.servicio.cancelar(id);
        return aReservaDto(cancelado);
    }

    @Roles(Rol.administrador)
    @Get("solicitudes/cancelacion")
    async listarSolicitudes(@Query() dto: FiltrosSolicitudesDto) {
        const solicitudes = await this.servicio.listarSolicitudes({
            fechaInicio: dto.fechaInicio,
            fechaFin: dto.fechaFin,
            estado: dto.estado
        });
        return solicitudes.map(aSolicitudDto);
    }

    @Roles(Rol.cliente)
    @Post("solicitudes/cancelacion")
    @HttpCode(201)
    async crearSolicitud(
        @Body() dto: CrearSolicitudDto,
        @UsuarioActual() usuario: PayloadJwt,
        @Res({passthrough: true}) res: Response
    ) {
        const nuevaSolicitud = await this.servicio.crearSolicitud(
            dto,
            usuario.perfilId,
        );
        res.setHeader("Location", `reservas/solicitudes/${nuevaSolicitud.id}`);
        return aSolicitudDto(nuevaSolicitud);
    }

    @Roles(Rol.administrador)
    @Delete("solicitudes/cancelacion/:id")
    async rechazarSolicitud(@Param("id") id: number) {
        const solicitud = await this.servicio.rechazarSolicitud(id);
        if (!solicitud) throw new NotFoundException(`No se encontró la solicitud ${id}`);
        return aSolicitudDto(solicitud);
    }

    private async verificarAccesoReserva(
        reservaId: number,
        usuario: PayloadJwt,
    ): Promise<void> {
        const reserva = await this.servicio.buscarPorId(reservaId);
        if (!reserva) {
            throw new NotFoundException(`No existe la reserva ${reservaId}`);
        }
        if (
            usuario.rol === Rol.cliente &&
            reserva.clienteId !== usuario.perfilId
        ) {
            throw new ForbiddenException('No tienes acceso a esta reserva.');
        }
    }
}
