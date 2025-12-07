import { Transform } from 'class-transformer';
import { IsOptional, IsString, Length, IsEnum, IsIn, IsInt, Min, IsNumberString } from 'class-validator';
import { EnumEstadoEmpleado } from '../enums/estado_empleado.enum';
import { isIntNumeric } from 'src/helpers/utilities';

export class FilterEmpleadoDTO {
    
    @IsOptional()
    @Transform(({value}) => isIntNumeric(value) ? (+value) : -1 )
    @IsInt()
    @Min(0)
    ideRol: number;

    @IsNumberString()
    @Length(7, 15)
    @Transform(({ value }) =>
        typeof value === 'string' ? value.trim() : null
    )
    cedulaEmpl: string;
    
    @IsString()
    @Length(1, 50)
    @Transform(({ value }) =>
        typeof value === 'string' ? value.trim().toLowerCase() : null
    )
    primerNombreEmpl: string;

    @IsString()
    @Length(1, 50)
    @Transform(({ value }) =>
        typeof value === 'string' ? value.trim().toLowerCase() : null
    )
    apellidoPaternoEmpl: string;

    @IsString()
    @Length(1, 250)
    @Transform(({ value }) =>
        typeof value === 'string' ? value.trim().toLowerCase() : null
    )
    tituloEmpl: string;

    @IsEnum(EnumEstadoEmpleado)
    estadoEmpl: EnumEstadoEmpleado;

    toArray(): any[] {
        return [
            this.ideRol,
            this.cedulaEmpl,
            this.primerNombreEmpl,
            this.apellidoPaternoEmpl,
            this.tituloEmpl,
            this.estadoEmpl
        ];
    }
}
