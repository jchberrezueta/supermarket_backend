import { 
  IsString,
  IsOptional, 
  IsInt,
  Max,
  Min
} from 'class-validator';
import { Length } from 'class-validator';
import { IFiltroMarca } from '@models';

export class FilterMarcaDTO implements IFiltroMarca{

    @IsOptional()
    @IsString()
    @Length(1, 100)
    nombreMarc?: string;

    @IsOptional()
    @IsString()
    @Length(1, 100)
    paisOrigenMarc?: string;

    @IsOptional()
    @IsInt()
    @Min(1)
    @Max(10)
    calidadMarc?: number;

    toArray(): any[] {
      return [
        this.nombreMarc?? null,
        this.paisOrigenMarc?? null,
        this.calidadMarc?? null,
      ];
    }
}