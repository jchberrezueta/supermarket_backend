import { 
  IsString,
  IsInt,
  Equals,
  Min,
  IsNumber,
  IsIn,
  IsOptional
} from 'class-validator';
import { Transform } from 'class-transformer';
import { Length, IsEnum } from 'class-validator';
import { IProducto } from '@models';
import { EnumEstadosProducto } from '../../../../../models/producto.model';

export class CreateProductoDTO implements IProducto {

  @IsInt()
  @Equals(-1)
  ideProd: number;

  @IsInt()
  @Min(0)
  ideCate: number;
  
  @IsInt()
  @Min(0)
  ideMarc: number;

  @IsString()
  @Length(1, 30)
  @Transform(({ value }) =>
    (typeof value === 'string' && value.trim() !== '') ? value.trim().toLowerCase() : null
  )
  codigoBarraProd: string;

  @IsString()
  @Length(1, 100)
  @Transform(({ value }) =>
    (typeof value === 'string' && value.trim() !== '') ? value.trim().toLowerCase() : null
  )
  nombreProd: string;

  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  precioVentaProd: number;

  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  ivaProd: number;

  @IsNumber()
  @Min(0)
  @Transform(({ value }) => parseFloat(value))
  dctoPromoProd: number;

  @IsInt()
  @Min(0)
  stockProd: number;

  @IsIn(['si', 'no'])
  disponibleProd: 'si' | 'no';

  @IsEnum(EnumEstadosProducto)
  estadoProd: EnumEstadosProducto;

  @IsString()
  @Length(1, 250)
  @Transform(({ value }) =>
    (typeof value === 'string' && value.trim() !== '') ? value.trim().toLowerCase() : 'ninguna'
  )
  descripcionProd: string;

  @IsOptional()
  @IsString()
  @Length(1, 500)
  @Transform(({ value }) =>
    (typeof value === 'string' && value.trim() !== '') ? value.trim() : null
  )
  urlImgProd: string;

  toArray(): any[] {
    return [
      this.ideCate,
      this.ideMarc,
      this.codigoBarraProd,
      this.nombreProd,
      this.urlImgProd,
      this.precioVentaProd,
      this.ivaProd,
      this.dctoPromoProd,
      this.stockProd,
      this.disponibleProd,
      this.estadoProd,
      this.descripcionProd,
      null,
    ];
  }
}