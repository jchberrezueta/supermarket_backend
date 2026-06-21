import { Type } from 'class-transformer';
import { IsInt, IsNumber, Min } from 'class-validator';

export class CreateEmpresaPrecioDTO {
  @Type(() => Number)
  @IsInt()
  @Min(0)
  ideEmpr!: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  ideProd!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  precioCompraProd!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  dctoCompraProd!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  dctoCaducidadProd!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  ivaProd!: number;
}
