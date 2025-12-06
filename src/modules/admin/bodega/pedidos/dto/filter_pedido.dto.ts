import { IsOptional, IsString, Length, IsEnum, IsNumber, Min, IsDateString } from 'class-validator';
import { EnumEstadoPedido } from '../enums/estado_pedido.enum';
import { EnumMotivoPedido } from '../enums/motivo_pedido.enum';

export class FilterPedidoDTO {

  @IsNumber()
  @Min(0)
  ideEmp: number;

  @IsEnum(EnumEstadoPedido)
  estadoPedi: EnumEstadoPedido;

  @IsEnum(EnumMotivoPedido)
  motivoPedi: EnumMotivoPedido;

  @IsDateString()
  fechaPedi: Date;

  @IsDateString()
  fechaEntrPedi: Date;

  toArray(): any[] {
    return [
      this.ideEmp,
      this.estadoPedi,
      this.motivoPedi,
      this.fechaPedi,
      this.fechaEntrPedi
    ];
  }
}
