import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateVentaDetalleDTO } from './update_venta_detalle.dto';
import { UpdateVentaCabeceraDTO } from './update_venta_cabecera.dto';


export class UpdateVentaDTO {

  @ValidateNested()
  @Type( () => UpdateVentaCabeceraDTO)
  cabecerVenta: UpdateVentaCabeceraDTO;

  @IsArray()
  @ValidateNested({each: true})
  @Type( () => UpdateVentaDetalleDTO)
  detalleVenta: UpdateVentaDetalleDTO[];

}