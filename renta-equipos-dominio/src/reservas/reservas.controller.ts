import type { Response } from 'express';
import { Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, Patch, Post, Res } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Rol } from 'src/dominio/entidades';
import { Roles } from 'src/auth/decoradores/rol.decorator';
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
@Roles(Rol.administrador)
export class ReservasController {
    constructor(private readonly servicio: ReservasService) {}

    // Solo accesible para el admin
    // Puede filtrarse
    @Roles(Rol.administrador)
    @Get()
    async listar(@Body() dto: FiltrosReserva) {
        const reservas =  await this.servicio.listar({
            nombreCliente: dto.nombreCliente,
            fechaEntrega: dto.fechaEntrega,
            fechaRecoleccion: dto.fechaRecoleccion,
            estado: dto.estado
        });
        return reservas.map(aReservaDto);
    }

    // Solo admin
    @Roles(Rol.administrador)
    @Get(":id")
    async buscarPorId(@Param("id") id: number) {
        console.log("Hola");
        const reserva = await this.servicio.buscarPorId(id);
        if (!reserva) {
            throw new NotFoundException(`No existe la reserva ${id}`);
        }
        return aReservaDto(reserva);
    }

    @Get("clientes/:id")
    async buscarPorCliente(@Param("id") idCliente: number) {
        const reservas = await this.servicio.buscarPorCliente(idCliente);
        return reservas.map(aReservaDto);
    }

    @Get("articulos/:id")
    async buscarArticulosPorId(@Param("id") reservaId: number) {
        return this.servicio.buscarArticulosPorReserva(reservaId);
    }

    
    @Roles(Rol.cliente)
    @Post()
    @HttpCode(201)
    async crear(
        @Body() dto: CrearReservaDto,
        @Res({passthrough: true}) res: Response
    ) {
        const reserva = await this.servicio.crear(dto);
        res.setHeader("Location", `/reservas/${reserva.id}`);
        return aReservaDto(reserva);
    }

    @Get("garantias/:id")
    async obtenerGarantiaPorReserva(@Param("id") id: number) {
        const garantia = await this.servicio.obtenerGarantiaPorReserva(id);
        if (!garantia) {
            throw new NotFoundException(`No existe el depósito de garantía ${id}`);
        }
        return aDepositoGarantiaDto(garantia);
    }

    // Solo admin
    @Roles(Rol.administrador)
    @Delete(":id")
    async cancelar(@Param("id") id: number) {
        const cancelado = await this.servicio.cancelar(id);
        return aReservaDto(cancelado);
    }

    // Solo admin
    @Roles(Rol.administrador)
    @Get("solicitudes/cancelacion")
    async listarSolicitudes(@Body() dto: FiltrosSolicitudesDto) {
        const solicitudes = await this.servicio.listarSolicitudes({
            fechaInicio: dto.fechaInicio,
            fechaFin: dto.fechaFin,
            estado: dto.estado
        });
        return solicitudes.map(aSolicitudDto);
    }

    // Solo cliente
    @Roles(Rol.cliente)
    @Post("solicitudes/cancelacion")
    @HttpCode(201)
    async crearSolicitud(
        @Body() dto: CrearSolicitudDto,
        @Res({passthrough: true}) res: Response
    ) {
        const nuevaSolicitud = await this.servicio.crearSolicitud(dto);
        res.setHeader("Location", `reservas/solicitudes/${nuevaSolicitud.id}`);
        return aSolicitudDto(nuevaSolicitud);
    }

    // Solo admin
    @Roles(Rol.administrador)
    @Delete("solicitudes/cancelacion/:id")
    async rechazarSolicitud(@Param("id") id: number) {
        const solicitud = await this.servicio.rechazarSolicitud(id);
        if (!solicitud) throw new NotFoundException(`No se encontró la solicitud ${id}`);
        return aSolicitudDto(solicitud);
    }

}
