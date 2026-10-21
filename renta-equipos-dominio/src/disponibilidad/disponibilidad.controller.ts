import { Body, Controller, Get } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { DisponibilidadService } from './disponibilidad.service';
import { VerificarDisponibilidadDto } from './dto/verificar.disponibilidad.dto';
import { Publico } from 'src/auth/decoradores/publico.decorator';

@Controller('disponibilidad')
export class DisponibilidadController {
    constructor(private readonly servicio: DisponibilidadService) {}

    @Get(":id")
    @Publico()
    @ApiOperation({ security: [] })
    async obtenerDisponibilidadPeriodo(@Body() dto: VerificarDisponibilidadDto) {
        return this.servicio.obtenerDisponibilidadPeriodo(dto.articuloId, dto.fechaInicio, dto.fechaFin);
    }
}
