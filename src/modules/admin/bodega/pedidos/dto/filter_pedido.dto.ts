import { IsOptional, IsEnum, Min, IsDateString, IsInt } from 'class-validator';
import { EnumEstadoPedido } from '../enums/estado_pedido.enum';
import { EnumMotivoPedido } from '../enums/motivo_pedido.enum';
import { isIntNumeric } from 'src/helpers/utilities';
import { Transform } from 'class-transformer';

export class FilterPedidoDTO {

  @IsOptional()
  @Transform(({value}) => isIntNumeric(value) ? (+value) : -1 )
  @IsInt()
  @Min(0)
  ideEmp?: number;

  @IsOptional()
  @IsEnum(EnumEstadoPedido)
  estadoPedi?: EnumEstadoPedido;

  @IsOptional()
  @IsEnum(EnumMotivoPedido)
  motivoPedi?: EnumMotivoPedido;

  @IsOptional()
  @IsDateString()
  fechaPedi?: Date;

  @IsOptional()
  @IsDateString()
  fechaEntrPedi?: Date;

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
