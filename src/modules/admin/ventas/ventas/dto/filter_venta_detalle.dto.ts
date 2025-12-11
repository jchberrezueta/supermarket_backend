import { IsOptional, Min, IsInt } from 'class-validator';
import { Transform } from 'class-transformer';
import { isIntNumeric } from '@helpers/utilities';
import { IFiltroDetalleVenta } from '@models';

export class FilterVentaDetalleDTO implements IFiltroDetalleVenta {
    
    @IsOptional()
    @Transform(({value}) => isIntNumeric(value) ? (+value) : null )
    @IsInt()
    @Min(0)
    ideVent?: number;

    @IsOptional()
    @Transform(({value}) => isIntNumeric(value) ? (+value) : null )
    @IsInt()
    @Min(0)
    ideProd?: number;


    toArray(): any[] {
        return [
            this.ideVent ?? null,
            this.ideProd ?? null,   
        ];
    }
}
