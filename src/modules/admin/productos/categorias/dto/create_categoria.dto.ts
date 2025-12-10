import { 
  IsString,
  IsOptional, 
  IsNotEmpty,
  IsInt,
  Equals
} from 'class-validator';
import { Transform } from 'class-transformer';
import { Length } from 'class-validator';
import { ICategoria } from '@models';

export class CreateCategoriaDTO implements ICategoria {

  @IsInt()
  @Equals(-1)
  ideCate: number;

  @IsString()
  @Length(1, 100)
  @Transform(({value}) => 
    (typeof value === 'string' && value.trim() !== '') ? value.trim().toLowerCase() : null
  )
  nombreCate: string;

  @IsString()
  @Length(1, 250)
  @Transform(({value}) => 
    (typeof value === 'string' && value.trim() !== '') ? value.trim().toLowerCase() : null
  )
  descripcionCate: string;

  toArray(): any[] {
    return [
      this.nombreCate,
      this.descripcionCate
    ];
  }
}