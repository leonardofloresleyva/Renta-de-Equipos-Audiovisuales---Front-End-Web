import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsInt, IsNumber, IsOptional, IsPositive, Min, ValidateNested } from 'class-validator';

export class InspeccionPiezaEntradaDto {
  @IsInt({ message: 'El Id del artículo reservado debe ser un entero' })
  @IsPositive({ message: 'El Id del artículo reservado debe ser positivo' })
  articuloReservadoId!: number;

  @IsInt({ message: 'Las piezas completas deben ser un entero' })
  @Min(0, { message: 'Las piezas completas no pueden ser negativas' })
  piezasCompletas!: number;

  @IsOptional()
  @IsInt({ message: 'Las piezas dañadas deben ser un entero' })
  @Min(0, { message: 'Las piezas dañadas no pueden ser negativas' })
  piezasDaniadas?: number;

  @IsOptional()
  @IsInt({ message: 'Las piezas faltantes deben ser un entero' })
  @Min(0, { message: 'Las piezas faltantes no pueden ser negativas' })
  piezasFaltantes?: number;

  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'El monto de garantía debe ser un número' },
  )
  @Min(0, { message: 'El monto de garantía no puede ser negativo' })
  montoGarantia?: number;
}

export class RegistrarRecoleccionDto {
  @IsArray({ message: 'Las inspecciones de piezas deben ser un arreglo' })
  @ArrayNotEmpty({
    message: 'Debe incluir por lo menos una inspección de piezas',
  })
  @ValidateNested({ each: true })
  @Type(() => InspeccionPiezaEntradaDto)
  inspeccionesPiezas!: InspeccionPiezaEntradaDto[];
}
