import { IsOptional, IsEnum, Min, IsDateString, IsInt } from 'class-validator';
import { isIntNumeric } from 'src/helpers/utilities';
import { Transform } from 'class-transformer';
import { EnumEstadosPedido, EnumMotivosPedido } from '@models';

export class FilterPedidoDTO {

  @IsOptional()
  @Transform(({value}) => isIntNumeric(value) ? (+value) : -1 )
  @IsInt()
  @Min(0)
  ideEmp?: number;

  @IsOptional()
  @IsEnum(EnumEstadosPedido)
  estadoPedi?: EnumEstadosPedido;

  @IsOptional()
  @IsEnum(EnumMotivosPedido)
  motivoPedi?: EnumMotivosPedido;

  @IsOptional()
  @IsDateString()
  fechaPedi?: string;

  @IsOptional()
  @IsDateString()
  fechaEntrPedi?: string;

  toArray(): any[] {
    return [
      this.ideEmp ?? null,
      this.estadoPedi ?? null,
      this.motivoPedi ?? null,
      this.fechaPedi ?? null,
      this.fechaEntrPedi ?? null
    ];
  }
}
