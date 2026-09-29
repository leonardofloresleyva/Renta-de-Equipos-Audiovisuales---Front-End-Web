export interface AjustarExistenciaDto {
    articuloId: number;
    adminId: number;
    cantidad: number;
    esIncremento: boolean;
    motivo: 'perdida' | 'adquisicion' | 'deterioro';
}