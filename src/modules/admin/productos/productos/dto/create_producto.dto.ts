import { 
  IsString,
  IsOptional, 
  IsNotEmpty
} from 'class-validator';
import { Transform } from 'class-transformer';
import { Length } from 'class-validator';


export class CreateProductoDTO {

    @IsString()
    @Length(1, 100)
    @Transform(({value}) => value.trim().toLowerCase())
    nombreCate: string;

    @IsString()
    @Length(1, 250)
    @Transform(({value}) => value.trim().toLowerCase())
    descripcionCate?: string;

    toArray = (): any[] => {
      return [
        this.nombreCate,
        this.descripcionCate
      ];
    }
}