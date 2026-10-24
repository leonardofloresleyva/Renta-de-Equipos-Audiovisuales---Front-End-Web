import { BitacoraReserva } from 'src/dominio/entidades';

export interface BitacoraReservaRespuestaDto {
  id: number;
  reservaId: number;
  fechaHoraEntregada: Date;
  fechaHoraRecolectada?: Date;
  montoTotalGarantía: number;
}

export function aBitacoraReservaDto(
  bitacora: BitacoraReserva,
): BitacoraReservaRespuestaDto {
  return {
    id: bitacora.id,
    reservaId: bitacora.reservaId,
    fechaHoraEntregada: bitacora.fechaHoraEntregada,
    ...(bitacora.fechaHoraRecolectada && {
      fechaHoraRecolectada: bitacora.fechaHoraRecolectada,
    }),
    montoTotalGarantía: bitacora.montoTotalGarantia,
  };
}
