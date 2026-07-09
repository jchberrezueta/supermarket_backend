import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { CreateEntregaCabeceraDTO } from './create_entrega_cabecera.dto';
import { CreateEntregaDetalleDTO } from './create_entrega_detalle.dto';

export class CreateEntregaDTO {
  @ValidateNested()
  @Type(() => CreateEntregaCabeceraDTO)
  cabeceraEntrega!: CreateEntregaCabeceraDTO;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateEntregaDetalleDTO)
  detalleEntrega!: CreateEntregaDetalleDTO[];
}
