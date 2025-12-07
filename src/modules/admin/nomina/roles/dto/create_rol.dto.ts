import { Transform } from "class-transformer";
import { IsString, Length } from "class-validator";

export class CreateRolDTO {

    @IsString()
    @Length(1, 100)
    @Transform(({value}) => (
        typeof value === 'string' ? value.trim().toLowerCase() : null
    ))
    nombreRol: string;

    @IsString()
    @Length(1, 250)
    descripcionRol: string;

    toArray = (): any[] => {
        return [
            this.nombreRol,
            this.descripcionRol  
        ];
    }
}