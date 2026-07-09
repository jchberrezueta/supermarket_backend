import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { CreateEntregaDetalleDTO } from './create_entrega_detalle.dto';
import { UpdateEntregaCabeceraDTO } from './update_entrega_cabecera.dto';

export class UpdateEntregaDTO {
  @ValidateNested()
  @Type(() => UpdateEntregaCabeceraDTO)
  cabeceraEntrega!: UpdateEntregaCabeceraDTO;

  /**
   * En actualización se reemplazan los detalles completos de la entrega.
   * Por eso se usa CreateEntregaDetalleDTO: los detalles nuevos no necesitan
   * ideDetaEntr obligatorio.
   */
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateEntregaDetalleDTO)
  detalleEntrega!: CreateEntregaDetalleDTO[];
}
