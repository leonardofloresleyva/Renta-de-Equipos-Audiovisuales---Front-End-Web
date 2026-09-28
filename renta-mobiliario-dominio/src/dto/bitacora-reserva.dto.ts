export interface InspeccionPiezaItemDto {
  articuloReservadoId?: number | string;
  articuloId?: number | string;
  piezasCompletas: number;
  piezasDanadas: number;
  piezasFaltantes: number;
  montoGarantia: number;
}

export interface CrearBitacoraReservaDto {
  reservaId: number | string;
  fechaHoraRecolectada: Date | string;
  fechaHoraEntregada: Date | string;
  montoTotalGarantia: number;
  inspecciones?: InspeccionPiezaItemDto[];
}
