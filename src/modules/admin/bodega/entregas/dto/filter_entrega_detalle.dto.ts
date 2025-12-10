import { IsOptional, Min, IsInt } from 'class-validator';
import { Transform } from 'class-transformer';
import { isIntNumeric } from '@helpers/utilities';
import { IFiltroDetalleEntrega } from '@models';

export class FilterEntregaDetalleDTO implements IFiltroDetalleEntrega {
    
    @IsOptional()
    @Transform(({value}) => isIntNumeric(value) ? (+value) : null )
    @IsInt()
    @Min(0)
    ideEntr?: number;

    @IsOptional()
    @Transform(({value}) => isIntNumeric(value) ? (+value) : null )
    @IsInt()
    @Min(0)
    ideProd?: number;


    toArray(): any[] {
        return [
            this.ideEntr ?? null,
            this.ideProd ?? null,   
        ];
    }
}
