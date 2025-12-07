import { IsOptional, IsString, Length, IsEnum, IsNumber, Min, IsDateString } from 'class-validator';
import { EnumEstadoPedido } from '../enums/estado_pedido.enum';
import { EnumMotivoPedido } from '../enums/motivo_pedido.enum';

export class FilterPedidoDTO {
  @IsOptional()
  @IsNumber()
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
