import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UpdateEntregaCabeceraDTO } from './update_entrega_cabecera.dto';
import { UpdateEntregaDetalleDTO } from './update_entrega_detalle.dto';


export class UpdateEntregaDTO {

  @ValidateNested()
  @Type( () => UpdateEntregaCabeceraDTO)
  cabeceraEntrega: UpdateEntregaCabeceraDTO;

  @IsArray()
  @ValidateNested({each: true})
  @Type( () => UpdateEntregaDetalleDTO)
  detalleEntrega: UpdateEntregaDetalleDTO[];

}