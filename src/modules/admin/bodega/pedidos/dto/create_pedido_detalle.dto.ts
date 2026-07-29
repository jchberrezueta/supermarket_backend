import { EnumEstadoDetallePedido } from '@models';
import { Transform } from 'class-transformer';
import { Allow, IsInt, Min } from 'class-validator';
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
