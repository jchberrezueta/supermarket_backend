import { IsOptional, IsString, Length, IsEnum } from 'class-validator';
import { EnumEstadoEmpresa } from '../enums/estado_empresa.enum';

export class FilterEmpresaDTO {

  @IsOptional()
  @IsString()
  @Length(1, 250)
  nombreEmp?: number;

  @IsOptional()
  @IsEnum(EnumEstadoEmpresa)
  estadoEmp?: EnumEstadoEmpresa;

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
