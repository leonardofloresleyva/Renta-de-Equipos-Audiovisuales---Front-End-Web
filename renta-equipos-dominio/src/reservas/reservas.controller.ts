import type { Response } from 'express';
import { Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, Patch, Post, Res } from '@nestjs/common';
import { ReservasService } from './reservas.service';
import { aReservaDto } from './dto/reserva.respuesta.dto';
import type { CrearReservaDto } from './dto/crear.reserva.dto';
import { aDepositoGarantiaDto } from './dto/deposito.garantia.respuesta';
import { FiltrosReserva } from './dto/filtros.reserva.dto';
import { FiltrosSolicitudesDto } from './dto/filtros.solicitudes.dto';
import { aSolicitudDto } from './dto/solicitud.respuesta.dto';
import { CrearSolicitudDto } from './dto/crear.solicitud.dto';

@Controller('reservas')
export class ReservasController {
    constructor(private readonly servicio: ReservasService) {}

    // Solo accesible para el admin
    // Puede filtrarse
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
    @Get(":id")
    async buscarPorId(@Param("id") id: string) {
        const reserva = await this.servicio.buscarPorId(Number(id));
        if (!reserva) {
            throw new NotFoundException(`No existe la reserva ${id}`);
        }
        return aReservaDto(reserva);
    }

    // Checar el id del cliente con el token
    @Get("clientes/:id")
    async buscarPorCliente(@Param("id") idCliente: string) {
        const reservas = await this.servicio.buscarPorCliente(Number(idCliente));
        return reservas.map(aReservaDto);
    }

    @Get("articulos/:id")
    async buscarArticulosPorId(@Param("id") reservaId: string) {
        return this.servicio.buscarArticulosPorReserva(Number(reservaId));
    }

    // Falta:
    // - Validar que solo el cliente puede crear una nueva reserva (token)
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
    async obtenerGarantiaPorReserva(@Param("id") id: string) {
        const garantia = await this.servicio.obtenerGarantiaPorReserva(Number(id));
        if (!garantia) {
            throw new NotFoundException(`No existe el depósito de garantía ${id}`);
        }
        return aDepositoGarantiaDto(garantia);
    }

    // Solo admin
    @Patch("entregas/:id")
    async entregar(@Param("id") id: string) {
        const entregado = await this.servicio.entregar(Number(id));
        return aReservaDto(entregado);
    }

    // Solo admin
    @Patch("recolecciones/:id")
    async recolectar(@Param("id") id: string) {
        const entregado = await this.servicio.recolectar(Number(id));
        return aReservaDto(entregado);
    }

    // Solo admin
    @Delete(":id")
    async cancelar(@Param("id") id: string) {
        const cancelado = await this.servicio.cancelar(Number(id));
        return aReservaDto(cancelado);
    }

    // Solo admin
    @Get("solicitudes")
    async listarSolicitudes(@Body() dto: FiltrosSolicitudesDto) {
        const solicitudes = await this.servicio.listarSolicitudes({
            fechaInicio: dto.fechaInicio,
            fechaFin: dto.fechaFin,
            estado: dto.estado
        });
        return solicitudes.map(aSolicitudDto);
    }

    // Solo cliente
    @Post()
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
    @Delete("solicitudes/:id")
    async rechazarSolicitud(@Param("id") id: string) {
        const solicitud = await this.servicio.rechazarSolicitud(Number(id));
        if (!solicitud) throw new NotFoundException(`No se encontró la solicitud ${id}`);
        
        return aSolicitudDto(solicitud);
    }

}
