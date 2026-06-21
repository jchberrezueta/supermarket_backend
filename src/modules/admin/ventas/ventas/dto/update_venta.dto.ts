import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { UpdateVentaCabeceraDTO } from './update_venta_cabecera.dto';
import { UpdateVentaDetalleDTO } from './update_venta_detalle.dto';

export class UpdateVentaDTO {
  @ValidateNested()
  @Type(() => UpdateVentaCabeceraDTO)
  cabeceraVenta!: UpdateVentaCabeceraDTO;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateVentaDetalleDTO)
  detalleVenta!: UpdateVentaDetalleDTO[];
}
