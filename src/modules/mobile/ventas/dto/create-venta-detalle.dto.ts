import { IsInt, IsNumber, IsOptional, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateVentaDetalleDto {
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(0)
  ideProd!: number;

  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  cantidadProd!: number;

  @Transform(({ value }) => Number(value ?? 0))
  @IsNumber()
  @Min(0)
  @IsOptional()
  precioUnitarioProd = 0;

  @Transform(({ value }) => Number(value ?? 0))
  @IsNumber()
  @Min(0)
  @IsOptional()
  subtotalProd = 0;

  @Transform(({ value }) => Number(value ?? 0))
  @IsNumber()
  @Min(0)
  @IsOptional()
  ivaProd = 0;

  @Transform(({ value }) => Number(value ?? 0))
  @IsNumber()
  @Min(0)
  @IsOptional()
  dctoPromoProd = 0;

  @Transform(({ value }) => Number(value ?? 0))
  @IsNumber()
  @Min(0)
  @IsOptional()
  totalProd = 0;
}
