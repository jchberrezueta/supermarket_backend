import { IsOptional, Min, IsInt } from 'class-validator';
import { isIntNumeric } from '@helpers/utilities';
import { Transform } from 'class-transformer';

export class FilterPedidoDetalleDTO {

  @IsOptional()
  @Transform(({value}) => isIntNumeric(value) ? (+value) : -1 )
  @IsInt()
  @Min(0)
  idePedi?: number;

  @IsOptional()
  @Transform(({value}) => isIntNumeric(value) ? (+value) : -1 )
  @IsInt()
  @Min(0)
  ideProd?: number;

  toArray(): any[] {
    return [
      this.idePedi ?? null,
      this.ideProd ?? null
    ];
  }
}
