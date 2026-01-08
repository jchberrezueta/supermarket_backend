import { IsOptional, IsEnum, IsDateString, IsString } from 'class-validator';
import { EnumEstadosPedido, EnumMotivosPedido } from '@models';

export class FilterPedidoDTO {

  @IsOptional()
  @IsString()
  nombreEmpr?: string;

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
      this.nombreEmpr ?? null,
      this.estadoPedi ?? null,
      this.motivoPedi ?? null,
      this.fechaPedi ?? null,
      this.fechaEntrPedi ?? null
    ];
  }
}
