import { IsOptional, IsEnum, Min, IsDateString, IsInt } from 'class-validator';
import { EnumEstadoEntrega } from '../enums/estado_entrega.enum';
import { Transform } from 'class-transformer';
import { isIntNumeric } from '@helpers/utilities';

export class FilterEntregaDetalleDTO {
    
    @IsOptional()
    @Transform(({value}) => isIntNumeric(value) ? (+value) : -1 )
    @IsInt()
    @Min(0)
    ideEntr?: number;

    @IsOptional()
    @Transform(({value}) => isIntNumeric(value) ? (+value) : -1 )
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
