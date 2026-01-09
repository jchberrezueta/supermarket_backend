import { 
  IsString,
  IsOptional, 
  IsInt,
  Min,
  IsDateString
} from 'class-validator';
import { IFiltroLote } from '@models';
import { isIntNumeric } from '@helpers/utilities';
import { Transform } from 'class-transformer';

export class FilterLoteDTO implements IFiltroLote{

    @IsOptional()
    @IsInt()
    @Transform(({value}) => isIntNumeric(value) ? (+value) : null )
    @Min(0)
    ideLote?: number;

    @IsOptional()
    @IsInt()
    @Transform(({value}) => isIntNumeric(value) ? (+value) : null )
    @Min(1)
    ideProd?: number;

    @IsOptional()
    @IsDateString()
    fechaCaducidadLoteDesde?: string;

    @IsOptional()
    @IsDateString()
    fechaCaducidadLoteHasta?: string;

    @IsOptional()
    @IsInt()
    @Transform(({value}) => isIntNumeric(value) ? (+value) : null )
    @Min(0)
    stockLoteMin?: number;

    @IsOptional()
    @IsInt()
    @Transform(({value}) => isIntNumeric(value) ? (+value) : null )
    @Min(0)
    stockLoteMax?: number;

    @IsOptional()
    @IsString()
    estadoLote?: string;

    toArray(): any[] {
      return [
        this.ideProd?? null,
        this.estadoLote?? null,
        this.fechaCaducidadLoteDesde?? null,
        this.fechaCaducidadLoteHasta?? null,
      ];
    }
}
