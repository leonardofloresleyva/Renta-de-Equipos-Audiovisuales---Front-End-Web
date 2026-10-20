import { IsBoolean, IsIn, IsInt, IsPositive } from 'class-validator';

const MOTIVOS_AJUSTE = ['perdida', 'adquisicion', 'deterioro'] as const;

export class AjustarExistenciaDto {
  @IsInt({ message: 'El ID del artículo debe ser un número entero.' })
  @IsPositive({ message: 'El ID del artículo debe ser positivo.' })
  articuloId!: number;

  @IsInt({ message: 'El ID del administrador debe ser un número entero.' })
  @IsPositive({ message: 'El ID del administrador debe ser positivo.' })
  adminId!: number;

  @IsInt({ message: 'La cantidad debe ser un número entero.' })
  @IsPositive({ message: 'La cantidad debe ser mayor que cero.' })
  cantidad!: number;

  @IsBoolean({ message: 'El campo esIncremento debe ser verdadero o falso.' })
  esIncremento!: boolean;

  @IsIn(MOTIVOS_AJUSTE, {
    message: 'El motivo debe ser pérdida, adquisición o deterioro.',
  })
  motivo!: (typeof MOTIVOS_AJUSTE)[number];
}
