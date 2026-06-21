import { Type } from 'class-transformer';
import { IsDateString, IsIn, IsInt, Min } from 'class-validator';

export class UpdateLoteDTO {
  @Type(() => Number)
  @IsInt()
  @Min(0)
  ideLote!: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  ideProd!: number;

  @IsDateString()
  fechaCaducidadLote!: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  stockLote!: number;

  @IsIn(['correcto', 'proximo', 'caducado', 'devuelto'])
  estadoLote!: 'correcto' | 'proximo' | 'caducado' | 'devuelto';
}
