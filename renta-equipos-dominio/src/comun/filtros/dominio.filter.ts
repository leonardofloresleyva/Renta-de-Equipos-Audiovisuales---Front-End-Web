import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import {
  AdministradorConRegistrosError,
  AdminNoEncontradoError,
  ArticuloEnMantenimientoError,
  ArticuloNoEncontradoError,
  CancelacionReservaInvalidaError,
  CantidadExcesivaError,
  ClienteConRegistrosError,
  ClienteNoEncontradoError,
  ClienteYaExisteError,
  DatosInvalidosError,
  DepositoGarantiaRequeridoError,
  DisponibilidadInsuficienteError,
  EmailYaRegistradoError,
  ErrorDeDominio,
  EstadoAjusteNoValido,
  EstadoReservaInvalidoError,
  ExistenciasModificadasConcurrentementeError,
  FechasInvalidasError,
  NoSePuedeEliminarPropiaCuentaError,
  ReduccionStockInvalidaError,
  ReservaNoEncontradaError,
  SolicitudNoEncontradaError,
} from 'src/dominio/errores';
import { Response } from 'express';

@Catch(ErrorDeDominio)
export class DominioExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('Dominio');

  private codigoPara(error: ErrorDeDominio): number {
    if (
      error instanceof AdminNoEncontradoError ||
      error instanceof ArticuloNoEncontradoError ||
      error instanceof ClienteNoEncontradoError ||
      error instanceof ReservaNoEncontradaError ||
      error instanceof SolicitudNoEncontradaError
    ) { return HttpStatus.NOT_FOUND; }

    if (
      error instanceof DisponibilidadInsuficienteError ||
      error instanceof FechasInvalidasError ||
      error instanceof DepositoGarantiaRequeridoError ||
      error instanceof ArticuloEnMantenimientoError ||
      error instanceof ReduccionStockInvalidaError ||
      error instanceof ExistenciasModificadasConcurrentementeError ||
      error instanceof CancelacionReservaInvalidaError ||
      error instanceof EstadoReservaInvalidoError
    ) { return HttpStatus.CONFLICT; }

    if (
      error instanceof EmailYaRegistradoError ||
      error instanceof ClienteYaExisteError ||
      error instanceof DatosInvalidosError ||
      error instanceof CantidadExcesivaError ||
      error instanceof EstadoAjusteNoValido ||
      error instanceof NoSePuedeEliminarPropiaCuentaError ||
      error instanceof ClienteConRegistrosError ||
      error instanceof AdministradorConRegistrosError
    ) { return HttpStatus.CONFLICT; }

    return HttpStatus.INTERNAL_SERVER_ERROR;
  }

  catch(error: ErrorDeDominio, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<{ url: string; method: string }>();
    const estado = this.codigoPara(error);

    this.logger.warn(
      `${req.method} ${req.url} -> ${estado} ${error.constructor.name}`,
    );

    // Todos los errores de dominio responden con la MISMA forma. Asi el
    // frontend los maneja en un solo lugar.
    res.status(estado).json({
      statusCode: estado,
      error: error.constructor.name, // el nombre de la clase: "CupoLlenoError"
      message: error.message, // el texto que se puso en el constructor
      path: req.url,
      timestamp: new Date().toISOString(),
    });
  }
}
