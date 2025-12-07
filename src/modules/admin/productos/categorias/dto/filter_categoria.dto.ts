import { 
  IsString,
  IsOptional, 
  IsNotEmpty
} from 'class-validator';
import { Transform } from 'class-transformer';
import { Length } from 'class-validator';

export class FilterCategoriaDTO {

    @IsOptional()
    @IsString()
    @Length(1, 100)
    @Transform(({value}) => value.trim().toLowerCase())
    nombreCate: string;

    @IsOptional()
    @IsString()
    @Length(1, 250)
    @Transform(({value}) => value.trim().toLowerCase())
    descripcionCate?: string;

    toArray = (): any[] => {
      return [
        this.nombreCate ?? null,
        this.descripcionCate ?? null
      ];
    }
}