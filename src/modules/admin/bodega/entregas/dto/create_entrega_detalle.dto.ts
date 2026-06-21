import { EnumEstadoDetalleEntrega } from '@models';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateEntregaDetalleDTO {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  ideDetaEntr?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  ideEntr?: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  ideProd!: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  cantidadProd!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  precioUnitarioProd!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  subtotalProd!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  dctoCompraProd!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  ivaProd!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  totalProd!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  dctoCaducProd!: number;

  @IsEnum(EnumEstadoDetalleEntrega)
  estadoDetaEntr!: EnumEstadoDetalleEntrega;
}
