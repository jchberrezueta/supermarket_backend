import { IsOptional, IsEnum, Min, IsDateString, IsInt, IsString, Length } from 'class-validator';
import { Transform } from 'class-transformer';
import { isIntNumeric } from '@helpers/utilities';
import { EnumEstadoEntrega, EnumEstadoVenta, IFiltroVenta } from '@models';

export class FilterVentaDTO implements IFiltroVenta {
    
    @IsOptional()
    @Transform(({value}) => isIntNumeric(value) ? (+value) : null )
    @IsInt()
    @Min(0)
    ideEmpl?: number;

    @IsOptional()
    @Transform(({value}) => isIntNumeric(value) ? (+value) : null )
    @IsInt()
    @Min(0)
    ideClie?: number;

    @IsOptional()
    @IsString()
    @Length(1, 25)
    numFacturaVent: string;

    @IsOptional()
    @IsEnum(EnumEstadoVenta)
    estadoVent?: EnumEstadoVenta;

    @IsOptional()
    @IsDateString()
    fechaDesde?: string;

    @IsOptional()
    @IsDateString()
    fechaHasta?: string;

    toArray(): any[] {
        return [
            this.ideEmpl ?? null,
            this.ideClie ?? null,
            this.numFacturaVent?? null,
            this.estadoVent ?? null,
            this.fechaDesde ?? null,
            this.fechaHasta ?? null        
        ];
    }
}
