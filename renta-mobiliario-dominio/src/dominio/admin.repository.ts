import type { Administrador, AjusteExistencia, BitacoraReserva, NuevoAjusteExistencia, NuevoInspeccionPieza, PiezasMantenimiento, RegistroEntradaBitacora } from './entidades';

export interface AdminRepository {
  listar(): Promise<Administrador[]>;
  buscarPorId(id: number): Promise<Administrador | null>;
  crear(datos: Omit<Administrador, 'id'>): Promise<Administrador>;
  actualizar(id: number, datos: Partial<Administrador>): Promise<Administrador | null>;
  eliminar(id: number): Promise<Administrador | null>;
  obtenerCantidadPiezasMantenimiento(articuloId: number): Promise<number>;
  obtenerCantidadPiezasMantenimientoPeriodo(articuloId: number, fechaInicio: Date, fechaFin: Date): Promise<number>;
  registrarAjuste(datos: NuevoAjusteExistencia): Promise<AjusteExistencia>;
  registrarPiezasMantenimiento(datos: Omit<PiezasMantenimiento, 'id'>): Promise<PiezasMantenimiento>;
  registrarEntrega(registroEntrada: RegistroEntradaBitacora): Promise<BitacoraReserva>;
  obtenerBitacoraPorReserva(idFolio: number): Promise<BitacoraReserva | null>;
  registrarRecoleccion(bitacoraId: number, inspeccionesPiezas: NuevoInspeccionPieza[]): Promise<BitacoraReserva>;
}
