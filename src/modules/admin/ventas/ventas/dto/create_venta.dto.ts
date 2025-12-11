import { 
  ValidateNested,
  IsArray
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateVentaDetalleDTO } from './create_venta_detalle.dto';
import { CreateVentaCabeceraDTO } from './create_venta_cabecera.dto';

export class CreateVentaDTO {

  @ValidateNested()
  @Type( () => CreateVentaCabeceraDTO)
  cabeceraVenta: CreateVentaCabeceraDTO;

  @IsArray()
  @ValidateNested({each: true})
  @Type( () => CreateVentaDetalleDTO)
  detalleVenta: CreateVentaDetalleDTO[];

}