import { 
  IsString,
  IsOptional, 
  IsNotEmpty
} from 'class-validator';
import { Transform } from 'class-transformer';
import { Length } from 'class-validator';
import { IFiltroCategoria } from '@models';

export class FilterCategoriaDTO implements IFiltroCategoria {

    @IsOptional()
    @IsString()
    @Length(1, 100)
    nombreCate?: string;

    @IsOptional()
    @IsString()
    @Length(1, 250)
    descripcionCate?: string;

    toArray(): any[] {
      return [
        this.nombreCate ?? null,
        this.descripcionCate ?? null
      ];
    }
}