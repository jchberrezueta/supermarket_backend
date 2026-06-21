import { Transform, Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class CreateProductoDTO {
  @Type(() => Number)
  @IsInt()
  @Min(0)
  ideCate!: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  ideMarc!: number;

  @IsString()
  @Length(1, 30)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== ''
      ? value.trim().toLowerCase()
      : null,
  )
  codigoBarraProd!: string;

  @IsString()
  @Length(1, 100)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== ''
      ? value.trim().toLowerCase()
      : null,
  )
  nombreProd!: string;

  @IsOptional()
  @IsString()
  @Length(1, 500)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== '' ? value.trim() : null,
  )
  urlImgProd?: string | null;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  precioVentaProd!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  ivaProd!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  dctoPromoProd!: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  stockProd!: number;

  @IsIn(['si', 'no'])
  disponibleProd!: 'si' | 'no';

  @IsIn(['activo', 'inactivo'])
  estadoProd!: 'activo' | 'inactivo';

  @IsString()
  @Length(1, 250)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== ''
      ? value.trim().toLowerCase()
      : 'ninguna',
  )
  descripcionProd!: string;
}
