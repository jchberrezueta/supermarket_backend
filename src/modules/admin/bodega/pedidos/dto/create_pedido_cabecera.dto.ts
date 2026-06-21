import { EnumEstadosPedido, EnumMotivosPedido } from '@models';
import { Transform, Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';

export class CreatePedidoCabeceraDTO {
  @Type(() => Number)
  @IsInt()
  @Min(0)
  ideEmpr!: number;

  @IsDateString()
  fechaPedi!: string;

  @IsDateString()
  fechaEntrPedi!: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  cantidadTotalPedi!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  totalPedi!: number;

  @IsEnum(EnumEstadosPedido)
  estadoPedi!: EnumEstadosPedido;

  @IsEnum(EnumMotivosPedido)
  motivoPedi!: EnumMotivosPedido;

  @IsOptional()
  @IsString()
  @Length(1, 250)
  @Transform(({ value }) =>
    typeof value === 'string' && value.trim() !== ''
      ? value.trim().toLowerCase()
      : 'ninguna',
  )
  observacionPedi?: string;
}
