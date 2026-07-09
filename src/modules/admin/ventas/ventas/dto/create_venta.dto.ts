import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { CreateVentaCabeceraDTO } from './create_venta_cabecera.dto';
import { CreateVentaDetalleDTO } from './create_venta_detalle.dto';

export class CreateVentaDTO {
  @ValidateNested()
  @Type(() => CreateVentaCabeceraDTO)
  cabeceraVenta!: CreateVentaCabeceraDTO;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateVentaDetalleDTO)
  detalleVenta!: CreateVentaDetalleDTO[];
}
