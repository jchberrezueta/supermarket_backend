import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { CreateVentaCabeceraDto } from './create-venta-cabecera.dto';
import { CreateVentaDetalleDto } from './create-venta-detalle.dto';

export class CreateVentaClienteDto {
  @ValidateNested()
  @Type(() => CreateVentaCabeceraDto)
  cabeceraVenta!: CreateVentaCabeceraDto;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateVentaDetalleDto)
  detalleVenta!: CreateVentaDetalleDto[];
}
