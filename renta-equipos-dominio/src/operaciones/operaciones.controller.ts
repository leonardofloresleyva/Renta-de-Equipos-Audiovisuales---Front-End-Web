import { Body, Controller, Get, NotFoundException, Param, ParseIntPipe, Patch, Post} from '@nestjs/common';
import { aBitacoraReservaDto } from './dto/bitacora-reserva.respuesta.dto';
import { RegistrarEntregaDto } from './dto/registrar-entrega.dto';
import { RegistrarRecoleccionDto } from './dto/registrar-recoleccion.dto';
import { OperacionesService } from './operaciones.service';

@Controller('operaciones')
export class OperacionesController {
  constructor(private readonly operacionesService: OperacionesService) {}

  @Get('bitacoras')
  async listarBitacoras() {
    const bitacoras = await this.operacionesService.listarBitacoras();
    return bitacoras.map(aBitacoraReservaDto);
  }

  @Get('bitacoras/reserva/:reservaId')
  async buscarBitacoraPorReserva(
    @Param('reservaId', ParseIntPipe) reservaId: number,
  ) {
    const bitacora =
      await this.operacionesService.buscarBitacoraPorReserva(reservaId);
    if (!bitacora) {
      throw new NotFoundException(
        `No se encontró una bitácora para la reserva ${reservaId}.`,
      );
    }
    return aBitacoraReservaDto(bitacora);
  }

  @Get('bitacoras/:id')
  async buscarBitacoraPorId(@Param('id', ParseIntPipe) id: number) {
    const bitacora = await this.operacionesService.buscarBitacoraPorId(id);
    if (!bitacora) {
      throw new NotFoundException(`No se encontró la bitácora ${id}.`);
    }
    return aBitacoraReservaDto(bitacora);
  }

  @Post('bitacoras')
  async registrarEntrega(@Body() dto: RegistrarEntregaDto) {
    const bitacora = await this.operacionesService.registrarEntrega(
      dto.reservaId,
    );
    return aBitacoraReservaDto(bitacora);
  }

  @Patch('bitacoras/:id')
  async registrarRecoleccion(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: RegistrarRecoleccionDto,
  ) {
    const bitacora = await this.operacionesService.registrarRecoleccion(
      id,
      dto.inspeccionesPiezas,
    );
    if (!bitacora) {
      throw new NotFoundException(`No se encontró la bitácora ${id}.`);
    }
    return aBitacoraReservaDto(bitacora);
  }
}
