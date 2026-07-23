import { EnumEstadoDetallePedido } from '@models';
import { Transform } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

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

  /** Campos internos calculados después de validar el payload mínimo. */
  precioUnitarioProd: number = 0;
  subtotalProd: number = 0;
  dctoCompraProd: number = 0;
  ivaProd: number = 0;
  totalProd: number = 0;
  dctoCaducProd: number = 0;
  estadoDetaPedi: EnumEstadoDetallePedido = EnumEstadoDetallePedido.PENDIENTE;
}
