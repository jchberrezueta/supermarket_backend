import { IsOptional, IsInt, IsString, Min, Max, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export enum EstadoCuenta {
  ACTIVO = 'activo',
  INACTIVO = 'inactivo',
}

export class FiltroCuentaDto {
  @IsOptional()
  @IsString()
  usuario_cuen?: string;

  @IsOptional()
  @IsEnum(EstadoCuenta)
  estado_cuen?: EstadoCuenta;

  @IsOptional()
  @IsString()
  ide_empl?: string; // para buscar por nombre, código, etc.

  @IsOptional()
  @IsString()
  ide_perf?: string;
}


/*
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  estado?: number;
*/
