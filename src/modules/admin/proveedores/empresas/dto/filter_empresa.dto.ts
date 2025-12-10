import { IsOptional, IsString, Length, IsEnum } from 'class-validator';
import { EnumEstadosEmpresa } from '@models';

export class FilterEmpresaDTO {

  @IsOptional()
  @IsString()
  @Length(1, 250)
  nombreEmp?: number;

  @IsOptional()
  @IsEnum(EnumEstadosEmpresa)
  estadoEmp?: EnumEstadosEmpresa;

  @IsOptional()
  @IsString()
  @Length(1, 250)
  responsableEmp?: string;

  toArray(): any[] {
    return [
      this.nombreEmp ?? null,
      this.estadoEmp ?? null,
      this.responsableEmp ?? null,
    ];
  }
}
