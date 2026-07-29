import { EnumEstadoDetallePedido } from '@models';
import { Transform, Type } from 'class-transformer';
import {
  Allow,
  IsArray,
  IsInt,
  IsOptional,
  Min,
  ValidateNested,
} from 'class-validator';
import { CreatePedidoLoteDevolucionDTO } from './create_pedido_lote_devolucion.dto';

function toRequiredInt(value: unknown): number | unknown {
  if (value === null || value === undefined || value === '') {
    return value;
  }

  const numberValue = Number(value);

  return Number.isInteger(numberValue) ? numberValue : value;
}

export class CreatePedidoDetalleDTO {
  @Transform(({ value }) => toRequiredInt(value))
  @IsInt()
  @Min(1)
  ideProd!: number;

  @Transform(({ value }) => toRequiredInt(value))
  @IsInt()
  @Min(1)
  cantidadProd!: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({
    each: true,
  })
  @Type(() => CreatePedidoLoteDevolucionDTO)
  lotesDevolucion: CreatePedidoLoteDevolucionDTO[] = [];

  /*
   * Campos internos calculados
   * exclusivamente por el backend.
   */

  @Allow()
  precioUnitarioProd = 0;

  @Allow()
  subtotalProd = 0;

  @Allow()
  dctoCompraProd = 0;

  @Allow()
  ivaProd = 0;

  @Allow()
  totalProd = 0;

  @Allow()
  dctoCaducProd = 0;

  @Allow()
  estadoDetaPedi: EnumEstadoDetallePedido = EnumEstadoDetallePedido.PENDIENTE;
}
