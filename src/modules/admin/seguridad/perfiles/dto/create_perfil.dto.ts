import { IPerfil } from '@models';
import { Transform } from 'class-transformer';
import { IsString, Equals, IsInt, Min, Length } from 'class-validator';

export class CreatePerfilDto implements IPerfil {
    
    @IsInt()
    @Equals(-1)
    idePerf: number;
    
    @IsInt()
    @Min(0)
    ideRol: number;

    @IsString()
    @Length(1, 100)
    @Transform(({ value }) =>
        (typeof value === 'string' && value.trim() !== '') ? value.trim().toLowerCase() : null
    )
    nombrePerf: string;

    @IsString()
    @Length(1, 250)
    @Transform(({ value }) =>
        (typeof value === 'string' && value.trim() !== '') ? value.trim().toLowerCase() : 'ninguna'
    )
    descripcionPerf: string;
    

    toArray(): any[] {
        return [
            this.ideRol,
            this.nombrePerf,
            this.descripcionPerf
        ]
    }
}