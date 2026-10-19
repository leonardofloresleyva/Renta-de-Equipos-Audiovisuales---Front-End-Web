import { Body, Controller, Get } from '@nestjs/common';
import { DisponibilidadService } from './disponibilidad.service';
import { VerificarDisponibilidadDto } from './dto/verificar.disponibilidad.dto';

@Controller('disponibilidad')
export class DisponibilidadController {
    constructor(private readonly servicio: DisponibilidadService) {}

    @Get(":id")
    async obtenerDisponibilidadPeriodo(@Body() dto: VerificarDisponibilidadDto) {
        return this.servicio.obtenerDisponibilidadPeriodo(dto.articuloId, dto.fechaInicio, dto.fechaFin);
    }
}
