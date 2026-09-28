import type { MotivoAjuste } from '../dominio/entidades';

export interface CrearAjusteExistenciaDto {
  articuloId: number | string;
  adminId: number | string;
  cantidad: number;
  tipo: boolean;
  motivo: MotivoAjuste;
  fechaHora?: Date | string;
}
