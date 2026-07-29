import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsNumber, Max, Min } from 'class-validator';

function toRequiredInt(value: unknown): number | unknown {
  if (value === null || value === undefined || value === '') {
    return value;
  }

  const numberValue = Number(value);

  if (Number.isInteger(numberValue)) {
    return numberValue;
  }

  return value;
}

function toRequiredNumber(value: unknown): number | unknown {
  if (value === null || value === undefined || value === '') {
    return value;
  }

  const numberValue = Number(value);

  if (Number.isFinite(numberValue)) {
    return numberValue;
  }

  return value;
}

enum EnumEstadosEmpresaProducto {
  ACTIVO = 'activo',
  INACTIVO = 'inactivo',
}

export class UpdateEmpresaPrecioDTO {
  @Transform(({ value }) => toRequiredInt(value))
  @IsInt()
  @Min(1)
  ideEmprProd!: number;

  @Transform(({ value }) => toRequiredInt(value))
  @IsInt()
  @Min(1)
  ideEmpr!: number;

  @Transform(({ value }) => toRequiredInt(value))
  @IsInt()
  @Min(1)
  ideProd!: number;

  @Transform(({ value }) => toRequiredNumber(value))
  @IsNumber()
  @Min(0.01)
  precioCompraProd!: number;

  @Transform(({ value }) => toRequiredNumber(value))
  @IsNumber()
  @Min(0)
  dctoCompraProd!: number;

  @Transform(({ value }) => toRequiredNumber(value))
  @IsNumber()
  @Min(0)
  dctoCaducidadProd!: number;

  @Transform(({ value }) => toRequiredNumber(value))
  @IsNumber()
  @Min(0)
  @Max(100)
  ivaProd!: number;

  @IsEnum(EnumEstadosEmpresaProducto)
  estadoEmprProd!: EnumEstadosEmpresaProducto;
}
