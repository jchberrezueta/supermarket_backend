import { EnumEstadosOpcion, IFiltroOpciones } from '@models';
import { IsOptional, IsInt, IsString, Min, Max, IsEnum, IsNumber, Length, IsDateString } from 'class-validator';


export class FilterOpcionDto implements IFiltroOpciones {

    @IsOptional()
    @IsString()
    @Length(1, 100)
    nombreOpci?: string;

    @IsOptional()
    @IsString()
    @Length(1, 500)
    rutaOpci?: string;

    @IsOptional()
    @IsEnum(EnumEstadosOpcion)
    activoOpci?: EnumEstadosOpcion;
  

    toArray(): any[] {
        return [
            this.nombreOpci?? null,
            this.rutaOpci?? null,
            this.activoOpci?? null
        ]
    }

}