import { EnumEstadosPedido, EnumMotivosPedido } from '@models';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class FilterPedidoDTO {
  @IsOptional()
  @IsString()
  @Length(1, 250)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== '' ? value.trim() : null,
  )
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
}
