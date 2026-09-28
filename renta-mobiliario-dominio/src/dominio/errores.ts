export class ErrorDominio extends Error {
  constructor(mensaje: string) {
    super(mensaje);
    this.name = 'ErrorDominio';
  }
}

/* =========================================================
   Errores de Entidades No Encontradas
   ========================================================= */

export class AdminNoEncontradoError extends ErrorDominio {
  constructor(id?: number | string) {
    super(
      id
        ? `Administrador con ID ${id} no encontrado.`
        : 'Administrador no encontrado.'
    );
    this.name = 'AdminNoEncontradoError';
  }
}

export class ArticuloNoEncontradoError extends ErrorDominio {
  constructor(id?: number | string) {
    super(
      id
        ? `Artículo con ID ${id} no encontrado.`
        : 'Artículo no encontrado.'
    );
    this.name = 'ArticuloNoEncontradoError';
  }
}

export class ClienteNoEncontradoError extends ErrorDominio {
  constructor(id?: number | string) {
    super(
      id
        ? `Cliente con ID ${id} no encontrado.`
        : 'Cliente no encontrado.'
    );
    this.name = 'ClienteNoEncontradoError';
  }
}

export class ReservaNoEncontradaError extends ErrorDominio {
  constructor(id?: number | string) {
    super(
      id
        ? `Reserva con ID ${id} no encontrada.`
        : 'Reserva no encontrada.'
    );
    this.name = 'ReservaNoEncontradaError';
  }
}

/* =========================================================
   Errores de Validación y Duplicidad
   ========================================================= */

export class EmailYaRegistradoError extends ErrorDominio {
  constructor(email?: string) {
    super(
      email
        ? `El correo electrónico '${email}' ya se encuentra registrado.`
        : 'El correo electrónico ya se encuentra registrado.'
    );
    this.name = 'EmailYaRegistradoError';
  }
}

export class ClienteYaExisteError extends ErrorDominio {
  constructor(mensaje = 'El cliente ya se encuentra registrado en el sistema.') {
    super(mensaje);
    this.name = 'ClienteYaExisteError';
  }
}

export class DatosInvalidosError extends ErrorDominio {
  constructor(mensaje = 'Los datos proporcionados son inválidos o incompletos.') {
    super(mensaje);
    this.name = 'DatosInvalidosError';
  }
}

/* =========================================================
   Errores de Reglas de Negocio del Dominio de Renta
   ========================================================= */

/**
 * Regla de negocio 01: No se puede confirmar una reserva si no hay piezas disponibles en el rango.
 */
export class DisponibilidadInsuficienteError extends ErrorDominio {
  constructor(articuloNombre?: string) {
    super(
      articuloNombre
        ? `No hay suficientes piezas disponibles del artículo '${articuloNombre}' para el período solicitado.`
        : 'No hay piezas disponibles de alguno de los artículos seleccionados para el período solicitado.'
    );
    this.name = 'DisponibilidadInsuficienteError';
  }
}

/**
 * Regla de negocio 02: Fechas de recolección/entrega inválidas o pasadas (duración mínima de un día).
 */
export class FechasReservaInvalidasError extends ErrorDominio {
  constructor(
    mensaje = 'Las fechas de la reserva son inválidas. La fecha de fin debe ser posterior a la de inicio y no puede ser una fecha pasada.'
  ) {
    super(mensaje);
    this.name = 'FechasReservaInvalidasError';
  }
}

/**
 * Regla de negocio 03: Prohibición de confirmar una reserva sin depósito en garantía.
 */
export class DepositoGarantiaRequeridoError extends ErrorDominio {
  constructor(
    mensaje = 'No se puede confirmar la reserva sin haber cubierto el depósito en garantía estimado.'
  ) {
    super(mensaje);
    this.name = 'DepositoGarantiaRequeridoError';
  }
}

/**
 * Regla de negocio 04 / 06: Exclusión de disponibilidad y reincorporación por daño o mantenimiento.
 */
export class ArticuloEnMantenimientoError extends ErrorDominio {
  constructor(
    mensaje = 'El artículo reporta avería o se encuentra en mantenimiento y no está disponible para renta.'
  ) {
    super(mensaje);
    this.name = 'ArticuloEnMantenimientoError';
  }
}

/**
 * Regla de negocio 05: Prohibición de decremento de existencias por debajo de lo ya reservado.
 */
export class ReduccionStockInvalidaError extends ErrorDominio {
  constructor(
    mensaje = 'No se pueden reducir las existencias de un artículo por debajo de las piezas comprometidas en reservas activas o mantenimiento.'
  ) {
    super(mensaje);
    this.name = 'ReduccionStockInvalidaError';
  }
}

/**
 * Regla de negocio 06: Prohibición de cancelar reservas cuyos artículos ya hayan sido entregados.
 */
export class CancelacionReservaInvalidaError extends ErrorDominio {
  constructor(
    mensaje = 'No se puede cancelar una reserva cuyos artículos ya han sido entregados o finalizados.'
  ) {
    super(mensaje);
    this.name = 'CancelacionReservaInvalidaError';
  }
}

/**
 * Error para cambios de estado no permitidos en el ciclo de vida de la reserva.
 */
export class EstadoReservaInvalidoError extends ErrorDominio {
  constructor(mensaje = 'La transición solicitada no es válida para el estado actual de la reserva.') {
    super(mensaje);
    this.name = 'EstadoReservaInvalidoError';
  }
}
