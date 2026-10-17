import {
  BadRequestException,
  ConflictException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  ParseIntPipe,
  Post,
  Body,
} from '@nestjs/common';
import { NuevoInspeccionPieza } from 'src/dominio/entidades';
import {
  DepositoGarantiaRequeridoError,
  ReservaNoEncontradaError,
} from 'src/dominio/errores';
import { OperacionesService } from './operaciones.service';

@Controller('operaciones')
export class OperacionesController {
  constructor(private readonly operacionesService: OperacionesService) {}

  @Get('bitacoras')
  listarBitacoras() {
    return this.operacionesService.listarBitacoras();
  }

  @Get('bitacoras/reserva/:reservaId')
  async buscarBitacoraPorReserva(
    @Param('reservaId', ParseIntPipe) reservaId: number
  ) {
    this.validarId(reservaId);
    const bitacora =
      await this.operacionesService.buscarBitacoraPorReserva(reservaId);
    if (!bitacora) {
      throw new NotFoundException(
        `No se encontró una bitácora para la reserva ${reservaId}.`
      );
    }
    return bitacora;
  }

  @Get('bitacoras/:id')
  async buscarBitacoraPorId(@Param('id', ParseIntPipe) id: number) {
    this.validarId(id);
    const bitacora = await this.operacionesService.buscarBitacoraPorId(id);
    if (!bitacora) {
      throw new NotFoundException(`No se encontró la bitácora ${id}.`);
    }
    return bitacora;
  }

  @Post('bitacoras')
  async registrarEntrega(@Body() body: unknown) {
    const reservaId = this.validarReservaId(body);
    try {
      return await this.operacionesService.registrarEntrega(reservaId);
    } catch (error) {
      if (error instanceof ReservaNoEncontradaError) {
        throw new NotFoundException(error.message);
      }
      if (error instanceof DepositoGarantiaRequeridoError) {
        throw new ConflictException(error.message);
      }
      throw error;
    }
  }

  @Patch('bitacoras/:id')
  async registrarRecoleccion(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: unknown
  ) {
    this.validarId(id);
    const inspeccionesPiezas = this.validarInspecciones(body);
    const bitacora = await this.operacionesService.registrarRecoleccion(
      id,
      inspeccionesPiezas
    );
    if (!bitacora) {
      throw new NotFoundException(`No se encontró la bitácora ${id}.`);
    }
    return bitacora;
  }

  private validarId(id: number): void {
    if (!Number.isSafeInteger(id) || id <= 0) {
      throw new BadRequestException('El identificador debe ser un entero positivo.');
    }
  }

  private validarReservaId(body: unknown): number {
    if (
      typeof body !== 'object' ||
      body === null ||
      !('reservaId' in body) ||
      !Number.isSafeInteger(body.reservaId) ||
      (body.reservaId as number) <= 0
    ) {
      throw new BadRequestException(
        'El cuerpo debe incluir un reservaId entero positivo.'
      );
    }
    return body.reservaId as number;
  }

  private validarInspecciones(body: unknown): NuevoInspeccionPieza[] {
    if (
      typeof body !== 'object' ||
      body === null ||
      !('inspeccionesPiezas' in body) ||
      !Array.isArray(body.inspeccionesPiezas) ||
      body.inspeccionesPiezas.length === 0
    ) {
      throw new BadRequestException(
        'El cuerpo debe incluir un arreglo no vacío de inspeccionesPiezas.'
      );
    }

    return body.inspeccionesPiezas.map((inspeccion: unknown, index: number) => {
      if (typeof inspeccion !== 'object' || inspeccion === null) {
        throw new BadRequestException(
          `La inspección en la posición ${index} debe ser un objeto.`
        );
      }

      const registro = inspeccion as Record<string, unknown>;
      const {
        articuloReservadoId,
        piezasCompletas,
        piezasDaniadas,
        piezasFaltantes,
        montoGarantia,
      } = registro;

      if (
        !Number.isSafeInteger(articuloReservadoId) ||
        (articuloReservadoId as number) <= 0
      ) {
        throw new BadRequestException(
          `La inspección en la posición ${index} requiere un articuloReservadoId entero positivo.`
        );
      }

      this.validarCantidad(piezasCompletas, 'piezasCompletas', index, true);
      this.validarCantidad(piezasDaniadas, 'piezasDaniadas', index, false);
      this.validarCantidad(piezasFaltantes, 'piezasFaltantes', index, false);
      this.validarCantidad(montoGarantia, 'montoGarantia', index, false);

      return {
        articuloReservadoId: articuloReservadoId as number,
        piezasCompletas: piezasCompletas as number,
        ...(piezasDaniadas !== undefined && {
          piezasDaniadas: piezasDaniadas as number,
        }),
        ...(piezasFaltantes !== undefined && {
          piezasFaltantes: piezasFaltantes as number,
        }),
        ...(montoGarantia !== undefined && {
          montoGarantia: montoGarantia as number,
        }),
      };
    });
  }

  private validarCantidad(
    valor: unknown,
    campo: string,
    indice: number,
    requerido: boolean
  ): void {
    if (valor === undefined && !requerido) return;

    const esMonto = campo === 'montoGarantia';
    const esValido = esMonto
      ? typeof valor === 'number' && Number.isFinite(valor) && valor >= 0
      : Number.isSafeInteger(valor) && (valor as number) >= 0;
    if (!esValido) {
      const formato = esMonto ? 'un número no negativo' : 'un entero no negativo';
      throw new BadRequestException(
        `La inspección en la posición ${indice} requiere ${campo} como ${formato}.`
      );
    }
  }
}
