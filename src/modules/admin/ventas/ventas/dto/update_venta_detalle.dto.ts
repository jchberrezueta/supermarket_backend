import { Type } from 'class-transformer';
import { IsInt, IsNumber, Min } from 'class-validator';

export class UpdateVentaDetalleDTO {
  /**
   * Se permite -1 por compatibilidad con pantallas que envían
   * detalles nuevos dentro de una actualización.
   */
  @Type(() => Number)
  @IsInt()
  @Min(-1)
  ideDetaVent!: number;

  /**
   * Se permite -1 por compatibilidad con el flujo anterior.
   */
  @Type(() => Number)
  @IsInt()
  @Min(-1)
  ideVent!: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  ideProd!: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  cantidadProd!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  precioUnitarioProd!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  subtotalProd!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  dctoPromoProd!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  ivaProd!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  totalProd!: number;
}
