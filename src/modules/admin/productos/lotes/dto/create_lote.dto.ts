import { 
  IsString,
  IsInt,
  Min,
  Equals,
  IsDateString
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ILote } from '@models';


export class CreateLoteDTO implements ILote {
  
  @IsInt()
  @Equals(-1)
  ideLote: number;

  @IsInt()
  @Min(1)
  ideProd: number;

  @IsDateString()
  fechaCaducidadLote: string;

  @IsInt()
  @Min(0)
  stockLote: number;

  @IsString()
  @Transform(({value}) => 
    (typeof value === 'string' && value.trim() !== '') ? value.trim().toLowerCase() : 'correcto'
  )
  estadoLote: string;

  toArray(): any[] {
    return [
      this.ideProd,
      this.fechaCaducidadLote,
      this.stockLote,
      this.estadoLote
    ];
  }
}
