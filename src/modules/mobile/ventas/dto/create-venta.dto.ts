import { ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateVentaCabeceraDto } from './create-venta-cabecera.dto';
import { CreateVentaDetalleDto } from './create-venta-detalle.dto';

export class CreateVentaClienteDto {

    @ValidateNested()
    @Type(() => CreateVentaCabeceraDto)
    cabeceraVenta: CreateVentaCabeceraDto;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateVentaDetalleDto)
    detalleVenta: CreateVentaDetalleDto[];
}
