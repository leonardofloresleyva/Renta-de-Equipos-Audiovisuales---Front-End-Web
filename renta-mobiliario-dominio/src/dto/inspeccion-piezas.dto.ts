export interface CrearInspeccionPiezasDto {
  bitacoraReservaId: number | string;
  articuloReservadoId: number | string;
  piezasCompletas: number;
  piezasDanadas: number;
  piezasFaltantes: number;
  montoGarantia: number;
}
