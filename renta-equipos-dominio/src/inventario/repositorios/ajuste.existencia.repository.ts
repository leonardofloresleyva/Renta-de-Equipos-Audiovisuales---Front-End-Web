import { AjusteExistencia, FiltrosAjusteExistencia, NuevoAjusteExistencia } from "src/dominio/entidades";

export interface AjusteExistenciaRepository {
    listar(): Promise<AjusteExistencia[]>;
    buscarPorId(id: number): Promise<AjusteExistencia | null>;
    busquedaFiltrada(filtros: FiltrosAjusteExistencia): Promise<AjusteExistencia[]>;
    crear(datos: NuevoAjusteExistencia): Promise<AjusteExistencia>;
    crearConActualizacionExistencias(
        datos: NuevoAjusteExistencia,
        existenciasActuales: number,
        existenciasNuevas: number
    ): Promise<AjusteExistencia>;
}