import { EnumEstadosEmpresa } from '@models';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString, Length } from 'class-validator';

export class FilterEmpresaDTO {
  @IsOptional()
  @IsString()
  @Length(1, 250)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== '' ? value.trim() : undefined,
  )
  nombreEmp?: string;

  @IsOptional()
  @IsEnum(EnumEstadosEmpresa)
  estadoEmp?: EnumEstadosEmpresa;

  @IsOptional()
  @IsString()
  @Length(1, 250)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== '' ? value.trim() : undefined,
  )
  responsableEmp?: string;
}
