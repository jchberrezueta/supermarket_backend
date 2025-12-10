import { EnumEstadoEmpleado, IFiltroEmpleado } from '@models';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, Length, IsEnum, IsIn, IsInt, Min, IsNumberString } from 'class-validator';
import { isIntNumeric } from 'src/helpers/utilities';

export class FilterEmpleadoDTO implements IFiltroEmpleado {
    
    @IsOptional()
    @Transform(({value}) => isIntNumeric(value) ? (+value) : -1 )
    @IsInt()
    @Min(0)
    ideRol?: number;

    @IsOptional()
    @IsNumberString()
    @Length(7, 15)
    cedulaEmpl?: string;
    
    @IsOptional()
    @IsString()
    @Length(1, 50)
    primerNombreEmpl?: string;

    @IsOptional()
    @IsString()
    @Length(1, 50)
    apellidoPaternoEmpl?: string;

    @IsOptional()
    @IsString()
    @Length(1, 250)
    tituloEmpl?: string;

    @IsOptional()
    @IsEnum(EnumEstadoEmpleado)
    estadoEmpl?: EnumEstadoEmpleado;

    toArray(): any[] {
        return [
            this.ideRol?? null,
            this.cedulaEmpl?? null,
            this.primerNombreEmpl?? null,
            this.apellidoPaternoEmpl?? null,
            this.tituloEmpl?? null,
            this.estadoEmpl?? null
        ];
    }
}
