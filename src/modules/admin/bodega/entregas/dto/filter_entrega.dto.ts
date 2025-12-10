import { IsOptional, IsEnum, Min, IsDateString, IsInt } from 'class-validator';
import { Transform } from 'class-transformer';
import { isIntNumeric } from '@helpers/utilities';
import { EnumEstadoEntrega, IFiltroEntrega } from '@models';

export class FilterEntregaDTO implements IFiltroEntrega {
    
    @IsOptional()
    @Transform(({value}) => isIntNumeric(value) ? (+value) : null )
    @IsInt()
    @Min(0)
    idePedi?: number;

    @IsOptional()
    @Transform(({value}) => isIntNumeric(value) ? (+value) : null )
    @IsInt()
    @Min(0)
    ideProv?: number;

    @IsOptional()
    @IsEnum(EnumEstadoEntrega)
    estadoEntr?: EnumEstadoEntrega;

    @IsOptional()
    @IsDateString()
    fechaDesde?: string;

    @IsOptional()
    @IsDateString()
    fechaHasta?: string;


    toArray(): any[] {
        return [
            this.idePedi ?? null,
            this.ideProv ?? null,
            this.estadoEntr ?? null,
            this.fechaDesde ?? null,
            this.fechaHasta ?? null        
        ];
    }
}
