import { Body, Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { DisponibilidadService } from './disponibilidad.service';
import { Publico } from 'src/auth/decoradores/publico.decorator';
import { PeriodoDisponibilidadDto } from './dto/verificar.disponibilidad.dto';

@Controller('disponibilidad')
export class DisponibilidadController {
    constructor(private readonly servicio: DisponibilidadService) { }

    @Get(":id")
    @Publico()
    @ApiOperation({ security: [] })
    async obtenerDisponibilidadPeriodo(
        @Param('id', ParseIntPipe) articuloId: number,
        @Query() rango: PeriodoDisponibilidadDto,
    ) {
        return this.servicio.obtenerDisponibilidadPeriodo(
            articuloId,
            rango.fechaInicio,
            rango.fechaFin,
        );
    }
}
