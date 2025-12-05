import { IsOptional, IsString, Length, IsEnum } from 'class-validator';
import { EstadoEmpresa } from '../enums/estado_empresa.enum';

export class FilterEmpresaDTO {

  @IsOptional()
  @IsString()
  @Length(1, 250)
  nombreEmpr?: number;

  @IsOptional()
  @IsEnum(EstadoEmpresa)
  estadoEmp?: EstadoEmpresa;

  @IsOptional()
  @IsString()
  @Length(1, 250)
  responsableEmp?: string;

  toArray(): any[] {
    return [
      this.nombreEmpr ?? null,
      this.estadoEmp ?? null,
      this.responsableEmp ?? null,
    ];
  }
}
