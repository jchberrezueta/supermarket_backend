import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { CreateVentaDetalleDTO } from './create_venta_detalle.dto';
import { UpdateVentaCabeceraDTO } from './update_venta_cabecera.dto';

export class UpdateVentaDTO {
  @ValidateNested()
  @Type(() => UpdateVentaCabeceraDTO)
  cabeceraVenta!: UpdateVentaCabeceraDTO;

  /**
   * En actualización se reemplazan los detalles completos de la venta.
   * Por eso se usa CreateVentaDetalleDTO: los detalles nuevos no necesitan
   * ideDetaVent obligatorio.
   */
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateVentaDetalleDTO)
  detalleVenta!: CreateVentaDetalleDTO[];
}
