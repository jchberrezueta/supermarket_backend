import { 
  IsString,
  IsOptional, 
  IsNotEmpty,
  IsInt,
  Min,
  IsIn
} from 'class-validator';
import { Transform } from 'class-transformer';
import { Length, IsEnum } from 'class-validator';
import { EnumEstadosProducto, IFiltroProducto } from '@models';
import { isIntNumeric } from '@helpers/utilities';


export class FilterProductoDTO implements IFiltroProducto {

  @IsOptional()
  @Transform(({value}) => isIntNumeric(value) ? (+value) : null )
  @IsInt()
  @Min(0)
  ideCate?: number;

  @IsOptional()
  @Transform(({value}) => isIntNumeric(value) ? (+value) : null )
  @IsInt()
  @Min(0)
  ideMarc?: number;

  @IsOptional()
  @IsString()
  @Length(1, 30)
  codigoBarraProd?: string;

  @IsOptional()
  @IsString()
  @Length(1, 250)
  nombreProd?: string;
  
  @IsOptional()
  @IsIn(['si', 'no'])
  disponibleProd?: 'si' | 'no';

  @IsOptional()
  @IsEnum(EnumEstadosProducto)
  estadoProd?: EnumEstadosProducto;
  
  toArray(): any[] {
    return [
      this.ideCate?? null,
      this.ideMarc?? null,
      this.codigoBarraProd?? null,
      this.nombreProd?? null,
      this.disponibleProd?? null,
      this.estadoProd?? null
    ];
  }
}