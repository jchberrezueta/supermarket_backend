import { isIntNumeric } from '@helpers/utilities';
import { IFiltroPerfil } from '@models';
import { Transform } from 'class-transformer';
import { IsOptional, IsInt, IsString, Min, Length } from 'class-validator';


export class FilterPerfilDto implements IFiltroPerfil {

    @IsOptional()
    @Transform(({value}) => isIntNumeric(value) ? (+value) : null )
    @IsInt()
    @Min(0)
    ideRol?: number;

    @IsOptional()
    @IsString()
    @Length(1, 100)
    nombrePerf?: string;

    @IsOptional()
    @IsString()
    @Length(1, 250)
    descripcionPerf?: string;
  

    toArray(): any[] {
        return [
            this.ideRol?? null,
            this.nombrePerf?? null,
            this.descripcionPerf?? null
        ]
    }

}